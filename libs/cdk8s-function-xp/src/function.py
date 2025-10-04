"""Crossplane function for rendering cdk8s Python code."""

import json
import re
import sys
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional


@dataclass
class Result:
    """Crossplane function result."""

    severity: str  # NORMAL, WARNING, FATAL
    message: str


@dataclass
class FunctionRequest:
    """Crossplane function request."""

    composite_resource: Dict[str, Any]
    desired_resources: List[Dict[str, Any]] = field(default_factory=list)

    def get_composite_spec(self) -> Dict[str, Any]:
        """Extract composite resource spec."""
        return self.composite_resource.get("spec", {})

    def get_cdk8s_code(self) -> str:
        """Extract cdk8s code from annotations."""
        annotations = self.composite_resource.get("metadata", {}).get("annotations", {})

        # Check for inline code
        code = annotations.get("cdk8s-function.crossplane.io/code")
        if code:
            return code

        # Check for ConfigMap reference
        code_ref = annotations.get("cdk8s-function.crossplane.io/code-ref")
        if code_ref:
            # TODO: Implement ConfigMap fetching in production
            raise ValueError("ConfigMap code reference not yet implemented")

        raise ValueError(
            "No cdk8s code found. Add 'cdk8s-function.crossplane.io/code' annotation."
        )


@dataclass
class FunctionResponse:
    """Crossplane function response."""

    apiVersion: str = "apiextensions.crossplane.io/v1beta1"
    kind: str = "FunctionResponse"
    composite_resource: Dict[str, Any] = field(default_factory=dict)
    desired_resources: List[Dict[str, Any]] = field(default_factory=list)
    results: List[Result] = field(default_factory=list)

    @classmethod
    def success(
        cls,
        composite_resource: Dict[str, Any],
        desired_resources: List[Dict[str, Any]],
        message: str = "Successfully rendered resources",
    ) -> "FunctionResponse":
        """Create a successful response."""
        response = cls(
            composite_resource=composite_resource,
            desired_resources=[
                {"name": f"resource-{i}", "resource": r}
                for i, r in enumerate(desired_resources)
            ],
            results=[Result(severity="NORMAL", message=message)],
        )
        return response

    @classmethod
    def error(
        cls,
        composite_resource: Dict[str, Any],
        error_message: str,
    ) -> "FunctionResponse":
        """Create an error response."""
        # Set error condition on composite
        if "status" not in composite_resource:
            composite_resource["status"] = {}

        composite_resource["status"]["conditions"] = [
            {
                "type": "Synced",
                "status": "False",
                "reason": "ReconcileError",
                "message": error_message,
            }
        ]

        response = cls(
            composite_resource=composite_resource,
            desired_resources=[],
            results=[Result(severity="FATAL", message=error_message)],
        )
        return response

    def add_resource(self, name: str, resource: Dict[str, Any]):
        """Add a resource to the response."""
        self.desired_resources.append({"name": name, "resource": resource})

    def set_composite_status(
        self, ready: bool = True, conditions: List[Dict[str, Any]] = None
    ):
        """Set composite resource status."""
        if "status" not in self.composite_resource:
            self.composite_resource["status"] = {}

        self.composite_resource["status"]["ready"] = ready

        if conditions:
            self.composite_resource["status"]["conditions"] = conditions

    def to_dict(self) -> Dict[str, Any]:
        """Convert response to dictionary."""
        return {
            "apiVersion": self.apiVersion,
            "kind": self.kind,
            "spec": {
                "desired": {
                    "composite": {"resource": self.composite_resource},
                    "resources": self.desired_resources,
                },
                "results": [
                    {"severity": r.severity, "message": r.message} for r in self.results
                ],
            },
        }


def parse_function_request(request_data: Dict[str, Any]) -> FunctionRequest:
    """Parse Crossplane function request."""
    spec = request_data.get("spec", {})
    observed = spec.get("observed", {})
    composite = observed.get("composite", {})
    resource = composite.get("resource")

    if not resource:
        raise ValueError("No composite resource found in request")

    desired = spec.get("desired", {})
    resources = desired.get("resources", [])

    return FunctionRequest(composite_resource=resource, desired_resources=resources)


def map_spec_to_props(spec: Dict[str, Any]) -> Dict[str, Any]:
    """Map Crossplane spec (camelCase) to cdk8s props (snake_case)."""

    def camel_to_snake(name: str) -> str:
        """Convert camelCase to snake_case."""
        s1 = re.sub("(.)([A-Z][a-z]+)", r"\1_\2", name)
        return re.sub("([a-z0-9])([A-Z])", r"\1_\2", s1).lower()

    def convert_dict(d: Dict[str, Any]) -> Dict[str, Any]:
        """Recursively convert dictionary keys."""
        result = {}
        for key, value in d.items():
            new_key = camel_to_snake(key)
            if isinstance(value, dict):
                result[new_key] = convert_dict(value)
            elif isinstance(value, list):
                result[new_key] = [
                    convert_dict(item) if isinstance(item, dict) else item
                    for item in value
                ]
            else:
                result[new_key] = value
        return result

    return convert_dict(spec)


def main():
    """Main function entry point."""
    try:
        # Read request from stdin
        request_data = json.loads(sys.stdin.read())

        # Parse request
        request = parse_function_request(request_data)

        # Get cdk8s code
        cdk8s_code = request.get_cdk8s_code()

        # Map spec to props
        spec = request.get_composite_spec()
        props = map_spec_to_props(spec)

        # Render cdk8s code
        from cdk8s_renderer import render_cdk8s

        resources = render_cdk8s(cdk8s_code, props)

        # Create success response
        response = FunctionResponse.success(
            composite_resource=request.composite_resource,
            desired_resources=resources,
            message=f"Successfully rendered {len(resources)} resources from cdk8s code",
        )

        # Set composite status
        response.set_composite_status(
            ready=True,
            conditions=[
                {
                    "type": "Synced",
                    "status": "True",
                    "reason": "ReconcileSuccess",
                    "message": "cdk8s resources rendered successfully",
                }
            ],
        )

        # Output response
        print(json.dumps(response.to_dict(), indent=2))

    except Exception as e:
        # Create error response
        error_response = FunctionResponse.error(
            composite_resource=request_data.get("spec", {})
            .get("observed", {})
            .get("composite", {})
            .get("resource", {}),
            error_message=f"cdk8s rendering failed: {str(e)}",
        )

        print(json.dumps(error_response.to_dict(), indent=2))
        sys.exit(1)


if __name__ == "__main__":
    main()
