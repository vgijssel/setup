# Tasks: Countdown Web Application

**Input**: Design documents from `/workspaces/setup/specs/001-build-a-web/`
**Prerequisites**: plan.md, research.md, data-model.md, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Extract: JavaScript ES2022+, Vite 6.x, Vitest, Playwright
   → Structure: apps/blueorange (single frontend app)
2. Load design documents:
   → data-model.md: 3 entities (SecretValidator, SessionManager, Timer)
   → research.md: Vite multi-page, timezone handling, sessionStorage
   → quickstart.md: 12 test scenarios
3. Generate tasks by category:
   → Setup: Nx app, Vite config, test configs, Docker, K8s
   → Assets: Logo SVG, CSS files
   → Tests: Unit tests (3 modules), E2E tests (3 scenarios)
   → Core: JS modules (3), HTML pages (3), CSS integration
   → Integration: Vite multi-page wiring, deployment
   → Polish: Performance validation, quickstart execution
4. Apply task rules:
   → Different files = [P] (parallel)
   → Tests before implementation (TDD)
   → Unit tests [P], E2E tests [P], implementation sequential
5. Dependencies:
   → Setup → Tests → Implementation → Integration → Polish
6. Validation:
   → All 3 modules have unit tests
   → All 12 quickstart scenarios covered by E2E tests
   → TDD workflow enforced (tests fail before implementation)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- All paths relative to `apps/blueorange/`

## Path Conventions
- **App root**: `apps/blueorange/`
- **Sources**: `apps/blueorange/src/`
- **Tests**: `apps/blueorange/tests/`
- **Configs**: `apps/blueorange/*.config.js`
- **K8s**: `apps/blueorange/k8s/`

---

## Phase 3.1: Setup & Infrastructure

- [X] **T001** [P] Create Nx app structure using `nx generate @nx/vite:application blueorange --directory=apps/blueorange --bundler=vite --unitTestRunner=vitest --e2eTestRunner=playwright --style=css --routing=false`
  - **Acceptance**: `apps/blueorange/` directory exists with basic Vite structure
  - **Files created**: `apps/blueorange/package.json`, `apps/blueorange/project.json`, `apps/blueorange/vite.config.js`
  - **Verify**: `nx build blueorange` runs without errors (may produce empty dist)

- [X] **T002** [P] Configure Vite for multi-page app in `apps/blueorange/vite.config.js`
  - **Acceptance**: Vite configured with 3 entry points (index.html, landing.html, countdown.html)
  - **Config**:
    ```javascript
    import { defineConfig } from 'vite';
    import { resolve } from 'path';

    export default defineConfig({
      build: {
        rollupOptions: {
          input: {
            main: resolve(__dirname, 'index.html'),
            landing: resolve(__dirname, 'src/pages/landing.html'),
            countdown: resolve(__dirname, 'src/pages/countdown.html')
          }
        }
      },
      server: {
        port: 4173
      }
    });
    ```
  - **Verify**: Config file has correct structure

- [X] **T003** [P] Configure Vitest in `apps/blueorange/vitest.config.js`
  - **Acceptance**: Vitest configured for unit tests with jsdom environment
  - **Config**:
    ```javascript
    import { defineConfig } from 'vitest/config';

    export default defineConfig({
      test: {
        globals: true,
        environment: 'jsdom',
        include: ['tests/unit/**/*.test.js'],
        coverage: {
          reporter: ['text', 'json', 'html'],
          exclude: ['node_modules/', 'tests/']
        }
      }
    });
    ```
  - **Verify**: `nx test blueorange` runs (no tests yet, should pass with 0 tests)

- [X] **T004** [P] Configure Playwright in `apps/blueorange/playwright.config.js`
  - **Acceptance**: Playwright configured for E2E tests
  - **Config**:
    ```javascript
    import { defineConfig, devices } from '@playwright/test';

    export default defineConfig({
      testDir: './tests/e2e',
      fullyParallel: true,
      forbidOnly: !!process.env.CI,
      retries: process.env.CI ? 2 : 0,
      workers: process.env.CI ? 1 : undefined,
      reporter: 'html',
      use: {
        baseURL: 'http://localhost:4173',
        trace: 'on-first-retry',
      },
      projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
      ],
      webServer: {
        command: 'nx preview blueorange',
        port: 4173,
        reuseExistingServer: !process.env.CI,
      },
    });
    ```
  - **Verify**: Config file has correct structure

