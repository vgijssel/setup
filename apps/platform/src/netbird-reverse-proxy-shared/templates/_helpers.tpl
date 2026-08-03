{{/*
Fail-fast validation of the two required parameters. Included at the top of every template
that consumes them so a bundle that forgets to set `domain`/`tokenKvPath` fails to render
(loudly) instead of emitting a cert for `*.` or an ExternalSecret reading an empty KV path.
*/}}
{{- define "netbird-reverse-proxy-shared.validate" -}}
{{- if not .Values.domain -}}
{{- fail "netbird-reverse-proxy-shared: .Values.domain is required (e.g. network.vgijssel.nl)" -}}
{{- end -}}
{{- if not .Values.tokenKvPath -}}
{{- fail "netbird-reverse-proxy-shared: .Values.tokenKvPath is required (OpenBao KV path holding the proxy token)" -}}
{{- end -}}
{{- end -}}

{{/*
The first DNS label of the domain (secret.vgijssel.nl -> "secret", network.vgijssel.nl ->
"network"). Used as the stable, per-cluster suffix for BOTH the domain Workspace's
metadata.name AND the opentofu resource addresses inside its module — so a given cluster's
rendered Workspace + tofu state keys are IDENTICAL before and after this chart takes ownership,
letting opentofu ADOPT existing state instead of destroying/recreating the
netbird_reverse_proxy_domain (see the secret migration, tasks/plan.md Phase 2 / Risk #1).
*/}}
{{- define "netbird-reverse-proxy-shared.label" -}}
{{- .Values.domain | splitList "." | first -}}
{{- end -}}
