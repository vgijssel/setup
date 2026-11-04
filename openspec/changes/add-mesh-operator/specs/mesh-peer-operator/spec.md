# Spec Delta

## Purpose

Provides a declarative, continuously reconciled lifecycle for mesh peers, so that exposing a service
and granting it mesh egress are cluster resources rather than hand-assembled manifests. Its central
obligation is that the misconfigurations which otherwise fail silently — unapplied DNS configuration,
colliding ports, clobbered shared state, a data plane that starts before it can resolve — are either
impossible to express or visibly reported.

## ADDED Requirements

### Requirement: A mesh peer is one declarative resource

Declaring a mesh peer SHALL require only its mesh name, its published listeners with their backing
Service ports, and the destinations it may call. Every supporting resource SHALL be derived from that
declaration. A declaration that cannot produce a working peer SHALL be rejected when submitted, rather
than accepted and reconciled into a broken state.

#### Scenario: A new peer is created from one declaration

- **WHEN** a mesh peer resource declaring a name, listeners, and destinations is created
- **THEN** its data plane, forwarder, mesh identity, and name resolution entries are all provisioned
  from that declaration with no additional per-service resources authored by hand

#### Scenario: An incomplete declaration is rejected

- **WHEN** a mesh peer resource omits its name, or declares a listener with no backing Service port
- **THEN** the resource is rejected with an error naming the missing field, rather than producing an
  identity or hostname built from an empty value

#### Scenario: Declared state is reported against observed state

- **WHEN** a mesh peer has been reconciled
- **THEN** its status reports whether each derived part is in effect, so "declared" and "working" are
  distinguishable without inspecting the cluster by hand

### Requirement: A mesh peer names the mesh it belongs to

A mesh peer SHALL belong to exactly one declared mesh, identified by a cluster-scoped resource that
carries the account endpoint, its credentials, and the peer DNS domain. Because an account provides
exactly one peer DNS domain, one such resource corresponds to one account. The reference SHALL be
optional where the cluster declares a default, so that the common single-mesh case needs no reference.

#### Scenario: Omitted reference resolves to the default

- **WHEN** a mesh peer omits its mesh reference and exactly one declared mesh is marked default
- **THEN** it is reconciled against that mesh

#### Scenario: An ambiguous default is rejected

- **WHEN** more than one declared mesh is marked default
- **THEN** the conflict is rejected, rather than resolved by an arbitrary choice

#### Scenario: A peer cannot span two meshes

- **WHEN** a mesh peer is declared
- **THEN** it resolves to exactly one mesh, because its hostname is only meaningful within one peer DNS
  domain

### Requirement: Credentials are read from a referenced secret and honoured when rotated

Account credentials SHALL be referenced rather than embedded in the resource, so they can be supplied
and rotated by an external secret store. A rotated credential SHALL take effect without restarting the
operator.

#### Scenario: Credentials are referenced, not inlined

- **WHEN** a declared mesh is created
- **THEN** it names a secret holding the account credential, and the credential value does not appear
  in the resource

#### Scenario: A rotated credential is picked up

- **WHEN** the referenced secret's credential is replaced with a newly issued one
- **THEN** subsequent account operations use the new credential without an operator restart

#### Scenario: Insufficient credential privilege is reported

- **WHEN** the referenced credential lacks the privilege required to create the peer's identity group
- **THEN** that is reported on the declared mesh as a distinct, named failure, rather than surfacing
  only as a failure of the first peer that needs it

### Requirement: Egress ports are allocated by the system, never declared

The container ports that implement a service's egress SHALL be allocated from a cluster-scoped pool and
reported in status. They SHALL NOT be settable in the declaration. Each distinct destination-and-port
pair SHALL receive a port that is unique within the cluster.

#### Scenario: Allocated ports are reported

- **WHEN** a mesh peer declaring destinations is reconciled
- **THEN** its status reports which container port was allocated for each destination-and-port pair

#### Scenario: Two peers never collide

- **WHEN** two mesh peers in the same cluster each declare destinations
- **THEN** no allocated container port is shared between them

#### Scenario: Pool exhaustion is reported, not silently wrapped

- **WHEN** the pool has no free port for a new destination
- **THEN** the condition is reported as exhaustion, and no existing allocation is reassigned

### Requirement: Shared DNS configuration is written per entry, under ownership

Where name resolution entries are published into a configuration object that the cluster or other
operators also use, the system SHALL own only its own entry. It SHALL NOT remove or overwrite entries
owned by anyone else, and SHALL fail closed rather than taking an entry already owned by another writer.

#### Scenario: A foreign entry is preserved

- **WHEN** the system publishes its entry into a configuration object that already contains an entry
  written by someone else
- **THEN** both entries are present afterwards, and the foreign entry's content is unchanged

#### Scenario: A contested entry fails closed and is reported

- **WHEN** the entry the system is configured to write is already owned by another writer
- **THEN** the write is refused, the conflict is reported naming the other owner, and the existing
  content is left intact

#### Scenario: Removing the last peer removes only the system's entry

- **WHEN** the last mesh peer in a cluster is deleted
- **THEN** the system's own entry is removed and any foreign entries remain, and the configuration
  object itself is not deleted

#### Scenario: Stale entries do not survive

- **WHEN** a mesh peer is deleted while the system is not running, and the system later resumes
- **THEN** the resulting entry reflects only the mesh peers that currently exist, because the entry is
  regenerated from the full set rather than edited incrementally

