#!/usr/bin/env python3
"""
Record real HTTP responses from Coder API for test fixtures.

This script makes actual HTTP calls to a live Coder instance and records
the responses to JSON files, with automatic secret sanitization.

Usage:
    python scripts/record_fixtures.py --scenario agent_creation
    python scripts/record_fixtures.py --scenario agent_lifecycle
    python scripts/record_fixtures.py --all

Environment Variables:
    CODER_URL: Coder instance URL (required)
    CODER_SESSION_TOKEN: Coder API token (required)
"""

import argparse
import asyncio
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

import httpx
import yaml

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from scripts.sanitize import sanitize_response
from src.fleet_mcp.coder.client import CoderClient


class FixtureRecorder:
    """Records HTTP responses from Coder API with sanitization."""

    def __init__(
        self,
        base_url: str,
        token: str,
        output_dir: Path,
        sanitize: bool = True,
    ):
        """
        Initialize recorder.

        Args:
            base_url: Coder API base URL
            token: Coder session token
            output_dir: Directory to write recordings
            sanitize: Whether to sanitize secrets (default True)
        """
        self.client = CoderClient(base_url=base_url, token=token)
        self.output_dir = output_dir
        self.sanitize_enabled = sanitize
        self.recordings: list[dict] = []

        # Ensure output directory exists
        self.output_dir.mkdir(parents=True, exist_ok=True)

        # Track created resources for cleanup
        self.created_workspaces: list[str] = []

    async def record_call(
        self,
        name: str,
        method: str,
        endpoint: str,
        **kwargs,
    ) -> dict:
        """
        Make an HTTP call and record the response.

        Args:
            name: Name for this recording
            method: HTTP method (GET, POST, etc.)
            endpoint: API endpoint path
            **kwargs: Additional arguments for httpx request

        Returns:
            Response data
        """
        url = f"{self.client.base_url}{endpoint}"

        print(f"  Recording: {name}")
        print(f"    → {method} {endpoint}")

        # Make request
        headers = kwargs.pop("headers", {})
        headers["Coder-Session-Token"] = self.client.token

        async with httpx.AsyncClient() as client:
            response = await client.request(method, url, headers=headers, **kwargs)

        # Parse response
        try:
            data = response.json()
        except Exception:
            data = {"_raw": response.text}

        # Record metadata
        recording = {
            "name": name,
            "method": method,
            "endpoint": endpoint,
            "status_code": response.status_code,
            "headers": dict(response.headers),
            "data": data,
            "recorded_at": datetime.now(timezone.utc).isoformat(),
        }

        # Sanitize if enabled
        if self.sanitize_enabled:
            recording = sanitize_response(
                recording, base_url="https://coder.example.com"
            )

        self.recordings.append(recording)

        print(f"    ✓ Status {response.status_code}")

        return data

    async def run_scenario(self, scenario_name: str, scenario_def: dict) -> None:
        """
        Run a recording scenario.

        Args:
            scenario_name: Name of scenario
            scenario_def: Scenario definition from YAML
        """
        print(f"\n{'='*60}")
        print(f"Running scenario: {scenario_name}")
        print(f"Description: {scenario_def.get('description', 'N/A')}")
        print(f"{'='*60}\n")

        # Setup phase
        setup_steps = scenario_def.get("setup", [])
        if setup_steps:
            print("Setup phase:")
            for step in setup_steps:
                await self._execute_step(step, is_setup=True)

        # Recording phase
        record_steps = scenario_def.get("record", [])
        print("\nRecording phase:")
        for step in record_steps:
            await self._execute_step(step, is_setup=False)

        # Teardown phase
        teardown_steps = scenario_def.get("teardown", [])
        if teardown_steps:
            print("\nTeardown phase:")
            for step in teardown_steps:
                await self._execute_step(step, is_setup=True)

        # Write recordings to file
        output_file = self.output_dir / f"{scenario_name}.json"
        with open(output_file, "w") as f:
            json.dump(self.recordings, f, indent=2)

        print(f"\n✓ Recorded {len(self.recordings)} calls to {output_file}")

    async def _execute_step(self, step: str | dict, is_setup: bool) -> None:
        """
        Execute a single scenario step.

        Args:
            step: Step definition (string or dict)
            is_setup: Whether this is setup/teardown (not recorded)
        """
        if isinstance(step, str):
            step_name = step
            step_params = {}
        else:
            step_name = list(step.keys())[0]
            step_params = step[step_name]

        # Execute step based on name
        if step_name == "list_templates":
            await self.client.list_templates()
            if not is_setup:
                await self.record_call(
                    "list_templates",
                    "GET",
                    "/api/v2/templates",
                )
        elif step_name == "get_template_by_name":
            templates = await self.client.list_templates()
            template = next(
                (t for t in templates if t["name"] == step_params["name"]),
                None,
            )
            if template and not is_setup:
                await self.record_call(
                    f"get_template_{step_params['name']}",
                    "GET",
                    f"/api/v2/templates/{template['id']}",
                )
        elif step_name == "get_template_version_rich_parameters":
            templates = await self.client.list_templates()
            if templates:
                template = templates[0]
                version_id = template.get("active_version_id")
                if version_id and not is_setup:
                    await self.record_call(
                        "get_template_version_rich_parameters",
                        "GET",
                        f"/api/v2/templateversions/{version_id}/rich-parameters",
                    )
        elif step_name == "get_template_version_presets":
            templates = await self.client.list_templates()
            if templates:
                template = templates[0]
                version_id = template.get("active_version_id")
                if version_id and not is_setup:
                    await self.record_call(
                        "get_template_version_presets",
                        "GET",
                        f"/api/v2/templateversions/{version_id}/presets",
                    )
        elif step_name == "get_user_info":
            if not is_setup:
                await self.record_call(
                    "get_user_info",
                    "GET",
                    "/api/v2/users/me",
                )
        elif step_name == "get_user_organizations":
            if not is_setup:
                await self.record_call(
                    "get_user_organizations",
                    "GET",
                    "/api/v2/users/me/organizations",
                )
        elif step_name == "create_workspace":
            workspace = await self.client.create_workspace(
                name=step_params["name"],
                template_name=step_params["template_name"],
                workspace_preset=step_params.get("workspace_preset", "coder"),
            )
            self.created_workspaces.append(workspace["id"])
            if not is_setup:
                # Record was already captured by client, but we'll record it explicitly
                pass
        elif step_name == "get_workspace":
            if self.created_workspaces and not is_setup:
                workspace_id = self.created_workspaces[-1]
                await self.record_call(
                    "get_workspace",
                    "GET",
                    f"/api/v2/workspaces/{workspace_id}",
                )
        elif step_name == "list_workspace_builds":
            if self.created_workspaces and not is_setup:
                workspace_id = self.created_workspaces[-1]
                await self.record_call(
                    "list_workspace_builds",
                    "GET",
                    f"/api/v2/workspaces/{workspace_id}/builds",
                )
        elif step_name == "delete_workspace":
            if self.created_workspaces:
                workspace_id = self.created_workspaces.pop()
                await self.client.delete_workspace(workspace_id)
                if not is_setup:
                    # Record was already captured
                    pass
        elif step_name == "delete_all_test_workspaces":
            for workspace_id in self.created_workspaces:
                await self.client.delete_workspace(workspace_id)
            self.created_workspaces.clear()
        else:
            print(f"  ⚠ Unknown step: {step_name}")

    async def cleanup(self) -> None:
        """Cleanup any remaining created resources."""
        if self.created_workspaces:
            print("\nCleaning up created workspaces...")
            for workspace_id in self.created_workspaces:
                try:
                    await self.client.delete_workspace(workspace_id)
                    print(f"  ✓ Deleted workspace {workspace_id}")
                except Exception as e:
                    print(f"  ✗ Failed to delete workspace {workspace_id}: {e}")


