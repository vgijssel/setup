## 0.8.0 (2025-11-13)

### 🚀 Features

- Add HTTP server console script entry point (setup-fleet-mcp-serve) ([#828](https://github.com/vgijssel/setup/pull/828))

## 0.7.5 (2025-11-13)

### 🩹 Fixes

- Pin Python version to 3.10 to ensure consistent environment and validate compatibility with lower Python versions ([#829](https://github.com/vgijssel/setup/pull/829))

## 0.7.4 (2025-11-12)

### 🩹 Fixes

- Add console script entrypoint and lower Python version to 3.10 ([#827](https://github.com/vgijssel/setup/pull/827))

## 0.7.3 (2025-11-12)

### 🩹 Fixes

- Let uv handle trusted publisher token ([#826](https://github.com/vgijssel/setup/pull/826))

## 0.7.2 (2025-11-12)

### 🩹 Fixes

- Build the right version for fleet-mcp publish ([#825](https://github.com/vgijssel/setup/pull/825))

## 0.7.1 (2025-11-12)

### 🩹 Fixes

- Fix release script invocation ([#824](https://github.com/vgijssel/setup/pull/824))

## 0.7.0 (2025-11-12)

### 🚀 Features

- Enable publishing of the fleet-mcp package to pypi under "setup-fleet-mcp"  ([#823](https://github.com/vgijssel/setup/pull/823))

## 0.6.0 (2025-11-12)

### 🚀 Features

- Add header-based Bearer token authentication with opt-in configuration support ([#817](https://github.com/vgijssel/setup/pull/817))

### 🩹 Fixes

- Initialize authentication token on startup when auth is enabled ([#817](https://github.com/vgijssel/setup/pull/817))

## 0.5.0 (2025-11-10)

### 🚀 Features

- Refactor fleet-mcp to clean architecture. This improves maintainability and scalability of the library and reduces confusion when developed on by Claude Code. ([#808](https://github.com/vgijssel/setup/pull/808))