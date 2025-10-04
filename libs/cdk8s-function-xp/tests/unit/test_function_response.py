"""Test Crossplane function response contract."""

import sys
from pathlib import Path

import pytest

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "src"))

from function import FunctionResponse, Result  # noqa: E402


def test_create_success_response():
    """Test creating a successful function response."""
    resources = [
        {
            "apiVersion": "v1",
            "kind": "Service",
            "metadata": {"name": "dns-service"},
        }
    ]

    response = FunctionResponse.success(
        composite_resource={
            "apiVersion": "dns.internal/v1alpha1",
            "kind": "XInternalDNS",
            "metadata": {"name": "test"},
            "spec": {"domain": "test.local"},
        },
        desired_resources=resources,
        message="Successfully rendered resources",
    )

    assert response.apiVersion == "apiextensions.crossplane.io/v1beta1"
    assert response.kind == "FunctionResponse"
    assert len(response.desired_resources) == 1
    assert response.results[0].severity == "NORMAL"


def test_create_error_response():
    """Test creating an error function response."""
    response = FunctionResponse.error(
        composite_resource={
            "apiVersion": "dns.internal/v1alpha1",
            "kind": "XInternalDNS",
            "metadata": {"name": "test"},
        },
        error_message="Failed to render cdk8s code",
    )

    assert response.kind == "FunctionResponse"
    assert len(response.results) == 1
    assert response.results[0].severity == "FATAL"
    assert "Failed to render" in response.results[0].message


def test_response_to_dict():
    """Test converting response to dictionary."""
    response = FunctionResponse.success(
        composite_resource={
            "apiVersion": "dns.internal/v1alpha1",
            "kind": "XInternalDNS",
            "metadata": {"name": "test"},
        },
        desired_resources=[],
        message="Test message",
    )

    response_dict = response.to_dict()

    assert response_dict["apiVersion"] == "apiextensions.crossplane.io/v1beta1"
    assert response_dict["kind"] == "FunctionResponse"
    assert "desired" in response_dict["spec"]
    assert "results" in response_dict["spec"]


def test_add_resource_to_response():
    """Test adding resources to response."""
    response = FunctionResponse.success(
        composite_resource={"metadata": {"name": "test"}},
        desired_resources=[],
    )

    response.add_resource(
        "deployment",
        {
            "apiVersion": "apps/v1",
            "kind": "Deployment",
            "metadata": {"name": "dns-deployment"},
        },
    )

    assert len(response.desired_resources) == 1
    assert response.desired_resources[0]["name"] == "deployment"


def test_set_composite_status():
    """Test setting composite resource status."""
    response = FunctionResponse.success(
        composite_resource={
            "apiVersion": "dns.internal/v1alpha1",
            "kind": "XInternalDNS",
            "metadata": {"name": "test"},
        },
        desired_resources=[],
    )

    response.set_composite_status(
        ready=True,
        conditions=[
            {
                "type": "Synced",
                "status": "True",
                "reason": "ReconcileSuccess",
            }
        ],
    )

    assert response.composite_resource["status"]["ready"] is True
    assert len(response.composite_resource["status"]["conditions"]) == 1


def test_result_severity_levels():
    """Test Result severity levels."""
    normal = Result(severity="NORMAL", message="Info")
    warning = Result(severity="WARNING", message="Warning")
    fatal = Result(severity="FATAL", message="Error")

    assert normal.severity == "NORMAL"
    assert warning.severity == "WARNING"
    assert fatal.severity == "FATAL"
