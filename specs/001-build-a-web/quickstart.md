# Quickstart Guide: Countdown Web Application

**Feature**: 001-build-a-web | **Date**: 2025-10-08

## Purpose
This guide provides step-by-step manual testing procedures to validate the Countdown Web Application meets all functional requirements from [spec.md](./spec.md).

## Prerequisites
- Modern web browser (Chrome 120+, Firefox 120+, Safari 17+, Edge 120+)
- Application deployed and accessible at `http://localhost:3000` (dev) or production URL
- Test device system time set reasonably close to actual time (within 1 hour)

## Test Environment Setup

### Local Development
```bash
# From repository root
cd apps/blueorange

# Install dependencies
npm install

# Start development server
nx serve blueorange

# Expected output:
# > Local: http://localhost:4173
# > Network: use --host to expose
```

### Kubernetes Deployment
```bash
# Apply Kubernetes resources
kubectl apply -f apps/blueorange/k8s/

# Verify deployment
kubectl get pods -l app=blueorange
kubectl get svc blueorange

# Get service URL (replace with actual ingress URL)
export APP_URL="http://blueorange.local.example.com"
```

## Test Scenarios

### Scenario 1: Landing Page Display (FR-001, FR-002, FR-003)

**Objective**: Verify landing page loads with logo and secret input

**Steps**:
1. Open browser to application root URL (`http://localhost:4173` or production URL)
2. Observe page loads successfully (HTTP 200)
3. Verify Blue Orange banana logo is displayed prominently at top
4. Verify "BLUE ORANGE" text appears below logo
5. Verify secret input field is present and focused
6. Verify submit button is present

**Expected Results**:
- [ ] Logo SVG visible and correctly sized (responsive)
- [ ] Logo colors: green/yellow banana, brown outline/text
- [ ] Input field placeholder text: "Enter 5-character secret"
- [ ] Input field accepts keyboard input
- [ ] Submit button initially disabled (no input yet)
- [ ] Page background: light beige/cream color

**Pass Criteria**: All checkboxes marked

---

### Scenario 2: Submit Button State (FR-004)

**Objective**: Verify submit button disabled until exactly 5 characters entered

**Steps**:
1. Navigate to landing page
2. Observe submit button state (should be disabled)
3. Type 1 character: "s"
4. Observe submit button state (should remain disabled)
5. Type 4 more characters: "orry" (total: "sorry")
6. Observe submit button state (should be enabled)
7. Delete 1 character (total: "sorr")
8. Observe submit button state (should be disabled again)
9. Re-type 1 character: "y" (total: "sorry")

**Expected Results**:
- [ ] Submit button disabled with 0-4 characters
- [ ] Submit button enabled with exactly 5 characters
- [ ] Submit button disabled if input reduced below 5 characters
- [ ] Button visual state changes (e.g., opacity, cursor)

**Pass Criteria**: All checkboxes marked

---

### Scenario 3: Valid Secret Entry (FR-005, FR-007)

**Objective**: Verify correct secret redirects to countdown page

**Steps**:
1. Navigate to landing page
2. Type "sorry" in input field (case-sensitive)
3. Click submit button (or press Enter)
4. Observe page navigation

**Expected Results**:
- [ ] Page redirects to `/countdown.html` within 100ms
- [ ] URL bar shows countdown page URL
- [ ] No error message displayed before redirect
- [ ] Landing page is no longer visible

**Pass Criteria**: All checkboxes marked

---

### Scenario 4: Invalid Secret Entry (FR-006)

**Objective**: Verify incorrect secret displays error and prevents navigation

**Steps**:
1. Navigate to landing page
2. Test invalid input: "Sorry" (capital S)
3. Click submit button
4. Observe error message: "Incorrect secret"
5. Verify still on landing page (URL unchanged)
6. Clear input field
7. Test invalid input: "hello"
8. Click submit button
9. Observe same error message

