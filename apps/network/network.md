# Home Network (Omada) — Configuration Reference

Reference for the physical home LAN managed by TP-Link Omada (gateway + switch + APs).
This is the **target configuration** the Omada controller should hold. The controller
software itself runs in the `network` vind cluster (`apps/network/src/omada`) and is
reached over the NetBird mesh; the PiKVM (`apps/pikvm`) is the site-to-VPN ingress that
lets LAN devices and the Omada hardware reach that controller.

> Status (2026-07-30): **gateway not yet installed.** The ISP modem currently does DHCP on
> a flat `192.168.1.0/24`. The PiKVM's `eth0` is **DHCP** so it follows whichever VLAN its
> access port lives in during the modem→Omada cutover. See "Migration / cutover" below.

## Topology

```
Internet ── ISP modem (bridge mode) ── Omada Gateway (router, DHCP, firewall)
                                             │
                                        Omada Switch ── APs
                                             │
                    ┌────────────────────────┼────────────────────────┐
                  VLANs 10/20/30/40/50/90 (see table)
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

## Addressing rules

- Scheme: **`192.168.<vlan>.0/24`** — chosen to be visually distinct from Kubernetes ranges.
- The gateway interface (SVI) for each VLAN is **`.1`**.
- **Never** use a LAN subnet inside the cluster CIDRs, or the controller path silently breaks:
  - Service CIDR `10.96.0.0/16` (holds the Omada ClusterIP `10.96.0.20`)
  - Pod CIDR `10.244.0.0/16`
- NetBird advertises only the host route `10.96.0.20/32` into the mesh (not whole subnets).

## VLANs

| VLAN | Name | Subnet | Gateway | Purpose / devices | Internet | Inter-VLAN |
|-----:|------|--------|---------|-------------------|:--------:|------------|
| 10 | Management | `192.168.10.0/24` | `.1` | Omada gateway/switch/APs, **PiKVM** | restricted | admin plane; reachable only from Trusted |
| 20 | Servers | `192.168.20.0/24` | `.1` | servers, **Home Assistant (HAOS)** | yes | HAOS ↔ IoT allowed (see DNS/mDNS) |
| 30 | Trusted | `192.168.30.0/24` | `.1` | laptops, phones | yes | may initiate to all VLANs |
| 40 | IoT | `192.168.40.0/24` | `.1` | esphome, dishwasher, washing machine, car charger | per-device | no LAN-init; accept only from Trusted/HAOS |
| 50 | Media | `192.168.50.0/24` | `.1` | TVs | yes | no LAN-init to other VLANs |
| 90 | Guest | `192.168.90.0/24` | `.1` | visitors | yes | fully isolated (internet only) |

## DHCP

Per VLAN, on the Omada gateway (single DHCP authority — the modem's DHCP is **off** once
bridged; never run two DHCP servers on one L2):

| VLAN | DHCP pool | Reservations (below the pool) | Lease |
|-----:|-----------|-------------------------------|-------|
| 10 | `.100`–`.199` | **PiKVM → reserved (by MAC)** so its LAN IP is stable | 24h |
| 20 | `.100`–`.199` | servers, HAOS reserved by MAC | 24h |
| 30 | `.100`–`.199` | — | 24h |
| 40 | `.100`–`.199` | appliances reserved by MAC (for firewall rules) | 24h |
| 50 | `.100`–`.199` | — | 24h |
| 90 | `.100`–`.199` | — | 4h |

- **PiKVM reservation is required.** `eth0` is DHCP, but the Omada static route next-hop and
  the NetBird site-to-VPN path need a predictable address. Reserve the PiKVM's MAC to a fixed
  address on VLAN 10 (and, during migration, on the legacy `192.168.1.0/24`).
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

Default **deny** between VLANs; allow only:

- Trusted (30) → all VLANs
- Servers/HAOS (20) ↔ IoT (40): the specific ports Home Assistant needs
- Any VLAN → the controller route (`10.96.0.20`) as needed for Omada management
- IoT (40) / Media (50) / Guest (90) → other VLANs: **deny** (established/return + permitted internet only)

## DNS / discovery

- **mDNS repeater** enabled between VLANs 20 ↔ 30 ↔ 40 so Home Assistant and phones can
  discover esphome/appliances/casting targets across the segmentation boundary.
- Public DNS resolution via the gateway; `omada.network.vgijssel.nl` resolves publicly
  (Cloudflare) to `10.96.0.20` and is reached over the mesh route.

## Switch port profiles

| Port role | Native (untagged) | Tagged | Used by |
|-----------|-------------------|--------|---------|
| Trunk (uplinks, APs) | Management (10) | 20/30/40/50/90 | gateway↔switch, switch↔APs |
| PiKVM | (its access VLAN) | — | **access port**, not a trunk — see note |
| Access | one VLAN | — | single-VLAN endpoints |

> **PiKVM is an access port, not a trunk.** Because `eth0` is DHCP, the PiKVM takes the VLAN
> of whatever access port it is plugged into. During migration that port is on the legacy
> network; after cutover it is moved to Management (VLAN 10). No 802.1Q tagging on the PiKVM.

## Migration / cutover (modem → Omada)

1. Bridge the ISP modem; bring up the Omada gateway with its **initial default LAN =
   `192.168.1.0/24`, gateway `.1`** so every existing device (incl. the PiKVM on DHCP) keeps
   working. Modem DHCP off.
2. Add static route `10.96.0.20/32 → PiKVM` (its current `192.168.1.x` lease); confirm the
   PiKVM NetBird routing peer + ACL are up. Adopt gateway/switch/APs (Inform URL → controller).
3. Create VLANs 10/20/30/40/50/90 with DHCP pools + reservations above.
4. Migrate clients onto their VLANs incrementally. Move the PiKVM's access port to VLAN 10;
   it re-leases into `192.168.10.x` (use its reservation). Confirm PiKVM reachable on VLAN 10.
5. **Repoint before removing anything:** static route → `10.96.0.20/32 → <PiKVM VLAN 10 IP>`.
   (`PIKVM_LAN_CIDR` is already `192.168.0.0/16`, so the masquerade needs no change.)
6. With nothing left on it, delete the legacy `192.168.1.0/24` LAN.

Legacy `192.168.1.0/24` must survive until step 5 is verified — adoption (step 2) is **not**
the finish line.
