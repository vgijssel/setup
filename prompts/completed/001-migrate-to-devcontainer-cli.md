<objective>
Migrate the coder-devcontainer-kubernetes Coder workspace template from Envbuilder to the devcontainer CLI approach.

The current implementation uses Envbuilder with Kaniko for building devcontainer images, but Kaniko does not properly handle symlinks (particularly Hermit bin/internal symlinks), breaking the Dockerfile build process. The devcontainer CLI uses a standard Docker daemon which handles symlinks correctly.
</objective>

<context>
**Current implementation**: `libs/coder-devcontainer-kubernetes/main.tf`
- Uses `envbuilder_cached_image` resource to build devcontainers
- Runs in Kubernetes as a deployment
- Caches to a local registry via `cache_repo`

**Target implementation pattern**: Based on Coder's official docker-devcontainer template
- Use the `devcontainers-cli` module from Coder registry
- Use `coder_devcontainer` resource to define the devcontainer project
- Run Docker inside the workspace (Docker-in-Docker with privileged mode)
- Use `build.cacheFrom` in devcontainer.json for caching

**Reference resources**:
- Example template: https://github.com/coder/coder/blob/main/examples/templates/docker-devcontainer/main.tf
- Devcontainer integration docs: https://coder.com/docs/admin/integrations/devcontainers/integration
- Devcontainer JSON reference: https://containers.dev/implementors/json_reference/

**Repository**: https://github.com/vgijssel/setup.git
**Devcontainer location**: `.devcontainer/devcontainer.json`
</context>

<research>
Before implementation, thoroughly analyze:

1. Read the current `libs/coder-devcontainer-kubernetes/main.tf` to understand all existing resources and their dependencies
2. Read `.devcontainer/devcontainer.json` to understand the current devcontainer configuration
3. Read `.devcontainer/Dockerfile` if it exists to understand the build process
4. Search the codebase for any references to envbuilder to ensure complete migration
5. Fetch and analyze the official docker-devcontainer example from Coder to understand the exact pattern
6. Research devcontainer.json `build.options` to determine if it can pass `--cache-to` flags to Docker build for cache pushing (since `cacheTo` is not a native devcontainer.json property)
</research>

<requirements>
1. **Remove Envbuilder components**:
   - Remove `envbuilder` provider from terraform required_providers
   - Remove `envbuilder_cached_image` resource
   - Remove references to `envbuilder_cached_image.workspace` in the deployment
   - Remove the `devcontainer_builder` parameter (no longer needed)

2. **Add devcontainer CLI integration**:
   - Add the `devcontainers-cli` module from `registry.coder.com/coder/devcontainers-cli/coder`
   - Add the `git-clone` module to ensure repository is cloned before devcontainer builds
   - Add `coder_devcontainer` resource pointing to `/workspaces/setup`

3. **Modify Kubernetes deployment**:
   - Change base image to one that supports Docker (e.g., `codercom/enterprise-node:ubuntu` or similar)
   - Add privileged mode to the container security context (required for Docker-in-Docker)
   - Mount Docker socket or use Docker-in-Docker approach
   - Update the container command to run the agent init script

4. **Update agent configuration**:
   - Set `startup_script_behavior = "blocking"` on the agent
   - Add Docker startup commands to the startup script
   - Ensure devcontainer environment variables are set:
     - `CODER_AGENT_DEVCONTAINERS_ENABLE=true`
     - `CODER_AGENT_DEVCONTAINERS_PROJECT_DISCOVERY_ENABLE=false` (using manual coder_devcontainer)

5. **Configure caching via devcontainer.json**:
   - Add `build.cacheFrom` configuration to `.devcontainer/devcontainer.json` to pull cached layers
   - Use the existing local registry URL pattern for cache images
   - **Note**: `cacheTo` is NOT directly supported in devcontainer.json spec. To enable cache pushing, explore:
     - `build.options` - can pass additional Docker build flags like `--cache-to`
     - `build.args` - for build arguments that might influence caching behavior
   - Research the best approach to push cache layers to the local registry after builds

