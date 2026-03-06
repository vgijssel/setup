<objective>
Deploy ArgoCD v3.3.2 in **high availability (HA) mode** using standard manifest installation, configured for self-management through an ArgoCD Application resource, and exposed via nginx ingress with SSL passthrough at `argocd.enigma.vgijssel.nl`.
</objective>

<context>
This is a Moon monorepo that uses:
- **vendir** for downloading external dependencies (manifests, charts, configs) into `third_party/vendir/`
- **Kustomize** for organizing Kubernetes resources in `apps/` directory
- **CozyStack** which provides nginx ingress for the cluster

The target namespace is `setup-argocd`. ArgoCD should manage itself via an Application resource.

Reference files:
- @third_party/vendir/vendir.yml - existing vendir configuration patterns
- @third_party/vendir/moon.yml - vendir build task
- @apps/enigma-cluster/kustomization.yaml - example app structure
</context>

<requirements>
1. **Vendir Configuration**
   - Add ArgoCD v3.3.2 manifests to `third_party/vendir/vendir.yml`
   - Use git source to download the entire `manifests/` directory from the ArgoCD repo at tag v3.3.2
   - This includes the HA manifests at `manifests/ha/install.yaml` which we'll use
   - Output path should be `manifests/argocd` within the vendir directory
   - Use `includePaths` to get all files under `manifests/**` and `newRootPath` to flatten the structure

2. **App Structure in `apps/argo-cd/`**
   Create the following structure:
   - `moon.yml` - Moon project configuration
   - `kustomization.yaml` - Kustomize configuration that:
     - References the vendir-downloaded manifests
     - Sets the namespace to `setup-argocd`
     - Includes the ingress resource
     - Includes the ArgoCD Application for self-management
   - `namespace-setup-argocd.yaml` - Namespace definition
   - `ingress-argocd.yaml` - Ingress resource for ArgoCD server
   - `application-argocd.yaml` - ArgoCD Application resource for self-management

3. **Ingress Configuration (SSL Passthrough)**
   Use exactly this ingress configuration:
   ```yaml
   apiVersion: networking.k8s.io/v1
   kind: Ingress
   metadata:
     name: argocd-server-ingress
     namespace: setup-argocd
     annotations:
       nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
       nginx.ingress.kubernetes.io/ssl-passthrough: "true"
   spec:
     ingressClassName: nginx
     rules:
     - host: argocd.enigma.vgijssel.nl
       http:
         paths:
         - path: /
           pathType: Prefix
           backend:
             service:
               name: argocd-server
               port:
                 name: https
   ```

4. **Self-Management Application**
   Create an ArgoCD Application that:
   - Is in the `setup-argocd` namespace
   - Points to this repo's `apps/argo-cd` path
   - Uses the appropriate sync policy for GitOps
   - Manages itself and all related resources (including the ingress)

5. **Run Vendir Sync**
   After updating vendir.yml, run `moon run vendir:build` to download the manifests
</requirements>

<implementation>
Follow existing patterns from the codebase:

**Vendir entry pattern** (using git to download full manifests directory):
```yaml
- path: manifests/argocd
  contents:
    - path: .
      git:
        url: https://github.com/argoproj/argo-cd
        ref: v3.3.2
      includePaths:
        - manifests/**
      newRootPath: manifests
```

**Kustomization should reference the HA manifest**:
```yaml
resources:
  - namespace-setup-argocd.yaml
  - ../../../third_party/vendir/manifests/argocd/ha/install.yaml  # HA mode
  - ingress-argocd.yaml
  - application-argocd.yaml
```

**Moon.yml pattern** (similar to enigma-cluster):
```yaml
language: javascript
layer: application
tags:
  - scope.app
  - type.stack
  - kubernetes
  - argocd
```

**Kustomization namespace transformation**:
Use `namespace: setup-argocd` field to transform all resources to the target namespace.

**Do NOT**:
- Create separate files for each ArgoCD component - use the upstream `ha/install.yaml` for HA mode
- Use the non-HA `install.yaml` - we specifically need HA mode with multiple replicas
- Skip the self-management Application resource - this is critical for GitOps
- Forget to include the ingress in the kustomization resources list
</implementation>

<output>
Create/modify files:

1. `./third_party/vendir/vendir.yml` - Add argocd manifests entry
2. `./apps/argo-cd/moon.yml` - Moon project config
3. `./apps/argo-cd/kustomization.yaml` - Main kustomization
4. `./apps/argo-cd/namespace-setup-argocd.yaml` - Namespace resource
5. `./apps/argo-cd/ingress-argocd.yaml` - Ingress with SSL passthrough
6. `./apps/argo-cd/application-argocd.yaml` - Self-managing Application

After file creation, run:
```bash
moon run vendir:build
```
</output>

<verification>
Before declaring complete, verify:
1. Vendir sync completed successfully and HA manifests exist: `ls third_party/vendir/manifests/argocd/ha/install.yaml`
2. Full manifests directory downloaded: `ls third_party/vendir/manifests/argocd/` shows `ha/`, `base/`, `crds/`, etc.
3. All YAML files pass validation: `trunk check apps/argo-cd/`
4. Kustomization can be built: `kustomize build apps/argo-cd/`
5. The ArgoCD Application resource references the correct repo path
6. Ingress hostname is `argocd.enigma.vgijssel.nl` with SSL passthrough annotations
</verification>

<success_criteria>
- ArgoCD v3.3.2 manifests downloaded via vendir (full manifests directory including `ha/` subdirectory)
- Complete app structure in `apps/argo-cd/`
- **HA mode enabled** by using `ha/install.yaml` manifest
- Namespace set to `setup-argocd` for all resources
- Ingress configured with SSL passthrough at `argocd.enigma.vgijssel.nl`
- Self-managing ArgoCD Application created
- All files follow existing codebase patterns
- Vendir sync and kustomize build succeed
</success_criteria>