- [X] **T005** [P] Update `apps/blueorange/package.json` with exact dependency versions
  - **Acceptance**: All dependencies pinned to exact versions (no ^ or ~)
  - **Dependencies**:
    ```json
    {
      "dependencies": {},
      "devDependencies": {
        "vite": "6.0.1",
        "vitest": "2.1.5",
        "@playwright/test": "1.48.2",
        "@vitest/ui": "2.1.5",
        "jsdom": "25.0.1"
      }
    }
    ```
  - **Verify**: No version ranges, all exact versions

- [X] **T006** [P] Update `apps/blueorange/project.json` with Nx targets
  - **Acceptance**: Nx targets defined for build, serve, test, lint, e2e
  - **Targets**:
    ```json
    {
      "targets": {
        "build": {
          "executor": "@nx/vite:build",
          "outputs": ["{options.outputPath}"],
          "options": {
            "outputPath": "dist/apps/blueorange"
          }
        },
        "serve": {
          "executor": "@nx/vite:dev-server",
          "options": {
            "buildTarget": "blueorange:build"
          }
        },
        "preview": {
          "executor": "@nx/vite:preview-server",
          "options": {
            "buildTarget": "blueorange:build"
          }
        },
        "test": {
          "executor": "@nx/vite:test",
          "options": {}
        },
        "lint": {
          "executor": "@nx/eslint:lint"
        },
        "e2e": {
          "executor": "nx:run-commands",
          "options": {
            "command": "playwright test",
            "cwd": "apps/blueorange"
          }
        }
      }
    }
    ```
  - **Verify**: `nx build blueorange`, `nx test blueorange` commands recognized

- [X] **T007** [P] Create Dockerfile in `apps/blueorange/Dockerfile`
  - **Acceptance**: Multi-stage build with nginx:1.27.3-alpine serving static files
  - **Dockerfile**:
    ```dockerfile
    # Build stage
    FROM node:22.11.0-alpine AS build
    WORKDIR /app
    COPY package.json package-lock.json ./
    RUN npm ci
    COPY . .
    RUN npm run build

    # Production stage
    FROM nginx:1.27.3-alpine
    COPY --from=build /app/dist /usr/share/nginx/html
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
    ```
  - **Verify**: Dockerfile syntax correct, exact version tags used

