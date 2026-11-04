# POC — one mesh peer for both ingress and egress

## Thesis

A single pod — Envoy with a NetBird client sidecar — can serve **both** directions for one
service, **for any protocol**:

- **ingress**: mesh peers reach `<service>.vpn.blueora.ng` and are forwarded to the backing
  Kubernetes Deployment;
- **egress**: that same Deployment's outbound calls to *other* mesh services leave through the
  same pod, so NetBird sees one identity for the service in both directions.

"Any protocol" is a first-class requirement, not a stretch goal. The POC exercises **terminated
HTTPS, raw TCP and raw UDP** through the same pod, because the services this has to carry
eventually include the Omada device fleet — 7 raw TCP ports and 3 raw UDP ports alongside an
HTTPS UI. A design that only works for TLS is not a design.

The protocol choice lands almost entirely on the forwarding layer: the naming layer is
protocol-blind (DNS returns an address, nothing more), so one view and one DNS answer serve all
three. What changes is that **UDP has no SNI and no Host header**, which removes any possibility
of content-based demultiplexing and makes the port the only selector — see the DNAT section.

If this holds, a NetBird ACL can finally say "service A connects to service B on port Y" instead
of "the cluster connects to B", which is all the current `NBRoutingPeer` can express.

The POC proves it across **two separate clusters** so nothing can be accidentally satisfied by
in-cluster routing: `foo` runs in `kerk`, `bar` runs in `shine`, and `foo` reaches `bar` only over
the overlay.

---

## What is already validated

Measured on the live `secret` cluster (2026-10-21/22), with NetBird on macOS **disconnected** so
the host peer could not be in the path. These are not assumptions; the POC builds on them.

| property | result |
|---|---|
| `metadata()` is populated when a CoreDNS **view** expression is evaluated | **yes** |
| view keyed on `kubernetes/client-label/<key>` | **yes** — two pods in the *same namespace*, differing only by a pod label, got different answers |
| view keyed on `kubernetes/client-namespace` | **yes** |
| works without per-namespace pod CIDRs | **yes** — all clients were in one flat `10.244.0.0/24`. This is an **API pod-cache lookup, not CIDR arithmetic**, so no CNI change is required |
| unmatched client falls through to the no-view block | **yes** — omit a fallback and an unregistered consumer gets nothing, so the view list *is* the allowlist |
| `cache` is **per-view**, not shared | **yes** — 12 interleaved queries across 3 rounds, no cross-view contamination. This was the one that could have been a silent security hole |
| `rewrite … answer auto` returns the **original** owner name | **yes** — `jwks-network.vpn.blueora.ng. 5 IN A 10.101.97.135`, `ANSWER: 1`, no CNAME leaked, flags `qr aa` |
| `{1}` capture resolves per-destination | **yes** — two mesh names → two different Service ClusterIPs |
| `dnsPolicy: None` preserves cluster DNS when the search list is complete | **yes** |
| Fleet renders Helm **then** applies `kustomize` on top | **yes** — and `kustomization.yaml` needs no `resources:`; Fleet feeds the chart output in |
| cross-cluster fetch over the mesh with the host peer down | **yes** — `HTTP=200 ssl_verify=0`, real JWKS, real hostname |

### Negative results, equally load-bearing

- **Appending a nameserver does not work for Go clients.** `dnsPolicy: ClusterFirst` plus an extra
  `dnsConfig.nameservers` entry: Go stopped at kube-dns's NXDOMAIN
  (`lookup … on 10.96.25.6:53: no such host`) and never tried the second server. musl *did* fall
  through, so an alpine `curl` test passes and the real consumers fail. OpenBao and VSO are Go, so
  `dnsPolicy: None` with a full search list is mandatory wherever per-pod DNS is used.
- **Envoy Gateway's `Backend` API is gated off.** `extensionApis: {}` in `envoy-gateway-config`; a
  `Backend` with an FQDN endpoint is accepted by the apiserver and gets **no status**. Irrelevant
  to this POC — it uses *static-config* Envoy, no Gateway API — but it blocks any design that
  routes to a mesh FQDN through Envoy Gateway.
- **`cluster.local` does not fall through** in the vcluster Corefile
  (`fallthrough in-addr.arpa ip6.arpa` only). A search-expanded name such as
  `bar.vpn.blueora.ng.default.svc.cluster.local` gets an authoritative NXDOMAIN from the
  `kubernetes` plugin and no later plugin sees it — so interception has to happen on the
  **absolute** name, in a `vpn.blueora.ng` server block.
- **`fleet` ignores `--context` *and* `-k/--kubeconfig`.** Only the `KUBECONFIG` env var takes
  effect. Two `fleet apply` runs silently landed on the wrong cluster while every `kubectl` in the
  same command was correctly targeted. Set `KUBECONFIG` explicitly for every `fleet` invocation in
  this POC.

---

## Design correction: do NOT chain CoreDNS

The original sketch copied Tailscale's `DNSConfig` shape — a separate CoreDNS with a static
ClusterIP, linked into the main CoreDNS as a stub domain. **That cannot work here.**

```
foo pod (10.244.0.17)
   |  query bar.vpn.blueora.ng
   v
main CoreDNS  ---- forward vpn.blueora.ng ---->  separate CoreDNS
                                                      ^
                        the source IP seen here is the MAIN COREDNS POD,
                        not 10.244.0.17
```

Views key on the remote IP of the DNS packet. The `kubernetes` plugin's own requirement is
explicit: *"the remote IP address in the DNS packet received by CoreDNS must be the IP address of
the Pod that sent the request."* `forward` is a proxy, so the second hop sees the forwarder and
every view expression evaluates false.

Tailscale's stub-domain shape is fine for Tailscale because its nameserver **answers per
destination** — one answer cluster-wide, so it never needs to know who asked. The moment the
answer must differ per consumer, the extra hop is fatal.

| option | shape | views work | cost |
|---|---|---|---|
| **A (chosen)** | view blocks **inside the main CoreDNS**, as a `vpn.blueora.ng:1053` server block imported via `coredns-custom` | **yes** — same process, real client IP | main CoreDNS ServiceAccount needs pod list/watch for `pods verified` |
| B (fallback) | separate CoreDNS; `foo` pods point at it directly with `dnsPolicy: None` | yes | per-pod dnsConfig on every consumer |
| C (original) | separate CoreDNS + stub domain in main | **no** | — |

> **Measured 2026-10-24 — see "Option C validated by experiment" in the results.** The prediction
> holds, and option C is worse than it looks here: the view does not fail, it evaluates the
> *forwarder's* identity, so labelling the CoreDNS pod grants the mesh address to **every pod in
> the cluster**. It passes assertion 1 while failing assertion 4 **open**.