async def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description="Record test fixtures from Coder API")
    parser.add_argument(
        "--scenario",
        help="Scenario name to record (from scenarios.yaml)",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Record all scenarios",
    )
    parser.add_argument(
        "--no-sanitize",
        action="store_true",
        help="Disable secret sanitization (DANGEROUS - for debugging only)",
    )
    args = parser.parse_args()

    # Get environment variables
    base_url = os.getenv("CODER_URL")
    token = os.getenv("CODER_SESSION_TOKEN")

    if not base_url or not token:
        print("Error: CODER_URL and CODER_SESSION_TOKEN must be set")
        sys.exit(1)

    # Load scenarios
    scenarios_file = Path(__file__).parent / "scenarios.yaml"
    with open(scenarios_file) as f:
        scenarios = yaml.safe_load(f)

    # Determine which scenarios to run
    if args.all:
        scenario_names = list(scenarios.keys())
    elif args.scenario:
        if args.scenario not in scenarios:
            print(f"Error: Scenario '{args.scenario}' not found in scenarios.yaml")
            print(f"Available scenarios: {', '.join(scenarios.keys())}")
            sys.exit(1)
        scenario_names = [args.scenario]
    else:
        print("Error: Must specify --scenario or --all")
        parser.print_help()
        sys.exit(1)

    # Setup recorder
    output_dir = Path(__file__).parent.parent / "tests" / "fixtures" / "recordings"
    recorder = FixtureRecorder(
        base_url=base_url,
        token=token,
        output_dir=output_dir,
        sanitize=not args.no_sanitize,
    )

    if args.no_sanitize:
        print("\n⚠️  WARNING: Secret sanitization is DISABLED!")
        print("⚠️  Do NOT commit the generated files!\n")

    # Run scenarios
    try:
        for scenario_name in scenario_names:
            recorder.recordings = []  # Reset recordings for each scenario
            scenario_def = scenarios[scenario_name]
            await recorder.run_scenario(scenario_name, scenario_def)
    finally:
        # Always cleanup
        await recorder.cleanup()


if __name__ == "__main__":
    asyncio.run(main())
