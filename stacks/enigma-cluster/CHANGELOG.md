## 1.2.0 (2025-12-15)

### 🚀 Features

- Deploy internal networking using Tailscale Operator and Kyverno. All CozyStack services using regular ingress resources are automatically made available via Tailscale ([#845](https://github.com/vgijssel/setup/pull/845))
- Deploy external networking using a remote gateway node on Hetzner connected via KubeSpan. Ingress resources with internal-networking/expose: true annotation receive external ingress routing through the gateway node ([#845](https://github.com/vgijssel/setup/pull/845))

## 1.1.0 (2025-09-17)

### 🚀 Features

- Migrate from project.json to package.json configuration for consistency ([#719](https://github.com/vgijssel/setup/pull/719))