**Expected Results**:
- [ ] Error message displayed clearly (red text, near input field)
- [ ] Page does not navigate away from landing
- [ ] Input field retains entered value (not cleared)
- [ ] User can edit input and retry
- [ ] Error message disappears when user starts typing again

**Invalid Test Cases**:
- [ ] "Sorry" (capital S) → Error
- [ ] "SORRY" (all caps) → Error
- [ ] "hello" (different word) → Error
- [ ] "12345" (numbers) → Error

**Pass Criteria**: All checkboxes marked

---

### Scenario 5: Countdown Page Display (FR-009, FR-010)

**Objective**: Verify countdown timer displays correctly after valid secret entry

**Steps**:
1. Navigate to landing page
2. Enter "sorry" and submit
3. Observe countdown page loads
4. Verify timer display format: `DD HH MM SS`
5. Verify labels below numbers: "DAYS HOURS MINUTES SECONDS"
6. Verify timer shows time remaining to 2025-11-20 00:00 Europe/Amsterdam

**Expected Results**:
- [ ] Dark background (teal-to-orange gradient, textured)
- [ ] Top text: "SHE WILL MAKE Him SORRY" (mixed case, "Him" in red)
- [ ] Timer digits large and prominent (10rem+ font size)
- [ ] Timer color: light green/yellow (`#C4D600` or similar)
- [ ] Timer digits zero-padded (e.g., "02" not "2")
- [ ] Labels: "DAYS HOURS MINUTES SECONDS" (smaller font, same color)
- [ ] Bottom text: "KLAASSANDRA" (large red text)
- [ ] Glitch/shadow effect on text (optional visual enhancement)

**Pass Criteria**: All checkboxes marked

---

### Scenario 6: Timer Updates (FR-011)

**Objective**: Verify countdown updates every second

**Steps**:
1. Navigate to countdown page (after entering secret)
2. Observe current seconds value (e.g., "26")
3. Wait 1 second
4. Observe seconds value decreases by 1 (e.g., "25")
5. Wait 10 seconds
6. Observe seconds value decreased by 10 total
7. Wait until seconds reach "00"
8. Observe minutes decrease by 1, seconds reset to "59"

**Expected Results**:
- [ ] Seconds update every 1 second (±100ms tolerance)
- [ ] Updates visible without page refresh
- [ ] Seconds countdown from 59 → 0
- [ ] When seconds reach 0, minutes decrement
- [ ] When minutes reach 0, hours decrement
- [ ] When hours reach 0, days decrement
- [ ] No visible flicker or layout shift during updates

**Pass Criteria**: All checkboxes marked

---

### Scenario 7: Countdown Target Time (FR-012)

**Objective**: Verify countdown targets correct date/time

**Steps**:
1. Navigate to countdown page
2. Record displayed time: `DD HH MM SS`
3. Use external tool to calculate actual time to 2025-11-20 00:00 Europe/Amsterdam
4. Compare calculated time with displayed time (±2 seconds tolerance)

**Expected Results**:
- [ ] Target date: November 20, 2025
- [ ] Target time: 00:00 (midnight)
- [ ] Target timezone: Europe/Amsterdam (CET/CEST, UTC+1/+2)
- [ ] Displayed time matches calculated time within 2 seconds

**Calculation Example** (as of 2025-10-08):
```
Target: 2025-11-20 00:00 CET (UTC+1)
Current: 2025-10-08 12:00 CET
Difference: 42 days, 12 hours

Expected display: "42 12 XX XX" (minutes/seconds vary)
```

**Pass Criteria**: All checkboxes marked

---

### Scenario 8: Countdown Reaches Zero (FR-014, FR-015)

**Objective**: Verify timer stops at 00:00:00:00 when target time reached

**Setup**: Modify target date in code to 1 minute in future for testing

**Steps**:
1. Set target date to `new Date(Date.now() + 60000)` (1 min from now)
2. Navigate to countdown page
3. Observe timer: "00 00 01 00" (approximately)
4. Wait until timer reaches "00 00 00 00"
5. Wait additional 10 seconds
6. Observe timer remains at "00 00 00 00"