**A** is already structurally validated: the spike ran exactly that block shape
(`vpn.blueora.ng:<port>` carrying `view` + `metadata` + `kubernetes … pods verified`). The only
difference is that clients reached it via the main CoreDNS rather than directly — and since it is
the *same process*, the client source IP survives. It also deletes the separate Deployment and its
static ClusterIP entirely.

Fall back to **B** only if `pods verified` RBAC turns out to be immovable under vcluster's own
reconciliation.

---

## Where kube-proxy DNAT sits, and why ports do the demux

```
foo pod
  |
  | 1. DNS -> main CoreDNS, vpn.blueora.ng block, view 'foo'
  |    rewrite -> bar-forward.default.svc.cluster.local
  |    answer (owner name restored): bar.vpn.blueora.ng A <ClusterIP>
  |
  | 2. TCP SYN -> <ClusterIP>:443
  v
+=========================================================+
|  kube-proxy DNAT  (netfilter on the consumer's node)     |
|    dst <ClusterIP>:443  ->  dst <envoy podIP>:10000      |
|    src <foo podIP>  UNCHANGED                            |
+=========================================================+
  |
  | 3. arrives on envoy eth0, dst = podIP:10000
  v
envoy listener :10000 -> raw TCP -> bar.vpn.blueora.ng:443 (via wt0)
```

One mechanism, two consequences:

- **N ClusterIPs can point at one pod** — DNAT maps any number of Service IPs to the same endpoint.
- **The ClusterIP is invisible to Envoy** — it is rewritten away, so the **targetPort is the only
  selector**. Every `(destination, port)` pair needs a unique container port. The consumer-visible
  port stays the real one because the Service translates.

This applies identically to **UDP** — kube-proxy DNATs UDP as well, so the diagram above holds with
`SYN` replaced by a datagram. For TCP and TLS you could in principle recover the destination from
SNI instead of the port; **for UDP there is no such signal at all**, so port-based demux is not one
option among several, it is the only mechanism. Everything here is therefore designed around the
UDP constraint and TCP simply inherits it. The cost is carried in kube-proxy's UDP conntrack
behaviour — see assertion 13 and the protocol traps.

DNAT rewrites the *destination*, not the *source* — which is precisely why the view mechanism
works at all. Anything that **SNATs** DNS traffic breaks it: `masqueradeAll` on kube-proxy, or a
node-local DNS cache in front of CoreDNS. Treat that as a hard constraint.

**Ingress has no kube-proxy in its path at all.** A mesh peer dials the pod's overlay address on
`wt0` directly — no Service, no DNAT, no translation, the real port. That asymmetry is what lets
one pod serve both directions without a port fight: ingress binds the actual port, egress is free
to use a private high port.

---

## Architecture

```
            kerk cluster                                     shine cluster
+--------------------------------------+       +-------------------------------------+
| foo Deployment, 10 replicas          |       | bar backends                        |
|   label mesh-identity: foo           |       |   nginx        :8080  (HTTP)         |
|   /foo      -> https://bar...:443    |       |   tcp-echo     :9000                 |
|   /foo-tcp  -> tcp   bar...:9000     |       |   udp-echo     :7777                 |
|   /foo-udp  -> udp   bar...:7777     |       +------------------^------------------+
+-----------------+--------------------+                          | plain, in-cluster
                  | view 'foo'                                    |
                  v                            +-----------------+-------------------+
   Service/bar-forward  (ONE ClusterIP)        | envoy + netbird client              |
     443/TCP  -> 10000                          |   DNS label  bar                    |
    9000/TCP  -> 10001                          |   group      bar                    |
    7777/UDP  -> 10002                          |   :443  INGRESS TLS   -> nginx:8080 |
                  |                             |   :9000 INGRESS tcp   -> :9000      |
                  v                             |   :7777 INGRESS udp   -> :7777      |
+--------------------------------------+       +-----------------^-------------------+
| envoy + netbird client  <<THE POD>>  |                         |
|   DNS label  foo    group  foo       |                         |
|                                      |                         |
|   :443    INGRESS TLS  -> foo:8080   |                         |
|   :10000  EGRESS tcp  --> bar:443    |                         |
|   :10001  EGRESS tcp  --> bar:9000   |=== NetBird overlay =====+
|   :10002  EGRESS udp  --> bar:7777   |
+--------------------------------------+
     ACL: homelab -> foo  (drives the headline test)
          foo -> bar  (all protocols, ONE WAY)  |  bar -> foo MUST be denied
```

Four listeners on the kerk pod across three protocols and both directions, in **one** Envoy
process with **one** static config. That is the thing being proven.

---

## Phase 0 — Preconditions

### Verified 2026-10-24

| check | result |
|---|---|
| **Built-in `Default` policy gone** | ✅ **absent from the account.** This is the one that makes everything else meaningful — while it exists (All ↔ All) every assertion passes regardless of policy and the reverse-direction set is decoration. |
| **`allow foo to reach bar`** | ✅ enabled, **`bidirectional=false`**, `proto=all`, all ports. One-way as intended, so assertions 14-17 are testable. `proto=all` means this POC does **not** prove per-port enforcement. |
| **`homelab reach foo`** | ✅ enabled, `bidirectional=false`, `proto=all`. Drives assertion 1b from PiKVM. |
| **Groups `foo` / `bar`** | ✅ both exist, **0 peers each** — ready for enrolment. `homelab` has 4 peers. |
| **DNS label collision** | ✅ **no existing peer** carries a `foo.` or `bar.` label. |
| **Broad `cidr-*` policies don't interfere** | ✅ `CIDR Access`, `cidr-default`, `cidr-automation`, `cidr-servers` are all `src=[roaming] → <network resource>`. Neither `foo` nor `bar` appears, so they cannot quietly satisfy a negative assertion. |
| **Wildcard keypair location** | ✅ `secret/mesh-wildcard-tls`, from Certificate `mesh-wildcard`, Ready. This is what Phase 2 copies. |
| **Disk** | ✅ **77%**, 98 GiB free — down from 82% after an image prune (39 GB → 5.5 GB). Comfortably clear of the 85% DiskPressure line, but re-check after `kerk` + `shine` exist. |

### ⚠️ Account drift found — not a blocker, but fix before trusting ACL reasoning

`homelab-devices` and `pikvm-ssh` each exist **three times**:

```
3 pikvm-ssh
3 homelab-devices
1 svc-openbao-tcp ... (all others single)
```

