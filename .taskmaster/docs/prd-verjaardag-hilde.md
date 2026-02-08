# Overview
This is an interactive escape room application called "Verjaardag Hilde" - a birthday present that transforms the entire smart home into an immersive puzzle game. The application orchestrates a series of 8 interconnected puzzles that leverage existing Home Assistant automation to create a seamless physical-digital experience. Players progress through 10 screens, solving puzzles that require interaction with real smart home devices (doors, lights, temperature sensors, audio systems) while the app provides visual feedback and guidance.

The escape room culminates in revealing an 8-digit code that unlocks a physical safe containing Hilde's birthday present. The system maintains all state in Home Assistant, making the frontend completely stateless and resilient to crashes or reloads.

# Core Features

## State Management via Home Assistant
- All application and puzzle state stored in Home Assistant select entities
- Global navigation controlled by `verjaardag_hilde_global_select` (values 1-10)
- Per-puzzle progress tracked in dedicated select entities (e.g., `verjaardag_hilde_puzzle_1_select`)
- Frontend subscribes to state changes and re-renders accordingly
- Enables crash-resilient gameplay - players resume at exact same point after reload

## Progressive Code Disclosure System
- 8-digit vault code revealed incrementally across puzzles
- Code: 83 92 49 80
- Screen 3: All digits hidden
- Screen 4: First digit revealed (8)
- Screen 5: First two digits revealed (83)
- Continues until Screen 10: All 8 digits revealed
- Code unlocks physical safe containing birthday present

## 10-Screen Game Flow
1. **Screen 1**: Intro screen with start button
2. **Screen 2**: Intro video with synchronized smart home actions
3. **Screens 3-9**: Seven puzzle screens (8 total puzzles, puzzle 2 has 3 sub-questions)
4. **Screen 10**: Outro video with full code reveal

## Integration with Smart Home Devices
- Door sensors and controls
- Light switches and bulbs
- Apple TV app detection
- Google Assistant voice commands
- Temperature sensors and thermostats
- Power usage monitoring
- Multi-room audio system (Sonos)
- All interactions trigger state changes in Home Assistant that drive puzzle progression

# User Experience

## User Personas
- **Primary**: Hilde (birthday recipient) - experiencing the escape room as a birthday surprise
- **Secondary**: Game facilitator (likely Maarten) - monitoring progress via Home Assistant app and providing hints if needed
- **Tertiary**: Other household members - may assist or participate

## Key User Flows

### Initial Game Launch
1. Open web application
2. See intro screen with "Start!" button
3. Click button to trigger intro video
4. Intro video plays with synchronized smart home effects:
   - 2s: Lights turn on
   - 4s: TVs turn on
   - 6s: Radio plays on Woonkamer Sonos
   - 8s: Everything turns off
5. Auto-transition to first puzzle

### Typical Puzzle Flow
1. Puzzle screen displays with title and description
2. Visual indicators show puzzle state (e.g., door icons, light bulbs, switches)
3. Player interacts with physical smart home devices
4. App updates in real-time as Home Assistant detects changes
5. Success splash screen when puzzle complete
6. Auto-transition to next screen after brief delay

### Code Discovery Flow
1. Complete first puzzle (screen 3) - code still hidden
2. Progress to screen 4 - first digit revealed
3. Each subsequent screen reveals next digit
4. All 8 digits visible on final screen
5. Use code to unlock physical safe

### Error Recovery Flow
1. Browser crashes or tab closes
2. Re-open application
3. App reads current state from Home Assistant
4. Immediately displays correct screen with correct puzzle state
5. Player continues from exact point of interruption

## UI/UX Considerations

### Visual Design
- Clean, minimal interface focused on puzzle clarity
- Large, clear icons for puzzle elements (doors, lights, switches, temperature)
- Prominent display of progressive code reveal
- Success animations for puzzle completion
- Mobile-responsive design (likely played on tablet or phone)

### Accessibility
- Clear text descriptions for each puzzle
- Visual feedback for all state changes
- No time pressure - puzzles can be completed at any pace
- No complex interactions - simple taps/clicks only

