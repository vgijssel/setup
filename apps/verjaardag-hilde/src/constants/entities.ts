/**
 * Home Assistant entity IDs for the Verjaardag Hilde escape room.
 *
 * All game state is managed through these HA entities.
 * The frontend subscribes to these entities via HassConnect WebSocket.
 */

export const ENTITIES = {
  /** Global screen selector (1-10) - controls which screen is displayed */
  GLOBAL_SELECT: "input_select.verjaardag_hilde_global_select",

  /** Progress puzzles use select entities with incremental values */
  PUZZLE_1_SELECT: "input_select.verjaardag_hilde_puzzle_1_select", // Doors (0-5)
  PUZZLE_2_SELECT: "input_select.verjaardag_hilde_puzzle_2_select", // Apple TV (0-3)
  PUZZLE_5_SELECT: "input_select.verjaardag_hilde_puzzle_5_select", // Lamps (0-5)
  PUZZLE_8_SELECT: "input_select.verjaardag_hilde_puzzle_8_select", // Audio (0-1)

  /** Collection puzzles use boolean entities for each item */
  PUZZLE_3_ITEM_1: "input_boolean.verjaardag_hilde_puzzle_3_item_1",
  PUZZLE_3_ITEM_2: "input_boolean.verjaardag_hilde_puzzle_3_item_2",
  PUZZLE_3_ITEM_3: "input_boolean.verjaardag_hilde_puzzle_3_item_3",
  PUZZLE_3_ITEM_4: "input_boolean.verjaardag_hilde_puzzle_3_item_4",
  PUZZLE_3_ITEM_5: "input_boolean.verjaardag_hilde_puzzle_3_item_5",

  PUZZLE_3: {
    ITEM_1: "input_boolean.verjaardag_hilde_puzzle_3_item_1",
    ITEM_2: "input_boolean.verjaardag_hilde_puzzle_3_item_2",
    ITEM_3: "input_boolean.verjaardag_hilde_puzzle_3_item_3",
    ITEM_4: "input_boolean.verjaardag_hilde_puzzle_3_item_4",
    ITEM_5: "input_boolean.verjaardag_hilde_puzzle_3_item_5",
  },

  PUZZLE_4: {
    RED: "input_boolean.verjaardag_hilde_puzzle_4_item_1",
    BLUE: "input_boolean.verjaardag_hilde_puzzle_4_item_2",
    GREEN: "input_boolean.verjaardag_hilde_puzzle_4_item_3",
  },

  PUZZLE_6: {
    POWER_THRESHOLD: "input_boolean.verjaardag_hilde_puzzle_6_item_1",
  },

  PUZZLE_7: {
    TEMP_7: "input_boolean.verjaardag_hilde_puzzle_7_item_1",
    TEMP_10: "input_boolean.verjaardag_hilde_puzzle_7_item_2",
    TEMP_15: "input_boolean.verjaardag_hilde_puzzle_7_item_3",
    TEMP_19: "input_boolean.verjaardag_hilde_puzzle_7_item_4",
    TEMP_20: "input_boolean.verjaardag_hilde_puzzle_7_item_5",
  },
} as const;

/** The 8-digit code that unlocks the physical safe */
export const SAFE_CODE = "83 92 49 80";

/** Code segments for progressive reveal (2 digits per puzzle completed) */
export const CODE_SEGMENTS = ["83", "92", "49", "80"];

/**
 * Screen to puzzle mapping.
 * Screens 1-2 are intro, 3-9 are puzzles, 10 is outro.
 */
export const SCREEN_PUZZLE_MAP = {
  3: { type: "progress", entity: ENTITIES.PUZZLE_1_SELECT, maxValue: 5 },
  4: { type: "progress", entity: ENTITIES.PUZZLE_2_SELECT, maxValue: 3 },
  5: { type: "collection", entities: Object.values(ENTITIES.PUZZLE_3) },
  6: { type: "progress", entity: ENTITIES.PUZZLE_5_SELECT, maxValue: 5 },
  7: { type: "collection", entities: Object.values(ENTITIES.PUZZLE_6) },
  8: { type: "collection", entities: Object.values(ENTITIES.PUZZLE_7) },
  9: { type: "progress", entity: ENTITIES.PUZZLE_8_SELECT, maxValue: 1 },
} as const;
