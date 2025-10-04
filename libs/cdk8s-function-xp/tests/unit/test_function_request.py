"""Test Crossplane function request contract."""

import sys
from pathlib import Path

import pytest

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "src"))

from function import FunctionRequest, parse_function_request  # noqa: E402


def test_parse_valid_function_request():
    """Test parsing a valid Crossplane function request."""
    request_data = {
        "apiVersion": "apiextensions.crossplane.io/v1beta1",
        "kind": "FunctionRequest",
        "metadata": {"name": "test"},
        "spec": {
            "observed": {
                "composite": {
                    "resource": {
                        "apiVersion": "dns.internal/v1alpha1",
                        "kind": "XInternalDNS",
                        "metadata": {"name": "test-dns"},
                        "spec": {
                            "domain": "internal.example.com",
                            "storageSize": "1Gi",
                        },
                    }
                }
            },
            "desired": {"composite": {"resource": {}}, "resources": []},
        },
    }

    req = parse_function_request(request_data)
    assert isinstance(req, FunctionRequest)
    assert req.composite_resource["metadata"]["name"] == "test-dns"
    assert req.composite_resource["spec"]["domain"] == "internal.example.com"


def test_extract_composite_spec():
    """Test extracting composite spec from request."""
    request_data = {
        "spec": {
            "observed": {
                "composite": {
                    "resource": {
                        "apiVersion": "dns.internal/v1alpha1",
                        "kind": "XInternalDNS",
                        "metadata": {"name": "test"},
                        "spec": {
                            "domain": "test.local",
                            "storageSize": "2Gi",
                            "syncInterval": "60s",
                        },
                    }
                }
            }
        }
    }

    req = parse_function_request(request_data)
    spec = req.get_composite_spec()

    assert spec["domain"] == "test.local"
    assert spec["storageSize"] == "2Gi"
    assert spec["syncInterval"] == "60s"


def test_missing_composite_resource_raises_error():
    """Test that missing composite resource raises error."""
    invalid_request = {"spec": {"observed": {}, "desired": {"resources": []}}}

    with pytest.raises(ValueError, match="composite resource"):
        parse_function_request(invalid_request)


def test_get_cdk8s_code_from_annotation():
    """Test extracting cdk8s code from annotation."""
    request_data = {
        "spec": {
            "observed": {
                "composite": {
                    "resource": {
                        "apiVersion": "dns.internal/v1alpha1",
                        "kind": "XInternalDNS",
                        "metadata": {
                            "name": "test",
                            "annotations": {
                                "cdk8s-function.crossplane.io/code": "print('hello')"
                            },
                        },
                        "spec": {"domain": "test.local"},
                    }
                }
            }
        }
    }

    req = parse_function_request(request_data)
    code = req.get_cdk8s_code()

    assert code == "print('hello')"


def test_missing_cdk8s_code_raises_error():
    """Test that missing cdk8s code annotation raises error."""
    request_data = {
        "spec": {
            "observed": {
                "composite": {
                    "resource": {
                        "apiVersion": "dns.internal/v1alpha1",
                        "kind": "XInternalDNS",
                        "metadata": {"name": "test"},
                        "spec": {"domain": "test.local"},
                    }
                }
            }
        }
    }

    req = parse_function_request(request_data)

    with pytest.raises(ValueError, match="cdk8s code"):
        req.get_cdk8s_code()
