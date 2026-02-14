import { useMemo, useEffect, useState } from "react";
import { useEntity } from "@hakit/core";
import GaugeComponent from "react-gauge-component";
import { ProgressCode } from "../components/ProgressCode";

/** Entity for the power level number (0-100) */
const POWER_NUMBER_ENTITY =
  "input_number.verjaardag_hilde_puzzle_6_power_number";

/** Entity for the solved state (0 = unsolved, 1 = solved) */
const SELECT_ENTITY = "input_select.verjaardag_hilde_puzzle_6_select";

/**
 * Screen 8: Puzzle 6 - Energy Gauge
 *
 * Player must manipulate the power consumption to reach the green zone.
 * The gauge displays the current power level from a Home Assistant sensor.
 * The puzzle is solved when the select entity is set to "1".
 */
export function Screen8Puzzle6() {
  // Get the power level from HA
  const powerEntity = useEntity(POWER_NUMBER_ENTITY, {
    returnNullIfNotFound: true,
  });
  const selectEntity = useEntity(SELECT_ENTITY, {
    returnNullIfNotFound: true,
  });

  // Use local state to track power value and ensure re-renders on entity changes
  const [localPowerValue, setLocalPowerValue] = useState(0);

  // Parse the power value with robust handling for edge cases
  const parsedPowerValue = useMemo(() => {
    if (!powerEntity?.state) return 0;
    if (
      powerEntity.state === "unavailable" ||
      powerEntity.state === "unknown"
    ) {
      return 0;
    }
    const parsed = parseFloat(powerEntity.state);
    return isNaN(parsed) ? 0 : Math.max(0, Math.min(100, parsed));
  }, [powerEntity?.state]);

  // Update local state when entity changes to force re-render
  useEffect(() => {
    setLocalPowerValue(parsedPowerValue);
  }, [parsedPowerValue]);

  // Use the local state value for rendering
  const powerValue = localPowerValue;

  // Check if puzzle is solved
  const isSolved = selectEntity?.state === "1";

  // Loading state
  const isLoading = powerEntity === undefined || selectEntity === undefined;

  if (isLoading) {
    return (
      <div className="puzzle-loading" data-testid="puzzle-loading">
        <p>Puzzel laden...</p>
      </div>
    );
  }

  return (
    <div className="screen screen-8-puzzle-6">
      <div className="puzzle-container gauge-puzzle">
        <div className="puzzle-header">
          <h2>Stroomverbruik Controle</h2>
          <p className="puzzle-description">
            {isSolved
              ? "Perfect! Het stroomverbruik is optimaal."
              : "Pas het stroomverbruik aan tot het in de groene zone valt."}
          </p>
        </div>

        <div className="gauge-container" data-testid="gauge-container">
          <GaugeComponent
            key={`gauge-${powerValue}`}
            id="power-gauge"
            type="semicircle"
            arc={{
              width: 0.2,
              padding: 0.005,
              cornerRadius: 1,
              subArcs: [
                {
                  limit: 40,
                  color: "#FFFFFF",
                  showTick: true,
                  tooltip: {
                    text: "Te laag!",
                  },
                },
                {
                  limit: 60,
                  color: "#5BE12C",
                  showTick: true,
                  tooltip: {
                    text: "Perfect!",
                  },
                },
                {
                  limit: 100,
                  color: "#EA4228",
                  showTick: true,
                  tooltip: {
                    text: "Te hoog!",
                  },
                },
              ],
            }}
            pointer={{
              color: "#345243",
              length: 0.8,
              width: 15,
              elastic: true,
            }}
            labels={{
              valueLabel: {
                formatTextValue: (value) => `${value}%`,
                style: {
                  fontSize: "35px",
                  fill: "#fff",
                  textShadow: "none",
                },
              },
              tickLabels: {
                type: "outer",
                defaultTickValueConfig: {
                  formatTextValue: (value) => `${value}`,
                  style: {
                    fontSize: "10px",
                    fill: "#999",
                  },
                },
                ticks: [{ value: 0 }, { value: 50 }, { value: 100 }],
              },
            }}
            value={powerValue}
            minValue={0}
            maxValue={100}
          />
        </div>

        <div className="gauge-status">
          {isSolved ? (
            <div className="status-solved" data-testid="puzzle-solved">
              <span className="status-icon">&#10003;</span>
              <span>Puzzel opgelost!</span>
            </div>
          ) : (
            <div className="status-hint" data-testid="puzzle-hint">
              <p>
                Huidige waarde: <strong>{powerValue}%</strong>
              </p>
              <p className="hint-text">
                Doel: Breng het niveau tussen 40% en 60%
              </p>
            </div>
          )}
        </div>

        <ProgressCode screenNumber={8} puzzleJustCompleted={isSolved} />
      </div>
    </div>
  );
}
