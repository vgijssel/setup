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
The Gateway's name — and therefore the name of every resource Envoy Gateway creates for it.

`-mesh` suffixed rather than bare `<name>`, and that is LOAD-BEARING, not cosmetic. The control
plane runs with `deploy.type: GatewayNamespace` (see ../../envoy-gateway/values.yaml for why),
which names the data-plane ServiceAccount, Deployment and Service after the GATEWAY, in the
Gateway's own namespace. A mesh-service release deliberately sits in the namespace of the Service
it publishes, so a Gateway named `<name>` collides head-on with the very workload it fronts: the
`openbao` exposure tried to create ServiceAccount `secret/openbao`, which the OpenBao StatefulSet
already owns.

The failure is quiet in the worst way. Envoy Gateway refuses to adopt a resource it does not own
("resource already exists and is not owned by this Gateway, skipping"), aborts infra creation, and
never builds the data-plane Deployment at all — so the Gateway reports `Accepted=True` with every
listener `Programmed=True`, and only the top-level `Programmed=False / AddressNotAssigned` hints
that nothing is serving. The Certificate goes Ready regardless, so the exposure looks almost
healthy while answering on no port. Had it got as far as the Service, the name it wanted was the
backing Service's own.

So: never name the Gateway after the service alone. Every other resource in this chart already
carries the suffix.
*/}}
{{- define "mesh-service.gatewayName" -}}
{{- printf "%s-mesh" .Values.name -}}
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
    {{- if $l.backend.tls }}
    {{- if ne $l.protocol "HTTPS" }}
    {{- fail (printf "mesh-service: listener %q sets backend.tls on protocol %s; re-encryption applies only to HTTPS listeners (TLS passes through untouched, TCP/UDP carry no TLS of their own)" $l.name (toString $l.protocol)) }}
    {{- end }}
    # Re-encrypt to a TLS-terminating backend. Carried through verbatim so
    # backendtlspolicy-mesh-service.yaml can render a policy per affected listener; this helper
    # normalises listeners, so anything it does not copy is silently invisible downstream.
    tls:
      {{- toYaml $l.backend.tls | nindent 6 }}
    {{- end }}
{{- end }}
{{- end }}
{{- end -}}

{{/*
The ports this service declares for one protocol, as seen from the mesh. `protocols` in NetBird
policy terms are only tcp/udp, so HTTPS and TLS listeners both count as tcp.

Used by workspace-policy-mesh-service.yaml to derive the access policy from the listeners instead
of restating the ports — the spec's "undeclared port is not reachable" holds by construction
rather than by remembering to keep two lists in sync.
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
{{/* No sort: `sortAlpha` would stringify the ports, and the caller needs them as numbers it
     can format itself. Declaration order is deterministic, which is all a stable render needs. */}}
{{- $ports | uniq | toJson -}}
{{- end -}}

{{/*
Label stamped on every resource belonging to one exposure, including the Envoy data-plane pod,
so a service's resources are greppable as a unit.

It used to also be a pod SELECTOR, read by a SidecarProfile to decide which pod to inject the
mesh client into. That injection is gone (the chart runs the client itself — see
envoyproxy-mesh-service.yaml), so this is now identification only.
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