`homelab-devices` is supposed to be owned by the Crossplane Workspace in
`apps/secret/src/netbird-account`. Three copies is the signature of that Workspace losing its state
and re-creating rather than adopting — which means the next reconcile may well produce a fourth.
Functionally the duplicates are permissive copies of the same grant, so nothing breaks; the problem
is that "what does the ACL actually permit" stops being answerable by reading the list, and that is
precisely the question assertions 7 and 14-17 depend on. It also matches the recorded pattern of
orphaned NetBird objects recurring on every rebuild.

### Still outstanding

| check | why |
|---|---|
| **macOS NetBird client DISCONNECTED** | decided, and it makes assertion 18 hold by construction. Verify `netbird status` → `Management: Disconnected` immediately before running the suite, since a reconnect would silently invalidate every egress result. |
| **PiKVM reachable on the mesh** | the `homelab` peer that drives assertion 1b — the only test of the full both-directions-in-one-request claim. Cannot be checked from the host while its own client is disconnected. If PiKVM is unavailable, 1b is deferred and the POC proves ingress only as far as the listener (1a). |
| **`kerk` / `shine` have no `NBRoutingPeer`** | fresh vclusters have none, but confirm — one would give every pod an independent overlay path and void assertion 18. |

## Phase 1 — Clusters

1. `vcluster create kerk --driver docker`, likewise `shine`.
2. Record each cluster's service CIDR and the CoreDNS **listen port**. Expect **`:1053`** — a
   server block on the wrong port is silently never consulted.
3. Per cluster: netbird-operator (pinned `0.7.0`) plus a PAT Secret. For a POC, inject the PAT
   directly rather than standing up OpenBao + VSO.

## Phase 2 — Certificate

Copy the existing `*.vpn.blueora.ng` keypair into both clusters as a `kubernetes.io/tls` Secret.
It is already issued, and the wildcard covers `foo.` and `bar.` at single-label depth.

> **Stated assumption:** this is a POC shortcut. Production reads `kv/mesh-tls` through VSO per
> cluster. Copying a private key into two clusters is acceptable *only* because they are
> throwaway — destroy the Secrets with the clusters.

## Phase 3 — `shine`: the destination

4. Three backends, one per protocol under test:
   - **HTTP** — nginx (`nginxinc/nginx-unprivileged`, already vendored) serving a distinguishable
     body on `:8080`.
   - **raw TCP echo** on `:9000` — `socat TCP4-LISTEN:9000,fork,reuseaddr PIPE`.
   - **raw UDP echo** on `:7777` — `socat UDP4-RECVFROM:7777,fork PIPE`. It must echo the payload
     back verbatim, because the MTU assertion below depends on comparing bytes sent to bytes
     received.

   nginx cannot serve the UDP leg, so the UDP backend is deliberately a separate process rather
   than a second nginx port.

5. One pod: **static-config Envoy + netbird client**. `allowExtraDnsLabels: true`, DNS label
   `bar`, group `bar`, `preStop: netbird deregister`, `replicas: 1`, `Recreate`.
6. Three Envoy ingress listeners, all bound on the overlay-facing side at the **real** ports
   (ingress has no Service and no DNAT, so no translation is available or wanted):
   - `0.0.0.0:443` — TLS terminate from the mounted Secret, plain HTTP to nginx.
   - `0.0.0.0:9000` — `tcp_proxy`, no transport socket, straight to the TCP echo. **No
     certificate is involved**; "valid certificate" applies to the HTTPS listener only.
   - `0.0.0.0:7777` **UDP** — `udp_proxy` listener filter to the UDP echo. See the protocol traps
     section for the config-shape risk here.
7. **Gate — all three must pass before building `kerk`:**
   - `curl https://bar.vpn.blueora.ng/` → body, `ssl_verify=0`
   - `socat - TCP:bar.vpn.blueora.ng:9000` → echoes
   - `socat - UDP:bar.vpn.blueora.ng:7777` → echoes

   Run these from an existing mesh peer. If UDP fails here, it is an ingress/overlay problem and
   has nothing to do with the view or the egress pod — debugging it later, through two more hops,
   is far more expensive.

## Phase 4 — `kerk`: the consumer

8. `foo` webserver, **10 replicas**, pod label `mesh-identity: foo`, with one endpoint per
   protocol — each returning its own pod name alongside what came back from `bar`:
   - `/foo` — HTTPS GET to `https://bar.vpn.blueora.ng/`
   - `/foo-tcp` — raw TCP to `bar.vpn.blueora.ng:9000`, send a token, read the echo
   - `/foo-udp` — raw UDP to `bar.vpn.blueora.ng:7777`, `sendto` / `recvfrom` with a timeout, and
     accept a **payload-size parameter** so the MTU assertion can sweep datagram sizes

   > Use a **stdlib** `http.server` + `urllib` + `socket` script in a ConfigMap on
   > `python:3.12-slim`, not FastAPI. FastAPI needs either a built image or an unpinned
   > `pip install` at startup, and the repo's dependency policy forbids unpinned installs. stdlib
   > `socket` covers the raw TCP and UDP legs with no dependencies at all. If FastAPI is required,
   > build and pin an image first and treat that as a prerequisite task.
   >
   > The UDP endpoint **must** set a receive timeout. UDP has no connection, so a dropped datagram
   > hangs forever rather than erroring — and a hung request looks identical to a routing problem.

9. One pod: **static-config Envoy + netbird client**, DNS label `foo`, group `foo`, same
   lifecycle rules. **This is the pod under test.**
10. One Envoy static config, both directions and all three protocols in one process:
    - ingress `0.0.0.0:443` → TLS terminate → `foo:8080`
    - egress `:10000` → `tcp_proxy` → `bar.vpn.blueora.ng:443`
    - egress `:10001` → `tcp_proxy` → `bar.vpn.blueora.ng:9000`
    - egress `:10002` **UDP** → `udp_proxy` → `bar.vpn.blueora.ng:7777`

    All egress clusters `STRICT_DNS`, resolved through the netbird-rewritten `/etc/resolv.conf`.
    Note the egress listeners are raw forwarders — the `:10000` leg is **passthrough**, so the TLS
    session terminates at shine's Envoy and `foo` validates the real certificate itself.

11. `Service/bar-forward` — **one ClusterIP, three ports**, selecting the Envoy pod:

    | service port | protocol | targetPort |
    |---|---|---|
    | 443 | TCP | 10000 |
    | 9000 | TCP | 10001 |
    | 7777 | UDP | 10002 |

    Mixed TCP/UDP ports on one ClusterIP Service are supported. The consumer-visible ports are the
    **real** ones; the private 1000x ports exist only because the pod cannot see which ClusterIP
    was dialled and must demux on port.
12. `coredns-custom` in `kube-system`, one key:

