<objective>
Update the FluxCluster kro ResourceGraphDefinition to create a ConfigMap containing environment variables for Kustomize postBuild substitution, then update apps/secrets HelmReleases to use these variables.
</objective>

<context>
The FluxCluster CRD (libs/flux-cluster/resourcegroup.yaml) creates k3k clusters with Flux GitRepository and Kustomization resources. The Kustomization uses postBuild.substituteFrom to inject environment variables from ConfigMaps.

Currently, apps/secrets contains HelmReleases that hardcode values like namespace and kubeconfig secret names. These should be parameterized using Kustomize variable substitution.

Key files:
- `libs/flux-cluster/resourcegroup.yaml` - The kro ResourceGraphDefinition defining FluxCluster
- `apps/secrets/helmrelease-1password-operator.yaml` - HelmRelease targeting a k3k cluster
- `apps/secrets/helmrelease-1password-secrets.yaml` - HelmRelease targeting a k3k cluster
- `apps/secrets/helmrelease-aws-sigv4-proxy.yaml` - HelmRelease targeting a k3k cluster
</context>

<requirements>
1. Add a new ConfigMap resource to the FluxCluster ResourceGraphDefinition with:
   - Resource id: `configmap`
   - Name: `${schema.metadata.name}-vars` (uniquely named based on CRD name)
   - Namespace: `${schema.metadata.namespace}`
   - Data containing these environment variables:
     - `FLUX_BRANCH`: value from `${schema.spec.flux.branch}`
     - `FLUX_NAMESPACE`: value from `${schema.metadata.namespace}` (namespace where flux resources go)
     - `KUBECONFIG_SECRET_NAME`: value `k3k-${schema.metadata.name}-kubeconfig` (following existing pattern from secretstore)
     - `FLUX_GITREPOSITORY_NAME`: value from `${gitrepository.metadata.name}` (the created gitrepository name)

2. Update the Kustomization resource (id: kustomization) to add postBuild.substituteFrom referencing the new ConfigMap:
   ```yaml
   postBuild:
     substituteFrom:
       - kind: ConfigMap
         name: ${configmap.metadata.name}
   ```

3. Update apps/secrets HelmReleases to use the substitution variables:
   - Replace hardcoded `namespace: tenant-prod` in metadata with `namespace: ${FLUX_NAMESPACE}`
   - Replace hardcoded `name: k3k-secrets-kubeconfig` in kubeConfig.secretRef with `name: ${KUBECONFIG_SECRET_NAME}`
   - Replace hardcoded `name: setup` in sourceRef with `name: ${FLUX_GITREPOSITORY_NAME}`
   - Replace hardcoded `namespace: flux-system` in sourceRef with `namespace: ${FLUX_NAMESPACE}`
</requirements>

<implementation>
Follow kro CEL expression patterns already used in the resourcegroup.yaml file. The ConfigMap should be placed with other resources in the resources array.

For the apps/secrets files, use Flux Kustomize variable substitution syntax: `${VARIABLE_NAME}`. These variables will be substituted at reconciliation time by Flux.

The dependency order matters: configmap must be created before kustomization references it, but kro handles this automatically through CEL references.
</implementation>

<output>
Modify the following files:
- `libs/flux-cluster/resourcegroup.yaml` - Add ConfigMap resource and update Kustomization with postBuild
- `apps/secrets/helmrelease-1password-operator.yaml` - Replace hardcoded values with substitution variables
- `apps/secrets/helmrelease-1password-secrets.yaml` - Replace hardcoded values with substitution variables
- `apps/secrets/helmrelease-aws-sigv4-proxy.yaml` - Replace hardcoded values with substitution variables
</output>

<verification>
Before declaring complete, verify:
1. The ConfigMap resource uses correct CEL syntax matching existing patterns in resourcegroup.yaml
2. The configmap name follows the pattern `${schema.metadata.name}-vars`
3. All four environment variables are present in the ConfigMap data
4. The Kustomization resource includes postBuild.substituteFrom referencing the ConfigMap
5. All three HelmRelease files in apps/secrets use the substitution variables
6. The substitution variable syntax uses `${VARIABLE_NAME}` format
</verification>

<success_criteria>
- FluxCluster creates a ConfigMap with all required environment variables
- Kustomization references the ConfigMap for postBuild substitution
- apps/secrets HelmReleases are parameterized and no longer contain hardcoded tenant-prod, k3k-secrets-kubeconfig, or setup values
</success_criteria>
