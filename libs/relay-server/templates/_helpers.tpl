{{/*
Expand the name of the chart.
Uses .Values.name if set, otherwise falls back to .Chart.Name
*/}}
{{- define "relay-server.name" -}}
{{- default .Chart.Name .Values.name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
Uses .Values.name for unique resource naming across multiple instances.
*/}}
{{- define "relay-server.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- default .Chart.Name .Values.name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "relay-server.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Selector labels - used by both deployment and service for matching
*/}}
{{- define "relay-server.selectorLabels" -}}
app.kubernetes.io/name: {{ include "relay-server.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Common labels - includes selector labels plus metadata labels
*/}}
{{- define "relay-server.labels" -}}
helm.sh/chart: {{ include "relay-server.chart" . }}
{{ include "relay-server.selectorLabels" . }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion }}
{{- end }}
{{- end }}