6. **Preserve existing functionality**:
   - All 1Password integrations must continue working
   - GitHub external auth must remain functional
   - Fleet MCP server configuration must be preserved
   - Claude Code module integration must work
   - All workspace presets must continue working
   - Resource monitoring metadata must be preserved
</requirements>

<implementation>
Follow this step-by-step approach:

1. **First, fetch and study the official example**:
   - Use WebFetch to get the raw docker-devcontainer template
   - Understand the exact module versions and resource configurations

2. **Update main.tf** (primary changes):
   ```hcl
   # Remove from required_providers:
   # - envbuilder provider

   # Add modules:
   module "git_clone" {
     source   = "registry.coder.com/coder/git-clone/coder"
     version  = "~> 1.0"
     agent_id = coder_agent.main.id
     url      = local.repo_url
     base_dir = "/workspaces"
     branch   = local.git_branch
   }

   module "devcontainers_cli" {
     source   = "registry.coder.com/coder/devcontainers-cli/coder"
     version  = "~> 1.0"
     agent_id = coder_agent.main.id
   }

   # Add coder_devcontainer resource
   resource "coder_devcontainer" "workspace" {
     agent_id       = coder_agent.main.id
     workspace_folder = "/workspaces/setup"
   }
   ```

3. **Update Kubernetes deployment**:
   - Change image to a Docker-capable base image
   - Add privileged security context
   - Update container command for agent startup

4. **Update agent startup script**:
   - Add Docker daemon startup
   - Wait for Docker to be ready before proceeding

5. **Update devcontainer.json**:
   - Add `build.cacheFrom` to pull cached layers from the local registry
   - Investigate using `build.options` to pass `--cache-to` flag for pushing cache layers
   - Example approach:
     ```json
     {
       "build": {
         "cacheFrom": ["registry.local/coder-cache:latest"],
         "options": ["--cache-to=type=registry,ref=registry.local/coder-cache:latest,mode=max"]
       }
     }
     ```
   - Test whether `build.options` correctly passes flags to `docker build`
</implementation>

<constraints>
- DO NOT break existing workspace functionality - this is a production template
- DO NOT remove 1Password integration, GitHub auth, or other secret management
- DO NOT change the workspace namespace or storage class
- Keep the existing module versions where possible (update only what's necessary)
- The devcontainer.json changes should be minimal - only add caching configuration
- Preserve all workspace presets (Coder, Operator, Researcher)
- Maintain backward compatibility with the existing parameter interface where possible
</constraints>

<output>
Modify these files:
- `./libs/coder-devcontainer-kubernetes/main.tf` - Main Terraform configuration
- `./.devcontainer/devcontainer.json` - Add caching configuration

Update the CLAUDE.md and AGENTS.md files in the library if necessary to reflect the new devcontainer CLI approach instead of Envbuilder.
</output>

<verification>
Before declaring complete, verify:

1. Run `terraform fmt` on the modified Terraform files
2. Run `terraform validate` (with `terraform init -backend=false` first if needed)
3. Run `trunk check libs/coder-devcontainer-kubernetes/main.tf`
4. Verify all required providers are correctly specified
5. Verify all module sources use pinned versions
6. Confirm the devcontainer.json is valid JSON
7. Ensure no references to envbuilder remain in the template
</verification>

<success_criteria>
- The template no longer uses Envbuilder or Kaniko
- Docker-in-Docker is properly configured with privileged mode
- The devcontainer CLI module is integrated
- Caching is configured via devcontainer.json:
  - `build.cacheFrom` pulls cached layers from local registry
  - `build.options` (or alternative) pushes cache layers back to registry (if feasible)
- All existing functionality (1Password, GitHub auth, Fleet MCP, Claude Code) is preserved
- Terraform validates successfully
- Linting passes
</success_criteria>
