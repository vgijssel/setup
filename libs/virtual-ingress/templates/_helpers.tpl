{{/*
Expand the name of the chart.
*/}}
{{- define "virtual-ingress.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "virtual-ingress.fullname" -}}
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
{{- define "virtual-ingress.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "virtual-ingress.labels" -}}
helm.sh/chart: {{ include "virtual-ingress.chart" . }}
{{ include "virtual-ingress.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "virtual-ingress.selectorLabels" -}}
app.kubernetes.io/name: {{ include "virtual-ingress.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Hash of the ClusterPolicy immutable fields.
This hash is used to detect when the policy needs to be recreated.
Only includes fields that are immutable in Kyverno mutate rules:
- match block, preconditions, rule name, mutate patch operations
*/}}
{{- define "virtual-ingress.policyHash" -}}
{{- $immutableContent := dict
    "ruleName" "resolve-service-from-annotation"
    "match" (dict "any" (list (dict "resources" (dict "kinds" (list "Ingress")))))
    "preconditions" (dict "all" (list
        (dict "key" "{{ request.object.metadata.annotations.\"myorg.io/backend-match-labels\" || '' }}" "operator" "NotEquals" "value" "")
        (dict "key" "{{ request.object.metadata.annotations.\"myorg.io/resolved-service-name\" || '' }}" "operator" "Equals" "value" "")
    ))
    "mutateType" "patchesJson6902"
    "patchOps" (list "add:/metadata/annotations/myorg.io~1resolved-service-name" "replace:/spec/rules/0/http/paths/0/backend/service/name")
-}}
{{- $immutableContent | toJson | sha256sum | trunc 16 -}}
{{- end }}
