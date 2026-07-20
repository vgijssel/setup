# The tailnet policy file, managed as code. This makes Terraform (reconciled by
# terranetes in the network cluster) the SOURCE OF TRUTH for the ENTIRE tailnet policy —
# manual edits in the admin console will be reverted on the next reconcile.
# overwrite_existing_content=true lets the first apply take over the hand-managed policy.
#
# Network-cluster additions vs the previous hand-managed policy:
#   - autoApprovers.services["svc:omada-network"] = ["tag:k8s"]
#       lets the network-ingress ProxyGroup advertise the Omada VIP (ACL-B).
#   - grant tag:k8s -> svc:secret tcp:443
#       lets the network cluster's in-cluster egress reach OpenBao (ACL-A). This is the
#       grant that resolves the chicken-and-egg: it must exist before terranetes here can
#       read OpenBao, so the FIRST apply is done out-of-band by network:configure.
#   - grant group:admin -> svc:omada-network (Omada TCP/UDP ports)
#       lets admins reach the Omada UI + adoption ports over the tailnet (ACL-B).
resource "tailscale_acl" "this" {
  overwrite_existing_content = true

  acl = <<-HUJSON
    {
        "autoApprovers": {
            "services": {
                // secret cluster's operator proxies (tag:k8s, via the secret-ingress
                // ProxyGroup) may advertise the "secret" Service VIP without manual approval
                "svc:secret": ["tag:k8s"],
                // network cluster's operator proxies (tag:k8s, via the network-ingress
                // ProxyGroup) may advertise the Omada "omada-network" Service VIP (ACL-B)
                "svc:omada-network": ["tag:k8s"],
                // ...and the "api-network" Service VIP: the reverse proxy exposing this
                // cluster's kube-apiserver at api.network.vgijssel.nl (ACL-D / T18).
                "svc:api-network": ["tag:k8s"],
            },
        },

        "groups": {"group:admin": ["mvgijssel@github"]},

        "tagOwners": {
            "tag:spacetail":           [],
            "tag:provisioner":         [],
            "tag:provisioner-k8s":     [],
            "tag:pikvm":               [],
            "tag:k8s-operator":        [],
            "tag:pihole-prod":         [],
            "tag:network-controllers": [],
            "tag:k8s":                 ["tag:k8s-operator"],
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
            // Allow admins to reach k8s services on port 443
            {
                "action": "accept",
                "src":    ["group:admin"],
                "dst":    ["tag:k8s:443", "tag:k8s:80"],
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
            // ACL-A: the network cluster's in-cluster egress proxy (tag:k8s) reaches the
            // secret cluster's OpenBao VIP so external-secrets + terranetes can read kv/*.
            {
                "src": ["tag:k8s"],
                "dst": ["svc:secret"],
                "ip":  ["tcp:443"],
            },
            // ACL-C: the SECRET cluster's egress proxy (tag:k8s) reaches the network
            // operator device (tag:k8s-operator) on 443, where the noauth API-server
            // proxy serves /openid/v1/jwks. This is the reverse of ACL-A and is what lets
            // secret's OpenBao fetch this cluster's JWKS live (jwt-network jwks_url). The
            // apiserver's own authz still applies: anonymous callers can read only the two
            // OIDC discovery endpoints (clusterrolebinding-oidc-discovery.yaml).
            // NOTE: superseded by ACL-D in T19 (JWKS moves to svc:api-network); removed then.
            {
                "src": ["tag:k8s"],
                "dst": ["tag:k8s-operator"],
                "ip":  ["tcp:443"],
            },
            // ACL-D (T18): the "api-network" Service VIP — the reverse proxy exposing this
            // cluster's kube-apiserver at api.network.vgijssel.nl (valid LE cert on 443).
            //  - group:admin reach it for kubectl over the tailnet.
            //  - tag:k8s (the SECRET cluster's in-cluster egress) reaches it so OpenBao can
            //    fetch this cluster's JWKS over a plain public HTTPS URL — this is what lets
            //    T19 retire the MagicDNS egress + CoreDNS rewrite (replacing ACL-C above).
            {
                "src": ["group:admin"],
                "dst": ["svc:api-network"],
                "ip":  ["tcp:443"],
            },
            {
                "src": ["tag:k8s"],
                "dst": ["svc:api-network"],
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
