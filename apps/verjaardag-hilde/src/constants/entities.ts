/**
 * Home Assistant entity IDs for the Verjaardag Hilde escape room.
 *
 * All game state is managed through these HA entities.
 * The frontend subscribes to these entities via HassConnect WebSocket.
 */

export const ENTITIES = {
  /** Global screen selector (1-11) - controls which screen is displayed */
  GLOBAL_SELECT: "input_select.verjaardag_hilde_global_select",

  /** Progress puzzles use select entities with incremental values */
  PUZZLE_1_SELECT: "input_select.verjaardag_hilde_puzzle_1_select", // Doors (0-5)
  PUZZLE_2_SELECT: "input_select.verjaardag_hilde_puzzle_2_select", // Apple TV (0-3)
  PUZZLE_5_SELECT: "input_select.verjaardag_hilde_puzzle_5_select", // Lamps (0-5)
  PUZZLE_8_SELECT: "input_select.verjaardag_hilde_puzzle_8_select", // Audio (0-1)

  /** Collection puzzles use boolean entities for each item */
  PUZZLE_3: {
    KEUKEN: "input_boolean.verjaardag_hilde_puzzle_3_keuken_toggle",
    SLAAPKAMER: "input_boolean.verjaardag_hilde_puzzle_3_slaapkamer_toggle",
    TUIN: "input_boolean.verjaardag_hilde_puzzle_3_tuin_toggle",
    VOORRAADKAST: "input_boolean.verjaardag_hilde_puzzle_3_voorraadkast_toggle",
    WASKAMER: "input_boolean.verjaardag_hilde_puzzle_3_waskamer_toggle",
  },

  PUZZLE_4: {
    RED: "input_boolean.verjaardag_hilde_puzzle_4_red_toggle",
    BLUE: "input_boolean.verjaardag_hilde_puzzle_4_blue_toggle",
    GREEN: "input_boolean.verjaardag_hilde_puzzle_4_green_toggle",
  },

  PUZZLE_6: {
    AUTO: "input_boolean.verjaardag_hilde_puzzle_6_auto_toggle",
    DROGER: "input_boolean.verjaardag_hilde_puzzle_6_droger_toggle",
    WASMACHINE: "input_boolean.verjaardag_hilde_puzzle_6_wasmachine_toggle",
  },

  PUZZLE_7: {
    BABYKAMER: "input_boolean.verjaardag_hilde_puzzle_7_babykamer_toggle",
    BADKAMER: "input_boolean.verjaardag_hilde_puzzle_7_badkamer_toggle",
    KANTOOR: "input_boolean.verjaardag_hilde_puzzle_7_kantoor_toggle",
    SLAAPKAMER: "input_boolean.verjaardag_hilde_puzzle_7_slaapkamer_toggle",
    WOONKAMER: "input_boolean.verjaardag_hilde_puzzle_7_woonkamer_toggle",
  },
} as const;

/** The 8-digit code that unlocks the physical safe */
export const SAFE_CODE = "83 92 49 80";

/** Code segments for progressive reveal (2 digits per puzzle completed) */
export const CODE_SEGMENTS = ["83", "92", "49", "80"];

/**
 * Screen to puzzle mapping.
 * Screens 1-2 are intro, 3-10 are puzzles (1-8), 11 is outro.
 */
export const SCREEN_PUZZLE_MAP = {
  3: { type: "progress", entity: ENTITIES.PUZZLE_1_SELECT, maxValue: 5 },
  4: { type: "progress", entity: ENTITIES.PUZZLE_2_SELECT, maxValue: 3 },
  5: { type: "collection", entities: Object.values(ENTITIES.PUZZLE_3) },
  6: { type: "collection", entities: Object.values(ENTITIES.PUZZLE_4) },
  7: { type: "progress", entity: ENTITIES.PUZZLE_5_SELECT, maxValue: 5 },
  8: { type: "collection", entities: Object.values(ENTITIES.PUZZLE_6) },
  9: { type: "collection", entities: Object.values(ENTITIES.PUZZLE_7) },
  10: { type: "progress", entity: ENTITIES.PUZZLE_8_SELECT, maxValue: 1 },
} as const;
