"""Test cdk8s renderer error handling."""

import sys
from pathlib import Path

import pytest

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "src"))

from cdk8s_renderer import CDK8sRenderError, render_cdk8s  # noqa: E402


def test_syntax_error_raises_exception():
    """Test that Python syntax errors are caught."""
    invalid_code = """
from cdk8s import Chart

class DNSChart(Chart):
    def __init__(self, scope, id, props):
        super().__init__(scope, id
        # Missing closing parenthesis
"""

    with pytest.raises(CDK8sRenderError, match="syntax"):
        render_cdk8s(invalid_code, {})


def test_runtime_error_raises_exception():
    """Test that runtime errors are caught."""
    error_code = """
from cdk8s import Chart

class DNSChart(Chart):
    def __init__(self, scope, id, props):
        super().__init__(scope, id)
        raise ValueError("Intentional error")
"""

    with pytest.raises(CDK8sRenderError, match="runtime"):
        render_cdk8s(error_code, {})


def test_import_error_raises_exception():
    """Test that import errors are caught."""
    invalid_import = """
from cdk8s import Chart
from nonexistent_module import something

class DNSChart(Chart):
    def __init__(self, scope, id, props):
        super().__init__(scope, id)
"""

    with pytest.raises(CDK8sRenderError):
        render_cdk8s(invalid_import, {})


def test_missing_chart_class_raises_error():
    """Test that code without Chart class raises error."""
    no_chart = """
print("This is not a cdk8s chart")
"""

    with pytest.raises(CDK8sRenderError, match="Chart"):
        render_cdk8s(no_chart, {})


def test_invalid_kubernetes_resource_raises_error():
    """Test that attempting to access undefined k8s resources raises error."""
    invalid_resource = """
from cdk8s import Chart
from imports import k8s

class DNSChart(Chart):
    def __init__(self, scope, id, props):
        super().__init__(scope, id)

        # Attempting to use a non-existent Kubernetes resource type
        k8s.KubeNonExistentResource(self, 'invalid')
"""

    with pytest.raises(CDK8sRenderError):
        render_cdk8s(invalid_resource, {})


def test_empty_code_raises_error():
    """Test that empty code raises error."""
    with pytest.raises(CDK8sRenderError, match="empty"):
        render_cdk8s("", {})


def test_none_code_raises_error():
    """Test that None code raises error."""
    with pytest.raises(CDK8sRenderError):
        render_cdk8s(None, {})


def test_error_includes_line_number():
    """Test that errors include line number information."""
    error_code = """
from cdk8s import Chart

class DNSChart(Chart):
    def __init__(self, scope, id, props):
        super().__init__(scope, id)
        undefined_variable  # This will cause NameError
"""

    try:
        render_cdk8s(error_code, {})
    except CDK8sRenderError as e:
        assert "line" in str(e).lower() or "undefined_variable" in str(e)


def test_props_type_error():
    """Test that invalid props type is handled."""
    code = """
from cdk8s import Chart

class DNSChart(Chart):
    def __init__(self, scope, id, props):
        super().__init__(scope, id)
        domain = props['domain']  # Will fail if props is not dict
"""

    with pytest.raises(CDK8sRenderError):
        render_cdk8s(code, None)  # Invalid props type
