{{/*
Comma-separated MongoDB seed hosts for the replica set, e.g.
  mongodb-rs0-0.mongodb-rs0.mongodb.svc.cluster.local:27017,mongodb-rs0-1...,mongodb-rs0-2...

Derived from .Values.mongodb so it cannot drift from the PerconaServerMongoDB CR
(../../mongodb/perconaservermongodb.yaml) — change the replica count in one place without the
other and Omada points at hosts that do not exist.

All members are listed. One reachable seed is enough for the driver to discover the rest, but
listing all of them means losing rs0-0 alone does not break startup.

It lives in a .tpl helper rather than inline at the top of the consuming manifest for a mundane
but real reason: a YAML file that OPENS with Go-template actions is not parseable YAML, and
yamllint rejects it ("expected the node content, but found '-'"). Helpers are not linted as YAML,
so the logic belongs here and the manifest stays valid from its first line.
*/}}
{{- define "omada.mongoSeeds" -}}
{{- $sts := printf "%s-%s" .Values.mongodb.clusterName .Values.mongodb.replsetName -}}
{{- $hosts := list -}}
{{- range $i := until (int .Values.mongodb.replicas) -}}
{{- $hosts = append $hosts (printf "%s-%d.%s.%s.svc.cluster.local:27017" $sts $i $sts $.Values.mongodb.namespace) -}}
{{- end -}}
{{- join "," $hosts -}}
{{- end -}}
