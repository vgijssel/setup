"""Factory functions for creating template test fixtures"""

from datetime import datetime, timezone


def create_template(
    template_id: str = "template-123",
    name: str = "test-template",
    display_name: str = "Test Template",
    **overrides,
):
    """Factory for creating template test fixtures

    Args:
        template_id: Unique template identifier
        name: Template name (used in API)
        display_name: Human-readable display name
        **overrides: Additional fields to override

    Returns:
        dict representing a Coder template
    """
    template = {
        "id": template_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "organization_id": "org-123",
        "organization_name": "test-org",
        "organization_display_name": "Test Organization",
        "organization_icon": "",
        "name": name,
        "display_name": display_name,
        "provisioner": "terraform",
        "active_version_id": "version-123",
        "active_user_count": 0,
        "build_time_stats": {
            "delete": {"P50": 10000, "P95": 20000},
            "start": {"P50": 15000, "P95": 30000},
            "stop": {"P50": 5000, "P95": 10000},
        },
        "description": "",
        "deprecated": False,
        "deprecation_message": "",
        "icon": "",
        "default_ttl_ms": 0,
        "activity_bump_ms": 3600000,
        "autostop_requirement": {"days_of_week": [], "weeks": 1},
        "autostart_requirement": {
            "days_of_week": [
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
            ]
        },
        "created_by_id": "user-123",
        "created_by_name": "test-user",
        "allow_user_autostart": True,
        "allow_user_autostop": True,
        "allow_user_cancel_workspace_jobs": False,
        "failure_ttl_ms": 0,
        "time_til_dormant_ms": 0,
        "time_til_dormant_autodelete_ms": 0,
        "require_active_version": False,
        "max_port_share_level": "public",
        "cors_behavior": "simple",
        "use_classic_parameter_flow": False,
    }
    template.update(overrides)
    return template


def create_template_version(
    version_id: str = "version-123",
    template_id: str = "template-123",
    name: str = "1.0.0",
    **overrides,
):
    """Factory for creating template version test fixtures

    Args:
        version_id: Unique version identifier
        template_id: ID of parent template
        name: Version name
        **overrides: Additional fields to override

    Returns:
        dict representing a Coder template version
    """
    version = {
        "id": version_id,
        "template_id": template_id,
        "name": name,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "organization_id": "org-123",
        "created_by": {
            "id": "user-123",
            "username": "test-user",
            "email": "test@example.com",
        },
        "job": {
            "id": f"job-{version_id}",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "status": "succeeded",
        },
        "readme": "# Test Template\n\nA test template",
    }
    version.update(overrides)
    return version


def create_rich_parameter(
    name: str = "test_param",
    display_name: str = "Test Parameter",
    description: str = "A test parameter",
    type: str = "string",
    mutable: bool = False,
    default_value: str = "",
    **overrides,
):
    """Factory for creating rich parameter test fixtures

    Args:
        name: Parameter name
        display_name: Human-readable display name
        description: Parameter description
        type: Parameter type (string, number, bool)
        mutable: Whether parameter can be changed after workspace creation
        default_value: Default value
        **overrides: Additional fields to override

    Returns:
        dict representing a Coder rich parameter
    """
    parameter = {
        "name": name,
        "display_name": display_name,
        "description": description,
        "type": type,
        "mutable": mutable,
        "default_value": default_value,
        "icon": "",
        "options": [],
        "validation_min": None,
        "validation_max": None,
        "validation_regex": "",
        "validation_error": "",
        "validation_monotonic": "increasing",
        "required": False,
        "legacy_variable_name": "",
        "display_order": 0,
        "ephemeral": False,
    }
    parameter.update(overrides)
    return parameter


def create_preset(
    preset_id: str = "preset-123",
    name: str = "test-preset",
    display_name: str = "Test Preset",
    parameters: list[dict] | None = None,
    default: bool = True,
    **overrides,
):
    """Factory for creating workspace preset test fixtures

    Args:
        preset_id: Unique preset identifier
        name: Preset name
        display_name: Human-readable display name
        parameters: List of parameter overrides
        default: Whether this is the default preset
        **overrides: Additional fields to override

    Returns:
        dict representing a Coder workspace preset
    """
    if parameters is None:
        parameters = []

    preset = {
        "ID": preset_id,
        "Name": display_name,
        "Parameters": parameters,
        "Default": default,
        "DesiredPrebuildInstances": 0,
        "Description": "",
        "Icon": "",
    }
    preset.update(overrides)
    return preset
