"""Test cdk8s renderer with valid code."""

import sys
from pathlib import Path

import pytest

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "src"))

from cdk8s_renderer import CDK8sRenderer, render_cdk8s  # noqa: E402


def test_render_simple_service():
    """Test rendering a simple Kubernetes Service with cdk8s."""
    cdk8s_code = """
from cdk8s import Chart
from imports import k8s

class DNSChart(Chart):
    def __init__(self, scope, id, props):
        super().__init__(scope, id)

        k8s.KubeService(self, 'dns-svc',
            metadata=k8s.ObjectMeta(name='dns-service'),
            spec=k8s.ServiceSpec(
                type='ClusterIP',
                ports=[k8s.ServicePort(port=53, protocol='UDP')]
            )
        )
"""

    props = {"domain": "test.local"}
    resources = render_cdk8s(cdk8s_code, props)

    assert len(resources) > 0
    service = next(r for r in resources if r["kind"] == "Service")
    assert service["metadata"]["name"] == "dns-service"
    assert service["spec"]["type"] == "ClusterIP"


def test_render_deployment():
    """Test rendering a Deployment with cdk8s."""
    cdk8s_code = """
from cdk8s import Chart
from imports import k8s

class DNSChart(Chart):
    def __init__(self, scope, id, props):
        super().__init__(scope, id)

        k8s.KubeDeployment(self, 'deployment',
            metadata=k8s.ObjectMeta(name='dns-deployment'),
            spec=k8s.DeploymentSpec(
                replicas=1,
                selector=k8s.LabelSelector(
                    match_labels={'app': 'dns'}
                ),
                template=k8s.PodTemplateSpec(
                    metadata=k8s.ObjectMeta(labels={'app': 'dns'}),
                    spec=k8s.PodSpec(
                        containers=[
                            k8s.Container(
                                name='dns',
                                image='dns-image:latest'
                            )
                        ]
                    )
                )
            )
        )
"""

    props = {}
    resources = render_cdk8s(cdk8s_code, props)

    deployment = next(r for r in resources if r["kind"] == "Deployment")
    assert deployment["metadata"]["name"] == "dns-deployment"
    assert deployment["spec"]["replicas"] == 1


def test_props_available_in_cdk8s():
    """Test that props are available in cdk8s code."""
    cdk8s_code = """
from cdk8s import Chart
from imports import k8s

class DNSChart(Chart):
    def __init__(self, scope, id, props):
        super().__init__(scope, id)

        domain = props.get('domain', 'default.local')

        k8s.KubeConfigMap(self, 'config',
            metadata=k8s.ObjectMeta(name='dns-config'),
            data={'domain': domain}
        )
"""

    props = {"domain": "internal.example.com"}
    resources = render_cdk8s(cdk8s_code, props)

    configmap = next(r for r in resources if r["kind"] == "ConfigMap")
    assert configmap["data"]["domain"] == "internal.example.com"


def test_renderer_class():
    """Test CDK8sRenderer class."""
    renderer = CDK8sRenderer()

    cdk8s_code = """
from cdk8s import Chart
from imports import k8s

class DNSChart(Chart):
    def __init__(self, scope, id, props):
        super().__init__(scope, id)

        k8s.KubeSecret(self, 'secret',
            metadata=k8s.ObjectMeta(name='api-key'),
            type='Opaque',
            string_data={'key': 'test-value'}
        )
"""

    resources = renderer.render(cdk8s_code, {"test": "value"})

    assert isinstance(resources, list)
    secret = next(r for r in resources if r["kind"] == "Secret")
    assert secret["metadata"]["name"] == "api-key"


def test_multiple_resources():
    """Test rendering multiple resources in one chart."""
    cdk8s_code = """
from cdk8s import Chart
from imports import k8s

class DNSChart(Chart):
    def __init__(self, scope, id, props):
        super().__init__(scope, id)

        k8s.KubeService(self, 'svc',
            metadata=k8s.ObjectMeta(name='service1'),
            spec=k8s.ServiceSpec(type='ClusterIP')
        )

        k8s.KubeConfigMap(self, 'cm',
            metadata=k8s.ObjectMeta(name='config1'),
            data={'key': 'value'}
        )
"""

    resources = render_cdk8s(cdk8s_code, {})

    assert len(resources) >= 2
    kinds = [r["kind"] for r in resources]
    assert "Service" in kinds
    assert "ConfigMap" in kinds
