# Spec Delta

## Purpose

How a versioned artifact produced by this monorepo gets its version decided, published exactly
once, and propagated to the in-repo consumers that pin it. Several artifacts are released
independently from one repository, so version decisions must be routed per artifact, and
publishing must converge against the registry rather than against a diff window — a release
pipeline that cannot be safely re-run is a release pipeline that silently publishes nothing.

## ADDED Requirements

### Requirement: Version decisions are derived from commit history and routed by file path

Each releasable package SHALL have its next version derived from the conventional-commit types
of the commits that touched **its own files** since its last release. A commit SHALL affect only
the packages whose files it modifies, regardless of the scope written in the commit subject.

#### Scenario: A change to one package bumps only that package

- **WHEN** a `fix:`-typed commit modifies files under one releasable package only
- **THEN** a version bump is proposed for that package and for no other

#### Scenario: A change to two packages bumps both

- **WHEN** a single commit modifies files under two releasable packages
- **THEN** a version bump is proposed for each of them

#### Scenario: Commit subject scope does not route the change

- **WHEN** a commit's subject names a scope that does not correspond to the package whose files
  it modifies
- **THEN** the version bump is still attributed to the package whose files changed

#### Scenario: A non-releasable commit type produces no bump

- **WHEN** the only commits touching a package since its last release are of a type that does
  not denote a user-visible change
- **THEN** no version bump is proposed and no new artifact is published

### Requirement: Multiple packages release together with independent versions

Version decisions for all releasable packages SHALL be presented as a single reviewable unit,
while each package retains its own version number and its own release tag. Approving that unit
SHALL release every package it covers.

#### Scenario: Two packages release from one approval

- **WHEN** two releasable packages each have outstanding releasable changes
- **THEN** both version bumps appear in one reviewable unit, and approving it produces a
  distinct release tag per package

#### Scenario: Versions do not move in lockstep

- **WHEN** one package has a feature-level change and the other a fix-level change in the same
  release
- **THEN** each package's version advances by its own increment, and a package with no changes
  does not advance at all

#### Scenario: Release tags identify their package

- **WHEN** a release tag is created
- **THEN** the tag identifies which package it releases, so two packages releasing at the same
  version do not collide

### Requirement: Each package has a single source of version truth

The version a build publishes SHALL be read from exactly one declared location per package.
No build SHALL carry a fallback or default version.

#### Scenario: Published tag matches the declared version

- **WHEN** a package's declared version is `X` and its publish step runs
- **THEN** the artifact is published at tag `X`

#### Scenario: A missing version fails the build

- **WHEN** the publish step runs and the declared version cannot be read
- **THEN** the step fails with a non-zero exit, and no artifact is published

#### Scenario: Version is not restated elsewhere

- **WHEN** a package's version is advanced
- **THEN** no other file inside the package has to be edited for the publish step to target the
  new version

### Requirement: Publishing is idempotent against the registry

The registry SHALL be the source of truth for whether a version has already shipped. Before
publishing, the publish step SHALL probe the registry for the target reference and SHALL take no
action when it is already present.

#### Scenario: Already-published version is skipped

- **WHEN** the publish step runs for a version whose artifact already exists in the registry
- **THEN** no build or push occurs, and the step exits successfully

#### Scenario: Absent version is published

- **WHEN** the publish step runs for a version that does not exist in the registry
- **THEN** the artifact is built and pushed at that version

#### Scenario: Repeated runs converge

- **WHEN** the publish step is run repeatedly against unchanged repository state
- **THEN** only the first run pushes, every later run is a successful no-op, and the published
  digest is identical across all of them

### Requirement: An ambiguous registry probe fails rather than publishing

Only an explicit, positively-identified "this version is absent" response SHALL authorize a
push. Any other probe outcome SHALL fail the step. The publish step SHALL NOT treat a probe
failure as evidence that the artifact is unpublished.

#### Scenario: Absent artifact is positively identified

