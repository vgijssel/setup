<context>
# Overview
Verjaardag Hilde is an interactive escape room experience designed as a birthday present. The application runs on an iPad Air 11 in landscape mode and integrates with the existing Home Assistant (haos) smart home automation system. Players progress through 8 distinct puzzles that interact with real smart home devices (doors, lights, TVs, thermostats, etc.) throughout the house. Successfully completing all puzzles reveals an 8-digit code that unlocks a physical safe containing the birthday present.

The application is stateless by design - all game state is managed by Home Assistant entities. This ensures the game can be paused, resumed, or recovered from crashes without losing progress. The frontend is purely a visualization layer that responds to Home Assistant state changes.

# Core Features

## State Management via Home Assistant
- **What it does**: All application and puzzle state is managed through Home Assistant select entities and input toggles
- **Why it's important**: Enables stateless frontend, crash recovery, remote control via HA app, and easy debugging
- **How it works**: A global select entity (`verjaardag_hilde_global_select`) tracks screen 1-10, each puzzle has its own select/toggle entities

## Two Puzzle Types
- **What it does**: Supports "progress" puzzles (sequential steps) and "collection" puzzles (unordered completion)
- **Why it's important**: Provides variety in gameplay and leverages different smart home interaction patterns
- **How it works**: Progress puzzles use select entities with incremental values; collection puzzles use multiple input toggles

## Progressive Code Disclosure
- **What it does**: Reveals one digit of the 8-digit safe code with each completed puzzle
- **Why it's important**: Provides continuous feedback on overall progress and builds anticipation
- **How it works**: Screens 3-10 show increasingly more digits of the code `83 92 49 80`

## Real Smart Home Integration
- **What it does**: Puzzles directly interact with physical smart home devices
- **Why it's important**: Creates an immersive, tangible escape room experience in the player's actual environment
- **How it works**: Uses ha-component-kit to monitor and trigger Home Assistant entities (doors, lights, TVs, thermostats, speakers)

## Video Playback with Automation Triggers
- **What it does**: Plays intro/outro videos with synchronized smart home actions at specific timestamps
- **Why it's important**: Creates dramatic moments and sets the atmosphere for the experience
- **How it works**: React Player with timed service calls to Home Assistant to control lights, TVs, and audio

# User Experience

## User Personas
- **Primary**: Hilde (birthday recipient) - expects a fun, challenging, personalized experience
- **Secondary**: Gift giver - needs easy setup, reliable operation, ability to monitor/control progress

## Key User Flows

### Happy Path Flow
1. Land on intro screen (Screen 1), press "Start!"
2. Watch intro video with dramatic smart home effects (Screen 2)
3. Progress through 8 puzzle screens (Screens 3-10), each revealing one more code digit
4. Complete final puzzle, watch outro video with full 8-digit code revealed
5. Use code to unlock physical safe containing present

### Puzzle Interaction Flow
1. Read puzzle title and description
2. Interact with physical smart home devices based on instructions
3. Watch checkmarks (✅) appear as puzzle progresses
4. Complete puzzle, automatic transition to next screen

### Recovery Flow
1. If app crashes or iPad restarts, relaunch app
2. App reads current `verjaardag_hilde_global_select` value from HA
3. Immediately displays correct screen with correct puzzle progress

## UI/UX Considerations
- **Layout**: Designed for iPad Air 11 landscape (1640×1148 effective pixels)
- **Visual Feedback**: Green checkmarks (✅) indicate progress on puzzle elements
- **Responsive State**: UI updates immediately when HA entities change
- **Accessibility**: Clear titles, descriptions, and visual progress indicators
- **Error Handling**: Graceful fallbacks if HA connection lost
</context>

<PRD>
# Technical Architecture

## System Components

