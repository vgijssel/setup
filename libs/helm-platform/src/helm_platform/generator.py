"""Core generation logic for config.yaml files."""

from dataclasses import dataclass
from pathlib import Path
from typing import Any

from ruamel.yaml import YAML
from ruamel.yaml.comments import CommentedMap


@dataclass
class ConfigContext:
    """Context for generating a config.yaml file."""

    app_name: str
    parent_dir: str

    @property
    def app_type(self) -> str:
        """Determine app type based on directory structure."""
        if self.app_name == "tenant":
            return "tenant"
        if self.parent_dir.endswith("-infra"):
            return "infra"
        return "apps"

    @property
    def platform(self) -> str:
        """Extract platform name from parent directory."""
        if self.parent_dir.endswith("-infra"):
            return self.parent_dir[:-6]  # Remove "-infra" suffix
        return self.parent_dir

    @property
    def default_namespace(self) -> str:
        """Calculate default namespace based on app type."""
        if self.app_type == "tenant":
            return "tenant-prod"
        if self.app_type == "infra":
            # Remove dashes from platform name
            platform_no_dashes = self.platform.replace("-", "")
            return f"tenant-prod-{platform_no_dashes}"
        return "default"

    @property
    def cluster(self) -> str:
        """Calculate cluster name based on app type."""
        if self.app_type in ("infra", "tenant"):
            return "enigma"
        return f"{self.platform}-vcluster"

    @property
    def create_namespace(self) -> bool:
        """Determine if namespace should be created."""
        return self.app_type == "apps"

    @property
    def pr_update_namespace(self) -> bool:
        """Determine if PR should update namespace."""
        return self.app_type == "infra"

    @property
    def pr_update_cluster(self) -> bool:
        """Determine if PR should update cluster."""
        return self.app_type == "apps"


def create_yaml_instance() -> YAML:
    """Create a configured YAML instance for round-trip processing."""
    yaml = YAML()
    yaml.preserve_quotes = True
    yaml.default_flow_style = False
    yaml.indent(mapping=2, sequence=2, offset=2)
    yaml.width = 4096  # Prevent line wrapping
    return yaml


def load_existing_config(config_path: Path) -> dict[str, Any] | None:
    """Load existing config.yaml if it exists."""
    if not config_path.exists():
        return None

    yaml = create_yaml_instance()
    with config_path.open("r") as f:
        return yaml.load(f)


def generate_config(
    ctx: ConfigContext, existing: dict[str, Any] | None = None
) -> CommentedMap:
    """Generate a config.yaml content for the given context."""
    config = CommentedMap()

    # Add header comment for infra and tenant types only
    if ctx.app_type in ("infra", "tenant"):
        # Capitalize first letter for display
        display_name = (
            ctx.app_name[0].upper() + ctx.app_name[1:] if ctx.app_name else ctx.app_name
        )
        # Special handling for "vcluster" -> "vCluster"
        if ctx.app_name == "vcluster":
            display_name = "vCluster"

        config.yaml_set_start_comment(
            f"ArgoCD ApplicationSet configuration for {display_name}"
        )

    # Set fields in the specified order
    config["appType"] = ctx.app_type
    config["appName"] = ctx.app_name
    config["platform"] = ctx.platform

    # Preserve existing namespace if present, otherwise use default
    if existing and "namespace" in existing:
        config["namespace"] = existing["namespace"]
    else:
        config["namespace"] = ctx.default_namespace

    # Add blank line before cluster section
    config.yaml_set_comment_before_after_key("cluster", before="\n")

    config["cluster"] = ctx.cluster
    config["createNamespace"] = ctx.create_namespace
    config["prUpdateNamespace"] = ctx.pr_update_namespace
    config["prUpdateCluster"] = ctx.pr_update_cluster

    # Add blank line before prOverrides
    config.yaml_set_comment_before_after_key("prOverrides", before="\n")

    # Preserve existing prOverrides if present, otherwise use empty dict
    if existing and "prOverrides" in existing:
        config["prOverrides"] = existing["prOverrides"]
    else:
        config["prOverrides"] = CommentedMap()

    return config


def write_config(config: CommentedMap, config_path: Path) -> None:
    """Write config to file with proper YAML formatting."""
    yaml = create_yaml_instance()
    with config_path.open("w") as f:
        yaml.dump(config, f)


def config_to_string(config: CommentedMap) -> str:
    """Convert config to string for comparison."""
    yaml = create_yaml_instance()
    from io import StringIO

    stream = StringIO()
    yaml.dump(config, stream)
    return stream.getvalue()


def is_app_directory(dir_path: Path) -> bool:
    """Check if a directory is a valid app directory (has Chart.yaml or kustomization.yaml)."""
    return (dir_path / "Chart.yaml").exists() or (
        dir_path / "kustomization.yaml"
    ).exists()


def process_directory(
    base_path: Path,
) -> list[tuple[Path, CommentedMap, str | None]]:
    """Process all subdirectories and generate configs.

    Returns list of (config_path, generated_config, existing_content_or_none).
    """
    results = []
    parent_dir = base_path.name

    for subdir in sorted(base_path.iterdir()):
        if not subdir.is_dir():
            continue

        # Skip directories that don't look like app directories
        if not is_app_directory(subdir):
            continue

        config_path = subdir / "config.yaml"
        ctx = ConfigContext(app_name=subdir.name, parent_dir=parent_dir)

        existing = load_existing_config(config_path)
        generated = generate_config(ctx, existing)

        existing_content = None
        if config_path.exists():
            existing_content = config_path.read_text()

        results.append((config_path, generated, existing_content))

    return results