**Expected Results**:
- [ ] Timer counts down to "00 00 00 00"
- [ ] Timer stops updating (no negative values)
- [ ] Timer displays "00 00 00 00" when target time passed
- [ ] No error messages or visual glitches
- [ ] Page remains functional (no crashes)

**Note**: Restore original target date after test

**Pass Criteria**: All checkboxes marked

---

### Scenario 9: Unauthorized Countdown Access (FR-013, FR-018)

**Objective**: Verify direct countdown access without secret entry redirects to landing

**Steps**:
1. Open new browser tab (or incognito window)
2. Navigate directly to `/countdown.html` URL (bypass landing page)
3. Observe page behavior

**Expected Results**:
- [ ] Page immediately redirects to `/landing.html`
- [ ] Countdown timer never visible
- [ ] Redirect happens within 100ms (before timer starts)
- [ ] Landing page input field focused after redirect

**Pass Criteria**: All checkboxes marked

---

### Scenario 10: Session Persistence (FR-017)

**Objective**: Verify secret validation does NOT persist across browser sessions

**Steps**:
1. Navigate to landing page
2. Enter "sorry" and submit (reach countdown page)
3. Verify countdown timer visible
4. Close browser tab completely
5. Open new browser tab
6. Navigate to `/countdown.html` directly
7. Observe redirect to landing page
8. Verify secret NOT remembered (must re-enter)

**Expected Results**:
- [ ] Closing tab clears session state
- [ ] New tab requires re-entering secret
- [ ] sessionStorage cleared on tab close
- [ ] No persistence via localStorage or cookies

**Pass Criteria**: All checkboxes marked

---

### Scenario 11: Page Refresh Persistence

**Objective**: Verify countdown continues after page refresh (same session)

**Steps**:
1. Navigate to landing page
2. Enter "sorry" and submit (reach countdown page)
3. Observe current timer value (e.g., "42 12 30 15")
4. Press F5 (or Ctrl+R / Cmd+R) to refresh page
5. Observe timer continues from approximately same value (±2 seconds)

**Expected Results**:
- [ ] Page refresh does NOT redirect to landing
- [ ] sessionStorage persists across refresh
- [ ] Timer resumes countdown (not reset)
- [ ] Timer value approximately matches pre-refresh (±2 sec)

**Pass Criteria**: All checkboxes marked

---

### Scenario 12: Target Date Already Passed (FR-015)

**Objective**: Verify timer displays zeros if target date in past

**Setup**: Modify target date in code to past date for testing

**Steps**:
1. Set target date to `new Date('2020-01-01T00:00:00+01:00')` (past)
2. Navigate to countdown page (after entering secret)
3. Observe timer display

**Expected Results**:
- [ ] Timer displays "00 00 00 00" immediately
- [ ] Timer does not update (remains at zeros)
- [ ] No negative values displayed
- [ ] No JavaScript errors in console

**Note**: Restore original target date after test

**Pass Criteria**: All checkboxes marked

---

## Performance Validation

### Page Load Performance (Performance Goals)

**Objective**: Verify <100ms p95 page load time

**Steps**:
1. Open browser DevTools → Network tab
2. Clear cache (hard refresh)
3. Navigate to landing page
4. Observe `DOMContentLoaded` and `Load` times
5. Repeat 10 times, record p95 (95th percentile)

**Expected Results**:
- [ ] Landing page: DOMContentLoaded <50ms, Load <100ms (p95)
- [ ] Countdown page: DOMContentLoaded <50ms, Load <100ms (p95)
- [ ] Bundle size: <100KB total (HTML+CSS+JS)
- [ ] No render-blocking resources

**Pass Criteria**: All checkboxes marked

---

### Timer Update Latency (Performance Goals)

**Objective**: Verify <16ms timer update latency (60fps)

**Steps**:
1. Open browser DevTools → Performance tab
2. Navigate to countdown page
3. Start performance recording
4. Wait 5 seconds (5 timer updates)
5. Stop recording
6. Analyze frame timings for timer update function