- [X] **T008** [P] Create Kubernetes Deployment in `apps/blueorange/k8s/deployment.yaml`
  - **Acceptance**: Deployment resource with 2 replicas, resource limits, health checks
  - **Manifest**:
    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: blueorange
      labels:
        app: blueorange
    spec:
      replicas: 2
      selector:
        matchLabels:
          app: blueorange
      template:
        metadata:
          labels:
            app: blueorange
        spec:
          containers:
          - name: blueorange
            image: blueorange:latest
            ports:
            - containerPort: 80
            resources:
              requests:
                memory: "64Mi"
                cpu: "100m"
              limits:
                memory: "128Mi"
                cpu: "200m"
            livenessProbe:
              httpGet:
                path: /index.html
                port: 80
              initialDelaySeconds: 10
              periodSeconds: 10
            readinessProbe:
              httpGet:
                path: /index.html
                port: 80
              initialDelaySeconds: 5
              periodSeconds: 5
    ```
  - **Verify**: YAML syntax valid, resource limits defined

- [X] **T009** [P] Create Kubernetes Service in `apps/blueorange/k8s/service.yaml`
  - **Acceptance**: ClusterIP service exposing port 80
  - **Manifest**:
    ```yaml
    apiVersion: v1
    kind: Service
    metadata:
      name: blueorange
      labels:
        app: blueorange
    spec:
      type: ClusterIP
      selector:
        app: blueorange
      ports:
      - protocol: TCP
        port: 80
        targetPort: 80
        name: http
    ```
  - **Verify**: YAML syntax valid, selector matches deployment labels

- [X] **T010** [P] Create directory structure for source files
  - **Acceptance**: All required directories exist
  - **Directories**:
    - `apps/blueorange/src/pages/`
    - `apps/blueorange/src/styles/`
    - `apps/blueorange/src/scripts/`
    - `apps/blueorange/src/assets/`
    - `apps/blueorange/tests/unit/`
    - `apps/blueorange/tests/e2e/`
    - `apps/blueorange/tests/goss/`
    - `apps/blueorange/public/`
  - **Verify**: All directories exist with `ls apps/blueorange/src apps/blueorange/tests`

---

## Phase 3.2: Asset Creation

- [X] **T011** [P] Create Blue Orange logo SVG in `apps/blueorange/src/assets/logo.svg`
  - **Acceptance**: Scalable SVG with green-yellow banana, brown outline, "BLUE ORANGE" text
  - **Specifications** (from design image):
    - Banana shape: curved path with green (#7AB800) to yellow (#C4D600) gradient
    - Outline: brown stroke (#4A2C2A), 3px width
    - Text: "BLUE ORANGE" in brown (#4A2C2A), bold sans-serif
    - Viewbox: 0 0 400 500 (scalable)
  - **Verify**: SVG renders correctly in browser, colors match specification

- [X] **T012** [P] Create landing page styles in `apps/blueorange/src/styles/landing.css`
  - **Acceptance**: Beige background, centered layout, responsive design
  - **Styles**:
    - Body: background #F5F5DC (beige), flexbox centered
    - Logo container: max-width 300px, margin-bottom 2rem
    - Input field: 5-character max-length, 3rem font-size, monospace, centered text
    - Submit button: disabled state with opacity 0.5, enabled with pointer cursor
    - Error message: red text (#DC143C), margin-top 1rem
    - Responsive: mobile (<768px) reduces logo to 200px, input to 2rem
  - **Verify**: CSS valid, no syntax errors

- [X] **T013** [P] Create countdown page styles in `apps/blueorange/src/styles/countdown.css`
  - **Acceptance**: Dark gradient background, glitch effect text, responsive timer grid
  - **Styles** (from design image):
    - Body: linear-gradient(180deg, #1A3A3A 0%, #8B4513 100%), background-blend-mode overlay
    - Top text: "SHE WILL MAKE Him SORRY", mixed case, "Him" in red-orange (#FF6347)
    - Timer container: CSS grid, 4 columns (days, hours, minutes, seconds)
    - Timer digits: 10rem font-size, monospace (Courier New), color #C4D600, text-shadow glow
    - Labels: "DAYS HOURS MINUTES SECONDS", 2rem, same color, uppercase
    - Bottom text: "KLAASSANDRA", 5rem, red (#DC143C), bold
    - Glitch effect: keyframe animation with text-shadow shifts (cyan/magenta)
    - Responsive: mobile (<768px) reduces timer to 5rem, labels to 1.5rem
  - **Verify**: CSS valid, gradient and glitch effects defined

---

## Phase 3.3: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.4

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Unit Tests (Parallel)

- [X] **T014** [P] Unit test for SecretValidator in `apps/blueorange/tests/unit/secret-validator.test.js`
  - **Acceptance**: 6 test cases covering all validation scenarios from data-model.md
  - **Test cases**:
    1. `validate("sorry")` → true (valid input)
    2. `validate("Sorry")` → false (wrong case)
    3. `validate("hello")` → false (wrong value)
    4. `validate("sorr")` → false (too short)
    5. `validate("sorrys")` → false (too long)
    6. `validate("sorr!")` → false (special characters)
  - **Framework**: Vitest with `describe`, `it`, `expect`
  - **Verify**: `nx test blueorange` runs tests and they FAIL (no implementation yet)

- [X] **T015** [P] Unit test for SessionManager in `apps/blueorange/tests/unit/session-manager.test.js`
  - **Acceptance**: 5 test cases covering sessionStorage operations
  - **Test cases**:
    1. `isValidated()` returns false initially
    2. `markValidated()` then `isValidated()` returns true
    3. `clearValidation()` then `isValidated()` returns false
    4. sessionStorage key is "secretValidated"
    5. sessionStorage value is "true" after markValidated()
  - **Mocking**: Mock sessionStorage (jsdom provides it)
  - **Verify**: Tests FAIL (no implementation yet)

- [X] **T016** [P] Unit test for Timer in `apps/blueorange/tests/unit/timer.test.js`
  - **Acceptance**: 8 test cases covering countdown calculations and interval management
  - **Test cases**:
    1. `getTimeRemaining()` with target 1 hour away → {days:0, hours:1, minutes:0, seconds:0}
    2. `getTimeRemaining()` with target in past → {days:0, hours:0, minutes:0, seconds:0, total:0}
    3. `start(callback)` calls callback every 1000ms (use vi.useFakeTimers)
    4. `stop()` clears interval (callback no longer called)
    5. Zero-padding: 9 seconds → "09", not "9"
    6. Days can exceed 99 (no padding limit)
    7. Timer updates correctly when crossing minute boundary (59s → 00s, minutes+1)
    8. Timer updates correctly when crossing hour boundary
  - **Mocking**: Mock Date, use Vitest fake timers (`vi.useFakeTimers()`)
  - **Verify**: Tests FAIL (no implementation yet)

### E2E Tests (Parallel)

- [X] **T017** [P] E2E test for landing page scenarios in `apps/blueorange/tests/e2e/landing-page.spec.js`
  - **Acceptance**: 4 test scenarios from quickstart.md (Scenarios 1-4)
  - **Test cases** (Playwright):
    1. **Scenario 1**: Landing page display
       - Navigate to `/`
       - Assert logo visible
       - Assert input field visible and focused
       - Assert submit button visible and disabled
    2. **Scenario 2**: Submit button state
       - Type 1 character → button disabled
       - Type 4 more characters (total 5) → button enabled
       - Delete 1 character (total 4) → button disabled
    3. **Scenario 3**: Valid secret entry
       - Type "sorry" → button enabled
       - Click button → redirects to `/src/pages/countdown.html`
    4. **Scenario 4**: Invalid secret entry
       - Type "Sorry" → button enabled
       - Click button → error message visible
       - Assert still on landing page (no redirect)
  - **Verify**: Tests FAIL (no pages exist yet)

- [X] **T018** [P] E2E test for countdown page scenarios in `apps/blueorange/tests/e2e/countdown-page.spec.js`
  - **Acceptance**: 4 test scenarios from quickstart.md (Scenarios 5-8)
  - **Test cases** (Playwright):
    1. **Scenario 5**: Countdown page display
       - Navigate to landing, enter "sorry", submit
       - Assert countdown page loads
       - Assert timer visible with format `DD HH MM SS`
       - Assert labels "DAYS HOURS MINUTES SECONDS" visible
    2. **Scenario 6**: Timer updates
       - Record initial seconds value
       - Wait 2 seconds
       - Assert seconds decreased by 2 (±1 tolerance)
    3. **Scenario 7**: Countdown target time
       - Calculate expected time to 2025-11-20 00:00 Europe/Amsterdam
       - Assert displayed time matches (±5 seconds tolerance)
    4. **Scenario 8**: Countdown reaches zero (mock target to 5s future)
       - Modify target date in code to 5 seconds from now
       - Wait for countdown to reach 00:00:00:00
       - Assert timer stops (no negative values)
  - **Verify**: Tests FAIL (no implementation yet)

- [X] **T019** [P] E2E test for end-to-end flow in `apps/blueorange/tests/e2e/end-to-end-flow.spec.js`
  - **Acceptance**: 4 test scenarios from quickstart.md (Scenarios 9-12)
  - **Test cases** (Playwright):
    1. **Scenario 9**: Unauthorized countdown access
       - Navigate directly to `/src/pages/countdown.html`
       - Assert redirect to `/src/pages/landing.html`
    2. **Scenario 10**: Session persistence
       - Enter secret on landing, navigate to countdown
       - Close page (simulate tab close by clearing sessionStorage)
       - Navigate to countdown again
       - Assert redirect to landing
    3. **Scenario 11**: Page refresh persistence
       - Enter secret on landing, navigate to countdown
       - Refresh page
       - Assert countdown page still visible (no redirect)
       - Assert timer continues (not reset)
    4. **Scenario 12**: Target date already passed (mock past date)
       - Modify target date to past
       - Navigate to countdown (after valid secret)
       - Assert timer displays "00 00 00 00"
  - **Verify**: Tests FAIL (no implementation yet)

### Infrastructure Tests

- [X] **T020** [P] Goss deployment validation in `apps/blueorange/tests/goss/deployment.yaml`
  - **Acceptance**: Goss tests validate Kubernetes deployment and service
  - **Tests**:
    ```yaml
    http:
      http://blueorange/index.html:
        status: 200
        timeout: 1000
      http://blueorange/src/pages/landing.html:
        status: 200
        timeout: 1000
      http://blueorange/src/pages/countdown.html:
        status: 200
        timeout: 1000

    kubernetes:
      deployment/blueorange:
        exists: true
        running: true
        replicas: 2
      service/blueorange:
        exists: true
        type: ClusterIP
        ports:
          - 80
    ```
  - **Verify**: Goss YAML syntax valid

---

## Phase 3.4: Core Implementation (ONLY after tests are failing)

### JavaScript Modules (Sequential due to integration dependencies)

- [X] **T021** Implement SecretValidator in `apps/blueorange/src/scripts/secret-validator.js`
  - **Acceptance**: Unit tests pass (T014)
  - **Implementation**:
    ```javascript
    export class SecretValidator {
      constructor() {
        this.SECRET = 'sorry';
      }

      validate(input) {
        if (typeof input !== 'string') return false;
        if (input.length !== 5) return false;
        return input === this.SECRET;
      }
    }
    ```
  - **Verify**: `nx test blueorange` → T014 tests pass (6/6)

- [X] **T022** Implement SessionManager in `apps/blueorange/src/scripts/session-manager.js`
  - **Acceptance**: Unit tests pass (T015)
  - **Implementation**:
    ```javascript
    export class SessionManager {
      constructor() {
        this.STORAGE_KEY = 'secretValidated';
        this.storage = window.sessionStorage;
      }

      markValidated() {
        this.storage.setItem(this.STORAGE_KEY, 'true');
      }

      isValidated() {
        return this.storage.getItem(this.STORAGE_KEY) === 'true';
      }

      clearValidation() {
        this.storage.removeItem(this.STORAGE_KEY);
      }
    }
    ```
  - **Verify**: `nx test blueorange` → T015 tests pass (5/5)

- [X] **T023** Implement Timer in `apps/blueorange/src/scripts/timer.js`
  - **Acceptance**: Unit tests pass (T016)
  - **Implementation**:
    ```javascript
    export class Timer {
      constructor(targetDate) {
        this.targetDate = new Date(targetDate);
        this.intervalId = null;
      }

      getTimeRemaining() {
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
      }

      start(onTick) {
        this.onTick = onTick;
        this.intervalId = setInterval(() => {
          const time = this.getTimeRemaining();
          this.onTick(time);
          if (time.total <= 0) {
            this.stop();
          }
        }, 1000);

        // Call immediately for initial display
        this.onTick(this.getTimeRemaining());
      }

      stop() {
        if (this.intervalId) {
          clearInterval(this.intervalId);
          this.intervalId = null;
        }
      }
    }
    ```
  - **Verify**: `nx test blueorange` → T016 tests pass (8/8)

### HTML Pages (Sequential due to asset dependencies)

- [X] **T024** Create index.html in `apps/blueorange/index.html`
  - **Acceptance**: Root page that redirects to landing.html
  - **Implementation**:
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Blue Orange</title>
      <script>
        window.location.href = '/src/pages/landing.html';
      </script>
    </head>
    <body>
      <p>Redirecting...</p>
    </body>
    </html>
    ```
  - **Verify**: Opening index.html redirects to landing.html

