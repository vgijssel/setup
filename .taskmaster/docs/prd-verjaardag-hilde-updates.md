# Verjaardag Hilde - UI/UX Updates

## Overview
This PRD covers polish and refinement updates to the Verjaardag Hilde escape room application based on user feedback and testing. The changes focus on improving clarity, consistency, and user experience across all puzzle screens.

## Updates Required

### Screen 4 / Puzzle 2: Update Apple TV Quiz Questions
**What**: Update the 3 questions in Puzzle 2 (Apple TV Quiz) to new specific questions
**Why**: Current questions need to be more specific and contextual to the user's actual Apple TV usage
**How**:
- Question 1: "Slaapkamer - Start de app met Ludo"
- Question 2: "Woonkamer - Start de app met veel bloed en snijden"
- Question 3: "Slaapkamer - Start de app om lekker te lachen"

### Rename All Puzzle Titles to "Controle" Format
**What**: Rename all puzzle titles from "Puzzel X: [Name]" to "[Device/Location] Controle"
**Why**: More consistent and clearer naming that reflects the control aspect of the escape room
**How**:
- Example: "Puzzel 2: De Apple TV Quiz" becomes "Apple TV Controle"
- Apply to all 8 puzzles (Screens 3-10)
- Maintain subtitle/description clarity

### Update Vault Code Copy
**What**: Update the vault code progress text to show recovered digits
**Why**: Better clarity on progress - shows how many digits have been recovered
**How**: Display "2/8 cijfers hersteld" format instead of just showing blank digits

### Make "Puzzel opgelost!" a Temporary Popup
**What**: Convert the "Puzzel opgelost!" (Puzzle Solved) section into a temporary popup notification
**Why**: Cleaner UI, doesn't permanently take up screen space, provides clear feedback
**How**:
- Display popup when puzzle is completed
- Auto-dismiss after 3 seconds
- Include transition/fade animation

### Update Puzzle 5 with Progressive Disclosure
**What**: Update Puzzle 5 (Lamps) to match Puzzle 3's progressive disclosure pattern
**Why**: Maintains consistency and prevents giving away answers before player discovers them
**How**:
- Hide location names initially
- Show "Woonkamer lamp" only after that lamp is found/activated
- Show "Keuken lamp" only after that lamp is found/activated
- Apply same progressive disclosure to all 5 lamp locations

### Update Puzzle 7 Copy and Subtitle
**What**: Update Puzzle 7 title and subtitle text
**Why**: More accurate and descriptive copy
**How**:
- Title: "Temperatuur controle"
- Subtitle: "Zet de juiste temperatuur in verschillende kamers: 7 - 10 - 15 - 19 - 20"

### Update Puzzle 8 Input Validation
**What**: Update Puzzle 8 (Audio code input) to remove placeholder text and enforce max 5 digits
**Why**: The code is exactly 5 digits (91872), input should reflect this constraint
**How**:
- Remove "Bijv." placeholder text from input field
- Set max length to 5 digits
- Ensure puzzle resolves when "91872" is entered
- Validate that the code check triggers puzzle completion

## Technical Requirements

### Testing Requirements
For each task:
- **Unit Tests**: Ensure component logic works in isolation
- **Integration Tests**: Verify component interaction with Home Assistant entities
- **E2E Tests (Playwright)**: Validate full user flow at http://localhost:5173/
  - Test puzzle completion
  - Test state transitions
  - Test progressive disclosure where applicable
  - Test popup timing (3 seconds)
  - Test input validation

### Acceptance Criteria
- All puzzles use consistent "Controle" naming pattern
- Vault code shows recovery progress format ("X/8 cijfers hersteld")
- "Puzzel opgelost!" appears as 3-second popup with smooth animation
- Progressive disclosure works in both Puzzle 3 and Puzzle 5
- Puzzle 7 shows correct temperature subtitle
- Puzzle 8 accepts only 5-digit code and resolves with "91872"
- All changes validated with working unit, integration, and E2E tests

## Priority
High - These are polish items required before final deployment