**Expected Results**:
- [ ] Timer update function executes in <1ms
- [ ] No frame drops (all frames <16.67ms)
- [ ] Consistent 1000ms intervals between updates
- [ ] No memory leaks (memory stable over 1 minute)

**Pass Criteria**: All checkboxes marked

---

## Cross-Browser Testing

### Supported Browsers

Test all scenarios in:
- [ ] Chrome 120+ (Windows/macOS/Linux)
- [ ] Firefox 120+ (Windows/macOS/Linux)
- [ ] Safari 17+ (macOS/iOS)
- [ ] Edge 120+ (Windows)

**Pass Criteria**: All scenarios pass in all browsers

---

## Mobile Responsiveness

### Mobile Testing

**Objective**: Verify responsive design on mobile devices

**Steps**:
1. Open DevTools → Device Toolbar
2. Select "iPhone 14 Pro" (390x844)
3. Navigate to landing page
4. Verify logo scales appropriately
5. Verify input field usable on touch screen
6. Navigate to countdown page
7. Verify timer digits readable (not truncated)
8. Verify all text fits viewport (no horizontal scroll)

**Expected Results**:
- [ ] Landing page readable on 390px width
- [ ] Countdown page readable on 390px width
- [ ] Font sizes scale down for mobile (timer 5rem → 3rem)
- [ ] Touch targets ≥44px for buttons
- [ ] No horizontal scrolling required

**Pass Criteria**: All checkboxes marked

---

## Accessibility Testing

### WCAG 2.1 AA Compliance

**Objective**: Verify basic accessibility requirements

**Steps**:
1. Run Lighthouse audit in Chrome DevTools
2. Check color contrast ratios
3. Test keyboard navigation
4. Test screen reader compatibility (NVDA/VoiceOver)

**Expected Results**:
- [ ] Lighthouse Accessibility score ≥90
- [ ] Color contrast ≥4.5:1 for normal text
- [ ] Color contrast ≥3:1 for large text (timer digits)
- [ ] Keyboard navigation: Tab to input field, Enter to submit
- [ ] Screen reader announces timer updates (aria-live)
- [ ] Semantic HTML (`<time>` element for countdown)

**Pass Criteria**: All checkboxes marked (or documented exceptions)

---

## Kubernetes Deployment Validation

### Infrastructure Testing (Goss)

**Objective**: Verify Kubernetes deployment configuration

**Steps**:
```bash
# Test deployment exists
kubectl get deployment blueorange -o json | goss validate

# Test service exists
kubectl get service blueorange -o json | goss validate

# Test pod health
kubectl get pods -l app=blueorange -o json | goss validate

# Test HTTP endpoint
curl -f http://blueorange.local/landing.html
```

**Expected Results**:
- [ ] Deployment has 1+ replica running
- [ ] Service type: ClusterIP or LoadBalancer
- [ ] Service port: 80
- [ ] Pod status: Running
- [ ] Pod ready: true
- [ ] HTTP 200 from /landing.html endpoint
- [ ] nginx:1.27.3-alpine image used

**Pass Criteria**: All checkboxes marked

---

## Success Criteria Summary

**Functional Requirements**: 20/20 tested
**Performance Requirements**: 2/2 validated
**Cross-Browser Compatibility**: 4/4 browsers
**Mobile Responsiveness**: Tested
**Accessibility**: WCAG 2.1 AA validated
**Deployment**: Kubernetes validated

**Overall Pass**: All scenarios passed with no critical issues

---

## Rollback Procedure

If quickstart tests fail:
1. Document failing scenario(s) in issue tracker
2. Revert deployment to previous version: `kubectl rollout undo deployment/blueorange`
3. Investigate failure in development environment
4. Fix issues and retest locally before redeploying

## Support

For issues or questions:
- **Development**: File issue in GitHub repository
- **Deployment**: Check kubectl logs: `kubectl logs -l app=blueorange`
- **Performance**: Use browser DevTools Performance and Network tabs