- [X] **T025** Create landing page in `apps/blueorange/src/pages/landing.html`
  - **Acceptance**: Page with logo, input, submit button, wired to SecretValidator and SessionManager
  - **Implementation**:
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Blue Orange - Enter Secret</title>
      <link rel="stylesheet" href="../styles/landing.css">
    </head>
    <body>
      <div class="container">
        <div class="logo-container">
          <img src="../assets/logo.svg" alt="Blue Orange Logo" class="logo">
        </div>
        <form id="secret-form">
          <input
            type="text"
            id="secret-input"
            maxlength="5"
            placeholder="_ _ _ _ _"
            autocomplete="off"
            autofocus
          >
          <button type="submit" id="submit-btn" disabled>Enter</button>
        </form>
        <p id="error-msg" class="error hidden"></p>
      </div>

      <script type="module">
        import { SecretValidator } from '../scripts/secret-validator.js';
        import { SessionManager } from '../scripts/session-manager.js';

        const validator = new SecretValidator();
        const sessionManager = new SessionManager();
        const form = document.getElementById('secret-form');
        const input = document.getElementById('secret-input');
        const button = document.getElementById('submit-btn');
        const errorMsg = document.getElementById('error-msg');

        // Enable/disable submit button based on input length
        input.addEventListener('input', () => {
          button.disabled = input.value.length !== 5;
          errorMsg.classList.add('hidden');
        });

        // Handle form submission
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const secret = input.value;

          if (validator.validate(secret)) {
            sessionManager.markValidated();
            window.location.href = '/src/pages/countdown.html';
          } else {
            errorMsg.textContent = 'Incorrect secret';
            errorMsg.classList.remove('hidden');
          }
        });
      </script>
    </body>
    </html>
    ```
  - **Verify**: E2E tests T017 pass (landing page scenarios)

- [X] **T026** Create countdown page in `apps/blueorange/src/pages/countdown.html`
  - **Acceptance**: Page with timer display, wired to SessionManager and Timer
  - **Implementation**:
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Blue Orange - Countdown</title>
      <link rel="stylesheet" href="../styles/countdown.css">
    </head>
    <body>
      <div class="container">
        <h1 class="top-text">
          SHE WILL MAKE <span class="highlight">Him</span> SORRY
        </h1>

        <div class="timer-container">
          <div class="timer-unit">
            <div class="timer-digit" id="days">00</div>
            <div class="timer-label">DAYS</div>
          </div>
          <div class="timer-unit">
            <div class="timer-digit" id="hours">00</div>
            <div class="timer-label">HOURS</div>
          </div>
          <div class="timer-unit">
            <div class="timer-digit" id="minutes">00</div>
            <div class="timer-label">MINUTES</div>
          </div>
          <div class="timer-unit">
            <div class="timer-digit" id="seconds">00</div>
            <div class="timer-label">SECONDS</div>
          </div>
        </div>

        <h2 class="bottom-text">KLAASSANDRA</h2>
      </div>

      <script type="module">
        import { SessionManager } from '../scripts/session-manager.js';
        import { Timer } from '../scripts/timer.js';

        const sessionManager = new SessionManager();

        // Check authorization
        if (!sessionManager.isValidated()) {
          window.location.href = '/src/pages/landing.html';
        }

        // Initialize timer
        const targetDate = '2025-11-20T00:00:00+01:00'; // Europe/Amsterdam (CET)
        const timer = new Timer(targetDate);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        function updateDisplay(time) {
          daysEl.textContent = String(time.days).padStart(2, '0');
          hoursEl.textContent = String(time.hours).padStart(2, '0');
          minutesEl.textContent = String(time.minutes).padStart(2, '0');
          secondsEl.textContent = String(time.seconds).padStart(2, '0');
        }

        timer.start(updateDisplay);

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
          timer.stop();
        });
      </script>
    </body>
    </html>
    ```
  - **Verify**: E2E tests T018, T019 pass (countdown page and flow scenarios)

