# Home Network (Omada) — Configuration Reference

Reference for the physical home LAN managed by TP-Link Omada (gateway + switch + APs).
This is the **target configuration** the Omada controller should hold. The controller
software itself runs in the `network` vind cluster (`apps/network/src/omada`) and is
reached over the NetBird mesh; the PiKVM (`apps/pikvm`) is the site-to-VPN ingress that
lets LAN devices and the Omada hardware reach that controller.

> Status (2026-09-17): **gateway installed.** It serves a default LAN on `192.168.0.0/24`.
> **VLAN 20 (Servers) is created** and the Harvester nodes are being installed into it.
> VLANs 10/30/40/50/60/70/80/90 are still pending. The PiKVM's `eth0` is **DHCP** so it
> follows whichever VLAN its access port lives in — verify where it currently sits before
> touching the static route. See "Migration / cutover" below.

## Topology

```
Internet ── ISP modem (bridge mode) ── Omada Gateway (router, DHCP, firewall)
                                             │
                                        Omada Switch ── APs
                                             │
                    ┌────────────────────────┼────────────────────────┐
                  VLANs 10/20/30/40/50/60/70/80/90 (see table)
                                             │
                              PiKVM (NetBird routing peer, wt0)
                                             │
                                      NetBird mesh
                                             │
                        Omada Controller @ 10.96.0.20 (network cluster)
```

- LAN clients use the **Omada gateway as their default gateway**. To reach the Omada
  controller they send to `10.96.0.20`, the gateway's static route forwards to the PiKVM,
  and the PiKVM routes it into the NetBird mesh (SNAT/masquerade on `wt0`).
- The Omada **hardware** (gateway/switch/APs) is adopted by the remote controller the same
  way — it needs the `10.96.0.20/32 → PiKVM` static route to be reachable.

## Design rules

**1. A VLAN is a policy class, not a device category.** Membership is the only per-device
decision; the rules are attached to the class. A device changing its IP can therefore never
change what it is allowed to do. DHCP reservations exist for stable names, **not** as a
security control.

Every class is defined by three properties:

| Property | Question |
|----------|----------|
| Internet | may members reach the internet? |
| Intra-VLAN peers | may members talk to each other (else client/port isolation)? |
| Inbound discovery | may members be discovered/initiated-to from elsewhere? |

**2. A controller never shares a VLAN with the things it controls.** Applied three times
here:

- PiKVM ∉ Servers — it is the break-glass path *for* the servers, so it must survive their
  failure domain. Out-of-band management has no L2 dependency on its target (HDMI + USB).
- HAOS ∉ IoT — it commands the IoT devices. Sharing an L2 segment would put no firewall at
  all between controller and device (Omada ACLs are gateway ACLs; intra-VLAN traffic never
  reaches them) and would force client isolation off for the whole IoT class.
- Harvester management ∉ VM networks — it hosts them.

## Addressing rules

- Scheme: **`192.168.<vlan>.0/24`** — chosen to be visually distinct from Kubernetes ranges.
- The gateway interface (SVI) for each VLAN is **`.1`**.
- Per-subnet convention:

| Range | Use |
|-------|-----|
| `.1` | gateway SVI |
| `.2`–`.99` | static infrastructure (Harvester nodes, cluster VIP) |
| `.100`–`.199` | DHCP pool |
| `.200`–`.250` | service / LoadBalancer IPs (MetalLB, kube-vip) |

- **Never** use a LAN subnet inside the cluster CIDRs, or the controller path silently breaks:
  - Service CIDR `10.96.0.0/16` (holds the Omada ClusterIP `10.96.0.20`)
  - Pod CIDR `10.244.0.0/16`
- NetBird advertises only the host route `10.96.0.20/32` into the mesh (not whole subnets).

## VLANs

