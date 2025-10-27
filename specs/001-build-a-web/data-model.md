# Data Model: Countdown Web Application

**Feature**: 001-build-a-web | **Date**: 2025-10-08

## Overview
Frontend-only application with three primary JavaScript modules managing secret validation, session state, and countdown timer logic. No backend persistence - all state is ephemeral (session-scoped).

## Entities

### 1. SecretValidator

**Responsibility**: Validate user-entered secret code against hardcoded value

**Properties**:
```javascript
{
  SECRET: string          // Hardcoded "sorry" (case-sensitive, readonly)
}
```

**Methods**:
```javascript
validate(input: string): boolean
  // Returns true if input === "sorry", false otherwise
  // Case-sensitive exact match
  // Input must be exactly 5 characters (validated by UI before calling)
```

**Validation Rules**:
- Input length: exactly 5 characters (enforced by UI, defensively checked here)
- Case-sensitive: "sorry" matches, "Sorry" does not match
- No trimming: leading/trailing spaces cause failure
- No special characters allowed (alphanumeric only)

**State Transitions**:
```
Initial → Validating
Validating → Valid (if input === "sorry")
Validating → Invalid (if input !== "sorry")
```

**Dependencies**: None

**Test Scenarios**:
- Valid input: `validate("sorry")` → true
- Wrong case: `validate("Sorry")` → false
- Wrong value: `validate("hello")` → false
- Too short: `validate("sorr")` → false (UI prevents submission)
- Too long: `validate("sorrys")` → false (UI prevents submission)
- Special chars: `validate("sorr!")` → false

---

### 2. SessionManager

**Responsibility**: Manage secret validation state across page navigations within same browser tab

**Properties**:
```javascript
{
  STORAGE_KEY: string     // "secretValidated" (readonly)
  storage: Storage        // sessionStorage reference
}
```

**Methods**:
```javascript
markValidated(): void
  // Sets sessionStorage.setItem('secretValidated', 'true')
  // Called after successful secret validation on landing page

isValidated(): boolean
  // Returns sessionStorage.getItem('secretValidated') === 'true'
  // Called on countdown page load to check authorization

clearValidation(): void
  // Removes sessionStorage.removeItem('secretValidated')
  // Called on manual logout (if implemented) or for testing
```

**Storage Schema**:
```
sessionStorage {
  "secretValidated": "true" | null
}
```

**Lifecycle**:
1. User enters correct secret → `markValidated()` called → navigate to countdown.html
2. Countdown page loads → `isValidated()` returns true → allow access
3. User closes tab/browser → sessionStorage cleared by browser
4. User opens new tab → `isValidated()` returns false → redirect to landing

**Security Considerations**:
- sessionStorage is same-origin policy protected (XSS vulnerability remains)
- Boolean flag only (no sensitive data stored)
- Secret itself is hardcoded in JS bundle (public knowledge)
- No encryption needed (not handling real secrets)

**Dependencies**: None (browser sessionStorage API)

**Test Scenarios**:
- Initial state: `isValidated()` → false
- After validation: `markValidated()`, `isValidated()` → true
- After clear: `clearValidation()`, `isValidated()` → false
- Page refresh (same tab): state persists
- New tab: state does not persist

---

### 3. Timer

**Responsibility**: Calculate and format countdown to target date/time, update display every second

**Properties**:
```javascript
{
  targetDate: Date        // 2025-11-20T00:00:00+01:00 (Europe/Amsterdam, readonly)
  intervalId: number      // setInterval ID for cleanup
  onTick: Function        // Callback for display updates
}
```

**Methods**:
```javascript
start(onTick: (time: TimeRemaining) => void): void
  // Begins countdown updates every 1000ms
  // Calls onTick with calculated time remaining
  // Stores intervalId for later cleanup

stop(): void
  // Clears interval (clearInterval(this.intervalId))
  // Called when countdown reaches zero or component unmounts

getTimeRemaining(): TimeRemaining
  // Calculates difference between targetDate and now
  // Returns object with days, hours, minutes, seconds
  // Returns all zeros if targetDate is in the past
```

**Data Structures**:
```javascript
interface TimeRemaining {
  days: number      // 0-999+ (no upper limit)
  hours: number     // 0-23
  minutes: number   // 0-59
  seconds: number   // 0-59
  total: number     // Total milliseconds remaining (for zero-check)
}
```

**Calculation Logic**:
```javascript
const now = new Date();
const diff = this.targetDate - now;

if (diff <= 0) {
  return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
}

const days = Math.floor(diff / (1000 * 60 * 60 * 24));
const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
const seconds = Math.floor((diff % (1000 * 60)) / 1000);

return { days, hours, minutes, seconds, total: diff };
```