---

## Phase 3.5: Integration & Validation

- [X] **T027** Run all unit tests and verify 100% pass rate
  - **Command**: `nx test blueorange`
  - **Acceptance**: All unit tests pass (19 tests total: 6 + 5 + 8)
  - **Coverage**: Target >90% line coverage for JS modules
  - **Verify**: No failing tests, coverage report generated

- [X] **T028** Run all E2E tests and verify 100% pass rate
  - **Command**: `nx e2e blueorange`
  - **Acceptance**: All E2E tests pass (12 scenarios total)
  - **Browsers**: Test in Chromium, Firefox, WebKit
  - **Verify**: No failing tests, HTML report generated

- [X] **T029** Build production bundle and verify size constraints
  - **Command**: `nx build blueorange`
  - **Acceptance**: Bundle size <100KB total (HTML+CSS+JS)
  - **Output**: `dist/apps/blueorange/`
  - **Verify**:
    - index.html, landing.html, countdown.html exist
    - logo.svg, landing.css, countdown.css exist
    - All JS modules bundled and minified
    - Total bundle size <100KB

- [X] **T030** Run Lighthouse performance audit
  - **Command**: `lighthouse http://localhost:4173 --view`
  - **Acceptance**: Performance ≥90, Accessibility ≥90, Best Practices ≥90, SEO ≥80
  - **Metrics**:
    - First Contentful Paint <1.8s
    - Time to Interactive <3.8s
    - Speed Index <3.4s
    - Total Blocking Time <200ms
  - **Verify**: Lighthouse report meets all targets

