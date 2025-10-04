---
title: Internal DNS Service
slug: internal-dns-service
date: 2025-10-04 06:00:00
---

# Internal DNS Service for Kubernetes Ingresses

The internal DNS service automatically discovers Kubernetes Ingress resources and makes them resolvable via DNS queries. This enables Tailscale-connected clients and internal systems to resolve ingress hostnames without manual DNS configuration.

## Overview

The service consists of two Crossplane packages:

1. **cdk8s-function-xp**: A Crossplane composition function that renders cdk8s Python code to Kubernetes manifests
2. **internal-dns-xp**: A Crossplane configuration that deploys external-dns and PowerDNS for internal DNS resolution

## Architecture

```
Kubernetes Ingresses → external-dns → PowerDNS API → SQLite DB → DNS Service (port 53)
                                                                        ↓
                                                           Tailscale/Internal Clients
```

## Features

- **Automatic Discovery**: Monitors all Ingress resources across namespaces
- **Fast Resolution**: DNS queries respond in < 500ms
- **Quick Updates**: New ingresses resolve within 2 minutes
- **Persistent**: DNS records survive pod restarts via PVC
- **Scalable**: Supports 10-100 ingresses per instance
- **Clean Deletion**: Automatically removes DNS records when ingresses are deleted

## Documentation

- **Quick Start**: [specs/001-build-a-dns/quickstart.md](../../../specs/001-build-a-dns/quickstart.md)
- **Deployment Guide**: [libs/internal-dns-xp/docs/deployment.md](../../../libs/internal-dns-xp/docs/deployment.md)
- **cdk8s Function**: [libs/cdk8s-function-xp/README.md](../../../libs/cdk8s-function-xp/README.md)
- **Internal DNS Config**: [libs/internal-dns-xp/README.md](../../../libs/internal-dns-xp/README.md)

## Tech Stack

- **Python**: 3.11+
- **cdk8s**: 2.68.84 (type-safe Kubernetes resource generation)
- **Crossplane**: >= 2.0.2 (infrastructure orchestration)
- **external-dns**: v0.14.0
- **PowerDNS**: pdns-auth-50