### Frontend Application
- **Framework**: React with TypeScript
- **Build Tool**: Vite (following moonrepo best practices)
- **Location**: `apps/verjaardag-hilde/`
- **Key Libraries**:
  - `@hakit/core` and `@hakit/components` - Home Assistant integration
  - `react-player` - Video playback for intro/outro
  - `react` and `react-dom` - UI framework

### Home Assistant Integration
- **Connection**: `<HassConnect>` component with WebSocket connection
- **Authentication**: Token-based auth via environment variables
  - `VITE_HA_URL`: `http://192.168.1.32:8123` (development)
  - `VITE_HA_TOKEN`: Sourced from global `.env` file
- **REST API**: Used for service calls and entity manipulation during testing

### Testing Infrastructure
- **Unit Tests**: Test individual React components in isolation
- **Integration Tests**: Test component interaction with mocked HA entities
- **E2E Tests**: Playwright with MCP integration for full flow validation
- **Manual Testing**: Use HA REST API via shell to change entity states

## Data Models

### Global State Entity
```yaml
entity_id: input_select.verjaardag_hilde_global_select
options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
initial: "1"
```

### Progress Puzzle Entity (Puzzles 1, 2, 5, 8)
```yaml
entity_id: input_select.verjaardag_hilde_puzzle_{n}_select
options: ["0", "1", "2", ..., "{max_steps}"]
initial: "0"
```

### Collection Puzzle Entities (Puzzles 3, 4, 6, 7)
```yaml
entity_id: input_boolean.verjaardag_hilde_puzzle_{n}_item_{m}
initial: false
```

## APIs and Integrations

### Home Assistant WebSocket API
- **Entity Subscription**: Real-time updates when entity states change
- **Service Calls**: Trigger HA automations and services from frontend
- **Authentication**: Long-lived access token

### Home Assistant REST API
- **Purpose**: Testing and validation during development
- **Usage**: Shell commands to change entity states and verify UI updates
- **Example**: `curl -X POST http://192.168.1.32:8123/api/services/input_select/select_option ...`

## Infrastructure Requirements

### Development Environment
- Node.js with moonrepo (Moon)
- Home Assistant instance at `192.168.1.32:8123`
- iPad Air 11 for manual testing
- Playwright with MCP for automated testing

### Production Environment
- Vite production build hosted on local network
- Continuous WebSocket connection to Home Assistant
- Served via Home Assistant ingress or separate web server

# Development Roadmap

## Phase 1: Foundation & Navigation (MVP)
**Scope**: Basic application structure with screen navigation and HA connection

**Deliverables**:
- Moon project setup in `apps/verjaardag-hilde/`
- Vite configuration with TypeScript
- Install and configure ha-component-kit
- Implement `<HassConnect>` with token authentication
- Create global state listener for `verjaardag_hilde_global_select`
- Implement screen routing (1-10) based on global select value
- Basic error handling for HA connection failures
- Unit tests for core navigation logic

**Definition of Done**:
- App connects to Home Assistant successfully
- Can manually change `verjaardag_hilde_global_select` via HA and see screen change
- All screens render placeholder content
- Tests pass for navigation logic

## Phase 2: Intro & Outro Screens (Screens 1, 2, 10)
**Scope**: Implement video playback with timed automation triggers

**Deliverables**:
- Screen 1: Title screen with "Start!" button that updates global select
- Screen 2: Video player for `verjaardag_hilde_intro.mp4` with timed service calls:
  - 2s: Turn on lights
  - 4s: Turn on TVs
  - 6s: Play radio on Woonkamer Sonos
  - 8s: Turn off all lights, TVs, and Sonos
  - End: Navigate to screen 3
- Screen 10: Video player for `verjaardag_hilde_outro.mp4` with background music
- Progressive code display component (shows 0-8 digits based on screen number)
- Integration tests for video playback and service call timing
- Playwright test for full intro → video → first puzzle flow

**Definition of Done**:
- Videos play correctly on iPad Air 11 landscape
- Timed automations trigger at correct timestamps
- Code display shows correct digits on each screen
- Playwright test validates entire intro sequence