- [X] **T031** Test Kubernetes deployment locally (kind/minikube)
  - **Commands**:
    ```bash
    # Build Docker image
    cd apps/blueorange
    docker build -t blueorange:latest .

    # Load into kind cluster (if using kind)
    kind load docker-image blueorange:latest

    # Apply K8s manifests
    kubectl apply -f k8s/

    # Verify deployment
    kubectl get pods -l app=blueorange
    kubectl get svc blueorange
    ```
  - **Acceptance**:
    - 2 pods running and ready
    - Service accessible via cluster IP
    - HTTP 200 from all endpoints
  - **Verify**: `kubectl logs` shows nginx serving files

- [X] **T032** Run Goss infrastructure validation
  - **Command**: `goss validate --format junit`
  - **Acceptance**: All Goss tests pass (HTTP endpoints, K8s resources)
  - **Tests** (from T020):
    - index.html returns HTTP 200
    - landing.html returns HTTP 200
    - countdown.html returns HTTP 200
    - Deployment has 2 replicas
    - Service type is ClusterIP
  - **Verify**: Goss report shows 0 failures

- [X] **T033** Execute quickstart.md manual test scenarios
  - **Acceptance**: All 12 scenarios pass
  - **Scenarios**:
    1. Landing page display (FR-001, FR-002, FR-003)
    2. Submit button state (FR-004)
    3. Valid secret entry (FR-005, FR-007)
    4. Invalid secret entry (FR-006)
    5. Countdown page display (FR-009, FR-010)
    6. Timer updates (FR-011)
    7. Countdown target time (FR-012)
    8. Countdown reaches zero (FR-014, FR-015)
    9. Unauthorized countdown access (FR-013, FR-018)
    10. Session persistence (FR-017)
    11. Page refresh persistence
    12. Target date already passed (FR-015)
  - **Verify**: All checkboxes in quickstart.md marked

