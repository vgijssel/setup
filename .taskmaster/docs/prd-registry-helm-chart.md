<objective>
Create a Helm chart for the Docker container registry and integrate it with FluxCD in coder-prod.

The existing raw Kubernetes manifests in `apps/coder-prod/` deploy a Docker registry with garbage collection. Convert this to a proper Helm chart deployed via FluxCD HelmRelease, enabling templating, values-based configuration, and proper dependency management with the coder HelmRelease.
</objective>

<context>
This monorepo follows a two-directory structure:
- `apps/` - Deployable applications and environment configs
- `libs/` - Reusable libraries and Helm charts

@apps/coder-prod/deployment-registry.yaml
@apps/coder-prod/pvc-registry.yaml
@apps/coder-prod/service-registry.yaml
@apps/coder-prod/cronjob-registry-gc.yaml
@apps/coder-prod/helmrelease-coder.yaml
@apps/coder-prod/helmrelease-1password-secrets.yaml
@apps/coder-prod/kustomization.yaml
@libs/1password-secrets/Chart.yaml
@libs/external-service/moon.yml

Reference existing Helm charts in `libs/` for structure patterns. The HelmRelease pattern in `helmrelease-1password-secrets.yaml` shows how to reference local charts from a GitRepository source. The moon.yml pattern in `libs/external-service/moon.yml` shows how to configure build and test tasks for Helm charts.
</context>

<requirements>
1. Create a new Helm chart at `libs/registry/`:
   - `Chart.yaml` - Chart metadata (apiVersion: v2, type: application)
   - `values.yaml` - Configurable values with sensible defaults
   - `templates/` directory with all Kubernetes resources
   - `moon.yml` - Moon build configuration with lint, build, and test tasks

2. The chart must include templates for:
   - Deployment (registry:2.8.3 image)
   - Service (ClusterIP on port 5000)
   - PersistentVolumeClaim
   - ConfigMap (registry config for GC)
   - CronJob (garbage collection)

3. Key configurable values:
   - `storage.size`: **Default to 40Gi** (user requirement)
   - `storage.storageClassName`: Default to "kubevirt"
   - `gc.schedule`: Set to run more frequently - **every 4 hours** (`"0 */4 * * *"`) to prevent storage exhaustion
   - `image.repository` and `image.tag`
   - `resources.requests` and `resources.limits`

4. Create `libs/registry/moon.yml` with:
   - `lint` task: Run `helm lint .`
   - `build` task: Run `helm package .` with output `*.tgz`
   - `test` task: Run snapshot tests via `./tests/snapshot_test.sh`
   - All tasks should have proper inputs with caching enabled
   - Tags: `type.library`, `scope.infrastructure`, `kubernetes`, `helm`

5. Create snapshot test infrastructure at `libs/registry/tests/`:
   - `snapshot_test.sh` - Script that renders templates and compares against snapshots
   - `snapshots/` directory with expected rendered output

6. Create FluxCD HelmRelease at `apps/coder-prod/helmrelease-registry.yaml`:
   - Reference the chart from GitRepository `setup` at path `./libs/registry`
   - Deploy to namespace `coder`
   - Set `reconcileStrategy: Revision`
   - Configure values to set storage to 40Gi

7. Update `apps/coder-prod/helmrelease-coder.yaml`:
   - Add dependency on the `registry` HelmRelease so coder deploys after registry is ready

8. Update `apps/coder-prod/kustomization.yaml`:
   - Add `helmrelease-registry.yaml` to resources
   - Remove the raw registry manifests that will be replaced:
     - `pvc-registry.yaml`
     - `deployment-registry.yaml`
     - `service-registry.yaml`
     - `cronjob-registry-gc.yaml`

9. Delete the old raw manifests after the HelmRelease is working:
   - `apps/coder-prod/pvc-registry.yaml`
   - `apps/coder-prod/deployment-registry.yaml`
   - `apps/coder-prod/service-registry.yaml`
   - `apps/coder-prod/cronjob-registry-gc.yaml`
</requirements>

<implementation>
Follow these patterns from existing code:

**Chart.yaml pattern** (from libs/1password-secrets):
```yaml
apiVersion: v2
name: registry
description: A Helm chart for Docker container registry with garbage collection
type: application
version: 0.1.0
appVersion: 2.8.3
```

**moon.yml pattern** (from libs/external-service):
```yaml
language: javascript
layer: library
tags:
  - type.library
  - scope.infrastructure
  - kubernetes
  - helm
tasks:
  lint:
    command: helm
    args:
      - lint
      - .
    inputs:
      - glob: "**/*"
        cache: true
    options:
      cache: true

  build:
    command: helm
    args:
      - package
      - .
    inputs:
      - glob: "**/*"
        cache: true
    options:
      cache: true
    outputs:
      - "*.tgz"

  test:
    command: ./tests/snapshot_test.sh
    inputs:
      - glob: "**/*"
        cache: true
    options:
      cache: true
```

**HelmRelease pattern** (from helmrelease-1password-secrets.yaml):
```yaml
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: registry
  namespace: flux-system
spec:
  interval: 30m
  chart:
    spec:
      chart: ./libs/registry
      sourceRef:
        kind: GitRepository
        name: setup
        namespace: flux-system
      interval: 12h
      reconcileStrategy: Revision
  targetNamespace: coder
  # ... rest of config
```

