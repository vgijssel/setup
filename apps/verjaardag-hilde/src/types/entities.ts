/**
 * Type definitions for Home Assistant entities used in Verjaardag Hilde.
 *
 * These types provide compile-time safety when working with HA entities.
 */

/**
 * Screen numbers (1-10) as string values matching HA select options.
 */
export type ScreenNumber =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10";

/**
 * Progress puzzle states (0 to max value).
 */
export type PuzzleProgress = string; // "0", "1", "2", etc.

/**
 * Boolean entity state values.
 */
export type BooleanState = "on" | "off";

/**
 * Entity attributes for input_select.
 */
export interface InputSelectAttributes {
  options: string[];
  editable: boolean;
  friendly_name: string;
  icon?: string;
}

/**
 * Entity attributes for input_boolean.
 */
export interface InputBooleanAttributes {
  editable: boolean;
  friendly_name: string;
  icon?: string;
}

/**
 * Mapping of screen numbers to their puzzle information.
 */
export interface ScreenInfo {
  screenNumber: number;
  puzzleNumber?: number;
  puzzleType?: "progress" | "collection";
  title: string;
  description: string;
}

/**
 * Screen information lookup.
 */
export const SCREEN_INFO: Record<number, ScreenInfo> = {
  1: {
    screenNumber: 1,
    title: "Welkom!",
    description: "Druk op Start om de escape room te beginnen.",
  },
  2: {
    screenNumber: 2,
    title: "Introductie",
    description: "Kijk naar de introductievideo.",
  },
  3: {
    screenNumber: 3,
    puzzleNumber: 1,
    puzzleType: "progress",
    title: "De Deuren",
    description: "Open 5 deuren in het huis om de eerste code te ontgrendelen.",
  },
  4: {
    screenNumber: 4,
    puzzleNumber: 2,
    puzzleType: "progress",
    title: "Apple TV",
    description: "Beantwoord 3 vragen over de Apple TV apps.",
  },
  5: {
    screenNumber: 5,
    puzzleNumber: 3,
    puzzleType: "collection",
    title: "De Schakelaars",
    description: "Vind de juiste combinatie van schakelaars en lampen.",
  },
  6: {
    screenNumber: 6,
    puzzleNumber: 5,
    puzzleType: "progress",
    title: "De Lampen",
    description: "Schakel 5 lampen in de juiste volgorde in.",
  },
  7: {
    screenNumber: 7,
    puzzleNumber: 6,
    puzzleType: "collection",
    title: "Stroomverbruik",
    description: "Bereik de juiste stroomverbruik drempel.",
  },
  8: {
    screenNumber: 8,
    puzzleNumber: 7,
    puzzleType: "collection",
    title: "De Temperaturen",
    description: "Stel 5 thermostaten in op de juiste temperatuur.",
  },
  9: {
    screenNumber: 9,
    puzzleNumber: 8,
    puzzleType: "progress",
    title: "Audio Code",
    description: "Voer de gehoorde code in.",
  },
  10: {
    screenNumber: 10,
    title: "Gefeliciteerd!",
    description: "Je hebt de escape room voltooid!",
  },
};
