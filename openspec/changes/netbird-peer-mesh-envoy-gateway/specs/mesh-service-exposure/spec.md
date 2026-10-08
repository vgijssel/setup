# Spec Delta

## Purpose

Publishing an in-cluster Kubernetes Service into the NetBird overlay as a dedicated mesh peer, reachable at a flat, cluster-agnostic hostname with a publicly-trusted certificate and its own complete TCP/UDP port space. A mesh hostname is not publicly resolvable by default; a service whose consumers include devices that cannot run a mesh client MAY opt into publishing its overlay address publicly, which keeps those devices on the same hostname as every mesh peer rather than giving them a parallel one.

## ADDED Requirements

### Requirement: Flat mesh hostname per exposed service

Every exposed service SHALL be reachable at `<service>.<peer-dns-domain>`, where `<peer-dns-domain>` is the NetBird account's configured peer DNS domain (`vpn.blueora.ng`). The hostname SHALL NOT encode the cluster, namespace, or any other placement detail, and service names SHALL be unique across all clusters in the account.

#### Scenario: Service name resolves inside the mesh

- **WHEN** a peer enrolled in the account queries `openbao.vpn.blueora.ng`
- **THEN** the NetBird resolver returns the overlay address of the peer publishing that service

#### Scenario: Placement is not part of the name

- **WHEN** a service is moved from one cluster to another with its name unchanged
- **THEN** consumers continue to reach it at the same hostname with no configuration change

#### Scenario: Name collision is rejected

- **WHEN** two services in different clusters are configured with the same name
- **THEN** the collision is detectable before rollout, because a single name resolving to two peers round-robins between them rather than failing loudly

### Requirement: Each exposed service owns its full port space

Each exposed service SHALL be published on its own overlay address, so that the TCP and UDP port numbers it uses are independent of every other exposed service. A service SHALL be reachable on the exact port numbers it declares, including privileged ports, with no port translation visible to clients.

#### Scenario: Two services both use the same port

- **WHEN** two different services are each exposed on TCP port 443
- **THEN** both are reachable on port 443 at their own hostnames, with no arbitration, remapping, or shared listener between them

#### Scenario: Declared privileged port is the observed port

- **WHEN** a service declares an HTTPS listener on port 443
- **THEN** a client connecting to `<service>.<peer-dns-domain>:443` is served, and no alternate port (such as a shifted unprivileged port) is required or exposed

#### Scenario: Raw TCP and UDP alongside HTTPS

- **WHEN** a service declares an HTTPS listener plus raw TCP ports and raw UDP ports
- **THEN** all three are reachable at the same hostname on their declared port numbers

### Requirement: Publicly-trusted certificate without public resolvability

Each exposed service SHALL serve a certificate issued by a publicly-trusted authority for its mesh hostname, such that a standard client validates it with no name mismatch, no trust override, and no login interstitial. A mesh hostname SHALL NOT resolve from the public internet unless the service explicitly opts in under "Non-peer devices reach the service at the mesh hostname" below, and opting in SHALL remain a per-service choice rather than a property of the domain.

#### Scenario: Client validates the certificate with no override

- **WHEN** a mesh peer requests `https://openbao.vpn.blueora.ng` with default trust settings
- **THEN** the TLS handshake succeeds against the public root store, and no certificate warning or interstitial is presented

#### Scenario: Hostname does not resolve publicly by default

- **WHEN** `openbao.vpn.blueora.ng` — a service that has not opted in — is queried against a public resolver
- **THEN** no address record is returned

#### Scenario: Certificate issuance does not publish the name

- **WHEN** a certificate is issued or renewed for a mesh hostname
- **THEN** issuance completes using only a temporary DNS challenge record, and no address record for the hostname is created at any point

#### Scenario: No wildcard makes mesh names public

- **WHEN** the public zone containing the peer DNS domain is inspected
- **THEN** it contains no wildcard **address record**, because a wildcard answers at arbitrary label depth and would make every mesh hostname publicly resolvable and let public DNS override the mesh resolver
- **AND** any address record that is present is an explicit per-service record created by that service's own opt-in, so the set of publicly resolvable mesh names is enumerable from the zone rather than implied by it
- **NOTE** this constrains DNS records only, and says nothing about certificates. A wildcard *certificate* for the peer DNS domain publishes no address record and is therefore permitted — it is in fact what the implementation uses, because it keeps individual service names out of public Certificate Transparency logs as well

### Requirement: Access restricted to explicitly named peer groups

An exposed service SHALL be reachable only by peers belonging to source groups named explicitly in that service's configuration, and only on the protocols and ports it declares. Access SHALL NOT be granted implicitly by virtue of a peer being enrolled in the account.

#### Scenario: Peer in an allowed group reaches the service

- **WHEN** a peer in a group named in the service's allowed sources connects on a declared port
- **THEN** the connection succeeds

#### Scenario: Enrolled peer outside the allowed groups is denied

- **WHEN** a peer enrolled in the account but not in any allowed source group connects
- **THEN** the connection is refused

#### Scenario: Undeclared port is not reachable

- **WHEN** a peer in an allowed group connects to a port the service did not declare
- **THEN** the connection is refused

#### Scenario: Off-mesh client cannot reach the service

