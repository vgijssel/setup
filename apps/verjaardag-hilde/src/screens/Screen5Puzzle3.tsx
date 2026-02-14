import { useState, useCallback, useEffect, useRef } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ProgressCode } from "../components/ProgressCode";
import { useHass, useEntity, EntityName } from "@hakit/core";
import { ENTITIES } from "../constants/entities";

/**
 * Switch to bulb mapping - each switch controls a different bulb than its label suggests
 * Slaapkamer switch -> Waskamer bulb
 * Waskamer switch -> Voorraadkast bulb
 * Keuken switch -> Slaapkamer bulb
 * Tuin switch -> Keuken bulb
 * Voorraadkast switch -> Tuin bulb
 */
const SWITCH_TO_BULB_MAP: Record<string, string> = {
  Slaapkamer: "Waskamer",
  Waskamer: "Voorraadkast",
  Keuken: "Slaapkamer",
  Tuin: "Keuken",
  Voorraadkast: "Tuin",
};

// Switches and bulbs in alphabetical order for consistent UI display
const SWITCHES = ["Keuken", "Slaapkamer", "Tuin", "Voorraadkast", "Waskamer"];
const BULBS = ["Keuken", "Slaapkamer", "Tuin", "Voorraadkast", "Waskamer"];

const SWITCH_ENTITY_MAP: Record<string, string> = {
  Slaapkamer: ENTITIES.PUZZLE_3.SLAAPKAMER,
  Waskamer: ENTITIES.PUZZLE_3.WASKAMER,
  Keuken: ENTITIES.PUZZLE_3.KEUKEN,
  Tuin: ENTITIES.PUZZLE_3.TUIN,
  Voorraadkast: ENTITIES.PUZZLE_3.VOORRAADKAST,
};

/** Special droppable ID for returning switches to the container */
const SWITCH_RETURN_ZONE = "switch-return-zone";

interface SwitchDraggableProps {
  id: string;
  isPlaced: boolean;
}

function SwitchDraggable({ id, isPlaced }: SwitchDraggableProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  // Don't render if placed on a bulb
  if (isPlaced) {
    return null;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="switch-draggable"
      data-testid={`switch-${id.toLowerCase()}`}
    >
      <span className="switch-icon">&#9728;</span>
      <span className="switch-label">{id}</span>
    </div>
  );
}

interface PlacedSwitchDraggableProps {
  id: string;
}

/** Draggable switch that has been placed on a bulb */
function PlacedSwitchDraggable({ id }: PlacedSwitchDraggableProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="placed-switch draggable"
      data-testid={`placed-switch-${id.toLowerCase()}`}
    >
      <span className="switch-icon">&#9728;</span>
      <span>{id}</span>
    </div>
  );
}

interface BulbDroppableProps {
  id: string;
  placedSwitch: string | null;
  isCorrect: boolean;
  isIncorrect: boolean;
}

function BulbDroppable({
  id,
  placedSwitch,
  isCorrect,
  isIncorrect,
}: BulbDroppableProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const className = [
    "bulb-droppable",
    placedSwitch ? "occupied" : "",
    isCorrect ? "correct" : "",
    isIncorrect ? "incorrect" : "",
    isOver && !placedSwitch ? "drag-over" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={setNodeRef}
      className={className}
      data-testid={`bulb-${id.toLowerCase()}`}
    >
      <span className="bulb-label">{id}</span>
      {placedSwitch && <PlacedSwitchDraggable id={placedSwitch} />}
      {!placedSwitch && (
        <span className="drop-hint">Sleep schakelaar hier</span>
      )}
    </div>
  );
}

/** Droppable zone for returning switches to the container */
function SwitchReturnZone() {
  const { setNodeRef, isOver } = useDroppable({ id: SWITCH_RETURN_ZONE });

  return (
    <div
      ref={setNodeRef}
      className={`switch-return-zone ${isOver ? "drag-over" : ""}`}
      data-testid="switch-return-zone"
    >
      <span className="return-hint">Sleep hier om terug te plaatsen</span>
    </div>
  );
}

