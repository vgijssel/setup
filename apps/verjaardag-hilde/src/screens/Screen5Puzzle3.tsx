import { useState, useCallback } from "react";
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
import { useHass } from "@hakit/core";
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

const SWITCHES = ["Slaapkamer", "Waskamer", "Keuken", "Tuin", "Voorraadkast"];
const BULBS = ["Waskamer", "Voorraadkast", "Slaapkamer", "Keuken", "Tuin"];

const SWITCH_ENTITY_MAP: Record<string, string> = {
  Slaapkamer: ENTITIES.PUZZLE_3.SLAAPKAMER,
  Waskamer: ENTITIES.PUZZLE_3.WASKAMER,
  Keuken: ENTITIES.PUZZLE_3.KEUKEN,
  Tuin: ENTITIES.PUZZLE_3.TUIN,
  Voorraadkast: ENTITIES.PUZZLE_3.VOORRAADKAST,
};

interface SwitchDraggableProps {
  id: string;
  isPlaced: boolean;
}

function SwitchDraggable({ id, isPlaced }: SwitchDraggableProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id, disabled: isPlaced });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isPlaced ? "default" : "grab",
  };

  if (isPlaced) {
    return null; // Don't render if already placed
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

interface BulbDroppableProps {
  id: string;
  placedSwitch: string | null;
  isCorrect: boolean;
}

function BulbDroppable({ id, placedSwitch, isCorrect }: BulbDroppableProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const className = [
    "bulb-droppable",
    placedSwitch ? "occupied" : "",
    isCorrect ? "correct" : "",
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
      <span className="bulb-icon">{isCorrect ? "&#128161;" : "&#128167;"}</span>
      <span className="bulb-label">{id}</span>
      {placedSwitch && (
        <div className="placed-switch">
          <span className="switch-icon">&#9728;</span>
          <span>{placedSwitch}</span>
        </div>
      )}
      {!placedSwitch && (
        <span className="drop-hint">Sleep schakelaar hier</span>
      )}
    </div>
  );
}

/**
 * Screen 5: Puzzle 3 - The Switches (Drag and Drop)
 *
 * Player must drag each switch to the correct bulb.
 * The twist: each switch controls a different room's bulb than its name suggests.
 */
export function Screen5Puzzle3() {
  const { callService } = useHass();

  // Track which switch is placed on which bulb: { bulbName: switchName }
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);

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
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over) return;

      const switchName = active.id as string;
      const bulbName = over.id as string;

      // Check if this bulb already has a switch
      if (placements[bulbName]) return;

      // Check if this switch is already placed somewhere
      if (Object.values(placements).includes(switchName)) return;

      // Place the switch on the bulb
      const newPlacements = { ...placements, [bulbName]: switchName };
      setPlacements(newPlacements);

      // If correct placement, toggle the HA entity
      if (isPlacementCorrect(switchName, bulbName)) {
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

  return (
    <div className="screen screen-5-puzzle-3">
      <div className="puzzle-container dnd-puzzle">
        <div className="puzzle-header">
          <h2>Schakelaars Puzzel</h2>
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
            </div>

            <div className="bulbs-container">
              <h3>Lampen</h3>
              <div className="bulbs-grid">
                {BULBS.map((bulbName) => {
                  const placedSwitch = placements[bulbName] || null;
                  const isCorrect = placedSwitch
                    ? isPlacementCorrect(placedSwitch, bulbName)
                    : false;
                  return (
                    <BulbDroppable
                      key={bulbName}
                      id={bulbName}
                      placedSwitch={placedSwitch}
                      isCorrect={isCorrect}
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
