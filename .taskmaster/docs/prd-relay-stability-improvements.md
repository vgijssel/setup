<context>
# Overview
The current Relay server deployment uses an external Helm chart (sourced via vendir) that lacks critical production features, resulting in pod instabilities. The primary issue is that the chart doesn't allow configuration of file descriptor limits, causing pods to fail when too many files are opened. Additionally, the chart lacks health checks and resource constraints, making it unsuitable for production use.

This PRD outlines the migration to a custom Helm chart that provides proper stability controls, health checks, and resource management for Relay server deployments.

# Core Features

## Custom Helm Chart
Create a production-ready Helm chart in `libs/relay-server` that includes:
- **Health Check Configuration**: Liveness and readiness probes to ensure pod stability
- **Resource Constraints**: CPU and memory limits/requests for predictable performance
- **File Descriptor Limits**: Configurable `ulimit` for open files (default: 1024)
- **LoadBalancer Service**: Expose Relay server externally via LoadBalancer service type
- **AWS S3 Integration**: Support for required AWS access keys for S3 communication
- **Production-Ready Defaults**: Sensible default values for all configurations

## Multi-Instance Deployment
Deploy two separate Relay server instances in `apps/docs-prod`:
- **Personal Instance**: Individual relay server configuration
- **Family Instance**: Shared family relay server configuration
Both instances will use the same custom Helm chart with different values.

## Migration from Existing Chart
Remove the external relay-server chart dependency:
- Delete relay-server entry from `third_party/vendir/vendir.yml`
- Clean up vendored chart files from `third_party/vendir/charts/relay-server`
- Update any existing references to use the new chart location

# User Experience
The stability improvements will provide:
- **Reduced Downtime**: Health checks enable automatic pod recovery
- **Predictable Performance**: Resource constraints prevent resource exhaustion
- **Better Diagnostics**: Health check endpoints for monitoring and debugging
- **Scalability**: Proper file descriptor limits prevent crashes under load
</context>

<PRD>
# Technical Architecture

## Helm Chart Structure (`libs/relay-server`)
```
libs/relay-server/
├── Chart.yaml              # Chart metadata
├── values.yaml             # Default configuration values
├── templates/
│   ├── deployment.yaml     # Pod deployment with health checks and resource limits
│   ├── service.yaml        # LoadBalancer service
│   ├── secret.yaml         # AWS credentials secret
│   └── _helpers.tpl        # Template helpers
└── README.md              # Chart documentation
```

## Key Components

### Deployment Configuration
- **Container Image**: relay-server image with configurable tag
- **Security Context**: Set file descriptor limits via `ulimit`
  - `nofile` (open files): Default 1024, configurable via values
- **Health Probes**:
  - Liveness probe: Check if server is responsive
  - Readiness probe: Check if server is ready to accept traffic
  - Configurable probe paths, intervals, and timeouts
- **Resource Limits**:
  - CPU: Default requests/limits (e.g., 100m/500m)
  - Memory: Default requests/limits (e.g., 128Mi/512Mi)
  - All values configurable via Helm values

### Service Configuration
- **Type**: LoadBalancer
- **Port**: Configurable, default 80
- **Annotations**: Support for cloud provider LoadBalancer configuration

### Secret Management
- **AWS Credentials**: Store S3 access keys in Kubernetes Secret
- **Environment Variables**: Inject secrets into pods securely
- **Values**: `awsAccessKeyId`, `awsSecretAccessKey`, `awsRegion`, `s3Bucket`

### Values Schema
```yaml
replicaCount: 1

image:
  repository: relay-server
  pullPolicy: IfNotPresent
  tag: "latest"

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 100m
    memory: 128Mi

ulimits:
  nofile: 1024

livenessProbe:
  httpGet:
    path: /health
    port: http
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /ready
    port: http
  initialDelaySeconds: 5
  periodSeconds: 5

service:
  type: LoadBalancer
  port: 80

aws:
  accessKeyId: ""
  secretAccessKey: ""
  region: us-east-1
  s3Bucket: ""
```

## Integration Points

### apps/docs-prod Deployment
Create two Helm release configurations:
1. **Personal Relay** (`apps/docs-prod/relay-personal/`)
   - Custom values for personal instance
   - Unique service name and labels
   - Separate AWS credentials

2. **Family Relay** (`apps/docs-prod/relay-family/`)
   - Custom values for family instance
   - Unique service name and labels
   - Separate AWS credentials

Each instance will reference `libs/relay-server` as the chart source.

# Development Roadmap

## Phase 1: Create Custom Helm Chart
**Scope**: Build the foundational Helm chart with all required features
- Create chart directory structure in `libs/relay-server`
- Define Chart.yaml with metadata
- Create values.yaml with all configurable options
- Build deployment.yaml template with:
  - Health check probes
  - Resource limits
  - File descriptor limits (ulimit)
  - AWS credential environment variables
