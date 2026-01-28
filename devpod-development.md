# TODO

 - [ ] Disable the majority of options inside `devpod context options`
 - [ ] Enable caching. Doesn't seem to work? Also not with prebuild? Is this an architecture thing?
 - [ ] Can we run devpod up with the entire devcontainer image?
 - [ ] Can we run with ide vscode and get all extensions preinstalled? `devpod ide list`

Command to run:
 ```
 devpod up github.com/vgijssel/setup@mg/fix/coder-agent-stability \
  --provider kubernetes \
  --provider-option KUBERNETES_CONFIG=/secrets/coder-prod/kubeconfig.yaml \
  --provider-option KUBERNETES_NAMESPACE=test-workspace-1 \
  --provider-option STORAGE_CLASS=kubevirt \
  --provider-option POD_MANIFEST_TEMPLATE=/workspaces/setup/pod-template.yaml \
  --disable-daemon \
  --id test-workspace-1 \
  --open-ide=false \
  --ide=vscode \
  --prebuild-repository ghcr.io/vgijssel/setup/devpod-builder
 ```

# DevPod Kubernetes Development Notes

This document captures configuration options and CLI flags for creating DevPod workspaces in Kubernetes with specific requirements.

## Requirements Summary

1. Create workspace in kubernetes cluster `coder-cluster-prod` in namespace `test-workspace-1`
2. Use storage class `kubevirt` for PVC
3. Use current git branch for checkout
4. Git checkout in `/workspaces/setup`
5. No devpod daemon running
6. Set environment variables: `CODER_AGENT_URL` and `CODER_AGENT_TOKEN`
7. Execute init script on workspace start

---

## 1. Kubernetes Provider Setup

### Install the Kubernetes Provider

```bash
devpod provider add kubernetes
devpod provider use kubernetes
```

### Key Provider Options

| Option | Description | Default |
|--------|-------------|---------|
| `KUBERNETES_NAMESPACE` | Target namespace for workspace | `devpod` |
| `KUBERNETES_CONTEXT` | Kubernetes context to use | Current context |
| `KUBERNETES_CONFIG` | Path to kubeconfig | `~/.kube/config` |
| `STORAGE_CLASS` | Storage class for PVC | Cluster default |
| `DISK_SIZE` | PVC size | `10Gi` |
| `CREATE_NAMESPACE` | Auto-create namespace | `true` |
| `PVC_ACCESS_MODE` | PVC access mode (RWO/ROX/RWX/RWOP) | - |
| `WORKSPACE_VOLUME_MOUNT` | Override workspace mount path | `/workspaces/$WORKSPACE_ID` |

### Configure Provider Options

```bash
# Set namespace
devpod provider set-options kubernetes -o KUBERNETES_NAMESPACE=test-workspace-1

# Set storage class
devpod provider set-options kubernetes -o STORAGE_CLASS=kubevirt

# View all options
devpod provider options kubernetes
```

---

## 2. Namespace Configuration

**Provider Option:** `KUBERNETES_NAMESPACE`

```bash
# Method 1: Set globally for provider
devpod provider set-options kubernetes -o KUBERNETES_NAMESPACE=test-workspace-1

# Method 2: Set per-workspace via provider-option flag
devpod up <source> --provider-option KUBERNETES_NAMESPACE=test-workspace-1
```

The `CREATE_NAMESPACE=true` option (default) will automatically create the namespace if it doesn't exist.

---

## 3. PVC Storage Class Configuration

**Provider Option:** `STORAGE_CLASS`

```bash
# Method 1: Set globally for provider
devpod provider set-options kubernetes -o STORAGE_CLASS=kubevirt

# Method 2: Set per-workspace
devpod up <source> --provider-option STORAGE_CLASS=kubevirt
```

Additional PVC options:
- `DISK_SIZE` - Size of the PVC (default: `10Gi`)
- `PVC_ACCESS_MODE` - Access mode (RWO, ROX, RWX, RWOP)
- `PVC_ANNOTATIONS` - Custom annotations for the PVC

---

## 4. Git Branch and Checkout Path

### Specifying Git Branch

Append `@<branch>` to the repository URL:

```bash
# Checkout specific branch
devpod up github.com/org/repo@mg/fix/coder-agent-stability

# Checkout specific commit
devpod up github.com/org/repo@sha256:abc123...

# Checkout PR (GitHub only)
devpod up github.com/org/repo@pull/123/head
```

### Workspace Folder Configuration

The checkout path is controlled by `workspaceFolder` in `devcontainer.json`:

```json
{
  "workspaceFolder": "/workspaces/setup"
}
```

**Provider Option:** `WORKSPACE_VOLUME_MOUNT`

This controls where the persistent volume is mounted. By default it's `/workspaces/$WORKSPACE_ID`.

```bash
# Override workspace volume mount location
devpod provider set-options kubernetes -o WORKSPACE_VOLUME_MOUNT=/workspaces
```

**Note:** The actual workspace folder path is determined by:
1. `workspaceFolder` in devcontainer.json (takes precedence)
2. Default: `/workspaces/<workspace-name>`

---

## 5. Disable DevPod Daemon

**CLI Flag:** `--disable-daemon`

```bash
devpod up <source> --disable-daemon
```

This prevents DevPod from installing a daemon into the target machine to track activity.

---

## 6. Environment Variables

### CLI Flags for Environment Variables

| Flag | Description | Timing |
|------|-------------|--------|
| `--workspace-env` | Environment variables for the workspace container | Available in running container |
| `--workspace-env-file` | File containing environment variables | Available in running container |
| `--init-env` | Environment variables during initialization | Available during workspace init |

### Usage Examples

```bash
# Set individual environment variables
devpod up <source> \
  --workspace-env CODER_AGENT_URL=https://coder.example.com \
  --workspace-env CODER_AGENT_TOKEN=secret-token

# Use environment file
echo "CODER_AGENT_URL=https://coder.example.com" > /tmp/env
echo "CODER_AGENT_TOKEN=secret-token" >> /tmp/env
devpod up <source> --workspace-env-file /tmp/env

# Init-time environment variables
devpod up <source> \
  --init-env CODER_AGENT_URL=https://coder.example.com \
  --init-env CODER_AGENT_TOKEN=secret-token
```

### devcontainer.json Environment Variables

```json
{
  "containerEnv": {
    "CODER_AGENT_URL": "https://coder.example.com",
    "CODER_AGENT_TOKEN": "${localEnv:CODER_AGENT_TOKEN}"
  },
  "remoteEnv": {
    "CODER_AGENT_URL": "https://coder.example.com"
  }
}
```

- `containerEnv`: Set for the entire container (all processes)
- `remoteEnv`: Set for devcontainer tools/terminals only

---

## 7. Init Script / Entrypoint Override

### Method 1: Lifecycle Commands in devcontainer.json

DevPod supports these lifecycle hooks (executed in order):

1. **initializeCommand** - Runs on host before container creation
2. **onCreateCommand** - Runs once when container is first created
3. **postCreateCommand** - Runs once after container creation
4. **postStartCommand** - Runs every time container starts
5. **postAttachCommand** - Runs every time a terminal attaches

**Example devcontainer.json:**

```json
{
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "workspaceFolder": "/workspaces/setup",
  "containerEnv": {
    "CODER_AGENT_URL": "https://coder.example.com",
    "CODER_AGENT_TOKEN": "${localEnv:CODER_AGENT_TOKEN}"
  },
  "postStartCommand": "echo 'hello world'",
  "postCreateCommand": "/workspaces/setup/scripts/init.sh"
}
```

### Method 2: Background Process on Start

For processes that should run in background:

```json
{
  "postStartCommand": "nohup bash -c '/path/to/script.sh &'"
}
```

### Method 3: Override Container Command

The `overrideCommand` property (default: `true`) controls whether DevPod overrides the container's CMD/ENTRYPOINT:

```json
{
  "overrideCommand": false
}
```

Set to `false` to preserve the container's original entrypoint.

### Example: Hello World Init Script

Create `scripts/init.sh`:

```bash
#!/bin/bash
echo "hello world"
echo "CODER_AGENT_URL: $CODER_AGENT_URL"
echo "CODER_AGENT_TOKEN: $CODER_AGENT_TOKEN"
```