```
vpn.blueora.ng:1053 {
    view foo {
        expr metadata('kubernetes/client-label/mesh-identity') == 'foo'
    }
    metadata
    kubernetes cluster.local {
        pods verified
    }
    rewrite name regex (.+)\.vpn\.blueora\.ng {1}-forward.default.svc.cluster.local answer auto
    errors
    cache 5
}
```

- `{1}-forward` matches the `bar-forward` naming. The rewrite target name and the Service name
  are a **convention that must agree**; nothing validates it.
- `kubernetes cluster.local { pods verified }` **must be multi-line** — the single-line
  `{ pods verified }` form is a parse error
  (`Wrong argument count or unexpected line ending after '}'`) and CrashLoops the pod.
- `pods verified` requires the CoreDNS ServiceAccount to list/watch pods. Verify before assuming;
  the main block currently runs `pods insecure`, which does not.

13. **NetBird access — already provisioned by hand, so verify rather than create.**

    Groups `foo` and `bar` and a policy allowing **`foo → bar` on all protocols** exist in the
    account. Three things follow:

    - **All protocols** means the policy does not gate ports, so assertions 1/9/10 cannot fail for
      ACL reasons. That is convenient for proving the data path and it means this POC does **not**
      prove per-port enforcement. Narrowing the policy to `443/tcp, 9000/tcp, 7777/udp` and
      re-running is a cheap follow-up that would.
    - **The policy is one-way.** `bar` must not be able to initiate to `foo`; see assertions 11-13.
      Note this constrains *initiation*, not *replies* — responses on a flow `foo` opened return
      fine, or nothing would work at all. "`bar` cannot reach `foo`" means `bar` cannot start a
      conversation.
    - **Ingress to `foo` is permitted from `homelab`** (added by hand alongside the above). With the
      macOS client deliberately disconnected, the `homelab` peer that uses this grant is
      **PiKVM**, and it is needed only for assertion 1b. Every other assertion is driven through
      the apiserver and needs no mesh policy at all.

    Keep `:10000-10002` out of every policy so no mesh peer can use `foo`'s egress listeners as a
    relay into `bar`.

### Test validity: macOS NetBird stays DISCONNECTED

**Decided.** The host client is disconnected for the whole POC, which removes the only route by
which a `kerk` pod could reach `100.65.0.0/16` without going through the Envoy pod. Assertion 18
then holds **by construction** rather than by configuration — keep it in the suite as a check that
the construction is what we think it is, not as a mitigation.

One design constraint survives regardless, because it protects the *mechanism* rather than the
environment:

> **The `vpn.blueora.ng` block must NOT have a fallback that resolves mesh names.** If a
> non-matching client falls through to something that forwards to the real mesh resolver, a failed
> view match silently becomes a working direct connection, and both assertion 1 and assertion 4
> pass while the mechanism under test does nothing. Unmatched clients must get **NXDOMAIN**.

### How the suite is driven, now that there is no mesh client on the host

`kubectl port-forward` and `kubectl exec` reach `foo` through the **apiserver**, not over the
overlay. That is fine for everything about egress, and it means the **ingress half of the thesis is
not covered by the headline test** — port-forward never touches the NetBird peer or the Envoy
ingress listener. The two claims have to be separated:

| claim | driven by | covered |
|---|---|---|
| `foo`'s outbound traffic leaves through the Envoy pod, for all three protocols | `port-forward` / `exec` into `foo` | **yes** — assertions 1, 9, 10, 11, 12 |
| Envoy terminates TLS for `foo.vpn.blueora.ng` and forwards to the backend | `exec` inside `kerk`, `curl --resolve foo.vpn.blueora.ng:443:<envoy podIP>` | **yes**, in-cluster — proves the listener, **not** the overlay leg |
| a real mesh peer reaches `foo` over the overlay | a `homelab` device peer — **PiKVM** is the natural one, already enrolled, already covered by `homelab → foo` | assertion 1b |

Without 1b, "one pod does both directions" is only half-demonstrated: egress end-to-end across
clusters, ingress only as far as the listener. PiKVM costs one `curl` and closes it, so it is worth
doing rather than deferring.

### ⚠️ `kubectl port-forward service/foo` does NOT round-robin

It resolves the Service to **one** backing pod and tunnels to that pod for the lifetime of the
forward. Every request down a single port-forward therefore hits the **same** replica — so a naive
"send 50 requests and count distinct pod names" shows **one** pod and looks like a broken view.

Drive replica coverage **deterministically** instead: iterate all ten pods and hit each one's own
`localhost:8080`:

```
for p in $(kubectl get pods -l mesh-identity=foo -o name); do
  kubectl exec "$p" -- curl -sS localhost:8080/foo
done
```

That proves **every** replica's egress independently rather than relying on load-balancer sampling
luck, which is a stronger claim than the original assertion made. Keep `port-forward` for
interactive spot checks.

## Phase 5 — Assertions

Two drivers, because the host has no mesh client. **Assertion 1b is the only one that exercises
both directions in a single request** — everything else covers one half.

```
 (1b)  PiKVM --https://foo.vpn.blueora.ng/foo--> [kerk envoy :443  INGRESS]
                                                         |
 (1)   kubectl port-forward / exec ----------------> foo pod (1 of 10)
       (apiserver path -- never touches the overlay)      |
                                      bar.vpn.blueora.ng resolved by the VIEW
                                                         v
                                              Service/bar-forward
                                               443 | 9000 | 7777
                                                    --DNAT-->
                                 [SAME kerk envoy :10000 / :10001 / :10002  EGRESS]
                                                         |
                                                     overlay
                                                         v
                         [shine envoy :443 / :9000 / :7777] -> nginx | tcp-echo | udp-echo
```

### Data path

| # | assertion | proves |
|---|---|---|
| 1 | via `port-forward`/`exec`, `GET /foo` returns bar's body | **egress** through the Envoy pod, end to end, across clusters |
| 1a | `curl --resolve foo.vpn.blueora.ng:443:<envoy podIP>` from inside `kerk` serves `foo` | the **ingress listener** terminates TLS and forwards to the backend |
| 1b | from **PiKVM**, `curl https://foo.vpn.blueora.ng/foo` returns bar's body | **ingress over the overlay + egress, through one pod, in one request** — the full thesis |
| 2 | **all ten** `foo` pods, iterated explicitly, each return bar's body | the view matches on a **label**, not a pod IP — every replica works, deterministically rather than by LB sampling |
| 3 | `dig bar.vpn.blueora.ng` from a `foo` pod → `bar-forward` ClusterIP | view selection |
| 4 | same query from a **non-`foo`** pod → NXDOMAIN / fallthrough | default-deny; identity actually gates it |
| 5 | same query from **inside the kerk envoy pod** → the real `100.65.x.y` | **no resolution loop** — Envoy uses the mesh resolver, not the view |
| 6 | TLS verifies against the public root store, no `--insecure` anywhere | end-to-end TLS, real hostname, nothing impersonating |
| 7 | from a mesh peer not permitted to reach `foo`, `bar-forward`'s ports are unreachable | the egress listener is not an open relay |
| 8 | `kubectl top pod` on both envoy pods | idle RSS, the input to the Envoy-vs-nginx decision |

