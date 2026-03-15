{{/*
Truncate a name to 63 characters (Kubernetes max) while preserving uniqueness.
If the name exceeds 63 chars, truncate and append a hash suffix.
*/}}
{{- define "argocd-cluster-registration.truncName" -}}
{{- $name := . -}}
{{- if gt (len $name) 63 -}}
{{- $hash := $name | sha256sum | trunc 8 -}}
{{- $truncated := $name | trunc 54 | trimSuffix "-" -}}
{{- printf "%s-%s" $truncated $hash -}}
{{- else -}}
{{- $name -}}
{{- end -}}
{{- end -}}

{{/*
Helper template for vcluster registration policy spec.
Used both for the actual spec and to generate a content-based hash for the name.
When this content changes, the policy name changes, causing ArgoCD to prune the old and create new.

IMPORTANT: This policy matches on the kubeconfig secret (vc-*) NOT the config secret (vc-config-*).
This is because vCluster creates secrets in this order:
1. vc-config-* (config secret with ingress host) - created first
2. vc-* (kubeconfig secret with certificates) - created ~47 seconds later

If we trigger on vc-config-*, the kubeconfig secret doesn't exist yet and we get empty certificates.
By triggering on vc-* (kubeconfig), we ensure certificates are available, then fetch the config secret.
*/}}
{{- define "argocd-cluster-registration.vclusterPolicySpec" -}}
generateExisting: true
rules:
  - name: generate-argocd-cluster-secret
    skipBackgroundRequests: false
    match:
      any:
        - resources:
            kinds:
              - Secret
            names:
              # Match kubeconfig secrets (vc-*) which have the certificates
              # These are created AFTER the config secrets, so certificates are guaranteed to exist
              - vc-*
            namespaces:
              - tenant-*
    exclude:
      any:
        - resources:
            names:
              # Exclude config secrets - they don't have certificates
              - vc-config-*
    context:
      # Extract release name from the kubeconfig secret's vcluster-name label
      - name: releaseName
        variable:
          jmesPath: request.object.metadata.labels."vcluster-name"
          default: ""
      - name: sourceNamespace
        variable:
          jmesPath: request.object.metadata.namespace
          default: ""
      # Derive the config secret name by adding 'config-' after 'vc-'
      # Example: vc-secrets-proxy-vcluster-pr942 → vc-config-secrets-proxy-vcluster-pr942
      - name: configSecretName
        variable:
          jmesPath: replace_all(request.object.metadata.name, 'vc-', 'vc-config-')
          default: ""
      # Extract certificate data directly from the matched kubeconfig secret
      - name: caData
        variable:
          jmesPath: request.object.data."certificate-authority"
          default: ""
      - name: certData
        variable:
          jmesPath: request.object.data."client-certificate"
          default: ""
      - name: keyData
        variable:
          jmesPath: request.object.data."client-key"
          default: ""
      # Fetch the corresponding config secret to get ingress host
      - name: configSecret
        apiCall:
          method: GET
          urlPath: "/api/v1/namespaces/{{ `{{ sourceNamespace }}` }}/secrets/{{ `{{ configSecretName }}` }}"
          jmesPath: "data"
      # Parse the config.yaml and extract the ingress host
      # The host is at: controlPlane.ingress.host in the YAML structure
      - name: vclusterConfig
        variable:
          jmesPath: parse_yaml(base64_decode(configSecret."config.yaml"))
          default: {}
      # Extract the ingress host from the parsed config
      - name: ingressHost
        variable:
          jmesPath: vclusterConfig.controlPlane.ingress.host || ''
          default: ""
      # Generate cluster name for ArgoCD (format: vc-{release})
      - name: clusterSecretName
        variable:
          jmesPath: "join('-', ['vc', releaseName])"
          default: ""
    generate:
      synchronize: true
      apiVersion: v1
      kind: Secret
      name: "{{ `{{ clusterSecretName }}` }}"
      namespace: {{ .Values.secretsNamespace }}
      data:
        metadata:
          labels:
            argocd.argoproj.io/secret-type: cluster
            vcluster.io/source-namespace: "{{ `{{ sourceNamespace }}` }}"
            vcluster.io/config-secret: "{{ `{{ configSecretName }}` }}"
            vcluster.io/kubeconfig-secret: "{{ `{{ request.object.metadata.name }}` }}"
            vcluster.io/release: "{{ `{{ releaseName }}` }}"
        stringData:
          # Use the release name as the cluster name in ArgoCD
          name: "{{ `{{ releaseName }}` }}"
          # Use the ingress host from config.yaml for the API server URL
          server: "https://{{ `{{ ingressHost }}` }}"
          # TLS client configuration for cluster authentication
          # Reference: https://argo-cd.readthedocs.io/en/stable/operator-manual/declarative-setup/#clusters
          config: '{"tlsClientConfig": {"insecure": false, "caData": "{{ `{{ caData }}` }}", "certData": "{{ `{{ certData }}` }}", "keyData": "{{ `{{ keyData }}` }}"}}'
{{- end }}

{{/*
Helper template for enigma cluster registration policy spec.
Used both for the actual spec and to generate a content-based hash for the name.
When this content changes, the policy name changes, causing ArgoCD to prune the old and create new.
*/}}
{{- define "argocd-cluster-registration.enigmaPolicySpec" -}}
generateExisting: true
rules:
  - name: generate-argocd-cluster-secret
    skipBackgroundRequests: true
    match:
      any:
        - resources:
            kinds:
              - Secret
            names:
              - argocd-token
            namespaces:
              - {{ .Release.Namespace }}
    context:
      - name: token
        variable:
          jmesPath: request.object.data.token
      - name: caData
        variable:
          jmesPath: request.object.data."ca.crt"
    generate:
      synchronize: true
      apiVersion: v1
      kind: Secret
      name: cluster-enigma
      namespace: {{ .Values.secretsNamespace }}
      data:
        metadata:
          labels:
            argocd.argoproj.io/secret-type: cluster
            cluster.enigma.vgijssel.nl/source-namespace: {{ .Release.Namespace }}
            cluster.enigma.vgijssel.nl/source-secret: argocd-token
        stringData:
          name: enigma
          server: https://api.enigma.vgijssel.nl:443
          config: |
            {
              "bearerToken": "{{ `{{ base64_decode(token) }}` }}",
              "tlsClientConfig": {
                "insecure": false,
                "caData": "{{ `{{ caData }}` }}"
              }
            }
{{- end }}