Reference in devcontainer.json:

```json
{
  "postStartCommand": "bash /workspaces/setup/scripts/init.sh"
}
```

---

## Complete Example Command

```bash
# Get current branch
BRANCH=$(git branch --show-current)

# Create workspace with all options
devpod up github.com/your-org/setup@${BRANCH} \
  --provider kubernetes \
  --provider-option KUBERNETES_NAMESPACE=test-workspace-1 \
  --provider-option STORAGE_CLASS=kubevirt \
  --disable-daemon \
  --workspace-env CODER_AGENT_URL=https://coder.example.com \
  --workspace-env CODER_AGENT_TOKEN=your-token \
  --id test-workspace-1
```

## Complete Example devcontainer.json

```json
{
  "name": "Coder Workspace",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "workspaceFolder": "/workspaces/setup",
  "containerEnv": {
    "CODER_AGENT_URL": "${localEnv:CODER_AGENT_URL}",
    "CODER_AGENT_TOKEN": "${localEnv:CODER_AGENT_TOKEN}"
  },
  "postStartCommand": "echo 'hello world'"
}
```

---

## Limitations and Notes

1. **Unsupported devcontainer.json properties in DevPod:**
   - `userEnvProbe`
   - `waitFor`
   - Parallel lifecycle scripts

2. **Environment variable interpolation:**
   - `${localEnv:VAR}` - Value from local environment
   - `${containerEnv:VAR}` - Value from container environment

3. **Lifecycle script failure:**
   - If any lifecycle script fails, subsequent scripts are skipped
   - e.g., if `postCreateCommand` fails, `postStartCommand` won't run

4. **Git credentials:**
   - DevPod forwards git credentials to remote machines
   - SSH agent forwarding is enabled by default

---

## Validation Results (2026-01-28)

Tested against cluster `coder-cluster-prod` using kubeconfig at `/secrets/coder-prod/kubeconfig.yaml`.

### What Works

| Feature | Status | Notes |
|---------|--------|-------|
| Namespace creation | ✅ | `--provider-option KUBERNETES_NAMESPACE=test-workspace-1` correctly creates namespace |
| Storage class | ✅ | `--provider-option STORAGE_CLASS=kubevirt` correctly uses the kubevirt storage class |
| Git branch checkout | ✅ | `github.com/org/repo@branch-name` correctly checks out the specified branch |
| Disable daemon | ✅ | `--disable-daemon` prevents daemon installation |
| Kubeconfig path | ✅ | `--provider-option KUBERNETES_CONFIG=/path/to/kubeconfig` works |
| POD_MANIFEST_TEMPLATE | ✅ | Environment variables injected into pod spec via `--provider-option POD_MANIFEST_TEMPLATE=/path/to/template.yaml` |

### What Requires Attention

| Feature | Status | Notes |
|---------|--------|-------|
| `--workspace-env` CLI flag | ⚠️ | Does NOT inject env vars into pod spec; only available to devcontainer lifecycle commands |
| Dockerfile builds | ⚠️ | Complex Dockerfiles may fail with dockerless builder; use pre-built images when possible |
| postStartCommand | ⚠️ | Requires the shell specified (e.g., `/bin/bash`) to exist in the container image |
| Command/Args override via POD_MANIFEST_TEMPLATE | ❌ | DevPod **overwrites** any `command` or `args` in the template (see below) |

### Command/Args Override via POD_MANIFEST_TEMPLATE (VALIDATED ❌)

**Tested and confirmed: DevPod OVERWRITES the `command` and `args` fields from POD_MANIFEST_TEMPLATE.**

Attempted template:
```yaml
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: devpod
    command: ["/bin/sh", "-c"]
    args: ["echo 'hello world' && sleep infinity"]
```

Actual pod spec after devpod creates the pod:
```bash
$ kubectl get pod -o jsonpath='{.spec.containers[0].command}'
["/bin/sh"]

$ kubectl get pod -o jsonpath='{.spec.containers[0].args}'
["-c","echo Container started\ntrap \"exit 0\" 15\n\nexec \"$@\"\nwhile sleep 1 & wait $!; do :; done","-","/bin/bash"]
```