- **WHEN** the probe reports that the version, or the repository holding it, does not exist
- **THEN** the push proceeds

#### Scenario: Unreachable registry fails loudly

- **WHEN** the probe fails because the registry is unreachable, rejects the credentials, or
  returns any response that does not positively identify the artifact as absent
- **THEN** the step exits non-zero with the probe's own error reported, and nothing is pushed

#### Scenario: A transient probe failure cannot cause a re-push

- **WHEN** a probe fails for a version that is in fact already published
- **THEN** the already-published artifact is left untouched

### Requirement: Published versions are immutable

Once an artifact has been published at a version, that reference SHALL continue to resolve to
the same content for as long as it exists. Changing what is shipped SHALL require a new version.

#### Scenario: Source change without a version bump publishes nothing

- **WHEN** a package's sources change but its declared version does not
- **THEN** no push occurs and the existing reference continues to resolve to its original
  content

#### Scenario: Content change requires a new version

- **WHEN** the content of a package's artifact must change
- **THEN** it is shipped at a new version, leaving every previously published version intact

### Requirement: Publishing is re-runnable and does not depend on the release step's state

Publishing SHALL converge from committed repository state and registry state alone. It SHALL NOT
be conditional on the in-band outputs of the step that decided the version, because those
outputs are not reproducible on a re-run. A run in which every declared version is already
present SHALL be a successful no-op.

#### Scenario: Re-run after a mid-publish failure completes the release

- **WHEN** a publish run fails after releasing one package but before releasing another, and is
  re-run against the same repository state
- **THEN** the outstanding artifact is published and the already-published one is skipped

#### Scenario: A publish run is not gated on a concurrent version decision

- **WHEN** a publish run occurs with no version decision having been made in that same run
- **THEN** it still publishes any declared version that is absent from the registry

#### Scenario: A scheduled run with nothing outstanding is a no-op

- **WHEN** publishing runs on a schedule and every declared version is already present
- **THEN** the run succeeds, pushes nothing, and reports that it published nothing

#### Scenario: Publishing nothing is never reported as a successful release

- **WHEN** a publish run finds a declared version absent from the registry but cannot push it
- **THEN** the run fails, rather than succeeding on the grounds that it had nothing to do

### Requirement: Consumer pins propagate atomically with the published artifact

When a consumer in this repository pins both a reference to an artifact and a checksum of that
artifact's contents, both values SHALL become consistent with a newly published version in a
single repository state transition. No committed state SHALL exist in which the reference names
one version and the checksum describes another. Propagation SHALL be idempotent: re-running it
against already-correct pins SHALL change nothing.

#### Scenario: Reference and checksum move together

- **WHEN** a new artifact version is published and its consumers are updated
- **THEN** the artifact reference and the content checksum are updated in one commit

#### Scenario: No intermediate mismatched state is ever committed

- **WHEN** any single committed state of the repository is inspected
- **THEN** the pinned checksum describes the contents of the pinned artifact reference

#### Scenario: Checksum is taken for the consuming architecture

- **WHEN** an artifact is published for multiple architectures and the consumer pins a checksum
  of its contents
- **THEN** the pinned checksum is the one for the architecture the consumer runs on

#### Scenario: Re-propagating correct pins is a no-op

- **WHEN** pin propagation runs and the committed pins already match the published artifact
- **THEN** no change is proposed

### Requirement: Consumer pins reach the main branch as a reviewable, validated change

Pin propagation SHALL NOT write directly to the main branch. It SHALL instead propose the
updated pins as a change that is subject to the same validation as any other change to this
repository, so that the question "does the newly published artifact actually work in the apps
that deploy it?" is answered before the pins become the deployed state.

Re-running propagation while an equivalent proposal is already outstanding SHALL update or
leave that proposal rather than creating a second one.

#### Scenario: New pins are proposed rather than pushed

