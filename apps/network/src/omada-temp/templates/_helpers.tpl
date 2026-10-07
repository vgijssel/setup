{{/*
Comma-separated MongoDB seed hosts for the replica set. Copied from ../../omada/templates/_helpers.tpl
rather than shared, because these are two independent Fleet bundles and a `file://` dep just to
share nine lines of templating would outlive the temporary bundle it serves. Keep them in step
only for as long as omada-temp exists — which is until the migration round-trip is done.

Lives in a .tpl helper rather than inline for a mundane but real reason: a YAML file that OPENS
with Go-template actions is not parseable YAML and yamllint rejects it. Helpers are not linted as
YAML, so the logic belongs here and the manifest stays valid from its first line.
*/}}
{{- define "omada-temp.mongoSeeds" -}}
{{- $sts := printf "%s-%s" .Values.mongodb.clusterName .Values.mongodb.replsetName -}}
{{- $hosts := list -}}
{{- range $i := until (int .Values.mongodb.replicas) -}}
{{- $hosts = append $hosts (printf "%s-%d.%s.%s.svc.cluster.local:27017" $sts $i $sts $.Values.mongodb.namespace) -}}
{{- end -}}
{{- join "," $hosts -}}
{{- end -}}
