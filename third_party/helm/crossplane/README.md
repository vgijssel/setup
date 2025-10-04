# Crossplane

**Version**: 2.0.2
**Type**: Kubernetes Orchestration Platform
**Purpose**: Infrastructure composition and orchestration

## Description

Crossplane is a framework for building cloud-native control planes using Kubernetes. It extends Kubernetes with Custom Resource Definitions (CRDs) to enable infrastructure provisioning and composition.

## Installation

Crossplane is already vendored in this repository via vendir:

```yaml
# third_party/vendir/vendir.yml
- path: charts/crossplane
  contents:
    - path: .
      helmChart:
        name: crossplane
        version: 2.0.2
        repository:
          url: https://charts.crossplane.io/stable
```

Location: `third_party/vendir/charts/crossplane/`

## Usage in internal-dns-xp

internal-dns-xp is a Crossplane Configuration package that:
- Defines the InternalDNS XRD (CompositeResourceDefinition)
- Provides a Composition that uses cdk8s-function-xp
- Orchestrates DNS resource creation via pipeline mode
- Depends on provider-kubernetes for resource provisioning

## Components

1. **XRD (definition.yaml)**: Defines the InternalDNS API
2. **Composition (compositions/internal-dns.yaml)**: Orchestration logic with cdk8s function
3. **Package Metadata (crossplane.yaml)**: Configuration package specification

## Dependencies

```yaml
spec:
  dependsOn:
    - configuration: xpkg.upbound.io/crossplane-contrib/provider-kubernetes
      version: ">=v0.11.4"
    - function: cdk8s-function-xp
      version: ">=v0.1.0"
```

## References

- **Helm Chart**: `third_party/vendir/charts/crossplane/`
- **Documentation**: https://docs.crossplane.io/
- **Compositions**: https://docs.crossplane.io/latest/concepts/compositions/
- **Functions**: https://docs.crossplane.io/latest/concepts/composition-functions/
