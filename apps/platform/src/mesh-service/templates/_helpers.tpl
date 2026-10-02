{{/*
Fail-fast validation of the required parameters. Included at the top of every template that
consumes them, so a bundle that forgets one fails to RENDER (loudly) rather than producing a
certificate for a bare `.<domain>`, a NetBird DNS label built from an empty string, or a Gateway
with no listeners that would look healthy while answering nothing.
*/}}
{{- define "mesh-service.validate" -}}
{{- if not .Values.name -}}
{{- fail "mesh-service: .Values.name is required (the flat mesh service name, e.g. openbao)" -}}
{{- end -}}
{{- if not .Values.domain -}}
{{- fail "mesh-service: .Values.domain is required (the NetBird account peer DNS domain, e.g. vpn.blueora.ng)" -}}
{{- end -}}
{{- if not .Values.listeners -}}
{{- fail "mesh-service: .Values.listeners is required and must declare at least one listener — a service with no listener answers on no port" -}}
{{- end -}}
{{- if not .Values.sourceGroups -}}
{{- fail "mesh-service: .Values.sourceGroups is required — an exposure with no allowed source group is reachable by nobody, which is never the intent" -}}
{{- end -}}
{{- end -}}

{{/*
The service's mesh hostname: <name>.<domain>. The certificate SAN, the Gateway listener hostname
and the name consumers configure are all THIS, computed once so they cannot drift apart.
*/}}
{{- define "mesh-service.fqdn" -}}
{{- printf "%s.%s" .Values.name .Values.domain -}}
{{- end -}}

{{/*
This service's own NetBird group — the destination group of its access policies and the group its
peer is enrolled into by the setup key. Prefixed so a service group can never be confused with
the long-lived peer groups (homelab, roaming, secret-k8s, network-k8s) that appear as SOURCES.
*/}}
{{- define "mesh-service.group" -}}
{{- printf "svc-%s" .Values.name -}}
{{- end -}}

{{/*
Normalise `listeners` into a flat list of one entry PER PORT, since Gateway API has no port-range
concept: a listener declaring `ports: [29811, 29812]` becomes two listeners, each with its own
sectionName and its own route. Emitted as YAML for the caller to re-parse (`fromYamlArray`).

Each normalised entry has:
  name      <listener name> for a single port, <listener name>-<port> when a list was expanded
  protocol  as declared
  port      the listener (mesh-facing) port
  backend   {name, port}, where an omitted backend.port defaults to the listener port

Fails on a listener that declares neither `port` nor `ports`, on one that declares both, and on a
missing backend name — all of which would otherwise render a listener that binds nothing.
*/}}
{{- define "mesh-service.listeners" -}}
{{- range $l := .Values.listeners }}
{{- if and $l.port $l.ports }}
{{- fail (printf "mesh-service: listener %q sets both `port` and `ports` — use one or the other" $l.name) }}
{{- end }}
{{- if not (or $l.port $l.ports) }}
{{- fail (printf "mesh-service: listener %q sets neither `port` nor `ports`" $l.name) }}
{{- end }}
{{- if not (and $l.backend $l.backend.name) }}
{{- fail (printf "mesh-service: listener %q has no `backend.name` (the in-cluster Service to forward to)" $l.name) }}
{{- end }}
{{- if not (has $l.protocol (list "HTTPS" "TLS" "TCP" "UDP")) }}
{{- fail (printf "mesh-service: listener %q has protocol %q; must be one of HTTPS, TLS, TCP, UDP" $l.name (toString $l.protocol)) }}
{{- end }}
{{- $ports := $l.ports | default (list $l.port) }}
{{- $multi := gt (len $ports) 1 }}
{{- range $p := $ports }}
- name: {{ if $multi }}{{ printf "%s-%v" $l.name $p }}{{ else }}{{ $l.name }}{{ end }}
  protocol: {{ $l.protocol }}
  port: {{ $p }}
  backend:
    name: {{ $l.backend.name }}
    port: {{ $l.backend.port | default $p }}
{{- end }}
{{- end }}
{{- end -}}

{{/*
The ports this service declares for one protocol, as seen from the mesh. `protocols` in NetBird
policy terms are only tcp/udp, so HTTPS and TLS listeners both count as tcp.

Used by nbpolicy-mesh-service.yaml to derive the access policy from the listeners instead of
restating the ports — the spec's "undeclared port is not reachable" holds by construction rather
than by remembering to keep two lists in sync.
*/}}
{{- define "mesh-service.portsFor" -}}
{{- $proto := .proto -}}
{{- $want := ternary (list "UDP") (list "HTTPS" "TLS" "TCP") (eq $proto "udp") -}}
{{- $ports := list -}}
{{- range $l := .listeners -}}
{{- if has $l.protocol $want -}}
{{- $ports = append $ports $l.port -}}
{{- end -}}
{{- end -}}
{{/* No sort: `sortAlpha` would stringify the ports and NBPolicy.spec.ports is []integer.
     Declaration order is deterministic, which is all that matters for a stable render. */}}
{{- $ports | uniq | toJson -}}
{{- end -}}

{{/*
Label stamped on the Envoy data-plane POD by the EnvoyProxy, and selected by the SidecarProfile
so the NetBird client is injected into exactly this service's proxy. Defined once because a
mismatch between the two is silent: the pod comes up healthy with no mesh client, so the service
is simply unreachable with nothing reporting an error.
*/}}
{{- define "mesh-service.podLabelKey" -}}
mesh.vgijssel.nl/service
{{- end -}}

{{/*
Common labels. `mesh.vgijssel.nl/service` also identifies every resource belonging to one
exposure, which is what makes a service's resources greppable as a unit.
*/}}
{{- define "mesh-service.labels" -}}
app.kubernetes.io/name: mesh-service
app.kubernetes.io/instance: {{ .Values.name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{ include "mesh-service.podLabelKey" . }}: {{ .Values.name }}
{{- end -}}
