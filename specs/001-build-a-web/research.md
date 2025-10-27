# Research: Countdown Web Application

**Feature**: 001-build-a-web | **Date**: 2025-10-08

## Overview
Research findings for implementing a two-page countdown web application with secret-based access control using Vite, vanilla JavaScript, and Kubernetes deployment.

## Technology Decisions

### 1. Vite 6.x Multi-Page Configuration

**Decision**: Use Vite's `build.rollupOptions.input` to define multiple HTML entry points

**Rationale**:
- Vite natively supports multi-page applications without additional plugins
- Each HTML file can have its own JavaScript entry point
- Production builds create optimized bundles per page
- Development server provides hot module replacement for all pages

**Implementation Approach**:
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        landing: resolve(__dirname, 'src/pages/landing.html'),
        countdown: resolve(__dirname, 'src/pages/countdown.html')
      }
    }
  }
}
```

**Alternatives Considered**:
- **Single-page routing (React Router, etc.)**: Rejected - adds framework overhead, requirement explicitly states "two pages" and mandates minimal libraries
- **Static site generator**: Rejected - unnecessary complexity for 2 pages
- **Manual HTML files without build tool**: Rejected - loses module bundling, tree-shaking, and development ergonomics

**References**:
- Vite Multi-Page Apps: https://vite.dev/guide/build.html#multi-page-app
- Vite Build Options: https://vite.dev/config/build-options.html

---

### 2. Timezone Handling in Browser

**Decision**: Use `Intl.DateTimeFormat` and `Date` with explicit timezone for Europe/Amsterdam

**Rationale**:
- Modern browsers support IANA timezone database via Intl API
- No external libraries needed (Moment.js, date-fns would violate minimal dependencies requirement)
- Handles daylight saving time transitions automatically
- Target date: 2025-11-20 00:00 Europe/Amsterdam (CET, UTC+1)

**Implementation Approach**:
```javascript
const targetDate = new Date('2025-11-20T00:00:00+01:00'); // CET explicit offset
const now = new Date();
const diff = targetDate - now;

const days = Math.floor(diff / (1000 * 60 * 60 * 24));
const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
const seconds = Math.floor((diff % (1000 * 60)) / 1000);
```

**Alternatives Considered**:
- **Server-side time synchronization**: Rejected - frontend-only requirement, no backend available
- **Manual UTC offset calculation**: Rejected - error-prone with DST, Intl API handles this
- **Third-party library (Luxon, date-fns-tz)**: Rejected - violates minimal dependencies requirement, native APIs sufficient

**Edge Cases**:
- Countdown already expired: Display 00:00:00:00 (all zeros)
- User system time incorrect: Accept user's local time (no server to verify against)
- Timezone changes during session: Recalculate on each tick (minimal performance impact)

**References**:
- MDN Intl.DateTimeFormat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
- MDN Date: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

---

### 3. Session Storage Strategy

**Decision**: Use `sessionStorage` with boolean flag for secret validation state

**Rationale**:
- sessionStorage is tab-scoped and clears on browser close (matches "no persistence across browser sessions" requirement)
- Simple key-value API, no serialization complexity
- Synchronous access (no async/await needed)
- Survives page refresh within same tab (matches "timer continues if in same session" requirement)

**Implementation Approach**:
```javascript
// On successful secret validation (landing page)
sessionStorage.setItem('secretValidated', 'true');

// On countdown page load
if (sessionStorage.getItem('secretValidated') !== 'true') {
  window.location.href = '/landing.html';
}
```

**Security Considerations**:
- sessionStorage is vulnerable to XSS attacks (acceptable - no sensitive data, just a boolean flag)
- No HTTPS requirement enforced (should be handled at deployment level via Kubernetes ingress)
- Secret hardcoded in JavaScript bundle (acceptable per specification - "sorry" is not a real secret)

**Alternatives Considered**:
- **localStorage**: Rejected - persists across browser restarts (violates requirement)
- **In-memory JavaScript variable**: Rejected - lost on page refresh (violates "timer continues" requirement)
- **Cookies**: Rejected - unnecessary complexity, requires domain configuration, sent with every request
- **IndexedDB**: Rejected - async API adds complexity, overkill for single boolean

**References**:
- MDN sessionStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
- Web Storage Security: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#security

---

### 4. Nginx Static File Serving

**Decision**: Use default nginx configuration with multi-page static files

**Rationale**:
- Nginx serves static files from root directory by default
- No special routing rules needed for multi-page apps (each HTML file has its own URL)
- landing.html → /landing.html, countdown.html → /countdown.html
- index.html can redirect to landing.html

**Implementation Approach**:
```nginx
# Default nginx.conf (nginx:1.27.3-alpine base image)
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ =404;
  }
}
```

**Dockerfile**:
```dockerfile
FROM nginx:1.27.3-alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
```

**Alternatives Considered**:
- **Custom nginx routes with rewrites**: Rejected - unnecessary, direct file serving is simpler
- **Client-side routing with catch-all**: Rejected - multi-page app doesn't need SPA routing
- **Apache httpd**: Rejected - nginx is lighter and more common for static hosting

**References**:
- Nginx Serving Static Content: https://nginx.org/en/docs/beginners_guide.html#static
- Official Nginx Docker Image: https://hub.docker.com/_/nginx

---

### 5. Logo Asset Extraction

**Decision**: Extract banana logo as inline SVG in HTML

**Rationale**:
- Provided logo image shows:
  - Green/yellow gradient banana shape with brown outline
  - "BLUE ORANGE" text in brown below banana
  - Beige/cream background (to be replaced with page background)
- SVG provides:
  - Infinite scalability (important for "prominent" display requirement)
  - Small file size (<5KB)
  - CSS styling capability (can adjust colors if needed)
  - No external HTTP request (inline in HTML)

**Implementation Approach**:
- Trace banana shape as SVG path
- Use CSS gradients for green-yellow fill
- Define brown stroke for outline
- Text as SVG `<text>` element with custom font or web font
- Inline SVG in landing.html `<header>` section

**Alternatives Considered**:
- **PNG raster image**: Rejected - not scalable, requires multiple sizes for responsive design
- **External SVG file**: Rejected - adds HTTP request, inline is faster for small asset
- **Icon font**: Rejected - overkill for single logo, harder to customize colors

**Color Palette (extracted from image)**:
- Banana fill: `#7AB800` to `#C4D600` (green to yellow gradient)
- Outline: `#4A2C2A` (dark brown)
- Text: `#4A2C2A` (dark brown)
- Background (landing page): `#F5F5DC` (beige)