## Phase 3: Progress Puzzle Pattern (Puzzle 1 - Doors)
**Scope**: Implement first puzzle to establish progress puzzle pattern

**Deliverables**:
- Screen 3 component with title, description, and 5 door entities
- Subscribe to `verjaardag_hilde_puzzle_1_select` entity
- Render door states from HA (open/closed with visual indicators)
- Display checkmarks (✅) based on select value (0-5)
- Create reusable `ProgressPuzzle` component for future puzzles
- Unit tests for puzzle state rendering
- Integration tests with mocked HA entities
- Playwright test for full puzzle completion flow

**Definition of Done**:
- Doors open/close in UI when HA entities change
- Checkmarks appear as puzzle progresses (select value increases)
- Can complete puzzle by manipulating HA entities via REST API
- All tests pass
- Pattern documented for reuse

## Phase 4: Additional Progress Puzzles (Puzzles 2, 5, 8)
**Scope**: Implement remaining progress-based puzzles

**Deliverables**:
- **Puzzle 2 (Screen 4 - Apple TV)**:
  - 3 questions about Apple TV apps
  - Subscribe to `verjaardag_hilde_puzzle_2_select`
  - Checkmarks appear to left of answered questions
- **Puzzle 5 (Screen 6 - Lamps)**:
  - 5 non-interactive toggles
  - Subscribe to `verjaardag_hilde_puzzle_5_select`
  - Toggles turn on sequentially as select increments
- **Puzzle 8 (Screen 9 - Audio)**:
  - 5-digit code input form
  - Frontend validation of code
  - Service call to set puzzle entity to 1 when correct
- Reuse `ProgressPuzzle` component where applicable
- Unit and integration tests for each puzzle
- Playwright tests for each puzzle flow

**Definition of Done**:
- All progress puzzles render correctly
- Entity subscriptions work for each puzzle
- Checkmarks appear appropriately
- Tests pass for all puzzles

## Phase 5: Collection Puzzle Pattern (Puzzle 3 - Buttons)
**Scope**: Implement first collection puzzle to establish pattern

**Deliverables**:
- Screen 5 component with title, description
- 5 switches with dropdown selects
- Subscribe to 5 boolean entities: `verjaardag_hilde_puzzle_3_item_{1-5}`
- Map switch-light combinations to boolean entities
- Display checkmarks when correct combination matched
- Create reusable `CollectionPuzzle` component
- Unit tests for collection puzzle logic
- Integration tests with mocked boolean entities
- Playwright test for puzzle completion

**Definition of Done**:
- Switches and selects render with correct options
- Checkmarks appear when HA booleans flip to true
- Can complete puzzle by setting all 5 booleans via REST API
- Tests pass
- Pattern documented for reuse

## Phase 6: Additional Collection Puzzles (Puzzles 4, 6, 7)
**Scope**: Implement remaining collection-based puzzles

**Deliverables**:
- **Puzzle 4 (Screen 5 - Voice)**:
  - 3 colored lightbulbs (red, blue, green) - non-interactive
  - Subscribe to 3 boolean entities
  - Checkmarks below each bulb when boolean true
- **Puzzle 6 (Screen 7 - Power Usage)**:
  - Power usage indicator (progress bar or gauge)
  - Subscribe to power usage sensor entity
  - Checkmarks or full completion indicator when threshold reached
- **Puzzle 7 (Screen 8 - Temperature)**:
  - 5 temperature indicators with preset values: 7, 10, 15, 19, 20
  - Subscribe to 5 boolean entities
  - Checkmarks below sensors when correct temp set
- Reuse `CollectionPuzzle` component where applicable
- Unit and integration tests for each puzzle
- Playwright tests for each puzzle flow

**Definition of Done**:
- All collection puzzles render correctly
- Boolean entity subscriptions work for each puzzle element
- Checkmarks appear when conditions met
- Tests pass for all puzzles

