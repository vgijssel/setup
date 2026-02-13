# Verjaardag Hilde - Additional UI Polish Updates

## Overview
Additional refinements to the Verjaardag Hilde escape room application focusing on visual feedback improvements and layout changes.

## Updates Required

### Remove Puzzle Solved Popup and Add Green Fade Effect
**What**: Replace the "Puzzel opgelost!" popup with a green fade effect on the vault code section
**Why**: More subtle and integrated visual feedback that doesn't interrupt the user experience
**How**:
- Remove PuzzleSolvedPopup component usage from all puzzle screens
- Add CSS class to ProgressCode component when puzzle is complete
- Animate vault code section background to fade into green color
- Use smooth transition (e.g., 1-2 seconds fade)
- Green background should remain visible to indicate completion

### Update Screen 7 (Puzzle 5) Subtitle Copy
**What**: Change the subtitle/description text for Puzzle 5 (Lamps)
**Why**: More accurate instruction that reflects the sequential nature of the puzzle
**How**:
- Update Screen7Puzzle5.tsx description from current text to: "Zet de lampen in de juiste volgorde aan"
- Maintain all other functionality (progressive disclosure, etc.)

### Redesign Screen 11 (Outro) Layout
**What**: Completely change the layout of Screen 11 to match Screen 2 video style
**Why**: Consistency with intro screen and better presentation of final code reveal
**How**:
- Display outro video "verjaardag_hilde_outro.mp4" similar to Screen 2 implementation
- Use react-player with same configuration as Screen2Video
- Show ProgressCode component below the video (same as puzzle screens)
- Remove all other content (puzzle complete messages, etc.)
- Keep only: video player + vault code section
- Video should play automatically
- No navigation elements needed (this is the final screen)

## Technical Requirements

### Testing Requirements
For each task:
- **Playwright E2E Validation**: Test implementation at http://localhost:5173/
- **HAOS REST API Testing**: Use Home Assistant REST API to:
  - Navigate to the correct screen (update global select entity)
  - Update puzzle state entities to trigger completion
  - Validate UI changes with Playwright
- **Unit Tests**: Ensure component logic works in isolation
- **Integration Tests**: Verify component interaction with Home Assistant entities
- All tests must pass

### Acceptance Criteria
- Puzzle completion shows green fade on vault code section (no popup)
- Screen 7 subtitle reads "Zet de lampen in de juiste volgorde aan"
- Screen 11 shows only video + vault code section
- All changes validated with working unit, integration, and E2E tests
- HAOS REST API testing confirms proper state handling

## Priority
High - Final polish items before deployment
