"""DNS resources generation using Python (for testing and composition)."""

import secrets
from typing import Any, Dict, List


def create_dns_deployment(props: Dict[str, Any]) -> Dict[str, Any]:
    """Create DNS deployment with external-dns and PowerDNS containers."""
    domain = props.get("domain", "internal.local")
    external_dns_version = props.get("external_dns_version", "v0.14.0")
    powerdns_version = props.get("powerdns_version", "powerdns/pdns-auth-50")
    sync_interval = props.get("sync_interval", "30s")

    return {
        "apiVersion": "apps/v1",
        "kind": "Deployment",
        "metadata": {
            "name": "internal-dns-deployment",
            "labels": {"app": "internal-dns"},
        },
        "spec": {
            "replicas": 1,
            "selector": {"matchLabels": {"app": "internal-dns"}},
            "template": {
                "metadata": {"labels": {"app": "internal-dns"}},
                "spec": {
                    "containers": [
                        {
                            "name": "external-dns",
                            "image": f"registry.k8s.io/external-dns/external-dns:{external_dns_version}",
                            "args": [
                                "--source=ingress",
                                "--provider=pdns",
                                "--pdns-server=http://localhost:8081",
                                "--pdns-api-key=$(PDNS_API_KEY)",
                                f"--domain-filter={domain}",
                                f"--interval={sync_interval}",
                            ],
                            "env": [
                                {
                                    "name": "PDNS_API_KEY",
                                    "valueFrom": {
                                        "secretKeyRef": {
                                            "name": "powerdns-api-key",
                                            "key": "api-key",
                                        }
                                    },
                                }
                            ],
                        },
                        {
                            "name": "powerdns",
                            "image": powerdns_version,
                            "ports": [
                                {"containerPort": 53, "name": "dns", "protocol": "UDP"},
                                {
                                    "containerPort": 53,
                                    "name": "dns-tcp",
                                    "protocol": "TCP",
                                },
                                {"containerPort": 8081, "name": "api"},
                            ],
                            "volumeMounts": [
                                {"name": "dns-data", "mountPath": "/var/lib/powerdns"},
                                {"name": "config", "mountPath": "/etc/powerdns"},
                            ],
                        },
                    ],
                    "volumes": [
                        {
                            "name": "dns-data",
                            "persistentVolumeClaim": {"claimName": "dns-storage"},
                        },
                        {
                            "name": "config",
                            "configMap": {"name": "powerdns-config"},
                        },
                    ],
                },
            },
        },
    }


def create_dns_service(props: Dict[str, Any]) -> Dict[str, Any]:
    """Create DNS service."""
    return {
        "apiVersion": "v1",
        "kind": "Service",
        "metadata": {
            "name": "internal-dns-service",
            "labels": {"app": "internal-dns"},
        },
        "spec": {
            "type": "ClusterIP",
            "selector": {"app": "internal-dns"},
            "ports": [
                {"name": "dns-udp", "port": 53, "protocol": "UDP"},
                {"name": "dns-tcp", "port": 53, "protocol": "TCP"},
                {"name": "api", "port": 8081, "protocol": "TCP"},
            ],
        },
    }


def create_dns_pvc(props: Dict[str, Any]) -> Dict[str, Any]:
    """Create PersistentVolumeClaim for DNS storage."""
    storage_size = props.get("storage_size", "1Gi")

    return {
        "apiVersion": "v1",
        "kind": "PersistentVolumeClaim",
        "metadata": {
            "name": "dns-storage",
            "labels": {"app": "internal-dns"},
        },
        "spec": {
            "accessModes": ["ReadWriteOnce"],
            "resources": {"requests": {"storage": storage_size}},
        },
    }


def create_powerdns_config(props: Dict[str, Any]) -> Dict[str, Any]:
    """Create PowerDNS configuration ConfigMap."""
    pdns_conf = """launch=gsqlite3
gsqlite3-database=/var/lib/powerdns/pdns.sqlite3
webserver=yes
webserver-address=0.0.0.0
webserver-port=8081
api=yes
local-address=0.0.0.0
local-port=53"""

    return {
        "apiVersion": "v1",
        "kind": "ConfigMap",
        "metadata": {
            "name": "powerdns-config",
            "labels": {"app": "internal-dns"},
        },
        "data": {"pdns.conf": pdns_conf},
    }


def create_api_secret(props: Dict[str, Any]) -> Dict[str, Any]:
    """Create PowerDNS API key secret."""
    api_key = secrets.token_urlsafe(32)

    return {
        "apiVersion": "v1",
        "kind": "Secret",
        "metadata": {
            "name": "powerdns-api-key",
            "labels": {"app": "internal-dns"},
        },
        "type": "Opaque",
        "stringData": {"api-key": api_key},
    }


def create_all_dns_resources(props: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Create all DNS resources."""
    return [
        create_dns_deployment(props),
        create_dns_service(props),
        create_dns_pvc(props),
        create_powerdns_config(props),
        create_api_secret(props),
    ]