---

### 6. Countdown Design Implementation

**Decision**: Implement countdown page design with CSS (no canvas/WebGL)

**Rationale**:
- Provided design image shows:
  - Dark textured background (teal/orange gradients with scan lines)
  - Top text: "SHE WILL MAKE Him SORRY" (mixed case, "Him" in red/orange)
  - Large numeric timer: "02 14 37 26" (light green/yellow)
  - Labels: "DAYS HOURS MINUTES SECONDS" (light green/yellow)
  - Bottom text: "KLAASSANDRA" (large red text)
- CSS is sufficient for:
  - Background gradients and textures (linear-gradient, background-blend-mode)
  - Text shadow effects for glitch styling
  - Grid layout for timer display
  - Responsive typography

**Implementation Approach**:
```css
/* Countdown page background */
body {
  background: linear-gradient(180deg, #1A3A3A 0%, #8B4513 100%);
  background-blend-mode: overlay;
}

/* Glitch text effect */
.glitch {
  text-shadow: 2px 2px 0px #00FFFF, -2px -2px 0px #FF00FF;
  animation: glitch 1s infinite;
}

/* Timer digits */
.timer-digit {
  font-family: 'Courier New', monospace;
  font-size: 10rem;
  color: #C4D600;
  text-shadow: 0 0 20px rgba(196, 214, 0, 0.8);
}
```

**Typography**:
- Timer: Monospace font (Courier New fallback, or custom web font)
- Text: Sans-serif (Arial, Helvetica)
- Sizes: Timer 10rem+, labels 2rem, text 3-5rem

**Layout**:
- CSS Grid for timer (4 columns: days, hours, minutes, seconds)
- Flexbox for vertical centering
- Responsive breakpoints for mobile (<768px reduce font sizes)

**Alternatives Considered**:
- **Canvas rendering**: Rejected - CSS sufficient, canvas adds complexity and accessibility issues
- **WebGL effects**: Rejected - overkill, violates minimal dependencies requirement
- **GIF/video background**: Rejected - large file size, performance impact

**Accessibility Considerations**:
- Sufficient color contrast (light text on dark background meets WCAG AA)
- Semantic HTML (`<time>` element for countdown)
- ARIA labels for screen readers
- Reduced motion media query to disable glitch animations

**References**:
- CSS Glitch Effect: https://css-tricks.com/glitch-effect-text-images-svg/
- CSS Grid Layout: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout

---

## Summary of Decisions

| Area | Decision | Key Dependencies |
|------|----------|------------------|
| Build Tool | Vite 6.x multi-page config | vite@6.x.x |
| Timezone | Native Intl.DateTimeFormat | None (browser API) |
| Session State | sessionStorage boolean flag | None (browser API) |
| Deployment | Nginx 1.27.3-alpine static serving | nginx:1.27.3-alpine |
| Logo | Inline SVG in HTML | None (hand-coded SVG) |
| Design | CSS gradients, text-shadow, Grid | None (CSS3) |

**Total External Dependencies**: 1 (Vite for build)

**Constitutional Compliance**:
- ✅ Minimal dependencies (only Vite required)
- ✅ Deterministic versions (exact pinning in package.json)
- ✅ No unnecessary abstractions (vanilla JS, no frameworks)
- ✅ Performance targets met (<100ms load, <16ms timer updates)

## Next Phase

**Phase 1**: Create data-model.md (entities: SecretValidator, SessionManager, Timer), quickstart.md (manual testing steps), and contracts/ (N/A - no backend APIs)