## Phase 7: Polish & Optimization
**Scope**: UI improvements, performance tuning, edge case handling

**Deliverables**:
- Responsive design validation on iPad Air 11 landscape
- Loading states for HA connection
- Reconnection logic if WebSocket drops
- Error boundaries for crash recovery
- Animations for checkmarks and transitions
- Accessibility improvements (ARIA labels, keyboard nav)
- Performance profiling and optimization
- Full Playwright test suite covering all screens
- Documentation for setup and deployment

**Definition of Done**:
- App performs smoothly on target device
- Handles network interruptions gracefully
- All edge cases covered by tests
- Setup documentation complete

## Phase 8: Home Assistant Backend Automations
**Scope**: Create HA automations that drive puzzle progression (not part of React app)

**Deliverables**:
- Automations to detect puzzle completion and increment global select
- Automations to track puzzle progress and update select/boolean entities
- Example: When 5th door closes, set `puzzle_1_select` to "5", then increment `global_select` to "4"
- Testing scripts to validate automations

**Definition of Done**:
- All puzzle completion automations functional
- Screen transitions happen automatically
- Can play full game end-to-end without manual intervention

# Logical Dependency Chain

## Foundation Layer (Must be built first)
1. **Moon Project Setup**: Project structure, dependencies, Vite config
2. **HA Connection**: `<HassConnect>` component with authentication working
3. **Global Navigation**: Listen to `verjaardag_hilde_global_select`, route to screens 1-10
4. **Testing Infrastructure**: Playwright MCP setup, unit test framework

## Presentation Layer (Visible frontend, build early)
5. **Screen 1 (Intro)**: Simple button to test navigation works end-to-end
6. **Screen 2 (Video)**: Video playback with timed automation hooks
7. **Progressive Code Display**: Component to show 0-8 digits based on screen

## Puzzle Framework (Establish patterns before scaling)
8. **Progress Puzzle Pattern**: Build Puzzle 1 (Doors) as template
9. **Collection Puzzle Pattern**: Build Puzzle 3 (Buttons) as template

## Puzzle Implementations (Can be parallelized within each group)
10. **Remaining Progress Puzzles**: Puzzles 2, 5, 8 reusing pattern
11. **Remaining Collection Puzzles**: Puzzles 4, 6, 7 reusing pattern

## Completion Layer
12. **Screen 10 (Outro)**: Final video with full code display
13. **Polish & Edge Cases**: Animations, error handling, performance

## Backend Integration (Separate track, can overlap with phases 8-11)
14. **HA Automations**: Backend logic to drive puzzle progression

**Pacing Strategy**: Build one complete screen at a time, validate with all three test types (unit, integration, Playwright) before proceeding. This ensures each screen is solid before moving on and provides visible progress quickly.

# Risks and Mitigations

## Technical Challenges

### Risk: Home Assistant WebSocket Connection Instability
- **Impact**: App becomes unresponsive if connection drops
- **Mitigation**: Implement automatic reconnection with exponential backoff, show connection status indicator, test with network interruptions

### Risk: Video Playback Timing Accuracy
- **Impact**: Smart home effects not synchronized with video moments
- **Mitigation**: Test timing extensively, use React Player's `onProgress` callback, add manual trigger fallbacks for critical effects

### Risk: State Synchronization Between HA and Frontend
- **Impact**: UI shows stale state after entity changes
- **Mitigation**: Use ha-component-kit's reactive subscriptions, implement optimistic UI updates, add "sync" button for manual refresh

### Risk: Testing Complexity with Physical Devices
- **Impact**: Hard to automate tests that require real door sensors, lights, etc.
- **Mitigation**: Use HA REST API to mock entity states during testing, create test mode that bypasses device checks, document manual test procedures

## MVP Scope Definition

### Risk: Scope Creep with 8 Unique Puzzles
- **Impact**: Development takes too long, complexity increases
- **Mitigation**: Build reusable components for puzzle types (ProgressPuzzle, CollectionPuzzle), strictly adhere to one-screen-at-a-time approach, defer polish features to Phase 7

