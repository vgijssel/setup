## 1.1.1 (2025-12-21)

### 🩹 Fixes

- Update internal-networking to exclude default-backend from Tailscale selector and add port 80 support ([#859](https://github.com/vgijssel/setup/pull/859))

## 1.1.0 (2025-12-15)

### 🚀 Features

- Deploy here-i-am node as remote gateway for Enigma cluster on Hetzner. Routes all traffic for ingresses tagged with internal-networking/expose: true annotation ([#845](https://github.com/vgijssel/setup/pull/845))