| VLAN | Class | Subnet | Internet | Peers | Inbound discovery | Members |
|-----:|-------|--------|:--------:|:-----:|-------------------|---------|
| 10 | Infra | `192.168.10.0/24` | restricted | yes | Trusted only | Omada gateway/switch/APs, **PiKVM** |
| 20 | Servers | `192.168.20.0/24` | egress only | yes | Trusted only | Harvester nodes + cluster VIP |
| 30 | Automation | `192.168.30.0/24` | yes | n/a | Trusted only | **Home Assistant (HAOS)** `.30` |
| 40 | Trusted | `192.168.40.0/24` | yes | yes | — | MacBook, iPhone |
| 50 | IoT-Local | `192.168.50.0/24` | **no** | **isolated** | no | esphome, WiCAN Pro |
| 60 | IoT-Cloud | `192.168.60.0/24` | yes | **isolated** | no | dishwasher, washing machine, car charger |
| 70 | Media | `192.168.70.0/24` | yes | **yes** | Trusted + Automation | TV, Sonos |
| 80 | Shared Services (DMZ) | `192.168.80.0/24` | yes | yes | Trusted + Media + mesh ingress | Plex / Jellyfin media cluster |
| 90 | Guest | `192.168.90.0/24` | yes | **isolated** | no | visitors |

Notes on the less obvious placements:

- **Media (70) keeps intra-VLAN peering** because Sonos speakers group by talking directly
  to each other. That is the property that justifies it as a separate class from the IoT
  tiers, which are isolated — you cannot express both in one VLAN.
- **IoT-Local (50) vs IoT-Cloud (60)** is purely the internet axis. esphome runs on the
  local API and WiCAN Pro publishes to the local MQTT broker, so neither needs egress.
  Cloud appliances integrate only via vendor clouds, so they must have it.
- **Shared Services (80)** is the DMZ: anything reachable by identities outside the
  household (family/friends streaming). Its blast radius differs from both Servers and
  Media, so it is isolated from both.

## DHCP

Per VLAN, on the Omada gateway (single DHCP authority — the modem's DHCP is **off** once
bridged; never run two DHCP servers on one L2):

| VLAN | DHCP pool | Reservations | Lease |
|-----:|-----------|--------------|-------|
| 10 | `.100`–`.199` | **PiKVM → reserved (by MAC)** so its LAN IP is stable | 24h |
| 20 | `.100`–`.199` | Harvester nodes are **static** (`.10`/`.11`/`.12`), VIP `.9` | 24h |
| 30 | `.100`–`.199` | HAOS is **static** `192.168.30.30` | 24h |
| 40 | `.100`–`.199` | — | 24h |
| 50 | `.100`–`.199` | all devices reserved by MAC | 24h |
| 60 | `.100`–`.199` | all devices reserved by MAC | 24h |
| 70 | `.100`–`.199` | Sonos reserved by MAC | 24h |
| 80 | `.100`–`.199` | service IPs from `.200`–`.250` | 24h |
| 90 | `.100`–`.199` | — | 4h |

- **PiKVM reservation is required.** `eth0` is DHCP, but the Omada static route next-hop and
  the NetBird site-to-VPN path need a predictable address.
- Reservations on VLANs 50/60/70 are for stable names in Home Assistant, not for policy —
  policy comes from the class. See "Design rules".
- DNS advertised via DHCP: the Omada gateway (`.1`), which forwards upstream.

## Static routes (Omada gateway)

| Destination | Next hop | Purpose |
|-------------|----------|---------|
| `10.96.0.20/32` | PiKVM LAN IP (VLAN 10 reservation) | reach the Omada controller in the NetBird mesh |
| `100.65.0.0/16` | PiKVM LAN IP | (optional) reach other NetBird mesh peers from the LAN |

The PiKVM masquerades LAN→mesh traffic (`setup-netbird-routing.sh`, `LAN_CIDR=192.168.0.0/16`),
so return traffic comes back through it. The NetBird dashboard must (a) designate the PiKVM
as a routing peer advertising `10.96.0.20/32` with Masquerade, and (b) permit the LAN source
group → the Omada resource.