**Template naming**: Use `{{ include "registry.fullname" . }}` helper pattern for resource names.

**Labels**: Include standard Kubernetes labels:
```yaml
labels:
  app.kubernetes.io/name: {{ include "registry.name" . }}
  app.kubernetes.io/instance: {{ .Release.Name }}
  app.kubernetes.io/part-of: coder
```

**GC Schedule Rationale**: The current schedule runs GC only once daily at 2 AM. With active development pushing images frequently, this can lead to storage exhaustion. Running every 4 hours provides better balance between storage reclamation and system load.
</implementation>

<output>
Create/modify files with these paths:

New files:
- `./libs/registry/Chart.yaml` - Chart metadata
- `./libs/registry/values.yaml` - Default values (40Gi storage, 4-hour GC schedule)
- `./libs/registry/moon.yml` - Moon build configuration
- `./libs/registry/templates/_helpers.tpl` - Template helpers
- `./libs/registry/templates/deployment.yaml` - Registry deployment
- `./libs/registry/templates/service.yaml` - ClusterIP service
- `./libs/registry/templates/pvc.yaml` - PersistentVolumeClaim
- `./libs/registry/templates/configmap.yaml` - Registry config for GC
- `./libs/registry/templates/cronjob.yaml` - GC cronjob
- `./libs/registry/tests/snapshot_test.sh` - Snapshot test script
- `./libs/registry/tests/snapshots/` - Snapshot directory with expected output
- `./apps/coder-prod/helmrelease-registry.yaml` - FluxCD HelmRelease

Modified files:
- `./apps/coder-prod/helmrelease-coder.yaml` - Add dependsOn for registry
- `./apps/coder-prod/kustomization.yaml` - Add helmrelease-registry.yaml, remove raw manifests

Deleted files:
- `./apps/coder-prod/pvc-registry.yaml`
- `./apps/coder-prod/deployment-registry.yaml`
- `./apps/coder-prod/service-registry.yaml`
- `./apps/coder-prod/cronjob-registry-gc.yaml`
</output>

<validation_workflow>
Follow this iterative validation workflow to ensure the implementation works in the live cluster:

1. **Remove existing resources from the cluster**:
   ```bash
   kubectl delete deployment registry -n coder --ignore-not-found
   kubectl delete service registry -n coder --ignore-not-found
   kubectl delete cronjob registry-gc -n coder --ignore-not-found
   kubectl delete configmap registry-config -n coder --ignore-not-found
   # Note: Do NOT delete the PVC to preserve data
   ```

2. **Make changes or updates** to the Helm chart and HelmRelease files

3. **Apply new resources to the cluster** for quick testing:
   ```bash
   helm template registry ./libs/registry --namespace coder | kubectl apply -f -
   ```

4. **Commit the changes and push to remote**:
   ```bash
   git add -A
   git commit -m "feat(registry): convert raw manifests to Helm chart"
   git push
   ```

5. **Reconcile using FluxCD**:
   ```bash
   flux reconcile source git setup
   flux reconcile kustomization root --with-source
   flux reconcile helmrelease registry -n flux-system
   ```

6. **Check for failures**:
   ```bash
   flux get helmreleases -A
   kubectl get pods -n coder -l app=registry
   kubectl logs -n coder -l app=registry --tail=50
   ```

   If there is a failure, analyze the error and return to step 2 to fix issues.

7. **Verify coder HelmRelease also reconciles**:
   ```bash
   flux reconcile helmrelease coder -n flux-system
   flux get helmreleases -A
   ```
</validation_workflow>

<verification>
Before declaring complete, verify:

1. Moon tasks work:
   ```bash
   moon run registry:lint
   moon run registry:build
   moon run registry:test
   ```

2. Helm chart lints successfully:
   ```bash
   helm lint ./libs/registry
   ```

3. Template renders correctly:
   ```bash
   helm template registry ./libs/registry --namespace coder
   ```

4. The rendered output matches the original manifests functionally (same image, ports, volume mounts)

5. The HelmRelease YAML is valid:
   ```bash
   kubectl --dry-run=client -o yaml apply -f ./apps/coder-prod/helmrelease-registry.yaml
   ```

6. Kustomization builds successfully:
   ```bash
   kubectl kustomize ./apps/coder-prod/
   ```

7. FluxCD reconciliation succeeds (follow validation_workflow)
</verification>

<success_criteria>
- Helm chart created at `libs/registry/` with all required templates
- moon.yml created with lint, build, and test tasks
- Snapshot tests created and passing
- Chart lints and templates render without errors
- HelmRelease created with proper GitRepository source reference
- Coder HelmRelease depends on registry HelmRelease
- Storage is configured to 40Gi
- GC runs every 4 hours (schedule: "0 */4 * * *")
- Kustomization updated to use HelmRelease instead of raw manifests
- Old raw manifest files deleted
- All verification commands pass
- FluxCD successfully reconciles the registry HelmRelease in the live cluster
- Coder HelmRelease reconciles successfully with the registry dependency
</success_criteria>