**Display Format**:
- Each component zero-padded to 2 digits: `02 14 37 26`
- Days can exceed 99 (no padding limit)
- When countdown reaches zero: `00 00 00 00`

**Update Frequency**:
- Every 1000ms (1 second)
- Uses setInterval (not setTimeout recursion) for consistent intervals
- Performance: <1ms calculation time per tick (negligible)

**Edge Cases**:
- Target date in past: Display all zeros immediately
- User changes system time: Accept new time (no server verification)
- User suspends tab (mobile): Resume countdown when tab becomes active
- Daylight saving time transition: Handled by Date object

**Dependencies**: None (browser Date API)

**Test Scenarios**:
- Target 1 hour away: `getTimeRemaining()` → `{days:0, hours:1, minutes:0, seconds:0, total:3600000}`
- Target in past: `getTimeRemaining()` → `{days:0, hours:0, minutes:0, seconds:0, total:0}`
- Start/stop: `start()`, wait, `stop()` → interval cleared
- Tick callback: `start(cb)` → cb called every second with updated time

---

## Entity Relationships

```
User Interaction Flow:

1. Landing Page
   ┌─────────────────┐
   │ User Input      │
   │ (5 chars)       │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ SecretValidator │ ──validate()──> true/false
   └────────┬────────┘
            │
            ▼ (if valid)
   ┌─────────────────┐
   │ SessionManager  │ ──markValidated()──> sessionStorage
   └────────┬────────┘
            │
            ▼
   Navigate to countdown.html

2. Countdown Page
   ┌─────────────────┐
   │ SessionManager  │ ──isValidated()──> true? continue : redirect
   └────────┬────────┘
            │
            ▼ (if authorized)
   ┌─────────────────┐
   │ Timer           │ ──getTimeRemaining()──> {days, hours, mins, secs}
   │                 │ ──start(onTick)──────> updates every 1s
   └─────────────────┘
```

**No Inter-Module Dependencies**: Each module is independently testable

## Data Flow

### Successful Login Flow
```
1. User types "sorry" → UI enables submit button (length === 5)
2. User clicks submit → SecretValidator.validate("sorry") → true
3. SessionManager.markValidated() → sessionStorage["secretValidated"] = "true"
4. window.location.href = "/countdown.html"
5. Countdown page loads → SessionManager.isValidated() → true
6. Timer.start(updateDisplay) → setInterval begins
7. Every 1s: Timer.getTimeRemaining() → display updated
8. When total === 0: Timer.stop() → display shows 00:00:00:00
```

### Failed Login Flow
```
1. User types "Sorry" → UI enables submit button (length === 5)
2. User clicks submit → SecretValidator.validate("Sorry") → false
3. Display error message "Incorrect secret"
4. User remains on landing page
5. SessionManager state unchanged (not validated)
```

### Unauthorized Access Flow
```
1. User navigates directly to /countdown.html
2. Countdown page loads → SessionManager.isValidated() → false
3. window.location.href = "/landing.html" (redirect)
4. User sees landing page
```

## Storage Schema

### sessionStorage
```javascript
{
  "secretValidated": "true" // Present only after successful validation
}
```

**Lifecycle**: Cleared on browser/tab close (per spec requirement)

## Performance Characteristics

| Operation | Time Complexity | Space Complexity | Notes |
|-----------|----------------|------------------|-------|
| SecretValidator.validate() | O(1) | O(1) | String equality check |
| SessionManager.markValidated() | O(1) | O(1) | Single storage write |
| SessionManager.isValidated() | O(1) | O(1) | Single storage read |
| Timer.getTimeRemaining() | O(1) | O(1) | Arithmetic operations |
| Timer update interval | O(1) | O(1) | 1s interval, <1ms calc |

**Memory Usage**: <1KB total for all modules (no persistent state)

## Testing Strategy

### Unit Tests
- `secret-validator.test.js`: Test all validation scenarios (valid, invalid, edge cases)
- `session-manager.test.js`: Test storage operations, mock sessionStorage
- `timer.test.js`: Test time calculations, mock Date, test interval behavior

### Integration Tests
- Landing → Countdown transition with valid secret
- Landing → Countdown direct access redirect
- Countdown timer updates over time (use fake timers)

### E2E Tests
- Complete user flow (Playwright): Enter secret, verify countdown page, verify timer updates
- Refresh countdown page (verify session persistence)
- Open new tab (verify session isolation)

## Constitutional Compliance

✅ **Minimal Dependencies**: Zero external libraries (browser APIs only)
✅ **Testable Design**: Each module independently testable, no complex coupling
✅ **Performance**: All operations O(1), <16ms per timer tick (60fps requirement)
✅ **Simplicity**: 3 modules, <200 LOC total, no abstractions beyond requirements