- **WHEN** publishing produces pins that differ from the committed ones
- **THEN** a reviewable change carrying those pins is opened against the main branch, and the
  main branch is not modified directly

#### Scenario: Proposed pins are validated before they can be adopted

- **WHEN** a pin-propagation change is open
- **THEN** the repository's checks run against it, and it cannot be adopted while they fail

#### Scenario: Repeated propagation does not accumulate proposals

- **WHEN** propagation runs repeatedly and the pins it computes have not changed
- **THEN** at most one outstanding proposal exists for them

#### Scenario: Superseded proposals converge on the current artifact

- **WHEN** a proposal is outstanding and a newer version is subsequently published
- **THEN** the outstanding proposal is brought up to date with the newer version rather than
  left describing the older one

### Requirement: A consumer's pins are declared separately from the configuration that consumes them

A pinned artifact reference and checksum SHALL be declared in a dedicated configuration value,
not embedded inside a program, template, or other document that the consumer interprets.
Updating a pin SHALL NOT require editing the logic that uses it.

This exists because a checksum buried inside an embedded program is editable only by textual
substitution, which neither a human nor an automated dependency updater can do safely, and
because the surrounding document gives no indication that the value is machine-maintained.

#### Scenario: A pin is updated without touching consuming logic

- **WHEN** a consumer's pinned version and checksum are advanced
- **THEN** only the declared configuration values change, and the logic that reads them is
  untouched

#### Scenario: Pins are discoverable as configuration

- **WHEN** the pins for a consumer are located
- **THEN** they are found as named configuration values rather than by searching the text of a
  program

#### Scenario: An automated updater can read and write the pins

- **WHEN** an automated dependency updater is pointed at a consumer's pins
- **THEN** it can identify the artifact reference and rewrite it without parsing an embedded
  program

### Requirement: Pin propagation does not itself trigger a release

A commit whose only purpose is to propagate a published artifact's pins to its consumers SHALL
NOT be interpreted as a releasable change to any package.

#### Scenario: Propagation commit proposes no version bump

- **WHEN** a pin-propagation commit lands on the main branch
- **THEN** no new version bump is proposed for any package as a result of it

### Requirement: The commit convention that drives releases is enforced mechanically

Because version decisions are derived from commit message types, a malformed or
wrongly-typed message silently produces the wrong version decision — or none. The convention
SHALL therefore be checked by tooling rather than by review, both before a change is authored
into history and in the repository's automated checks.

The check SHALL apply to whichever message actually becomes the released history. Where changes
reach the main branch through a squash, that is the message the squash is titled with, not the
individual messages on the contributing branch.

#### Scenario: A malformed message is rejected locally

- **WHEN** a contributor writes a commit message that does not follow the convention
- **THEN** the commit is rejected at the point it is written, with the rule it broke reported

#### Scenario: A malformed message fails automated checks

- **WHEN** a proposed change would land a message that does not follow the convention
- **THEN** the repository's automated checks fail

#### Scenario: The checked message is the one that lands

- **WHEN** a change lands as a squash of several commits
- **THEN** the convention is enforced on the resulting squashed message

#### Scenario: An unrecognised type is rejected

- **WHEN** a message uses a type that the version-decision tooling does not recognise
- **THEN** it is rejected, rather than silently producing no version decision

### Requirement: Dependency updates to a releasable package are releasable

An automated dependency update that changes what a releasable package ships SHALL produce a
version bump, so that the updated artifact can be published. A change that alters the shipped
artifact SHALL NOT be recorded with a commit type that makes it unreleasable.

#### Scenario: A base-image update reaches the consumer

- **WHEN** an automated update changes a releasable package's runtime base image
- **THEN** a version bump is proposed, a new version is published, and the consumer's pins are
  updated to it

#### Scenario: Unreleasable updates cannot strand a content change

- **WHEN** an automated update changes a releasable package's shipped contents
- **THEN** it does not land as a commit type that produces no version bump, because immutable
  versions would otherwise leave the change permanently unpublished
