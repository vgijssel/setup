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
            // ACL-B: admins reach the Omada controller (UI + device adoption ports) on the
            // omada-network VIP over the tailnet.
            {
                "src": ["group:admin"],
                "dst": ["svc:omada-network"],
                "ip":  ["tcp:*", "udp:*"],
            },
        ],
    }
  HUJSON
}