**Conclusion:** DevPod ignores the `command` and `args` from POD_MANIFEST_TEMPLATE and uses its own default command to manage the container lifecycle. This is required for devpod's agent to function properly.

**For init scripts, use devcontainer.json lifecycle commands instead:**
- `postCreateCommand` - runs once after container creation
- `postStartCommand` - runs every time container starts
- `onCreateCommand` - runs once when container is first created

### Pod Manifest Template for Environment Variables (VALIDATED ✅)

To inject environment variables directly into the pod spec, use the `POD_MANIFEST_TEMPLATE` provider option.

**This approach was validated and confirmed working.**

Create a pod template file (e.g., `pod-template.yaml`):

```yaml
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: devpod
    env:
    - name: CODER_AGENT_URL
      value: "https://coder.example.com"
    - name: CODER_AGENT_TOKEN
      value: "your-token-here"
```

Use it with devpod:

```bash
devpod up <source> --provider-option POD_MANIFEST_TEMPLATE=/path/to/pod-template.yaml
```

**Verification:** After running with POD_MANIFEST_TEMPLATE, the pod spec shows the injected environment variables:

```bash
$ kubectl get pod -n test-workspace-1 <pod-name> -o jsonpath='{.spec.containers[0].env}' | jq .
[
  {
    "name": "CODER_AGENT_URL",
    "value": "https://coder.example.com"
  },
  {
    "name": "CODER_AGENT_TOKEN",
    "value": "test-token-12345"
  },
  {
    "name": "DEVPOD",
    "value": "true"
  },
  ...
]
```

**Note:** You can also use Kubernetes secrets for sensitive values:

```yaml
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: devpod
    env:
    - name: CODER_AGENT_URL
      value: "https://coder.example.com"
    - name: CODER_AGENT_TOKEN
      valueFrom:
        secretKeyRef:
          name: coder-agent-secret
          key: token
```

### Validated Command (with POD_MANIFEST_TEMPLATE)

```bash
# This command was validated against coder-cluster-prod
devpod up github.com/vgijssel/setup@mg/fix/coder-agent-stability \
  --provider kubernetes \
  --provider-option KUBERNETES_CONFIG=/secrets/coder-prod/kubeconfig.yaml \
  --provider-option KUBERNETES_NAMESPACE=test-workspace-1 \
  --provider-option STORAGE_CLASS=kubevirt \
  --provider-option POD_MANIFEST_TEMPLATE=/workspaces/setup/pod-template.yaml \
  --disable-daemon \
  --devcontainer-image mcr.microsoft.com/devcontainers/base:ubuntu \
  --id test-workspace-1 \
  --open-ide=false
```

### Kubernetes Resources Created

Verified via kubectl:

```bash
# Namespace created
$ kubectl get namespace test-workspace-1
NAME               STATUS   AGE
test-workspace-1   Active   106s

# Pod created with environment variables from POD_MANIFEST_TEMPLATE
$ kubectl get pods -n test-workspace-1
NAME                      READY   STATUS    RESTARTS   AGE
devpod-default-te-af5a1   1/1     Running   0          2m

# PVC with kubevirt storage class
$ kubectl get pvc -n test-workspace-1
NAME                      STATUS   VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS
devpod-default-te-af5a1   Bound    pvc-xxx  10Gi       RWO            kubevirt

# Environment variables confirmed in pod spec
$ kubectl get pod -n test-workspace-1 devpod-default-te-af5a1 -o jsonpath='{.spec.containers[0].env[0:2]}'
[{"name":"CODER_AGENT_URL","value":"https://coder.example.com"},{"name":"CODER_AGENT_TOKEN","value":"test-token-12345"}]
```

---

## References

- [DevPod Kubernetes Provider](https://github.com/loft-sh/devpod-provider-kubernetes)
- [DevPod Documentation](https://devpod.sh/docs)
- [Dev Container Specification](https://containers.dev/implementors/json_reference/)
- [DevPod devcontainer.json Support](https://devpod.sh/docs/developing-in-workspaces/devcontainer-json)
