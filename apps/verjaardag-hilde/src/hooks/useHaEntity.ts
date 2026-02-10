import { useEntity } from "@hakit/core";
import type { EntityName } from "@hakit/core";

/**
 * Custom hook for reading input_select entity values.
 *
 * Used for:
 * - Global screen selector (verjaardag_hilde_global_select)
 * - Progress puzzle selectors (puzzle_1_select, puzzle_2_select, etc.)
 *
 * @param entityId - The full entity ID (e.g., "input_select.verjaardag_hilde_global_select")
 * @returns Object with value, options array, and loading state
 */
export function useInputSelect(entityId: string) {
  // Cast to EntityName for type compatibility
  // In production, these would be validated against HA's entity registry
  const entity = useEntity(entityId as EntityName, {
    returnNullIfNotFound: true,
  });

  return {
    /** Current selected option value (e.g., "1", "5") */
    value: entity?.state ?? "1",
    /** Array of available options */
    options: (entity?.attributes?.options as string[] | undefined) ?? [],
    /** True while entity is being loaded */
    isLoading: entity === null,
    /** The raw entity object for advanced use cases */
    entity,
  };
}

/**
 * Custom hook for reading input_boolean entity values.
 *
 * Used for:
 * - Collection puzzle items (puzzle_3_item_1, puzzle_4_item_1, etc.)
 *
 * @param entityId - The full entity ID (e.g., "input_boolean.verjaardag_hilde_puzzle_3_item_1")
 * @returns Object with boolean value and loading state
 */
export function useInputBoolean(entityId: string) {
  const entity = useEntity(entityId as EntityName, {
    returnNullIfNotFound: true,
  });

  return {
    /** True if the boolean is "on", false otherwise */
    value: entity?.state === "on",
    /** True while entity is being loaded */
    isLoading: entity === null,
    /** The raw entity object for advanced use cases */
    entity,
  };
}

/**
 * Custom hook for reading any entity state as a number.
 *
 * Useful for progress puzzles where the value represents a count.
 *
 * @param entityId - The full entity ID
 * @returns Object with numeric value, max value, and loading state
 */
export function useNumericSelect(entityId: string) {
  const { value, options, isLoading, entity } = useInputSelect(entityId);

  const numericValue = parseInt(value, 10) || 0;
  const maxValue =
    options.length > 0
      ? parseInt(options[options.length - 1], 10) || options.length - 1
      : 0;

  return {
    /** Current value as a number */
    value: numericValue,
    /** Maximum possible value */
    maxValue,
    /** Progress as a fraction (0 to 1) */
    progress: maxValue > 0 ? numericValue / maxValue : 0,
    /** True if the puzzle is complete (value equals max) */
    isComplete: numericValue >= maxValue && maxValue > 0,
    /** True while entity is being loaded */
    isLoading,
    /** The raw entity object */
    entity,
  };
}

/**
 * Custom hook for reading multiple input_boolean entities.
 *
 * Used for collection puzzles with multiple items.
 *
 * @param entityIds - Array of entity IDs to track
 * @returns Object with completion status for each item and overall progress
 */
export function useCollectionProgress(entityIds: string[]) {
  // Note: This creates multiple entity subscriptions
  // In a production app, we might want to optimize this
  const items = entityIds.map((id) => {
    // We can't call hooks conditionally, so we always call for all IDs
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { value, isLoading } = useInputBoolean(id);
    return { id, completed: value, isLoading };
  });

  const completedCount = items.filter((item) => item.completed).length;
  const isLoading = items.some((item) => item.isLoading);
  const isComplete =
    completedCount === entityIds.length && entityIds.length > 0;

  return {
    /** Array of items with their completion status */
    items,
    /** Number of completed items */
    completedCount,
    /** Total number of items */
    totalCount: entityIds.length,
    /** Progress as a fraction (0 to 1) */
    progress: entityIds.length > 0 ? completedCount / entityIds.length : 0,
    /** True if all items are complete */
    isComplete,
    /** True while any entity is loading */
    isLoading,
  };
}
