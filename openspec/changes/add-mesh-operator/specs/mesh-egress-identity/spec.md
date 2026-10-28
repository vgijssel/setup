# Spec Delta

## Purpose

Lets a service reach *other* mesh services through its own mesh peer, so the overlay sees one identity
for that service in both directions and access can be expressed as "service A connects to service B on
port Y" rather than "the cluster connects to B". Which workloads count as that service is decided by
workload identity, not by network address.

## ADDED Requirements

### Requirement: Outbound mesh traffic leaves through the service's own peer

A service's declared consumer workloads SHALL reach other mesh services through the mesh peer that
publishes that same service, so the service presents a single identity in both directions. Consumer
workloads SHALL reference a destination only by its mesh hostname and port, with no overlay address,
cluster address, or placement detail in their configuration.

#### Scenario: Consumer reaches a service published by another cluster

- **WHEN** a declared consumer of service A requests a destination mesh hostname that is published by a
  peer in a different cluster
- **THEN** the request is served, and the traffic reaches that destination over the overlay rather than
  by any in-cluster path

#### Scenario: Destination attributes the traffic to the service, not the pod

- **WHEN** a declared consumer of service A connects to service B
- **THEN** service B's peer observes the connection as originating from service A's peer identity,
  regardless of which consumer pod made it

#### Scenario: Every consumer replica behaves identically

- **WHEN** a service has many consumer replicas and each is exercised individually
- **THEN** every replica reaches the destination, because consumers are selected by workload identity
  rather than by a per-pod or per-address registration

### Requirement: Destination names resolve only for declared consumers

A destination mesh hostname SHALL resolve, inside a cluster, only for workloads that carry the identity
declared for that service's egress. Identity SHALL be expressed as workload labels, and SHALL NOT
depend on the consumer's address, address range, or namespace partitioning.

#### Scenario: Declared consumer resolves the destination

- **WHEN** a workload carrying the declared identity resolves a destination mesh hostname
- **THEN** it receives an address that routes to that service's egress path

#### Scenario: Undeclared workload in the same namespace does not resolve

- **WHEN** a workload in the same namespace and the same flat address range, differing from a declared
  consumer only by not carrying the declared identity, resolves the same destination mesh hostname
- **THEN** resolution fails with a name error, and no address is returned

#### Scenario: Identity is not inferable from placement

- **WHEN** consumer and non-consumer workloads share one address range with no per-identity
  partitioning
- **THEN** the distinction still holds, because resolution is decided from workload identity rather
  than from the requester's address

### Requirement: Unmatched consumers are denied by default

Resolution of mesh hostnames inside a cluster SHALL fail closed. There SHALL be no fallback path by
which a workload that does not match any declared consumer identity obtains a working answer for a mesh
hostname.

#### Scenario: No fallback answers a mesh hostname

- **WHEN** a workload matching no declared consumer identity resolves any mesh hostname
- **THEN** it receives a name error rather than an address obtained from another resolver, so the set
  of declared consumers is the complete allowlist

#### Scenario: A failed identity match cannot become a working connection

- **WHEN** a workload's identity does not match
- **THEN** it cannot reach the destination by any route, so a non-match is observably a denial rather
  than a silently working direct connection

### Requirement: Egress carries any protocol, selected by port

A service's declared destinations SHALL be reachable over raw TCP, raw UDP, and TLS-terminating
protocols through the same egress path. Because a destination's identity is not recoverable from the
connection for every protocol, destinations SHALL be distinguished by port, and the consumer-visible
port SHALL be the destination's real port.

#### Scenario: Raw TCP destination

- **WHEN** a declared consumer opens a raw TCP connection to a declared destination hostname and port
- **THEN** the connection is served end to end with no TLS anywhere in the path

#### Scenario: Raw UDP destination

- **WHEN** a declared consumer sends a datagram to a declared destination hostname and port
- **THEN** the datagram is delivered and the reply returns, with no reliance on any name or protocol
  signal inside the payload

#### Scenario: One resolution serves every declared port

- **WHEN** a declared consumer resolves a destination hostname once and then connects to several
  declared ports of different protocols
- **THEN** all of them are served from that single answer, because naming is independent of protocol

### Requirement: End-to-end TLS is preserved through the egress path

Where a destination terminates TLS, the egress path SHALL NOT terminate or re-encrypt it. The consumer
SHALL validate the destination's own certificate for the destination's own hostname, against the
public trust store, with no verification override.

#### Scenario: Consumer validates the destination's certificate

- **WHEN** a declared consumer makes an HTTPS request to a declared destination hostname
- **THEN** the TLS session terminates at the destination's peer, and the consumer validates a
  certificate naming that hostname without disabling or relaxing verification

#### Scenario: Egress path cannot read the payload

- **WHEN** a TLS destination is reached through the egress path
- **THEN** the egress path forwards the session without possessing a key for the destination's
  hostname, so it never observes the plaintext

### Requirement: Consumer workloads hold no independent route onto the overlay

Consumer workloads SHALL NOT be able to reach the overlay except through their service's egress path,
so that every mesh byte attributable to the service genuinely carries the service's identity.

#### Scenario: Direct connection to a destination's overlay address fails

- **WHEN** a declared consumer attempts to connect directly to a destination's overlay address
- **THEN** the attempt fails, confirming that a successful request through the mesh hostname exercised
  the egress path rather than bypassing it

### Requirement: Egress listeners are not reachable from the mesh

The listeners that implement a service's egress SHALL NOT be reachable from the overlay. A peer
permitted to reach the service's published ports SHALL NOT thereby be able to use the service's egress
listeners to reach that service's destinations.

#### Scenario: A permitted peer cannot relay through the egress listeners

- **WHEN** a mesh peer that is permitted to reach a service's published ports, but has no permission to
  reach that service's destinations, attempts to connect to the service's egress listeners
- **THEN** the attempt fails, and it does not reach any destination

#### Scenario: Relay prevention does not depend on access policy hygiene

- **WHEN** the access policy granting a peer reach to the service's published ports is broader than the
  declared ports
- **THEN** the egress listeners remain unreachable from the overlay regardless, because they are not
  exposed on the overlay at all

### Requirement: Datagram size limit is discoverable

Because the overlay reduces the usable path size and oversized datagrams are discarded without
notifying the sender, the maximum datagram payload that traverses the overlay intact SHALL be
discoverable from the system rather than found by trial.

#### Scenario: Limit is reported

- **WHEN** a service declares a UDP destination or a UDP published port
- **THEN** the maximum intact datagram payload size for that path is reported, so a consumer protocol
  can be sized against a stated number

#### Scenario: Oversized datagrams are known to be silently dropped

- **WHEN** a datagram larger than the reported limit is sent through the path
- **THEN** it does not arrive, and no error is returned to the sender, which is why the limit is
  published rather than discovered from failures