## Firewall / ACL policy

Default **deny** between VLANs. Rules belong to the class, not the device:

| Source | Destination | Allow |
|--------|-------------|-------|
| 40 Trusted | all VLANs | yes — admin plane + client apps |
| 30 Automation | 50 IoT-Local | esphome native API (TCP 6053) + device HTTP |
| 30 Automation | 60 IoT-Cloud | local device APIs where they exist |
| 30 Automation | 70 Media | Sonos (UPnP/1400) + TV control |
| 50 IoT-Local | 30 Automation | **TCP 1883 only** (MQTT) |
| 50 IoT-Local | internet | **deny** |
| 60 IoT-Cloud | internet | yes |
| 60 IoT-Cloud | any VLAN | deny |
| 70 Media | 80 Shared Services | Jellyfin/Plex (TCP 8096 / 32400) |
| 70 Media | internet | yes |
| 70 Media | other VLANs | deny |
| 80 Shared Services | 20 Servers | **storage host:port only** |
| 80 Shared Services | internet | yes — metadata + updates |
| 80 Shared Services | 10 / 30 / 50 / 60 / 70 | deny |
| 90 Guest | internet only | fully isolated |
| any VLAN | `10.96.0.20` | as needed for Omada management |

- **`50 IoT-Local → 30:1883` is a deliberate exception** to "IoT never initiates". ESPHome's
  native API is HA-initiated so it needs nothing, but WiCAN Pro *publishes* over MQTT.
- **Client isolation** is the mechanism for the "no peers" property: **on** for 50, 60, 90;
  **off** for 70 (Sonos grouping). Use Omada's **Client Isolation**, *not* "Guest Network"
  mode — Guest Network blocks all private subnets and would break HA→device. Wired
  equivalent is Port Isolation on the switch.
- The Hetzner NetBird proxy peer (see below) is scoped by **NetBird policy** to the Jellyfin
  host:port only. Treat it as an external member of the VLAN 80 DMZ.

## Wireless SSIDs

SSID is the only practical VLAN selector without 802.1X, so each wireless class needs its
own SSID:

| SSID | VLAN | Notes |
|------|-----:|-------|
| Home | 40 Trusted | WPA3, MacBook + iPhone |
| Home-IoT | 50 IoT-Local | **WPA2-PSK, 2.4 GHz enabled** — ESP32 gear (esphome, WiCAN Pro) is 2.4 GHz-only and often fails to associate with WPA3 or band-steered SSIDs. Client isolation on. |
| Home-Appliance | 60 IoT-Cloud | WPA2, client isolation on |
| Home-Media | 70 Media | TV, Sonos. Client isolation **off**. |
| Guest | 90 Guest | client isolation on |

Five SSIDs is the honest cost of the class model — each one adds beacon overhead on the air.
If that becomes a problem, the candidate to fold away is Home-Media into Home-IoT-Cloud (same
internet policy) at the price of losing Sonos peering.

## DNS / discovery

- **mDNS repeater** enabled on VLANs **30, 40, 50, 70** so Home Assistant and phones can
  discover esphome devices, Sonos and casting targets across the segmentation boundary.
  Omada's repeater is **all-to-all among the selected networks** — you cannot express
  pairwise relationships, so selecting these four also lets Trusted see IoT-Local.
- VLANs 60, 80 and 90 are deliberately **excluded**: cloud appliances integrate via vendor
  clouds, and media-server clients use explicit URLs rather than discovery.
- Public DNS resolution via the gateway; `omada.network.vgijssel.nl` resolves publicly
  (Cloudflare) to `10.96.0.20` and is reached over the mesh route.

### Shared services (VLAN 80) — planned

The media cluster runs as VMs on Harvester with its service IP in `192.168.80.200`–`.250`.
Because `*.vgijssel.nl` is a Cloudflare wildcard that answers at **arbitrary depth**, a name
like `jellyfin.media.vgijssel.nl` resolves publicly by default — which is the wrong answer
for anything on-site. It needs **three horizons**:

