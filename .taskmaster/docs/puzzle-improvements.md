# Puzzle Improvements PRD

## Overview
Improvements to various puzzles in the verjaardag-hilde application to enhance user experience and fix existing issues.

## Tasks

### Task 1: Puzzle 3 - Switch Interaction Improvements
**Description:** Improve the switch (schakelaar) interaction in Puzzle 3
**Requirements:**
- Ensure dropped switches can be moved back to the left column
- Add red border indication for invalid switch combinations
- Remove the drop target "💡" (&#128161;) heading completely

### Task 2: Application Vertical Scrollability
**Description:** Make the entire application scrollable vertically when content doesn't fit within the frame
**Requirements:**
- Ensure application is vertically scrollable when content exceeds viewport height
- Maintain proper layout and functionality while scrolling

### Task 3: Puzzle 4 - Color Label Display
**Description:** Show color labels before the correct answer is given in Puzzle 4
**Requirements:**
- Display "Blauw", "Groen", "Rood" instead of "???" when puzzles are not solved
- Keep green border indication when puzzle is solved (already present)

### Task 4: Puzzle 6 - Gauge Update Fix
**Description:** Fix gauge not updating when entity value changes in Puzzle 6
**Requirements:**
- Ensure gauge updates when entity "verjaardag_hilde_puzzle_6_power_number" is updated
- Fix the reactivity/state management issue preventing updates

### Task 5: Puzzle 6 - Gauge Color Segment Fix
**Description:** Fix the gauge color for the first segment in Puzzle 6
**Requirements:**
- Make the first segment (0-40%) white instead of red
- Ensure color transition is correct for subsequent segments

## Testing Requirements
All tasks must include:
- Validation via http://localhost:5173/ using Playwright MCP
- Home Assistant REST API testing for state updates
- Updated and passing unit tests
- Updated and passing integration tests
