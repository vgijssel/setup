{{/*
Helper template for vcluster registration policy spec.
Used both for the actual spec and to generate a content-based hash for the name.
When this content changes, the policy name changes, causing ArgoCD to prune the old and create new.
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
              - vc-config-*
            namespaces:
              - tenant-*
    context:
      # Extract release name from the config secret's release label
      - name: releaseName
        variable:
          jmesPath: request.object.metadata.labels.release
          default: ""
      - name: sourceNamespace
        variable:
          jmesPath: request.object.metadata.namespace
          default: ""
      # Derive the kubeconfig secret name by stripping 'config-' from the config secret name
      # Example: vc-config-secrets-proxy-vcluster-pr942 → vc-secrets-proxy-vcluster-pr942
      - name: kubeconfigSecretName
        variable:
          jmesPath: replace_all(request.object.metadata.name, 'vc-config-', 'vc-')
          default: ""
      # Fetch the corresponding kubeconfig secret to get certificate data
      - name: kubeconfigSecret
        apiCall:
          method: GET
          urlPath: "/api/v1/namespaces/{{ `{{ sourceNamespace }}` }}/secrets/{{ `{{ kubeconfigSecretName }}` }}"
          jmesPath: "data"
      # Extract certificate data from the kubeconfig secret
      - name: caData
        variable:
          jmesPath: kubeconfigSecret."certificate-authority"
          default: ""
      - name: certData
        variable:
          jmesPath: kubeconfigSecret."client-certificate"
          default: ""
      - name: keyData
        variable:
          jmesPath: kubeconfigSecret."client-key"
          default: ""
      # Parse the config.yaml and extract the ingress host
      # The host is at: controlPlane.ingress.host in the YAML structure
      - name: vclusterConfig
        variable:
          jmesPath: parse_yaml(base64_decode(request.object.data."config.yaml"))
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
            vcluster.io/config-secret: "{{ `{{ request.object.metadata.name }}` }}"
            vcluster.io/kubeconfig-secret: "{{ `{{ kubeconfigSecretName }}` }}"
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