### Protocol coverage — the point of the exercise

| # | assertion | proves |
|---|---|---|
| 9 | `/foo-tcp` echoes through | **raw TCP** egress + ingress, no TLS anywhere in the path |
| 10 | `/foo-udp` echoes through | **raw UDP** egress + ingress — no SNI, no Host, port-only demux |
| 11 | **one** DNS answer serves all three ports | the naming layer is protocol-blind; one view, three protocols |
| 12 | UDP payload sweep **1200 / 1400 / 1472 / 2000 / 8000** bytes, comparing bytes sent to bytes echoed | **MTU behaviour over WireGuard.** The overlay reduces the path MTU. TCP survives via MSS clamping; **UDP has no equivalent** and oversized datagrams fragment or vanish. Record the largest size that survives — this is the number Omada's device protocols will live or die by |
| 13 | after `kubectl rollout restart` of the kerk envoy pod, UDP recovers, and **how long it takes** | **UDP conntrack staleness.** kube-proxy's UDP conntrack entries can point at a dead endpoint after a pod is replaced and blackhole until they expire. The ingress pod is pinned to 1 replica + `Recreate` with a measured ~81 s gap, so this is a real window, not a theoretical one |

### Reverse direction — the policy is one-way

The account policy permits `foo → bar` only. These assertions prove the denial is real rather
than assumed, and they matter because a POC that only tests the permitted direction cannot tell a
working ACL from an absent one.

| # | assertion | proves |
|---|---|---|
| 14 | `dig foo.vpn.blueora.ng` **from the bar peer** returns nothing | **NetBird DNS is policy-scoped — a denied peer cannot even resolve.** This is the cleanest negative signal available and it sidesteps every connection-level ambiguity below |
| 15 | TCP from the bar pod to `foo`'s overlay address `:443` times out or is refused | denial on the permitted-in-reverse protocol |
| 16 | UDP from the bar pod to `foo` produces **no datagram at foo's listener** | the denial holds for UDP |
| 17 | `/foo` still works *while* 14-16 are failing | one-way means **initiation**, not replies — return traffic on flows `foo` opened is unaffected |

> **Assertion 16 needs care.** UDP gives the sender no feedback, so a *denied* send and a
> *successful* send with no reply look identical from the client. Verify at the **receiving** end —
> `socat -v` logging on foo's UDP listener, or a packet count — never by inferring from the
> sender's silence. Treating "no reply" as "denied" would make this assertion pass even if the
> policy were missing entirely.

### No independent overlay path

| # | assertion | proves |
|---|---|---|
| 18 | from a `foo` pod, a direct connection to **bar's real `100.65.x.y`** fails | the pod has **no overlay path of its own** — every mesh byte really does leave through the Envoy pod |

With the macOS client disconnected and no `NBRoutingPeer` in `kerk`, this should hold **by
construction**. Keep it anyway: it verifies the construction is what we believe it is, and it is
the control that makes every other result meaningful. If it ever *passes* a connection, the rest of
the suite is void — a working assertion 1 would then be equally consistent with the view, the
Service and the egress listener all being bypassed.

Confirm the same for `kerk` as a whole: **no `NBRoutingPeer`** (fresh vclusters have none unless
one is added), and no route to `100.65.0.0/16` from an ordinary pod.

Assertion **5** deserves the closest attention of the data-path set: it is the exact loop
`configmap-coredns-jwks.yaml` asserts cannot happen, and this is the first time that argument is
tested with views in play. Assertions **12** and **13** are the ones most likely to produce a
genuine surprise, and **18** is the one that protects every other result from being meaningless.

---

# RESULTS — executed 2026-10-24

Two throwaway vclusters (`kerk`, `shine`, docker driver). Static-config Envoy, no Envoy Gateway.
NetBird setup keys minted directly against the management API rather than via the operator — the
operator is not what is under test and two throwaway clusters do not need its CRDs.

**The thesis holds.** One pod — Envoy plus a NetBird client sidecar — served ingress and egress for
one service across terminated HTTPS, raw TCP and raw UDP, in one process, with one static config,
across two clusters. Assertion 1b closed it end to end in a single request.