/**
 * Screen 5: Puzzle 3 - The Switches (Drag and Drop)
 *
 * Player must drag each switch to the correct bulb.
 * The twist: each switch controls a different room's bulb than its name suggests.
 * Switches can be moved back to the container or to a different bulb.
 */
export function Screen5Puzzle3() {
  const { callService } = useHass();

  // Track which switch is placed on which bulb: { bulbName: switchName }
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  // Flag to prevent sync loop when user is dragging
  const isUserDraggingRef = useRef(false);

  // Subscribe to entity states for bidirectional sync
  const keukenEntity = useEntity(ENTITIES.PUZZLE_3.KEUKEN as EntityName, {
    returnNullIfNotFound: true,
  });
  const slaapkamerEntity = useEntity(
    ENTITIES.PUZZLE_3.SLAAPKAMER as EntityName,
    { returnNullIfNotFound: true }
  );
  const tuinEntity = useEntity(ENTITIES.PUZZLE_3.TUIN as EntityName, {
    returnNullIfNotFound: true,
  });
  const voorraadkastEntity = useEntity(
    ENTITIES.PUZZLE_3.VOORRAADKAST as EntityName,
    { returnNullIfNotFound: true }
  );
  const waskamerEntity = useEntity(ENTITIES.PUZZLE_3.WASKAMER as EntityName, {
    returnNullIfNotFound: true,
  });

  // Sync entity states to placements when entities change externally
  useEffect(() => {
    // Skip sync if user is actively dragging to prevent conflicts
    if (isUserDraggingRef.current) return;

    const entities = [
      { entity: keukenEntity, switchName: "Keuken" },
      { entity: slaapkamerEntity, switchName: "Slaapkamer" },
      { entity: tuinEntity, switchName: "Tuin" },
      { entity: voorraadkastEntity, switchName: "Voorraadkast" },
      { entity: waskamerEntity, switchName: "Waskamer" },
    ];

    const newPlacements: Record<string, string> = {};

    for (const { entity, switchName } of entities) {
      if (entity?.state === "on") {
        // Entity is on means switch is correctly placed
        // Find the correct bulb for this switch using SWITCH_TO_BULB_MAP
        const correctBulb = SWITCH_TO_BULB_MAP[switchName];
        if (correctBulb) {
          newPlacements[correctBulb] = switchName;
        }
      }
    }

    // Only update if placements have actually changed to avoid infinite loops
    const newPlacementsKey = JSON.stringify(
      Object.entries(newPlacements).sort()
    );
    const currentPlacementsKey = JSON.stringify(
      Object.entries(placements).sort()
    );

    if (newPlacementsKey !== currentPlacementsKey) {
      setPlacements(newPlacements);
    }
  }, [
    keukenEntity?.state,
    slaapkamerEntity?.state,
    tuinEntity?.state,
    voorraadkastEntity?.state,
    waskamerEntity?.state,
    placements,
  ]);

  // Check if a placement is correct
  const isPlacementCorrect = (
    switchName: string,
    bulbName: string
  ): boolean => {
    return SWITCH_TO_BULB_MAP[switchName] === bulbName;
  };

  // Count correct placements
  const correctCount = Object.entries(placements).filter(([bulb, switchName]) =>
    isPlacementCorrect(switchName, bulb)
  ).length;

  const isComplete = correctCount === 5;

  // Configure sensors for mouse and touch
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    isUserDraggingRef.current = true;
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      // Reset the dragging flag after a short delay to allow state updates
      setTimeout(() => {
        isUserDraggingRef.current = false;
      }, 100);

      if (!over) return;

      const switchName = active.id as string;
      const targetId = over.id as string;

      // Find if this switch is currently placed on a bulb
      const currentBulb = Object.entries(placements).find(
        ([, s]) => s === switchName
      )?.[0];
      const wasCorrectlyPlaced = currentBulb
        ? isPlacementCorrect(switchName, currentBulb)
        : false;

      // Handle returning switch to container
      if (targetId === SWITCH_RETURN_ZONE) {
        if (currentBulb) {
          // Remove from current placement
          const newPlacements = { ...placements };
          delete newPlacements[currentBulb];
          setPlacements(newPlacements);

          // If it was correctly placed, turn off the entity
          if (wasCorrectlyPlaced) {
            const entityId = SWITCH_ENTITY_MAP[switchName];
            if (entityId) {
              callService({
                domain: "input_boolean",
                service: "turn_off",
                target: { entity_id: entityId },
              });
            }
          }
        }
        return;
      }

      // Handle dropping on a bulb
      const isBulb = BULBS.includes(targetId);
      if (!isBulb) return;

      const targetBulb = targetId;

      // Check if target bulb already has a different switch
      if (placements[targetBulb] && placements[targetBulb] !== switchName) {
        return; // Can't drop on occupied bulb
      }

      // If dropping on the same bulb, do nothing
      if (currentBulb === targetBulb) return;

      // Build new placements
      const newPlacements = { ...placements };

      // Remove from old position if it was placed
      if (currentBulb) {
        delete newPlacements[currentBulb];

        // If it was correctly placed before, turn off the entity
        if (wasCorrectlyPlaced) {
          const entityId = SWITCH_ENTITY_MAP[switchName];
          if (entityId) {
            callService({
              domain: "input_boolean",
              service: "turn_off",
              target: { entity_id: entityId },
            });
          }
        }
      }

      // Place on new bulb
      newPlacements[targetBulb] = switchName;
      setPlacements(newPlacements);

      // If new placement is correct, turn on the entity
      if (isPlacementCorrect(switchName, targetBulb)) {
        const entityId = SWITCH_ENTITY_MAP[switchName];
        if (entityId) {
          callService({
            domain: "input_boolean",
            service: "turn_on",
            target: { entity_id: entityId },
          });
        }
      }
    },
    [placements, callService]
  );

  // Get which switches are still available (not placed)
  const placedSwitches = Object.values(placements);
  const hasPlacedSwitches = placedSwitches.length > 0;

  return (
    <div className="screen screen-5-puzzle-3">
      <div className="puzzle-container dnd-puzzle">
        <div className="puzzle-header">
          <h2>Schakelaars Controle</h2>
          <p className="puzzle-description">
            Sleep elke schakelaar naar de juiste lamp. Let op: de schakelaars
            bedienen niet de kamer waar ze naar vernoemd zijn!
          </p>
        </div>

        <div className="puzzle-progress-bar">
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${(correctCount / 5) * 100}%` }}
            />
          </div>
          <span className="progress-text">{correctCount} van 5 correct</span>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="dnd-layout">
            <div className="switches-container">
              <h3>Schakelaars</h3>
              <div className="switches-grid">
                {SWITCHES.map((switchName) => (
                  <SwitchDraggable
                    key={switchName}
                    id={switchName}
                    isPlaced={placedSwitches.includes(switchName)}
                  />
                ))}
              </div>
              {hasPlacedSwitches && <SwitchReturnZone />}
            </div>

            <div className="bulbs-container">
              <div className="bulbs-grid">
                {BULBS.map((bulbName) => {
                  const placedSwitch = placements[bulbName] || null;
                  const isCorrect = placedSwitch
                    ? isPlacementCorrect(placedSwitch, bulbName)
                    : false;
                  const isIncorrect = placedSwitch !== null && !isCorrect;
                  return (
                    <BulbDroppable
                      key={bulbName}
                      id={bulbName}
                      placedSwitch={placedSwitch}
                      isCorrect={isCorrect}
                      isIncorrect={isIncorrect}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <DragOverlay>
            {activeId ? (
              <div className="switch-draggable dragging">
                <span className="switch-icon">&#9728;</span>
                <span className="switch-label">{activeId}</span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        <ProgressCode screenNumber={5} puzzleJustCompleted={isComplete} />
      </div>
    </div>
  );
}