### Requirement: The resolver wiring is verified continuously, not assumed

Publishing a name resolution entry does not make it effective. The system SHALL verify that its entry
is actually consumed by the cluster's DNS server, SHALL report the specific reason when it is not, and
SHALL re-verify on an ongoing basis because the wiring can be removed after it was once correct.

#### Scenario: Configuration present but not consumed is reported

- **WHEN** the system's entry is published but the cluster's DNS server does not consume that
  configuration object
- **THEN** the system reports that the wiring is absent, rather than reporting success because the
  write succeeded

#### Scenario: Wiring removed after being correct is detected

- **WHEN** the cluster's DNS server is reverted by its own management, so the configuration object is
  no longer consumed while the entry itself remains present and correct
- **THEN** the system detects this on a subsequent check and reports it, rather than remaining healthy
  because it verified once at creation

#### Scenario: A port mismatch is reported as such

- **WHEN** the published entry declares a different listening port than the cluster's DNS server
  actually uses
- **THEN** the system reports a port mismatch by name, rather than reporting a generic resolution
  failure

#### Scenario: An entry name that cannot be consumed is rejected

- **WHEN** the configured entry name would not be picked up by the cluster DNS server's configured
  inclusion pattern
- **THEN** the declaration is rejected, rather than written successfully and never consumed

#### Scenario: The listening port is derived, not configured

- **WHEN** a declared mesh is reconciled in clusters whose DNS servers listen on different ports
- **THEN** the correct port is determined from the cluster rather than being required in the
  declaration, so the same declaration is portable between them

### Requirement: Name shadowing by an existing entry is detected

A mesh peer's hostname SHALL NOT be silently overridden by a more specific resolution entry published
elsewhere in the same configuration object. The system SHALL detect such an overlap and report or
reject it.

#### Scenario: A more specific foreign entry is detected

- **WHEN** a mesh peer's hostname falls within a zone declared by a foreign entry that is more specific
  than the system's own
- **THEN** the overlap is reported or rejected, rather than the peer being reconciled as healthy while
  its name is answered by the foreign entry

### Requirement: Access policy is not owned by the system

The system SHALL create and maintain each peer's own identity group, because identity is required for
the peer to exist. It SHALL NOT create, modify, or delete the policies that grant other peers reach to
it. Because reachability then depends on state the system does not own, the system SHALL report whether
any policy grants reach to each peer.

#### Scenario: Identity is created and reused

- **WHEN** a mesh peer is reconciled and an identity group of the expected name already exists
- **THEN** the existing group is adopted rather than a duplicate being created

#### Scenario: A peer with no granting policy is reported, not silently unreachable

- **WHEN** a mesh peer is fully reconciled but no access policy grants any peer group reach to it
- **THEN** that is reported on the peer, so an unreachable service is distinguishable from a
  misconfigured one

#### Scenario: Policies are left alone

- **WHEN** access policies naming a peer's identity group are changed outside the system
- **THEN** the system does not revert, duplicate, or remove them

### Requirement: The data plane does not start before it can resolve its destinations

A peer's data plane SHALL NOT begin serving until mesh name resolution is available to it, because a
data plane started earlier may fail to resolve its destinations permanently and without reporting an
error. Failure to reach that state SHALL be surfaced as a failure rather than producing a running
instance that cannot reach anything.

#### Scenario: Start is ordered after resolution works

- **WHEN** a peer's pod starts
- **THEN** its data plane begins serving only after a declared destination hostname resolves
  successfully from inside that pod

#### Scenario: Egress is never silently dead

- **WHEN** a peer reports itself ready
- **THEN** each declared destination has at least one resolved endpoint, so a ready peer with
  unreachable destinations is not a representable state

#### Scenario: Inability to resolve fails loudly

- **WHEN** mesh name resolution does not become available within a bounded time
- **THEN** the pod fails and reports that reason, rather than starting a data plane that cannot resolve

### Requirement: Certificate renewal does not interrupt the service

A renewed certificate SHALL be served without replacing the peer's pod, because the peer's hostname is
bound to exactly one pod and replacing it interrupts the service in both directions.

#### Scenario: A renewed certificate is served without a restart

- **WHEN** the certificate material a peer serves is replaced with a renewed one
- **THEN** the peer serves the renewed certificate without its pod being replaced or restarted

#### Scenario: Renewal is not a rollout

- **WHEN** a certificate is renewed
- **THEN** the peer's egress path is uninterrupted, because no pod replacement occurs

### Requirement: The system is installable on clusters whose DNS server offers no inclusion hook

Where a cluster's DNS server provides no mechanism to include externally supplied configuration, the
system SHALL report that as a named, actionable prerequisite rather than failing opaquely, and SHALL
become fully functional once that prerequisite is satisfied.

#### Scenario: A missing inclusion hook is reported with its remedy

- **WHEN** a declared mesh is reconciled in a cluster whose DNS server includes no externally supplied
  configuration
- **THEN** the system reports the missing prerequisite distinctly from other wiring failures, together
  with what must be configured to satisfy it

#### Scenario: Satisfying the prerequisite needs no change to the declaration

- **WHEN** the cluster operator adds the inclusion hook
- **THEN** the declared mesh becomes healthy with no edit to the mesh or peer resources