### Performance
- Lightweight React application
- Real-time WebSocket connection to Home Assistant
- Instant UI updates on state changes
- Video playback must be smooth and synchronized

# Technical Architecture

## System Components

### Frontend Application
- **Framework**: React with Vite build system
- **Home Assistant Integration**: ha-component-kit (https://github.com/shannonhochkins/ha-component-kit)
- **Authentication**: HassConnect from ha-component-kit
- **Video Playback**: react-player library
- **Location**: apps/verjaardag-hilde (moonrepo project structure)
- **Build**: Vite with moonrepo tasks
- **Deployment**: Static hosting (details TBD)

### Backend/State Management
- **Platform**: Home Assistant (haos)
- **State Entities**: Home Assistant select entities
- **Automation**: Home Assistant automations trigger state transitions
- **Device Integration**: Existing smart home devices via Home Assistant

### Smart Home Devices (Existing)
- Door sensors and locks
- Philips Hue or similar smart lights
- Apple TV
- Google Assistant/Home
- Nest or similar thermostats
- Power monitoring devices
- Sonos audio system

## Data Models

### Global State Entity
```yaml
entity_id: select.verjaardag_hilde_global_select
options:
  - "1"  # Intro screen
  - "2"  # Intro video
  - "3"  # Puzzle 1 - Doors
  - "4"  # Puzzle 2 - Apple TV
  - "5"  # Puzzle 3 - Switches/Lights
  - "6"  # Puzzle 4 - Voice
  - "7"  # Puzzle 5 - Button sequence
  - "8"  # Puzzle 6 - Power usage
  - "9"  # Puzzle 7 - Temperature
  - "10" # Puzzle 8 - Audio code
initial: "1"
```

### Puzzle State Entities (Example: Puzzle 1)
```yaml
entity_id: select.verjaardag_hilde_puzzle_1_select
options:
  - "0"  # Start
  - "1"  # 1 door changed
  - "2"  # 2 doors changed
  - "3"  # 3 doors changed
  - "4"  # 4 doors changed
  - "5"  # Complete
initial: "0"
```

### Frontend State Model
```typescript
interface AppState {
  currentScreen: number;        // 1-10, synced from global_select
  puzzleStates: {
    [puzzleId: number]: number; // Synced from puzzle_N_select
  };
  revealedDigits: number;       // Calculated from currentScreen
}
```

## APIs and Integrations

### Home Assistant WebSocket API
- Subscribe to select entity state changes
- Call services to update entity states
- Control smart home devices (lights, media players, climate)

### Required Home Assistant Services
- `select.select_option` - Update screen/puzzle state
- `light.turn_on/off` - Control lights
- `media_player.*` - Control Apple TV, Sonos
- `climate.set_temperature` - Set thermostats
- `tts.speak` - Text-to-speech for audio puzzle
- Custom automations for puzzle logic

## Infrastructure Requirements

### Development
- Node.js (version pinned in .nvmrc or moon.yml)
- npm with pinned dependencies
- moonrepo for build orchestration
- Home Assistant test instance (optional)

### Production
- Static file hosting (Netlify, Vercel, or self-hosted)
- HTTPS required for Home Assistant authentication
- Network access to Home Assistant instance
- Reliable WebSocket connection

# Development Roadmap

## Phase 1: MVP - Core Application Shell
**Goal**: Basic React app with Home Assistant connection and screen navigation

### Tasks
- Initialize moonrepo project in apps/verjaardag-hilde
- Set up Vite + React with TypeScript
- Configure ha-component-kit and HassConnect authentication
- Create basic routing/screen management (10 screens)
- Implement global state subscription to verjaardag_hilde_global_select
- Create placeholder screens 1-10
- Deploy to test environment and verify HA connection

## Phase 2: Intro/Outro Flow (Screens 1, 2, 10)
**Goal**: Working start and end experience with video playback

### Tasks
- Implement Screen 1 (intro with Start button)
- Integrate react-player for video playback
- Implement Screen 2 with synchronized smart home actions:
  - Timed service calls at 2s, 4s, 6s, 8s
  - Auto-transition on video end
- Implement Screen 10 (outro video + full code reveal)
- Create video player component with service call triggers
- Test video synchronization timing

## Phase 3: Progressive Code Reveal System
**Goal**: 8-digit code progressively revealed across screens 3-10

### Tasks
- Create CodeReveal component
- Implement digit masking/revealing logic based on current screen
- Style code display (large, readable, prominent)
- Test code reveal progression
- Verify code: 83 92 49 80 displays correctly

## Phase 4: Puzzle Infrastructure
**Goal**: Reusable puzzle components and state management

### Tasks
- Create base Puzzle component with title/description
- Implement puzzle state subscription pattern (puzzle_N_select entities)
- Create success splash screen component
- Build puzzle status indicator components (icons, progress bars, checkmarks)
- Set up puzzle transition logic
- Create testing utilities for puzzle state simulation

## Phase 5: Simple Puzzles (1, 4, 6, 7)
**Goal**: Puzzles with straightforward device monitoring

### Puzzle 1: Door Control (Screen 3)
- Display 5 door icons
- Subscribe to door sensor state changes
- Turn icons green on state change
- Show success on 5 doors changed

### Puzzle 4: Voice Control (Screen 6)
- Display 3 colored light bulbs (red, blue, green)
- Subscribe to light color state
- Show checkmarks when correct colors set
- Success when all 3 complete

### Puzzle 6: Power Usage (Screen 8)
- Display power usage indicator/meter
- Subscribe to power monitoring sensor
- Animate meter based on power consumption
- Success when threshold reached

### Puzzle 7: Temperature Control (Screen 9)
- Display 5 temperature targets: 7, 10, 15, 19, 20
- Subscribe to thermostat states
- Show checkmarks when correct temps set
- Success when all 5 match

## Phase 6: Interactive Puzzles (2, 8)
**Goal**: Puzzles with user input in frontend

### Puzzle 2: Apple TV Control (Screen 4)
- Display question sequence (1 of 3)
- Subscribe to Apple TV app state
- Progress through 3 questions
- Show success after question 3

### Puzzle 8: Audio Code Entry (Screen 10)
- Create 5-digit code input form
- Validate code locally
- Call service to update puzzle state on correct code
- Show success and transition

## Phase 7: Complex Puzzles (3, 5)
**Goal**: Puzzles with matching/sequencing mechanics

### Puzzle 3: Switch/Light Matching (Screen 5)
- Display 5 switches (left) and 5 light bulbs (right)
- Room labels: Slaapkamer, Waskamer, Keuken, Tuin, Voorraadkast
- Implement drag-and-drop or click-to-connect UI
- Subscribe to light states
- Validate correct mappings:
  - Slaapkamer switch → Waskamer lamp
  - Waskamer switch → Voorraadkast lamp
  - Keuken switch → Slaapkamer lamp
  - Tuin switch → Keuken lamp
  - Voorraadkast switch → Tuin lamp
- Show success when all correct

### Puzzle 5: Button Sequence (Screen 7)
- Display 5 toggle switches
- Subscribe to button press events
- Light up toggles in sequence as correct buttons pressed
- Success when sequence complete

## Phase 8: Home Assistant Automations
**Goal**: Backend logic for puzzle validation and state transitions

### Tasks
- Create select entities for all puzzles (global + 8 puzzle states)
- Write automations for each puzzle completion detection
- Implement auto-transition logic (puzzle complete → next screen)
- Create debug dashboard in HA for monitoring game state
- Test full game flow end-to-end
- Add reset automation for restarting game

## Phase 9: Polish and Testing
**Goal**: Production-ready escape room experience

### Tasks
- Optimize video file sizes and loading
- Add loading states and error handling
- Improve success animations
- Test on target device (tablet/phone)
- Full playthrough testing
- Fix any timing or synchronization issues
- Add analytics/logging for debugging
- Create facilitator guide/documentation

## Phase 10: Deployment and Handoff
**Goal**: Deployed and ready for birthday event

### Tasks
- Deploy to production hosting
- Configure Home Assistant production automations
- Test from production URL on target device
- Create troubleshooting guide
- Prepare backup/recovery procedures
- Final rehearsal run
- Document any manual setup steps

# Logical Dependency Chain

## Foundation First (Phase 1-3)
These must be completed before any puzzle work:
1. **Phase 1**: Core app shell - Required for all subsequent work
2. **Phase 2**: Video screens - Establishes intro/outro flow
3. **Phase 3**: Code reveal - Needed on screens 3-10

## Parallel Puzzle Development (Phase 4-7)
After foundation is complete, puzzle work can proceed in parallel:
- **Phase 4**: Puzzle infrastructure must complete first (dependency for Phase 5-7)
- **Phase 5, 6, 7**: Can be developed in parallel or any order
- Recommended: Phase 5 first (simpler puzzles), then 6 and 7

## Integration and Finalization (Phase 8-10)
Sequential completion required:
1. **Phase 8**: All puzzles must be complete before HA automations can be fully tested
2. **Phase 9**: Polish requires completed game
3. **Phase 10**: Deployment is final step

## Quick Wins Strategy
For fastest time-to-visible-progress:
1. Phase 1 → Phase 2 → Phase 3 → Phase 4 (foundation)
2. Phase 5: Puzzle 1 (simplest puzzle, quick win)
3. Phase 6: Puzzle 8 (frontend-only, demonstrates interactivity)
4. Continue with remaining puzzles
5. Phase 8-10 (integration and deployment)

This approach delivers a playable "vertical slice" (intro → one puzzle → code reveal) as early as possible, enabling testing and iteration while remaining puzzles are developed.

# Risks and Mitigations

## Technical Challenges

### WebSocket Connection Stability
**Risk**: Connection to Home Assistant drops during gameplay, breaking puzzle state updates
**Mitigation**:
- Implement automatic reconnection logic in ha-component-kit
- Add connection status indicator in UI
- Test over target network (WiFi stability)
- Consider local network deployment to minimize latency

### Video Synchronization Timing
**Risk**: Service calls to HA not precisely timed with video playback
**Mitigation**:
- Pre-buffer video before playback starts
- Use video player time position events (not setTimeout)
- Test on target device (not just development machine)
- Add buffer time to tolerances if needed

### Smart Home Device Responsiveness
**Risk**: Devices slow to respond, causing puzzle state lag or confusion
**Mitigation**:
- Test all device integrations before game day
- Ensure Home Assistant instance has adequate resources
- Consider adding visual "processing" indicators
- Manual override capability via HA dashboard

## MVP Scope Definition

### Potential Scope Creep
**Risk**: Adding features like hints, scoring, timers, multiplayer
**Mitigation**:
- Stick to core requirements: 10 screens, 8 puzzles, code reveal
- No additional features before full playthrough testing
- Focus on reliability over features
- Save enhancements for post-birthday updates

### Puzzle Complexity Balance
**Risk**: Puzzles too easy (boring) or too hard (frustrating)
**Mitigation**:
- Playtesting with someone unfamiliar with setup
- Provide hint system via Home Assistant app (manual)
- Document puzzle solutions for facilitator
- Adjustable difficulty via HA automation configuration

### Device Availability
**Risk**: Required smart home devices not available or compatible
**Mitigation**:
- Audit existing devices before finalizing puzzle designs
- Design puzzles around confirmed available devices
- Have backup puzzles that use different device types
- Test device control from Home Assistant before development

## Resource Constraints

### Development Time
**Risk**: Insufficient time before birthday deadline
**Mitigation**:
- Follow phased approach - deliver MVP quickly
- Deprioritize polish if needed (functionality > beauty)
- Consider reducing number of puzzles (8 → 5 or 6)
- Parallel development where possible

### Testing Environment
**Risk**: Can't fully test without disrupting household
**Mitigation**:
- Use Home Assistant "scripts" to simulate puzzle flows
- Test individual puzzles in isolation during low-activity times
- Full rehearsal scheduled in advance
- Restore automations after testing

### Home Assistant Expertise
**Risk**: Complex automation logic required, unfamiliar with YAML/automations
**Mitigation**:
- Start with simple automations, iterate to complexity
- Use Home Assistant UI automation builder where possible
- Leverage existing automation templates
- Have simpler fallback puzzles that require less automation logic

# Appendix

## Technical Specifications

### Home Assistant Select Entities Required
- `select.verjaardag_hilde_global_select` (10 options: "1" through "10")
- `select.verjaardag_hilde_puzzle_1_select` (6 options: "0" through "5")
- `select.verjaardag_hilde_puzzle_2_select` (4 options: "0" through "3")
- `select.verjaardag_hilde_puzzle_3_select` (6 options: "0" through "5")
- `select.verjaardag_hilde_puzzle_4_select` (4 options: "0" through "3")
- `select.verjaardag_hilde_puzzle_5_select` (6 options: "0" through "5")
- `select.verjaardag_hilde_puzzle_6_select` (TBD based on power threshold steps)
- `select.verjaardag_hilde_puzzle_7_select` (6 options: "0" through "5")
- `select.verjaardag_hilde_puzzle_8_select` (2 options: "0" (locked), "1" (unlocked))

### Device Mappings for Puzzles

#### Puzzle 1: Doors
- 5 door sensors/locks to monitor
- Any 5 doors in house (to be specified)

#### Puzzle 3: Switch/Light Mapping
- Slaapkamer (bedroom) switch → Waskamer (laundry) lamp
- Waskamer switch → Voorraadkast (pantry) lamp
- Keuken (kitchen) switch → Slaapkamer lamp
- Tuin (garden) switch → Keuken lamp
- Voorraadkast switch → Tuin lamp

#### Puzzle 4: Voice Commands
- Google Assistant integration
- Light color control (red, blue, green)

#### Puzzle 5: Button Sequence
- 5 buttons/switches to press in correct order
- Specific sequence to be determined

#### Puzzle 7: Temperature Settings
- 5 thermostats with targets: 7°C, 10°C, 15°C, 19°C, 20°C
- Room assignments to be determined

#### Puzzle 8: Audio Code
- Multi-room audio playback (Sonos)
- 5-digit code (to be determined)
- Rooms to play audio clues (to be determined)

### Video Files
- `verjaardag_hilde_intro.mp4` (already present in repo)
- `verjaardag_hilde_outro.mp4` (to be created)

### Dependencies (Pinned Versions)
```json
{
  "react": "18.3.1",
  "react-dom": "18.3.1",
  "react-player": "2.16.0",
  "@hakit/core": "latest stable version",
  "@hakit/components": "latest stable version",
  "vite": "5.4.11",
  "typescript": "5.6.3"
}
```

### Build Configuration
- Vite config for production optimization
- Code splitting for video components
- Asset optimization for video files
- Environment variables for HA connection details

## Research Findings

### ha-component-kit
- Comprehensive React library for Home Assistant integration
- Provides `<HassConnect>` wrapper for authentication
- `useEntity()` hook for subscribing to entity state
- `useService()` hook for calling HA services
- Well-documented with examples
- Active maintenance

### React Player
- Supports MP4 playback
- Provides `onProgress` callback for time-based triggers
- Can auto-play and loop
- Mobile-friendly
- Lightweight and performant

### Moon Monorepo Structure
- Apps belong in `apps/` directory
- Use `moon.yml` for task definitions
- Follow existing patterns in other apps
- Leverage shared configurations

## Open Questions (To Be Resolved)

1. Specific door sensors to use for Puzzle 1
2. Apple TV apps for Puzzle 2 (which 3 apps?)
3. Button sequence for Puzzle 5
4. Power usage threshold for Puzzle 6
5. Specific rooms/thermostats for Puzzle 7
6. Audio code and room assignments for Puzzle 8
7. Video file for outro (needs creation)
8. Home Assistant instance connection details (URL, authentication method)
9. Deployment hosting platform
10. Target device for playing game (iPad, Android tablet, phone?)
