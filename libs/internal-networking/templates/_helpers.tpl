{{/*
Expand the name of the chart.
*/}}
{{- define "internal-networking.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "internal-networking.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "internal-networking.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "internal-networking.labels" -}}
helm.sh/chart: {{ include "internal-networking.chart" . }}
{{ include "internal-networking.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "internal-networking.selectorLabels" -}}
app.kubernetes.io/name: {{ include "internal-networking.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Hash of the gateway ClusterPolicy immutable fields.
This hash is used to detect when the policy needs to be recreated.
Only includes fields that are immutable in Kyverno generate rules:
- match block, preconditions, rule name, generate apiVersion/kind/name/namespace
Does NOT include: data block (mutable), synchronize (mutable), generateExisting (mutable)
*/}}
{{- define "internal-networking.gatewayPolicyHash" -}}
{{- $immutableContent := dict
    "ruleName" "mirror-ingress-to-gateway"
    "match" (dict "any" (list (dict "resources" (dict "kinds" (list "Ingress")))))
    "preconditions" (dict "all" (list
        (dict "key" "{{ starts_with(request.object.spec.ingressClassName || '', 'tenant-') }}" "operator" "Equals" "value" true)
        (dict "key" "{{ request.object.metadata.annotations.\"internal-networking/expose\" || '' }}" "operator" "Equals" "value" "true")
        (dict "key" "{{ request.object.metadata.annotations.\"internal-networking/processed\" || '' }}" "operator" "NotEquals" "value" "true")
        (dict "key" "{{ request.object.metadata.annotations.\"internal-networking/skip-gateway-mirror\" || 'false' }}" "operator" "NotEquals" "value" "true")
    ))
    "generateApiVersion" "networking.k8s.io/v1"
    "generateKind" "Ingress"
    "generateName" "{{ request.object.metadata.name }}-gateway"
    "generateNamespace" "{{ request.object.metadata.namespace }}"
-}}
{{- $immutableContent | toJson | sha256sum | trunc 16 -}}
{{- end }}

{{/*
Hash of the tailscale ClusterPolicy immutable fields.
*/}}
{{- define "internal-networking.tailscalePolicyHash" -}}
{{- $immutableContent := dict
    "ruleName" "mirror-ingress-to-tailscale-service"
    "match" (dict "any" (list (dict "resources" (dict "kinds" (list "Ingress")))))
    "preconditions" (dict "all" (list
        (dict "key" "{{ starts_with(request.object.spec.ingressClassName || '', 'tenant-') }}" "operator" "Equals" "value" true)
        (dict "key" "{{ request.object.metadata.annotations.\"internal-networking/processed\" || '' }}" "operator" "NotEquals" "value" "true")
        (dict "key" "{{ request.object.metadata.annotations.\"tailscale-ingress-mirror/skip\" || 'false' }}" "operator" "NotEquals" "value" "true")
        (dict "key" "{{ request.object.metadata.annotations.\"internal-networking/expose\" || 'false' }}" "operator" "NotEquals" "value" "true")
    ))
    "generateApiVersion" "v1"
    "generateKind" "Service"
    "generateName" "{{ request.object.metadata.name }}-tailscale"
    "generateNamespace" .Values.tailscaleIngress.nginxNamespace
-}}
{{- $immutableContent | toJson | sha256sum | trunc 16 -}}
{{- end }}