The kerk pod ran **five** listeners rather than the planned four: an ingress UDP listener was added
on the real port so the reverse-direction denial had a receiving end to be observed at (see
assertion 16's warning). Note `:7777` then appears on both sides — ingress on the real port, egress
on `:10002` — which is the port asymmetry made concrete.

## Scoreboard

| # | assertion | result |
|---|---|---|
| 1 | `/foo` returns bar's body | ✅ `200`, `BAR-HTTP-OK served by shine nginx` |
| 1a | ingress listener terminates TLS in-cluster | ✅ TLSv1.3, `CN=*.vpn.blueora.ng`, driven from the outsider pod by explicit address |
| 1b | **PiKVM → `https://foo.vpn.blueora.ng/foo`** | ✅ **`http=200 ssl_verify=0 remote=100.65.81.14`** — ingress over the overlay + egress, one pod, one request |
| 2 | all ten replicas, iterated | ✅ 10/10, twice |
| 3 | view → `bar-forward` ClusterIP | ✅ `10.109.77.35` |
| 4 | non-`foo` pod → NXDOMAIN | ✅ same namespace, same flat `10.244.0.0/16`, label is the only difference |
| 5 | from inside the envoy pod → real overlay address | ✅ `100.65.159.225`, no resolution loop |
| 6 | TLS verified, no override | ✅ TLSv1.3, SAN `*.vpn.blueora.ng`, `notAfter Jan 6 2027` |
| 7 | egress listeners are not an open relay | ❌ **FAILED as configured** → ✅ after narrowing the policy. See below |
| 8 | idle RSS | ✅ envoy VmRSS **26 MiB** (kerk) / **32 MiB** (shine); cgroup incl. page cache 72 / 65 MiB per container |
| 9 | raw TCP | ✅ `BAR-TCP-OK:HELLO-TCP` |
| 10 | raw UDP | ✅ echo intact |
| 11 | one DNS answer serves all three ports | ✅ exactly 1 A record, all of 443/tcp, 9000/tcp, 7777/udp against it |
| 12 | UDP payload sweep | ✅ measured — **1252 bytes**, see below |
| 13 | UDP recovery after rollout | ✅ **12 s** total window, no conntrack blackhole — but only after fixing a separate bug |
| 14 | denied peer cannot resolve | ❌ **premise is wrong**, see below |
| 15 | TCP bar → foo denied | ✅ refused/timeout |
| 16 | UDP bar → foo denied | ✅ **verified at the receiving end** — Envoy `ingress_udp.downstream_sess_rx_datagrams` unchanged, sink log empty |
| 17 | `/foo` works while 14–16 fail | ✅ all three protocols |
| 18 | no independent overlay path | ✅ timeout, measured with the host client **connected** |

## The numbers the POC existed to produce

- **Largest UDP datagram that survives the overlay: 1252 bytes.** Bisected: 1252 intact, 1253
  gone. `wt0` MTU is 1280 on both peers, and 1252 + 8 (UDP) + 20 (IPv4) = 1280 exactly. Datagrams
  above it are **dropped, not fragmented**. 1400 / 1472 / 2000 / 8000 all vanished silently with no
  ICMP back to the sender. This is the number the Omada device protocols live or die by.
- **UDP downtime after replacing the egress pod: 12 s.** Old pod gone t+3 s, new Envoy Ready
  t+10 s, TCP *and* UDP both back at t+12 s. No UDP conntrack staleness was observed at all — the
  blackhole this assertion was written to catch did not materialise. Far inside the ~81 s this
  design budgeted, because a static-config Envoy has no Gateway shutdown-manager drain.
- **`pods verified` is grantable with ZERO RBAC change.** vcluster's `system:coredns` ClusterRole
  already carries `pods: list, watch`. CoreDNS loaded `.:1053` **and** `vpn.blueora.ng.:1053` and
  did not crash. **Option A is unblocked**; fallback B is not needed.
- **Idle cost of merging both directions into one pod: ~26–32 MiB Envoy RSS** plus a NetBird client.

## Three findings that change the design

### 1. A resolver startup race silently and permanently kills egress

The single most important result, and it is not in the plan.

A native sidecar is only *started*, not *initialised*, before the main container runs. Measured:
Envoy reached its dispatch loop at `19:16:54.245`; netbird replaced `/etc/resolv.conf` at
`19:16:56.446` — **2.2 s later**. Envoy's c-ares resolver reads that file **once at construction**,
so it kept querying the kube-dns address the file held at boot, which answers NXDOMAIN for a mesh
name (the view keys on `mesh-identity`, and the Envoy pod deliberately does not carry it).

The failure mode is the dangerous kind:

- every STRICT_DNS egress cluster sat at `membership_total: 0` **forever**;
- `update_failure: 0`, `update_empty: 0`, **nothing in the log**;
- the pod stayed `Running` and `2/2 Ready`;
- **it does not self-heal** — it survived 300 s of continuous polling;
- ingress kept working perfectly (STATIC ClusterIPs), so the service looked healthy in one
  direction while the other was dead.

Proof it was the race and nothing else: restarting **only** the envoy container, with netbird and
its resolv.conf already in place, took the clusters to `membership_healthy: 1` immediately and all
three protocols recovered.

This is why the first pod worked and its replacement did not — the first simply won the race. **Any
production mesh peer doing DNS-based egress needs the ordering forced**, not assumed. The fix used
here is a plain blocking init container, ordered after the netbird sidecar, that exits only once the
mesh name resolves; after it, netbird wrote resolv.conf at `19:25:52.978` and Envoy started at
`19:25:54.618` — the ordering inverted, and egress was healthy from cold.

### 2. One NetBird policy with two protocols programs only ONE of them

Assertion 7 **failed as the account was configured**: `homelab reach foo` was `proto=all` on all
ports, so a peer permitted only to reach foo's *ingress* inherited foo's entire *egress* authority.
Proven, not inferred — from the macbook, which has **no policy permitting it to reach bar at all**:

```
curl --resolve bar.vpn.blueora.ng:10000:<foo peer>  →  200, BAR-HTTP-OK served by shine nginx
nc <foo peer> 10001                                →  BAR-TCP-OK:relay-tcp
udp → <foo peer>:10002                             →  echo returned from shine's udp-echo
```

Narrowing the policy to the declared ingress ports blocked `:10000`/`:10001` while `:443` kept
working — so **per-port ACL enforcement is real** (this was listed as deliberately out of scope;
it is now tested).

But narrowing it exposed a second bug. A single policy carrying **two rules with different
protocols** (`tcp/443` + `udp/7777`) programmed only the TCP rule into the peer's firewall:

```
-A NETBIRD-ACL-INPUT -p tcp ... --dport 443 -j ACCEPT      <- present
                                                            <- the udp rule is simply absent
-A INPUT -i wt0 -j DROP                                     <- ate every inbound UDP datagram
```

The management API accepted it, returned it, and the peer logged `total rules count: 4`. Inbound
UDP never reached Envoy (`ingress_udp` rx counter never moved). Splitting into **one policy per
protocol** programmed both rules and UDP ingress worked immediately. This is exactly the shape the
repo already uses for `svc-omada-tcp` + `svc-omada-udp` — that convention is now explained rather
than merely inherited, and it is a hard requirement, not a style choice.

### 3. NetBird DNS is scoped to the policy RELATIONSHIP, not its direction

Assertion 14's premise is wrong. The `bar` peer **can** resolve `foo.vpn.blueora.ng` →
`100.65.81.14` even though `foo → bar` is one-way and bar may not initiate to foo. Characterised:

| name queried from the bar peer | answer |
|---|---|
| `foo.vpn.blueora.ng` | `100.65.81.14` — bar's policy counterpart, resolvable despite the denial |
| `pikvm.vpn.blueora.ng` | `100.65.192.152` — reachable via an `All →` resource policy |
| `macbook…`, `openbao…`, `omada…`, `nonexistent…` | NXDOMAIN |

So resolvability tracks *having a policy relationship*, not *being permitted to initiate*.
**DNS-resolvability is therefore not a usable signal for access denial** — the cleanest negative
signal the plan hoped for does not exist. The denial itself is real and was confirmed at the
connection level instead (15 and 16), with 16 verified at the receiving end exactly as its warning
demanded.

## Option C validated by experiment — and it is worse than "does not work"

The design correction was asserted from the `kubernetes` plugin's documented requirement, not
measured. It has now been measured, and the prediction holds — but the failure mode is more
dangerous than "every view expression evaluates false".

A second CoreDNS was deployed in `kerk` carrying the **same** view block on its own zone
`optc.test`, reached from the main CoreDNS by `forward . <its ClusterIP>` — the Tailscale
stub-domain shape exactly. Answers were made self-labelling: `bar-forward`'s ClusterIP means the
view matched, and a `192.0.2.99` sentinel from a trailing viewless block means it did not, so
"view did not match" could never be confused with "no answer". The same view block was reachable
two ways from the *same pod*, so hop count was the only variable.

| # | path from `foo-d87bd8b5b-27dvl` (`10.244.0.24`, `mesh-identity=foo`) | answer | |
|---|---|---|---|
| 1 | **direct** to the second CoreDNS — one hop | `10.109.77.35` | view **matched** |
| 2 | **forwarded** via the main CoreDNS — two hops | `192.0.2.99` | view **did not match** |
| 3 | option A, same process | `10.109.77.35` | view **matched** |

The second CoreDNS's own query log gives the mechanism directly, no inference:

```
10.244.0.24:36776  "A IN bar.optc.test."   <- direct:    the foo pod itself
10.244.0.32:47237  "A IN bar.optc.test."   <- forwarded: the MAIN COREDNS POD
```

### The part that matters more than the failure

A natural objection is that forwarding might break `metadata()` generally rather than specifically
substituting the client. It does not — and proving that produced the real finding. Labelling **the
main CoreDNS pod itself** with `mesh-identity=foo`:

| client, through the forward | before labelling the forwarder | after |
|---|---|---|
| `outsider` pod — **no label at all** | `192.0.2.99` | **`10.109.77.35`** |
| `foo` pod | `192.0.2.99` | `10.109.77.35` |

So under option C the view is not broken at all. It works perfectly — against the **forwarder's**
identity. One pod's labels then decide the answer for **every client in the cluster**, and the
`outsider` pod, which exists purely as the default-deny control and carries no label, was handed
the mesh address.

That converts option C from "does not work" to **"silently converts a per-consumer allowlist into a
cluster-wide grant"**, controlled by a label on the DNS server pod. It would pass assertion 1 and
fail assertion 4 open, which is the worst possible combination: the feature looks like it works and
the access control is simply absent.

Reverted afterwards — the `optc.server` key, the label and all second-CoreDNS resources removed,
and option A re-verified unchanged (`10.109.77.35` from a `foo` pod, NXDOMAIN from the outsider,
`/foo` still `200`).

## Certificate reload — measured 2026-10-26, and it changes the rollout calculus

This was listed as out of scope ("cert rotation on the combined pod … a cert reload or any
rollout now drops **egress** too"). Measured on `shine`, rotating `Secret/mesh-tls` under a
running pod and watching the **served** certificate from inside the cluster:

| Envoy TLS config | behaviour on rotation |
|---|---|
| inline `tls_certificates` with `filename:` | **never reloads** — 235 s, 0 restarts, old cert still served |
| …plus `watched_directory` on the inline cert | **still never reloads** — the field parses and is silently ignored |
| file-based SDS (`tls_certificate_sds_secret_configs` + `path_config_source` + `watched_directory`) | **reloads in place — 63 s, same pod, 0 restarts** |

The inline case is confirmed as an Envoy-side failure, not a kubelet one: the mounted file had
already changed (`CN = ROTATION-TEST-CERT` on disk inside the container, `..data` symlink swapped)
while Envoy kept serving `*.vpn.blueora.ng`. The giveaway is in the startup log —
`loading 0 static secret(s)` — an inline certificate is never registered with the secret manager,
so nothing watches it. **`watched_directory` on an inline `TlsCertificate` is a no-op**; it only
takes effect on a secret delivered through SDS.

Working shape:

```yaml
node: {id: bar-mesh, cluster: mesh}     # REQUIRED — SDS refuses to start without node.id+cluster
...
              common_tls_context:
                tls_certificate_sds_secret_configs:
                  - name: mesh_tls
                    sds_config:
                      path_config_source:
                        path: /etc/envoy-sds/sds-mesh-tls.yaml
                        watched_directory: {path: /etc/envoy-sds}
                      resource_api_version: V3
```
```yaml
# /etc/envoy-sds/sds-mesh-tls.yaml
resources:
  - "@type": type.googleapis.com/envoy.extensions.transport_sockets.tls.v3.Secret
    name: mesh_tls
    tls_certificate:
      certificate_chain: {filename: /etc/mesh-tls/tls.crt}
      private_key: {filename: /etc/mesh-tls/tls.key}
      watched_directory: {path: /etc/mesh-tls}
```

Consequence: **certificate renewal no longer needs a pod restart**, so it no longer drops egress.
That removes renewal from the list of things the 1-replica + `Recreate` constraint makes expensive,
leaving only genuine config changes and image bumps. Re-verified end to end afterwards with SDS in
the path: `/foo` 200, TLSv1.3, SAN `*.vpn.blueora.ng`, raw TCP and UDP intact.

## Smaller things worth keeping

- **Both `udp_proxy` forms validate on v1.39.1.** `matcher` is accepted (warned as
  work-in-progress); the bare `cluster:` is accepted and warned as deprecated. `matcher` is the one
  that survives. Validated with `--mode validate` before deploying, as planned.
- **`envoyproxy/envoy:v1.39.1`'s entrypoint fails closed and silent under a hardened
  securityContext.** With caps dropped it cannot `chown /dev/stdout`, exits 1, and emits **nothing
  but the chown warning** — a perfectly valid config looks like a config error. Set
  `command: [/usr/local/bin/envoy]` to bypass it. Cost ~15 minutes; would have cost an afternoon
  without the `--mode validate` baseline to compare against.
- **The first UDP datagram after a peer replacement can be lost.** Observed once immediately after
  a roll; steady state is 12/12. UDP has no retransmit, so a device protocol must tolerate it.
- **`kubectl rollout restart` + `rollout status` returns before the old pods are gone.** A naive
  `kubectl get pod … | head -1` picks a `Terminating` pod and runs the whole suite against stale
  code. Filter on `--field-selector=status.phase=Running`.
- **Mixed TCP/UDP on one ClusterIP works**, as predicted: `443/TCP,9000/TCP,7777/UDP` on a single
  `bar-forward` IP.
- **`masqueradeAll: false`** and no node-local DNS cache in either vcluster, so the hard constraint
  protecting the view mechanism holds.
- **No stale peers.** After several pod rolls, exactly one peer per group, each holding its own
  extra DNS label. `preStop: netbird deregister` plus ephemeral setup keys did their job.
- **Test validity deviation:** the macOS client stayed **connected** (the host is remote on
  `192.168.0.132` and reaches PiKVM only over the mesh, so disconnecting would have forfeited
  assertion 1b — the only test of the full thesis). Assertion 18 was therefore **measured** rather
  than held by construction, and it passed: no route from a `foo` pod to `100.65.0.0/16`. The
  macbook advertises no networks and `kerk` has no `NBRoutingPeer`, so there was no path for it to
  provide.

## Open questions, answered

- `pods verified` under vcluster — **yes, no RBAC change needed.** Option A confirmed.
- One static config across TLS + raw TCP + UDP, both directions — **yes**, five listeners, no
  interference.
- Largest UDP datagram over the overlay — **1252 bytes.**
- UDP downtime after the egress pod is replaced — **12 s**, and conntrack staleness did not appear.
- 10-replica consumer behind a label-keyed view — **uniform**, 10/10 twice.
- Does one-way `foo → bar` block the reverse — **yes at the connection level, including UDP**; but
  **policy-scoped DNS is not a reliable signal for it.**
- Idle RSS — **~26–32 MiB** Envoy, plus the NetBird client.

## Still not proven

- **Multi-destination egress from one identity** — unchanged, proven in principle only.
- **Cert rotation on the combined pod** — **now resolved**, see the certificate-reload section:
  file-based SDS reloads the keypair in place in 63 s with no restart, so renewal does not drop
  egress. The 1-replica + `Recreate` cost now applies only to real config changes and image bumps,
  and the measured window for those is 12 s rather than the ~81 s this plan assumed.
- **`NetworkEgress` / operator 0.8.0** — untouched. The UDP leg here succeeded via static Envoy, so
  the observation that `NetworkEgressPort` has no protocol field stands unchallenged.

---

## Protocol traps

Things that will cost an afternoon each if they are met for the first time during debugging.

- **Envoy's `udp_proxy` config shape has moved.** `UdpProxyConfig` historically took a bare
  `cluster:` field; newer Envoy expects a `matcher` with an on-no-match action, and `cluster` is
  deprecated. The cached image is `envoyproxy/envoy:distroless-v1.39.1` — **confirm which form it
  accepts before writing all three listeners**, because a rejected bootstrap fails the whole
  process, taking the working TCP and TLS listeners down with it. Build the UDP listener first,
  alone, then add the others.
- **`udp_proxy` is session-based.** Envoy keys a "session" on the client's source IP:port with an
  idle timeout. Fine for request/response echo; worth knowing before anything long-lived or
  one-directional (telemetry, syslog) rides it.
- **MTU is the real UDP risk.** WireGuard lowers the path MTU. TCP absorbs this through MSS
  clamping; UDP has no equivalent, so a datagram that fits on a LAN can silently disappear over
  the overlay. Assertion 12 exists to find the ceiling, and the answer should be recorded as a
  number in this file once measured.
- **UDP conntrack can blackhole after a pod roll.** kube-proxy keeps UDP conntrack entries that may
  continue pointing at a replaced endpoint. Combined with `Recreate` + 1 replica and the measured
  ~81 s gap, a rollout can leave UDP broken for longer than the pod was actually missing.
- **A Service with mixed TCP and UDP ports is fine for `ClusterIP`.** The restriction people
  remember applies to `LoadBalancer` on some clouds. One `bar-forward` ClusterIP carrying both is
  correct and intended.
- **Raw listeners carry no certificate.** The "valid certificate" requirement applies only to the
  terminated HTTPS listener. A raw TCP or UDP mesh service is protected by the overlay and the
  NetBird ACL, nothing else — which is the same trust model the Omada device ports already rely on.
- **`kubernetes cluster.local { pods verified }` must be multi-line.** The single-line form is a
  parse error and CrashLoops CoreDNS. Learned the hard way during the view spike.

## Phase 6 — Teardown

Order matters — setup keys pin groups, so keys must go before groups:

1. NetBird **setup keys** → peers. ⚠️ The groups `foo` / `bar` and the `foo → bar` policy were
   created **by hand, outside git**. Confirm whether they should survive this POC before deleting
   them; the same applies to any ingress policy added for assertion 1.
2. Confirm the `foo` / `bar` peers deregistered. `preStop` should handle it; verify, because stale
   peers holding a DNS label is the documented failure mode (five stale `jwks-gateway` peers
   accumulated once for exactly this reason).
3. `vcluster delete kerk shine`.
4. Delete the copied TLS Secrets with the clusters.
5. Re-check disk.

---

## Open questions this POC answers

- Whether `pods verified` is grantable in a vcluster's CoreDNS without fighting vcluster's own
  reconciliation — **gates option A**.
- Whether one static Envoy config cleanly serves a TLS-terminating listener, a raw TCP listener and
  a **UDP** listener with no interference — four listeners, three protocols, both directions.
- **The largest UDP datagram that survives the overlay.** Record the measured number.
- **How long UDP stays broken after the egress pod is replaced** (conntrack staleness vs. the ~81 s
  `Recreate` gap).
- Whether a 10-replica consumer behind a label-keyed view behaves uniformly.
- Whether the one-way `foo → bar` policy genuinely blocks the reverse direction, including over
  UDP, and whether policy-scoped DNS is the reliable signal for it.
- Idle RSS for the combined pod.

## Deliberately out of scope

- **Per-port ACL enforcement.** The hand-made policy permits `foo → bar` on **all protocols**, so
  nothing here proves a port-scoped grant. Narrowing it to `443/tcp, 9000/tcp, 7777/udp` and
  re-running assertions 1/9/10 is the cheap follow-up that would.
- **`NetworkEgress` / operator 0.8.0.** Note its `NetworkEgressPort` has **no protocol field**, so
  UDP has no path through that CRD at all — meaning if this POC's UDP leg succeeds, it succeeds via
  static Envoy and *not* via the upstream egress CRD. `NetworkEgress` exists only in `0.8.0`, which is still the
  latest release (2026-07-17) and still carries the sidecar-DNS regression — issue #383 **open**,
  PR #389 **open and unmerged**. The pin's stated rationale may nonetheless be stale: it cites the
  external-secrets sidecar, and ESO has been removed, while every netbird client in the repo is
  now a *declared* container rather than an injected one. Worth retesting separately.
- **Multi-destination egress from one identity.** Proven in principle (the `{1}` capture resolved
  two destinations to two ClusterIPs), not exercised here.
- **Cert rotation on the combined pod.** This is where merging the two directions has its real
  cost: the ingress pod is pinned to 1 replica + `Recreate` because two peers cannot share a DNS
  label, so a cert reload or any rollout now drops **egress** too — forfeiting the
  `RollingUpdate, maxUnavailable: 0` property the standalone egress relay was deliberately given.
  If that cost is unacceptable, the alternative is **two pods in one NetBird group**: ACLs are
  evaluated on group membership, not peer identity, so two peers still read as one service while
  keeping independent lifecycles.
