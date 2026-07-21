# The tailnet policy file, managed as code. This makes Terraform (reconciled by
# terranetes in the network cluster) the SOURCE OF TRUTH for the ENTIRE tailnet policy —
# manual edits in the admin console will be reverted on the next reconcile.
# overwrite_existing_content=true lets the first apply take over the hand-managed policy.
#
# Per-cluster tag taxonomy (Phase 8): each cluster's operator + proxies carry their OWN
# tags (tag:secret-operator/tag:secret-k8s, tag:network-operator/tag:network-k8s) so
# cross-cluster grants express direction and each OAuth client is an independent root of
# trust. The key policy elements:
#   - autoApprovers.services: each Service VIP is approved for the per-cluster proxy tag
#       that advertises it (svc:secret/svc:api-secret <- tag:secret-k8s; svc:omada-network/
#       svc:api-network <- tag:network-k8s).
#   - ACL-A grant tag:network-k8s -> svc:secret tcp:443: lets the NETWORK cluster reach
#       OpenBao (external-secrets + terranetes read kv/*). Chicken-and-egg: this must exist
#       before terranetes here can read OpenBao, so the FIRST apply is out-of-band via
#       network:configure.
#   - ACL-D grant tag:secret-k8s -> svc:api-network tcp:443: lets the SECRET cluster's
#       OpenBao fetch this cluster's JWKS.
#   - ACL-B grant group:admin -> svc:omada-network (Omada TCP/UDP ports): admins reach the
#       Omada UI + adoption ports over the tailnet.
resource "tailscale_acl" "this" {
  overwrite_existing_content = true

  acl = <<-HUJSON
    {
        "autoApprovers": {
            "services": {
                // Each Service VIP is auto-approved for the per-cluster proxy tag that
                // advertises it (T24 complete; the legacy shared tag:k8s was retired once
                // both clusters re-registered onto their own tags).
                //   svc:secret / svc:api-secret  <- advertised by the SECRET ingress proxies (tag:secret-k8s)
                //   svc:omada-network / svc:api-network <- by the NETWORK ingress proxies (tag:network-k8s)
                "svc:secret": ["tag:secret-k8s"],
                "svc:omada-network": ["tag:network-k8s"],
                "svc:api-network": ["tag:network-k8s"],
                "svc:api-secret": ["tag:secret-k8s"],
            },
        },

        "groups": {"group:admin": ["mvgijssel@github"]},

        "tagOwners": {
            "tag:spacetail":           [],
            "tag:provisioner":         [],
            "tag:provisioner-k8s":     [],
            "tag:pikvm":               [],
            "tag:pihole-prod":         [],
            "tag:network-controllers": [],
            // Phase 8 (T22-T24): per-cluster operator+proxy tag pairs so cross-cluster
            // ACLs express DIRECTION ("secret -> network") and each cluster's OAuth client
            // is an independent root of trust. tag:<c>-operator mints tag:<c>-k8s == the
            // operator->proxy relationship. The legacy shared tag:k8s / tag:k8s-operator
            // were retired in T24 after both clusters re-registered onto these tags.
            "tag:secret-operator":     [],
            "tag:secret-k8s":          ["tag:secret-operator"],
            "tag:network-operator":    [],
            "tag:network-k8s":         ["tag:network-operator"],
        },

        "acls": [
            {
                "action": "accept",
                "src":    ["group:admin"],
                "dst": [
                    "tag:network-controllers:22",
                    "tag:network-controllers:443",
                    "tag:network-controllers:19999",
                ],
            },
            // Allow Spacetail CI to reach provisioner/pikvm/provisioner-k8s on port 22
            {
                "action": "accept",
                "src":    ["tag:spacetail"],
                "dst":    ["tag:provisioner:22", "tag:pikvm:22", "tag:provisioner-k8s:22"],
            },
            // Allow admins to reach provisioner/pikvm/provisioner-k8s on port 22
            {
                "action": "accept",
                "src":    ["group:admin"],
                "dst": [
                    "tag:provisioner:22",
                    "tag:pikvm:22",
                    "tag:provisioner-k8s:22",
                    "tag:pihole-prod:22",
                ],
            },
            // Allow admins to reach provisioner on port 8443 which hosts Incus
            {
                "action": "accept",
                "src":    ["group:admin"],
                "dst":    ["tag:provisioner:8443"],
            },
            // Allow admins to reach PiKVM web UI
            {
                "action": "accept",
                "src":    ["group:admin"],
                "dst":    ["tag:pikvm:443"],
            },
            // Allow admins to reach Kubernetes API
            {
                "action": "accept",
                "src":    ["group:admin"],
                "dst":    ["tag:provisioner-k8s:6443"],
            },
            // Allow admins to reach k8s services on port 443/80 (per-cluster proxy tags;
            // legacy tag:k8s retired in T24).
            {
                "action": "accept",
                "src":    ["group:admin"],
                "dst": [
                    "tag:secret-k8s:443", "tag:secret-k8s:80",
                    "tag:network-k8s:443", "tag:network-k8s:80",
                ],
            },
            // All users can use exit nodes
            {
                "action": "accept",
                "src":    ["autogroup:member"],
                "dst":    ["autogroup:internet:*"],
            },
        ],

        "ssh": [
            // Allow admins to ssh into the provisioner/pikvm/provisioner-k8s
            {
                "action": "check",
                "src":    ["group:admin"],
                "dst":    ["tag:provisioner", "tag:pikvm", "tag:provisioner-k8s", "tag:pihole-prod"],
                "users":  ["maarten", "deploy", "root"],
            },
            // Allow spacetail to ssh into the provisioner as root without confirmation check
            {
                "action": "accept",
                "src":    ["tag:spacetail"],
                "dst":    ["tag:provisioner", "tag:pikvm", "tag:provisioner-k8s"],
                "users":  ["deploy"],
            },
        ],

        "nodeAttrs": [
            {
                // Funnel policy, which lets tailnet members control Funnel for their own devices.
                "target": ["autogroup:member"],
                "attr":   ["funnel"],
            },
        ],

        "grants": [
            // Allow admins access to the local LAN through PiKVM as the subnet router
            {
                "src": ["group:admin"],
                "dst": ["192.168.50.0/24", "192.168.1.0/24"],
                "ip":  ["*"],
            },
            {
                "src": ["group:admin"],
                "dst": ["svc:secret"],
                "ip":  ["tcp:443", "tcp:80"],
            },
            // ACL-A: the network cluster's proxies reach the secret cluster's OpenBao VIP
            // so external-secrets + terranetes can read kv/*. DIRECTIONAL (network ->
            // secret): src is tag:network-k8s only — secret's OWN proxies (tag:secret-k8s)
            // cannot match this grant (T24 retired the shared tag:k8s).
            {
                "src": ["tag:network-k8s"],
                "dst": ["svc:secret"],
                "ip":  ["tcp:443"],
            },
            // ACL-D (T18/T19): the "api-network" Service VIP — the reverse proxy exposing
            // this cluster's kube-apiserver at api.network.vgijssel.nl (valid LE cert on 443).
            //  - group:admin reach it for kubectl over the tailnet.
            //  - tag:k8s (the SECRET cluster's in-cluster egress) reaches it so OpenBao can
            //    fetch this cluster's JWKS over a plain public HTTPS URL (jwt-network
            //    jwks_url). The apiserver's own authz still applies: anonymous callers can
            //    read only the two OIDC discovery endpoints (clusterrolebinding-oidc-discovery.yaml).
            // This is the SOLE JWKS path: T19 retired the old ACL-C (tag:k8s ->
            // tag:k8s-operator:443, the operator's noauth API-server proxy) along with the
            // MagicDNS egress + CoreDNS rewrite.
            {
                "src": ["group:admin"],
                "dst": ["svc:api-network"],
                "ip":  ["tcp:443"],
            },
            // DIRECTIONAL (secret -> network): src is tag:secret-k8s only (the secret
            // cluster's pods fetching this cluster's JWKS for OpenBao). T24 retired the
            // shared tag:k8s.
            {
                "src": ["tag:secret-k8s"],
                "dst": ["svc:api-network"],
                "ip":  ["tcp:443"],
            },
            // ACL-E (T20): the "api-secret" Service VIP — the reverse proxy exposing the
            // SECRET cluster's kube-apiserver at api.secret.vgijssel.nl (valid LE cert on
            // 443). Operator convenience only (kubectl over the tailnet): group:admin may
            // reach it. Unlike api-network there is NO tag:k8s grant — nothing fetches a
            // JWKS from the secret cluster. The apiserver's own authn/authz still applies.
            {
                "src": ["group:admin"],
                "dst": ["svc:api-secret"],
                "ip":  ["tcp:443"],
            },
            // ACL-B: admins reach the Omada controller on the omada-network VIP over the
            // tailnet. Explicit Omada port set (controller 6.x) rather than tcp:*/udp:*:
            //   8088  management/portal HTTP (redirects to HTTPS)
            //   8043  management UI HTTPS (the omada.network.vgijssel.nl endpoint)
            //   8843  portal HTTPS
            //   29811 device manager v1     29812 device adopt v1     29813 device upgrade v1
            //   29814 device manager v2     29815 device transfer v2  29816 rtty
            //   29817 device monitor (Omada 6)
            //   27001 app discovery (UDP)   29810 device discovery (UDP)  19810 device mgmt (UDP)
            {
                "src": ["group:admin"],
                "dst": ["svc:omada-network"],
                "ip": [
                    "tcp:8088",
                    "tcp:8043",
                    "tcp:8843",
                    "tcp:29811",
                    "tcp:29812",
                    "tcp:29813",
                    "tcp:29814",
                    "tcp:29815",
                    "tcp:29816",
                    "tcp:29817",
                    "udp:27001",
                    "udp:29810",
                    "udp:19810",
                ],
            },
        ],
    }
  HUJSON
}