| Client location | Resolves to | Path |
|-----------------|-------------|------|
| Home LAN | `192.168.80.x` | switched locally, never leaves the house |
| On the NetBird mesh, off-LAN | Jellyfin's NetBird peer IP | direct P2P WireGuard |
| Neither | Hetzner reverse-proxy public IP | proxy → mesh → home |

Without the local override, a TV on VLAN 70 would send its stream to Germany and back.

Design decisions for that path:

- **Direct peer is the primary route** for any client that can run NetBird (incl. Apple TV
  tvOS 17+ and Android TV). Plain HTTP is fine over the mesh — WireGuard already encrypts it.
- The **public reverse proxy is a fallback** for client-incapable devices (Roku, Tizen,
  webOS). It must be *public with no NetBird auth* — an auth interstitial breaks app-based
  clients. Jellyfin's own login is the gate.
- **NetBird-only proxy mode is pointless here:** anyone who could reach it could have
  connected directly to the peer instead, without the proxy hop.
- Remote streaming is capped by **home upstream**, not by the proxy. Transcoding with
  per-user bitrate limits is the lever that decides how many viewers fit.

## Switch port profiles

| Port role | Native (untagged) | Tagged | Used by |
|-----------|-------------------|--------|---------|
| Trunk (uplinks, APs) | Infra (10) | 20/30/40/50/60/70/80/90 | gateway↔switch, switch↔APs |
| Harvester LAG | Servers (20) | 30/70/80 (VM networks) | one LACP LAG per node — see harvester.md |
| PiKVM | (its access VLAN) | — | **access port**, not a trunk — see note |
| Access | one VLAN | — | single-VLAN endpoints |

> **PiKVM is an access port, not a trunk.** Because `eth0` is DHCP, the PiKVM takes the VLAN
> of whatever access port it is plugged into. During migration that port is on the legacy
> network; after cutover it is moved to Infra (VLAN 10). No 802.1Q tagging on the PiKVM.

Harvester nodes are **LACP LAGs** with VLAN 20 untagged (PVID 20) and the VM networks
tagged. Full detail, including why the installer's VLAN ID is left unset, in
`apps/network/harvester.md`.

## Migration / cutover (modem → Omada)

1. Bridge the ISP modem; bring up the Omada gateway with its **default LAN =
   `192.168.0.0/24`, gateway `.1`** so every existing device (incl. the PiKVM on DHCP) keeps
   working. Modem DHCP off. *(Done.)*
2. Add static route `10.96.0.20/32 → PiKVM`; confirm the PiKVM NetBird routing peer + ACL
   are up. Adopt gateway/switch/APs (Inform URL → controller).
3. Create VLANs 10/20/30/40/50/60/70/80/90 with the DHCP pools, reservations, isolation
   settings and SSIDs above. *(VLAN 20 done.)*
4. Migrate clients onto their VLANs incrementally. Move the PiKVM's access port to VLAN 10;
   it re-leases into `192.168.10.x` (use its reservation). Confirm PiKVM reachable on VLAN 10.
5. **Repoint before removing anything:** static route → `10.96.0.20/32 → <PiKVM VLAN 10 IP>`.
   (`PIKVM_LAN_CIDR` is already `192.168.0.0/16`, so the masquerade needs no change.)
6. With nothing left on it, delete the default `192.168.0.0/24` LAN.

The default LAN must survive until step 5 is verified — adoption (step 2) is **not** the
finish line.

### Symptom → cause

- **A node configured statically on a VLAN can't ping its gateway, but DHCP hands out a
  `192.168.0.x` address.** The port is still on the default LAN: either the VLAN does not
  exist yet or the port/LAG profile's PVID is wrong. Not a LACP problem — a working DHCP
  lease proves the link forwards.