- [X] **T034** Cross-browser testing (Chrome, Firefox, Safari, Edge)
  - **Acceptance**: All E2E tests pass in all 4 browsers
  - **Browsers**:
    - Chrome 120+ (Windows/macOS/Linux)
    - Firefox 120+ (Windows/macOS/Linux)
    - Safari 17+ (macOS/iOS)
    - Edge 120+ (Windows)
  - **Command**: `nx e2e blueorange --project=all`
  - **Verify**: Playwright test results show pass for all browser projects

- [X] **T035** Mobile responsiveness testing
  - **Acceptance**: App usable on mobile devices (390px width minimum)
  - **Test devices**:
    - iPhone 14 Pro (390x844)
    - Pixel 5 (393x851)
    - iPad Mini (768x1024)
  - **Checks**:
    - Logo scales appropriately
    - Input field usable on touch screen
    - Timer digits readable (not truncated)
    - No horizontal scrolling
    - Font sizes scale down for mobile
  - **Verify**: DevTools device emulation shows correct rendering

---

## Dependencies

### Sequential Phases
1. **Setup** (T001-T010) → All parallel, no dependencies
2. **Assets** (T011-T013) → After setup, all parallel
3. **Tests** (T014-T020) → After setup, all parallel ⚠️ MUST COMPLETE BEFORE T021-T026
4. **Implementation** (T021-T026) → After tests fail, sequential (shared files)
5. **Integration** (T027-T035) → After implementation, sequential (depends on build)