- Build service.yaml template for LoadBalancer
- Build secret.yaml template for AWS credentials
- Create _helpers.tpl for reusable template functions
- Write Chart README with configuration examples

## Phase 2: Integrate Chart into apps/docs-prod
**Scope**: Deploy two relay instances using the new chart
- Create `apps/docs-prod/relay-personal/` directory
  - Create values.yaml for personal instance
  - Configure AWS credentials for personal S3 bucket
  - Set resource limits appropriate for personal use
- Create `apps/docs-prod/relay-family/` directory
  - Create values.yaml for family instance
  - Configure AWS credentials for family S3 bucket
  - Set resource limits appropriate for family use
- Add Helm install/upgrade commands to deployment scripts
- Verify both instances deploy successfully
- Test health check endpoints
- Verify S3 connectivity

## Phase 3: Remove Old Helm Chart
**Scope**: Clean up the external chart dependency
- Remove relay-server entry from `third_party/vendir/vendir.yml`
- Run vendir sync to remove vendored files
- Delete any remaining relay-server chart files in third_party
- Update any documentation referencing the old chart
- Verify no references remain to the old chart location

# Logical Dependency Chain

1. **Foundation - Custom Chart Creation** (Phase 1)
   - Must be completed first as it provides the deployment mechanism
   - All features (health checks, resources, ulimits, service, secrets) built together
   - Chart must be fully functional before integration

2. **Deployment - Integration** (Phase 2)
   - Depends on completed chart from Phase 1
   - Deploy both instances in parallel (personal and family)
   - Validation ensures stability before cleanup

3. **Cleanup - Remove Old Chart** (Phase 3)
   - Only after successful deployment of new chart
   - Safe to remove old dependency once new chart is proven stable

# Risks and Mitigations

## Technical Challenges

### File Descriptor Configuration
**Risk**: Kubernetes security contexts may not properly apply ulimit settings
**Mitigation**:
- Test ulimit configuration thoroughly in development
- Use `securityContext.sysctls` if standard ulimit doesn't work
- Document alternative approaches (init containers, node-level configuration)

### Health Check Endpoint Availability
**Risk**: Relay server may not expose suitable health check endpoints
**Mitigation**:
- Investigate relay server's existing endpoints
- Use TCP socket probes as fallback if HTTP probes unavailable
- Consider exec probes that run simple commands

### AWS Credential Management
**Risk**: Secrets management in Kubernetes requires careful handling
**Mitigation**:
- Use Kubernetes Secrets with proper RBAC
- Consider integration with external secret managers (1Password, Vault)
- Document credential rotation procedures

## MVP Definition
The minimum viable product must include:
- Functional Helm chart with deployment and service
- Health checks (even if using TCP probes)
- Resource limits configured
- File descriptor limits applied
- One working instance (personal or family)

Nice-to-have features that can be added later:
- Horizontal Pod Autoscaler
- PodDisruptionBudget
- Network policies
- Advanced monitoring/alerting
- Ingress configuration (if needed)

## Resource Constraints
- Development time: Focus on working solution over perfect solution
- Testing: Validate in staging environment before production
- Documentation: Prioritize operator documentation over developer details

# Appendix

## Research Findings

### Relay Server Requirements
- Requires persistent S3 storage for data
- Needs AWS credentials (access key, secret key, region, bucket)
- May have specific port requirements
- File descriptor limits are critical for stability under load

### Kubernetes File Descriptor Limits
Two approaches:
1. **securityContext.sysctls**: Node-level kernel parameters
2. **Init Container**: Use privileged init container to set ulimits

Example init container approach:
```yaml
initContainers:
- name: increase-fd-ulimit
  image: busybox
  command: ["sh", "-c", "ulimit -n 1024"]
  securityContext:
    privileged: true
```

### LoadBalancer Service Considerations
- Requires cloud provider integration (AWS/GCP/Azure)
- May need specific annotations for provider features
- Service IP may take time to provision
- Consider using MetalLB for bare-metal clusters

## Technical Specifications

### Health Check Probe Examples
```yaml
# HTTP-based health check
livenessProbe:
  httpGet:
    path: /health
    port: 80
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

# TCP-based health check (fallback)
livenessProbe:
  tcpSocket:
    port: 80
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

# Exec-based health check (alternative)
livenessProbe:
  exec:
    command:
    - cat
    - /tmp/healthy
  initialDelaySeconds: 5
  periodSeconds: 5
```

### Resource Limit Recommendations
Based on typical relay server load:
- **Personal Instance**: Lower limits (100m CPU / 256Mi memory)
- **Family Instance**: Higher limits (500m CPU / 512Mi memory)
- Start conservative and adjust based on monitoring

### Helm Chart Best Practices
- Use semantic versioning for chart versions
- Include NOTES.txt for post-install instructions
- Validate values with JSON schema
- Include default resource limits
- Make all sensitive values configurable
- Provide examples in README
</PRD>