- **WHEN** a client that is not enrolled in the account attempts to reach the service
- **THEN** it can neither resolve the hostname nor route to the overlay address

### Requirement: Stable identity across pod replacement

A service's mesh hostname SHALL remain bound to exactly one healthy peer across restarts, rollouts, and rescheduling of the workload that publishes it. The hostname SHALL NOT depend on any generated pod or instance name.

#### Scenario: Rollout preserves the hostname

- **WHEN** the workload publishing a service is replaced
- **THEN** the hostname resolves to the replacement peer once it is ready, with no change to consumer configuration

#### Scenario: No split resolution during replacement

- **WHEN** a replacement is in progress
- **THEN** the hostname does not resolve to both the outgoing and incoming peer simultaneously, so consumers are never load-balanced onto a terminating instance

#### Scenario: Retired peers do not linger

- **WHEN** a publishing workload is deleted
- **THEN** its peer is reaped from the account rather than accumulating as a stale registration holding the hostname

### Requirement: Recovery from a wedged mesh client

A published service SHALL recover automatically when the mesh client that gives it peer identity loses its session and cannot re-establish it on its own.

#### Scenario: Wedged session is detected and recovered

- **WHEN** a publishing peer's mesh session enters a state it cannot recover from, such as after the host is suspended and resumed
- **THEN** the condition is detected from the client's reported state rather than its exit status, and the publishing workload is recycled so the service becomes reachable again without manual intervention

### Requirement: Cross-cluster consumption over the mesh

A workload in one cluster SHALL be able to consume a service exposed by another cluster using only the service's mesh hostname, with no reverse proxy, no shared load balancer, no public DNS record, and no cluster-specific address.

#### Scenario: Secret consumer reads across clusters

- **WHEN** the network cluster's secret consumer is configured with the OpenBao mesh hostname
- **THEN** it authenticates and reads secrets over the overlay, validating the publicly-trusted certificate

#### Scenario: Consumer needs no knowledge of placement

- **WHEN** a consumer is configured
- **THEN** it references only the flat mesh hostname, and nothing in its configuration identifies which cluster serves it

### Requirement: Consumers that cannot join the mesh

Where a consumer cannot itself become a mesh peer, the capability SHALL provide a path to an exposed service that preserves end-to-end TLS to the service's own hostname and certificate, rather than downgrading the connection or terminating TLS at an intermediary.

#### Scenario: Non-peer consumer reaches a mesh service over HTTPS

- **WHEN** a consumer that must not become a mesh peer is configured with an exposed service's `https://` hostname
- **THEN** the request is resolved locally to a forwarder, relayed to the publishing peer without TLS termination, and the consumer validates the service's own certificate for that hostname

#### Scenario: Local resolution does not weaken validation

- **WHEN** the hostname resolves to a different address inside the consumer's cluster than it does on the mesh
- **THEN** both paths terminate at the same certificate for that hostname, so the local override does not require disabling verification

### Requirement: Non-peer devices reach the service at the mesh hostname

Where physical devices cannot run a mesh client, they SHALL reach the service at the SAME `<service>.<peer-dns-domain>` hostname that mesh peers use, rather than at a parallel hostname. The service SHALL opt in per-service to publishing its current overlay address as a public address record, and the devices SHALL reach that address by being routed to the overlay through a routing peer on their own network. No in-cluster address SHALL be pinned, advertised as a network resource, or split-horizoned to serve the device path.

#### Scenario: Device and mesh peer use one hostname

- **WHEN** a service serves both mesh peers and non-peer physical devices
- **THEN** both are configured with `<service>.<peer-dns-domain>`, and nothing in either consumer's configuration identifies which path it takes

#### Scenario: Published address tracks the peer

- **WHEN** the workload publishing an opted-in service is replaced and its peer is assigned a new overlay address
- **THEN** the public address record is updated to the new address without manual action, and the update is driven by the replacement itself rather than discovered by a periodic scan

#### Scenario: Published address is withdrawn with the peer

- **WHEN** an opted-in service's publishing workload is torn down
- **THEN** its public address record is removed, so the hostname does not resolve publicly to an address no peer holds

#### Scenario: Public record does not shadow the mesh resolver

- **WHEN** a mesh peer resolves an opted-in service's hostname while a public address record for that same name exists
- **THEN** the peer receives the mesh resolver's answer, so publishing the record changes nothing for peers

#### Scenario: Opt-in is recorded, not implied

- **WHEN** a service publishes its overlay address publicly
- **THEN** the opt-in is declared in that service's own exposure values with its reason, rather than being enabled by default or inferred from the presence of devices

### Requirement: Adding an exposure is a single declarative unit

Exposing a new service SHALL require declaring only its name, its allowed source groups, and its listeners with their backing Service ports. All supporting resources SHALL be derived from that declaration rather than hand-assembled per service.

#### Scenario: New service is exposed from one declaration

- **WHEN** a new exposure declares a name, allowed source groups, and listeners
- **THEN** the hostname, certificate, peer identity, access policy, routes, and recovery behaviour are all provisioned from that declaration with no additional per-service resources authored by hand

#### Scenario: Incomplete declaration fails fast

- **WHEN** an exposure omits its name or its domain
- **THEN** rendering fails with a clear error, rather than producing a certificate or DNS label built from an empty value