### Task-Level Dependencies
- **T021-T023 block T025-T026**: JS modules must exist before HTML pages import them
- **T024 blocks nothing**: index.html is standalone redirect
- **T011 blocks T025**: logo.svg must exist before landing.html references it
- **T012 blocks T025**: landing.css must exist before landing.html references it
- **T013 blocks T026**: countdown.css must exist before countdown.html references it
- **T027 blocks T028**: Unit tests must pass before running E2E tests
- **T029 blocks T030-T035**: Build must succeed before performance/deployment tests

### Critical Path
```
T001-T010 (Setup)
  → T014-T020 (Tests - must fail)
  → T021-T023 (JS Modules)
  → T011-T013 (Assets)
  → T024-T026 (HTML Pages)
  → T027 (Unit Tests Pass)
  → T028 (E2E Tests Pass)
  → T029 (Build)
  → T030-T035 (Validation)
```

---

## Parallel Execution Examples

### Setup Phase (T001-T010) - All Parallel
```bash
# All setup tasks can run simultaneously
nx generate @nx/vite:application blueorange &
# (Manual: Edit vite.config.js, vitest.config.js, playwright.config.js, package.json, project.json) &
# (Manual: Create Dockerfile, deployment.yaml, service.yaml) &
mkdir -p apps/blueorange/src/{pages,styles,scripts,assets} &
mkdir -p apps/blueorange/tests/{unit,e2e,goss} &
wait
```

### Asset Phase (T011-T013) - All Parallel
```bash
# Create logo.svg, landing.css, countdown.css simultaneously
# (Manual: Create all 3 files in parallel)
```

### Test Phase (T014-T020) - All Parallel
```bash
# Write all test files simultaneously
# (Manual: Create 7 test files in parallel)
# Verify all fail: nx test blueorange && nx e2e blueorange
```

### Implementation Phase (T021-T026) - Sequential
```bash
# MUST be sequential due to import dependencies
# T021 → T022 → T023 → T024 → T025 → T026
# Verify tests pass after each: nx test blueorange
```

---

## Notes

- **[P] tasks**: Different files, no dependencies, can run in parallel
- **TDD Critical**: Tests (T014-T020) MUST fail before implementation (T021-T026)
- **Verify before proceeding**: Each test phase must show failing tests
- **Integration tests**: Run after implementation completes (T027-T035)
- **Performance targets**: <100ms page load, <16ms timer updates, <100KB bundle
- **Coverage targets**: >90% line coverage for JS modules
- **Browser support**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile support**: 390px minimum width, touch-friendly inputs

---

## Task Generation Rules Applied

1. **From Data Model (3 entities)**:
   - SecretValidator → T014 (unit test), T021 (implementation)
   - SessionManager → T015 (unit test), T022 (implementation)
   - Timer → T016 (unit test), T023 (implementation)

2. **From Quickstart (12 scenarios)**:
   - Scenarios 1-4 → T017 (landing page E2E)
   - Scenarios 5-8 → T018 (countdown page E2E)
   - Scenarios 9-12 → T019 (end-to-end flow E2E)

3. **From Plan Structure**:
   - Vite multi-page → T002 (config)
   - Vitest → T003 (config)
   - Playwright → T004 (config)
   - Docker → T007 (Dockerfile)
   - Kubernetes → T008-T009 (manifests)

4. **Ordering**:
   - Setup (T001-T010) → Tests (T014-T020) → Implementation (T021-T026) → Validation (T027-T035)
   - Assets (T011-T013) parallel with tests, before HTML pages

---

## Validation Checklist

- [x] All 3 modules (SecretValidator, SessionManager, Timer) have unit tests (T014-T016)
- [x] All 12 quickstart scenarios covered by E2E tests (T017-T019)
- [x] All tests come before implementation (T014-T020 before T021-T026)
- [x] Parallel tasks truly independent (different files, no shared dependencies)
- [x] Each task specifies exact file path (all tasks include absolute paths)
- [x] No task modifies same file as another [P] task (verified: all [P] tasks different files)

---

**Total Tasks**: 35 (Setup: 10, Assets: 3, Tests: 7, Implementation: 6, Validation: 9)
**Estimated Time**: 8-12 hours (with TDD workflow)
**Next Step**: Execute T001 (Create Nx app structure)