### Risk: iPad-Specific Layout Issues
- **Impact**: UI doesn't work well on target device despite desktop testing
- **Mitigation**: Test on actual iPad Air 11 early and often, use responsive design from start, configure browser dev tools with correct viewport size

## Resource Constraints

### Risk: Dependency on Home Assistant for All State
- **Impact**: Cannot develop or test without HA running
- **Mitigation**: Create mock HA entity server for pure frontend development, use HA dev instance separate from production, document setup clearly

### Risk: Single Player Experience
- **Impact**: Cannot test multi-player edge cases like simultaneous entity changes
- **Mitigation**: Out of scope - designed as single-player experience, HA automations ensure atomic state transitions

# Appendix

## Research Findings

### ha-component-kit Documentation
- Source: https://shannonhochkins.github.io/ha-component-kit/
- Key findings:
  - Provides React hooks for entity subscriptions
  - Supports service calls via `useHass()` hook
  - Built-in TypeScript types for HA entities
  - Requires WebSocket connection via `<HassConnect>`

### React Player Documentation
- Source: https://www.npmjs.com/package/react-player
- Key findings:
  - Supports `onProgress` callback with `playedSeconds` for timed triggers
  - Works with local video files via `url` prop
  - Configurable controls, autoplay, loop, volume

### Moonrepo Best Practices
- Source: Project CLAUDE.md
- Key findings:
  - Place app in `apps/verjaardag-hilde/`
  - Define tasks in local `moon.yml`
  - Pin all dependencies to exact versions
  - Use `trunk fmt` and `trunk check` before commits

## Technical Specifications

### Entity Naming Convention
- **Global state**: `input_select.verjaardag_hilde_global_select`
- **Progress puzzles**: `input_select.verjaardag_hilde_puzzle_{n}_select` where n = 1,2,5,8
- **Collection puzzles**: `input_boolean.verjaardag_hilde_puzzle_{n}_item_{m}` where n = 3,4,6,7 and m = item index

### Screen to Puzzle Mapping
| Screen | Type | Entity | Max Value / Item Count |
|--------|------|--------|------------------------|
| 1 | Intro | N/A | N/A |
| 2 | Video | N/A | N/A |
| 3 | Progress | puzzle_1_select | 5 (doors) |
| 4 | Progress | puzzle_2_select | 3 (Apple TV apps) |
| 5 | Collection | puzzle_3_item_{1-5} | 5 (switch-light combos) |
| 6 | Progress | puzzle_5_select | 5 (lamp buttons) |
| 7 | Collection | puzzle_6_item_{1-N} | Power threshold |
| 8 | Collection | puzzle_7_item_{1-5} | 5 (temperatures) |
| 9 | Progress | puzzle_8_select | 1 (code validation) |
| 10 | Outro | N/A | N/A |

### iPad Air 11 Specifications (Landscape)
- Resolution: 2266 × 1488 pixels
- Viewport (without chrome): ~1640 × 1148 effective pixels
- Aspect ratio: ~16:10
- Touch interface - design for tap targets ≥44px

### Safe Code (Progressive Disclosure)
- Full code: `83 92 49 80`
- Screen 3: `__ __ __ __`
- Screen 4: `83 __ __ __`
- Screen 5: `83 92 __ __`
- Screen 6: `83 92 49 __`
- Screen 7-10: `83 92 49 80` (fully revealed after all puzzles)

### Video Assets
- `verjaardag_hilde_intro.mp4`: Intro video with timed automation triggers
- `verjaardag_hilde_outro.mp4`: Outro video with background music
- Location: `apps/verjaardag-hilde/public/videos/`

### Development Environment Variables
```bash
VITE_HA_URL=http://192.168.1.32:8123
VITE_HA_TOKEN=<token from global .env>
```
</PRD>
