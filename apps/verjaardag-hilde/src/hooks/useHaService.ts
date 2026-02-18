import { useHass } from "@hakit/core";
import { useCallback } from "react";

/**
 * Custom hook for calling Home Assistant services.
 *
 * Provides type-safe wrappers around common service calls used in the escape room.
 * Services are called via WebSocket for real-time updates.
 */
export function useHaService() {
  const { callService } = useHass();

  /**
   * Set an input_select to a specific option.
   *
   * @param entityId - Full entity ID (e.g., "input_select.verjaardag_hilde_global_select")
   * @param option - The option to select (e.g., "3")
   */
  const setInputSelect = useCallback(
    async (entityId: string, option: string) => {
      try {
        // Use type assertion for the domain since our entities aren't in the generated types
        callService({
          domain: "input_select" as "inputSelect",
          service: "selectOption",
          target: {
            entity_id: entityId,
          },
          serviceData: {
            option,
          },
        });
      } catch (error) {
        console.error(`Failed to set ${entityId} to ${option}:`, error);
        throw error;
      }
    },
    [callService]
  );

  /**
   * Turn on an input_boolean.
   *
   * @param entityId - Full entity ID
   */
  const turnOnBoolean = useCallback(
    async (entityId: string) => {
      try {
        callService({
          domain: "input_boolean" as "inputBoolean",
          service: "turnOn",
          target: {
            entity_id: entityId,
          },
        });
      } catch (error) {
        console.error(`Failed to turn on ${entityId}:`, error);
        throw error;
      }
    },
    [callService]
  );

  /**
   * Turn off an input_boolean.
   *
   * @param entityId - Full entity ID
   */
  const turnOffBoolean = useCallback(
    async (entityId: string) => {
      try {
        callService({
          domain: "input_boolean" as "inputBoolean",
          service: "turnOff",
          target: {
            entity_id: entityId,
          },
        });
      } catch (error) {
        console.error(`Failed to turn off ${entityId}:`, error);
        throw error;
      }
    },
    [callService]
  );

  /**
   * Navigate to a specific screen by setting the global select.
   *
   * @param screenNumber - Screen number (1-11)
   */
  const navigateToScreen = useCallback(
    (screenNumber: number) => {
      if (screenNumber < 1 || screenNumber > 11) {
        console.warn(`Invalid screen number: ${screenNumber}`);
        return Promise.resolve();
      }
      return setInputSelect(
        "input_select.verjaardag_hilde_global_select",
        String(screenNumber)
      );
    },
    [setInputSelect]
  );

  /**
   * Reset the entire game by triggering the reset automation.
   */
  const resetGame = useCallback(async () => {
    try {
      callService({
        domain: "input_boolean" as "inputBoolean",
        service: "turnOn",
        target: {
          entity_id: "input_boolean.verjaardag_hilde_reset_trigger",
        },
      });
    } catch (error) {
      console.error("Failed to reset game:", error);
      throw error;
    }
  }, [callService]);

  /**
   * Call a generic Home Assistant service.
   *
   * Supports both single entity and multiple entities for service calls.
   *
   * @param service - Service in "domain.service" format (e.g., "input_boolean.turn_on")
   * @param data - Service data including entity_id (can be string or string[] for multiple entities)
   */
  const callServiceGeneric = useCallback(
    async (
      service: string,
      data: { entity_id: string | string[]; [key: string]: unknown }
    ) => {
      const [domain, serviceName] = service.split(".");
      if (!domain || !serviceName) {
        console.error(`Invalid service format: ${service}`);
        return;
      }

      try {
        callService({
          domain: domain as "inputBoolean",
          service: serviceName as "turnOn",
          target: {
            entity_id: data.entity_id,
          },
          serviceData: data,
        });
      } catch (error) {
        console.error(`Failed to call ${service}:`, error);
        throw error;
      }
    },
    [callService]
  );

  return {
    setInputSelect,
    turnOnBoolean,
    turnOffBoolean,
    navigateToScreen,
    resetGame,
    callService: callServiceGeneric,
  };
}
