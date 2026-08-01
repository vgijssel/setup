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
