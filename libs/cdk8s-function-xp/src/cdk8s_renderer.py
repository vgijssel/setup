"""cdk8s renderer for executing Python cdk8s code."""

import io
import sys
from typing import Any, Dict, List

import yaml
from cdk8s import App


class CDK8sRenderError(Exception):
    """Error during cdk8s rendering."""

    pass


class CDK8sRenderer:
    """Renders cdk8s Python code to Kubernetes manifests."""

    def render(self, cdk8s_code: str, props: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Render cdk8s code with props to Kubernetes resources."""
        if not cdk8s_code:
            raise CDK8sRenderError("cdk8s code is empty")

        if cdk8s_code is None:
            raise CDK8sRenderError("cdk8s code is None")

        if props is None:
            raise CDK8sRenderError("props cannot be None")

        try:
            # Create cdk8s App
            app = App()

            # Prepare execution environment
            exec_globals = {
                "App": App,
                "app": app,
                "props": props,
            }

            # Add imports directory to Python path
            import os

            imports_dir = os.path.join(os.path.dirname(__file__), "..", "imports")
            if os.path.exists(imports_dir) and imports_dir not in sys.path:
                sys.path.insert(0, imports_dir)

            # Import common modules into exec environment
            exec(
                """
from cdk8s import Chart
from constructs import Construct
from imports import k8s
""",
                exec_globals,
            )

            # Execute cdk8s code
            exec(cdk8s_code, exec_globals)

            # Find Chart class and instantiate it
            chart_class = None
            for name, obj in exec_globals.items():
                if (
                    isinstance(obj, type)
                    and issubclass(obj, exec_globals.get("Chart", type))
                    and obj.__name__ != "Chart"
                ):
                    chart_class = obj
                    break

            if not chart_class:
                raise CDK8sRenderError("No Chart class found in cdk8s code")

            # Instantiate chart
            chart = chart_class(app, "dns-chart", props)

            # Synthesize to YAML
            synth_output = app.synth_yaml()

            # Parse YAML documents
            resources = []
            for doc in yaml.safe_load_all(synth_output):
                if doc:  # Skip empty documents
                    resources.append(doc)

            return resources

        except SyntaxError as e:
            raise CDK8sRenderError(f"Python syntax error in cdk8s code: {e}")
        except NameError as e:
            raise CDK8sRenderError(f"runtime error in cdk8s code: {e}")
        except (ValueError, TypeError, AttributeError) as e:
            raise CDK8sRenderError(f"runtime error in cdk8s code: {e}")
        except ImportError as e:
            raise CDK8sRenderError(f"Import error in cdk8s code: {e}")
        except Exception as e:
            raise CDK8sRenderError(f"cdk8s rendering failed: {e}")


def render_cdk8s(cdk8s_code: str, props: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Render cdk8s code to Kubernetes resources.

    Args:
        cdk8s_code: Python code defining a cdk8s Chart
        props: Properties to pass to the Chart

    Returns:
        List of Kubernetes resource dictionaries

    Raises:
        CDK8sRenderError: If rendering fails
    """
    renderer = CDK8sRenderer()
    return renderer.render(cdk8s_code, props)
