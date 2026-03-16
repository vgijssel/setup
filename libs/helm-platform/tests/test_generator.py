"""Tests for the config.yaml generator."""

from pathlib import Path

from helm_platform.generator import (
    ConfigContext,
    config_to_string,
    generate_config,
    is_app_directory,
    load_existing_config,
    process_directory,
    write_config,
)


class TestConfigContext:
    """Tests for ConfigContext dataclass."""

    def test_app_type_infra_when_parent_ends_with_infra(self) -> None:
        """Parent folder ending with -infra should result in infra type."""
        ctx = ConfigContext(app_name="vcluster", parent_dir="secrets-proxy-infra")
        assert ctx.app_type == "infra"

    def test_app_type_tenant_when_dir_named_tenant(self) -> None:
        """Directory named tenant should result in tenant type."""
        ctx = ConfigContext(app_name="tenant", parent_dir="secrets-proxy-infra")
        assert ctx.app_type == "tenant"

    def test_app_type_tenant_takes_priority_over_infra(self) -> None:
        """tenant app type should take priority even in -infra parent."""
        ctx = ConfigContext(app_name="tenant", parent_dir="secrets-proxy-infra")
        assert ctx.app_type == "tenant"

    def test_app_type_apps_otherwise(self) -> None:
        """Other directories should result in apps type."""
        ctx = ConfigContext(app_name="onepassword-operator", parent_dir="secrets-proxy")
        assert ctx.app_type == "apps"

    def test_platform_removes_infra_suffix(self) -> None:
        """Platform should strip -infra suffix."""
        ctx = ConfigContext(app_name="vcluster", parent_dir="secrets-proxy-infra")
        assert ctx.platform == "secrets-proxy"

    def test_platform_keeps_non_infra_name(self) -> None:
        """Platform should keep name without -infra suffix."""
        ctx = ConfigContext(app_name="app", parent_dir="secrets-proxy")
        assert ctx.platform == "secrets-proxy"

    def test_namespace_tenant(self) -> None:
        """Tenant namespace should be tenant-prod."""
        ctx = ConfigContext(app_name="tenant", parent_dir="secrets-proxy-infra")
        assert ctx.default_namespace == "tenant-prod"

    def test_namespace_infra(self) -> None:
        """Infra namespace should be tenant-prod-<platform without dashes>."""
        ctx = ConfigContext(app_name="vcluster", parent_dir="secrets-proxy-infra")
        assert ctx.default_namespace == "tenant-prod-secretsproxy"

    def test_namespace_apps(self) -> None:
        """Apps namespace should be default."""
        ctx = ConfigContext(app_name="app", parent_dir="secrets-proxy")
        assert ctx.default_namespace == "default"

    def test_cluster_infra(self) -> None:
        """Infra cluster should be enigma."""
        ctx = ConfigContext(app_name="vcluster", parent_dir="secrets-proxy-infra")
        assert ctx.cluster == "enigma"

    def test_cluster_tenant(self) -> None:
        """Tenant cluster should be enigma."""
        ctx = ConfigContext(app_name="tenant", parent_dir="secrets-proxy-infra")
        assert ctx.cluster == "enigma"

    def test_cluster_apps(self) -> None:
        """Apps cluster should be <platform>-vcluster."""
        ctx = ConfigContext(app_name="app", parent_dir="secrets-proxy")
        assert ctx.cluster == "secrets-proxy-vcluster"

    def test_create_namespace_infra(self) -> None:
        """createNamespace should be false for infra."""
        ctx = ConfigContext(app_name="vcluster", parent_dir="secrets-proxy-infra")
        assert ctx.create_namespace is False

    def test_create_namespace_tenant(self) -> None:
        """createNamespace should be false for tenant."""
        ctx = ConfigContext(app_name="tenant", parent_dir="secrets-proxy-infra")
        assert ctx.create_namespace is False

    def test_create_namespace_apps(self) -> None:
        """createNamespace should be true for apps."""
        ctx = ConfigContext(app_name="app", parent_dir="secrets-proxy")
        assert ctx.create_namespace is True

    def test_pr_update_namespace_infra(self) -> None:
        """prUpdateNamespace should be true for infra."""
        ctx = ConfigContext(app_name="vcluster", parent_dir="secrets-proxy-infra")
        assert ctx.pr_update_namespace is True

    def test_pr_update_namespace_tenant(self) -> None:
        """prUpdateNamespace should be false for tenant."""
        ctx = ConfigContext(app_name="tenant", parent_dir="secrets-proxy-infra")
        assert ctx.pr_update_namespace is False

    def test_pr_update_namespace_apps(self) -> None:
        """prUpdateNamespace should be false for apps."""
        ctx = ConfigContext(app_name="app", parent_dir="secrets-proxy")
        assert ctx.pr_update_namespace is False

    def test_pr_update_cluster_infra(self) -> None:
        """prUpdateCluster should be false for infra."""
        ctx = ConfigContext(app_name="vcluster", parent_dir="secrets-proxy-infra")
        assert ctx.pr_update_cluster is False

    def test_pr_update_cluster_tenant(self) -> None:
        """prUpdateCluster should be false for tenant."""
        ctx = ConfigContext(app_name="tenant", parent_dir="secrets-proxy-infra")
        assert ctx.pr_update_cluster is False

    def test_pr_update_cluster_apps(self) -> None:
        """prUpdateCluster should be true for apps."""
        ctx = ConfigContext(app_name="app", parent_dir="secrets-proxy")
        assert ctx.pr_update_cluster is True


class TestGenerateConfig:
    """Tests for generate_config function."""

    def test_generate_infra_config(self) -> None:
        """Generate correct config for infra app type."""
        ctx = ConfigContext(app_name="vcluster", parent_dir="secrets-proxy-infra")
        config = generate_config(ctx)

        assert config["appType"] == "infra"
        assert config["appName"] == "vcluster"
        assert config["platform"] == "secrets-proxy"
        assert config["namespace"] == "tenant-prod-secretsproxy"
        assert config["cluster"] == "enigma"
        assert config["createNamespace"] is False
        assert config["prUpdateNamespace"] is True
        assert config["prUpdateCluster"] is False
        assert config["prOverrides"] == {}

    def test_generate_tenant_config(self) -> None:
        """Generate correct config for tenant app type."""
        ctx = ConfigContext(app_name="tenant", parent_dir="secrets-proxy-infra")
        config = generate_config(ctx)

        assert config["appType"] == "tenant"
        assert config["appName"] == "tenant"
        assert config["platform"] == "secrets-proxy"
        assert config["namespace"] == "tenant-prod"
        assert config["cluster"] == "enigma"
        assert config["createNamespace"] is False
        assert config["prUpdateNamespace"] is False
        assert config["prUpdateCluster"] is False

    def test_generate_apps_config(self) -> None:
        """Generate correct config for apps app type."""
        ctx = ConfigContext(app_name="onepassword-operator", parent_dir="secrets-proxy")
        config = generate_config(ctx)

        assert config["appType"] == "apps"
        assert config["appName"] == "onepassword-operator"
        assert config["platform"] == "secrets-proxy"
        assert config["namespace"] == "default"
        assert config["cluster"] == "secrets-proxy-vcluster"
        assert config["createNamespace"] is True
        assert config["prUpdateNamespace"] is False
        assert config["prUpdateCluster"] is True

    def test_preserve_existing_namespace(self) -> None:
        """Existing namespace should be preserved."""
        ctx = ConfigContext(app_name="vcluster", parent_dir="secrets-proxy-infra")
        existing = {"namespace": "custom-namespace", "prOverrides": {}}
        config = generate_config(ctx, existing)

        assert config["namespace"] == "custom-namespace"

    def test_preserve_existing_pr_overrides(self) -> None:
        """Existing prOverrides should be preserved."""
        ctx = ConfigContext(app_name="vcluster", parent_dir="secrets-proxy-infra")
        existing_overrides = {"key": "value", "nested.key": "nested-value"}
        existing = {"namespace": "ns", "prOverrides": existing_overrides}
        config = generate_config(ctx, existing)

        assert config["prOverrides"] == existing_overrides

    def test_infra_has_header_comment(self) -> None:
        """Infra type should have header comment."""
        ctx = ConfigContext(app_name="vcluster", parent_dir="secrets-proxy-infra")
        config = generate_config(ctx)
        output = config_to_string(config)

        assert "# ArgoCD ApplicationSet configuration for vCluster" in output

    def test_tenant_has_header_comment(self) -> None:
        """Tenant type should have header comment."""
        ctx = ConfigContext(app_name="tenant", parent_dir="secrets-proxy-infra")
        config = generate_config(ctx)
        output = config_to_string(config)

        assert "# ArgoCD ApplicationSet configuration for Tenant" in output

    def test_apps_no_header_comment(self) -> None:
        """Apps type should not have header comment."""
        ctx = ConfigContext(app_name="app", parent_dir="secrets-proxy")
        config = generate_config(ctx)
        output = config_to_string(config)

        lines = output.strip().split("\n")
        assert not lines[0].startswith("#")


class TestIsAppDirectory:
    """Tests for is_app_directory function."""

    def test_chart_yaml_is_app_dir(self, tmp_path: Path) -> None:
        """Directory with Chart.yaml should be recognized."""
        app_dir = tmp_path / "app"
        app_dir.mkdir()
        (app_dir / "Chart.yaml").write_text("apiVersion: v2\n")

        assert is_app_directory(app_dir) is True

    def test_kustomization_yaml_is_app_dir(self, tmp_path: Path) -> None:
        """Directory with kustomization.yaml should be recognized."""
        app_dir = tmp_path / "app"
        app_dir.mkdir()
        (app_dir / "kustomization.yaml").write_text(
            "apiVersion: kustomize.config.k8s.io/v1beta1\n"
        )

        assert is_app_directory(app_dir) is True

    def test_empty_dir_not_app_dir(self, tmp_path: Path) -> None:
        """Empty directory should not be recognized."""
        app_dir = tmp_path / "app"
        app_dir.mkdir()

        assert is_app_directory(app_dir) is False


class TestLoadExistingConfig:
    """Tests for load_existing_config function."""

    def test_load_nonexistent_returns_none(self, tmp_path: Path) -> None:
        """Non-existent file should return None."""
        result = load_existing_config(tmp_path / "nonexistent.yaml")
        assert result is None

    def test_load_existing_config(self, tmp_path: Path) -> None:
        """Existing config should be loaded."""
        config_path = tmp_path / "config.yaml"
        config_path.write_text("namespace: custom\nprOverrides:\n  key: value\n")

        result = load_existing_config(config_path)
        assert result is not None
        assert result["namespace"] == "custom"
        assert result["prOverrides"]["key"] == "value"


class TestProcessDirectory:
    """Tests for process_directory function."""

    def test_process_infra_directory(self, infra_platform: Path) -> None:
        """Process infra platform directory correctly."""
        results = process_directory(infra_platform)

        assert len(results) == 2

        config_paths = [r[0].parent.name for r in results]
        assert "tenant" in config_paths
        assert "vcluster" in config_paths

    def test_process_apps_directory(self, apps_platform: Path) -> None:
        """Process apps platform directory correctly."""
        results = process_directory(apps_platform)

        assert len(results) == 2

        config_paths = [r[0].parent.name for r in results]
        assert "onepassword-operator" in config_paths
        assert "external-secrets" in config_paths

    def test_skip_non_app_directories(self, tmp_path: Path) -> None:
        """Directories without Chart.yaml or kustomization.yaml should be skipped."""
        platform = tmp_path / "my-platform"
        platform.mkdir()

        # Create a non-app directory
        non_app = platform / "docs"
        non_app.mkdir()
        (non_app / "README.md").write_text("# Docs")

        results = process_directory(platform)
        assert len(results) == 0


class TestWriteAndReadConfig:
    """Tests for write_config and round-trip operations."""

    def test_write_and_read_preserves_structure(self, tmp_path: Path) -> None:
        """Writing and reading should preserve config structure."""
        config_path = tmp_path / "config.yaml"

        ctx = ConfigContext(app_name="vcluster", parent_dir="secrets-proxy-infra")
        config = generate_config(ctx)

        write_config(config, config_path)

        loaded = load_existing_config(config_path)
        assert loaded is not None
        assert loaded["appType"] == "infra"
        assert loaded["appName"] == "vcluster"
        assert loaded["platform"] == "secrets-proxy"

    def test_output_has_trailing_newline(self, tmp_path: Path) -> None:
        """Output file should have trailing newline."""
        config_path = tmp_path / "config.yaml"

        ctx = ConfigContext(app_name="vcluster", parent_dir="secrets-proxy-infra")
        config = generate_config(ctx)

        write_config(config, config_path)

        content = config_path.read_text()
        assert content.endswith("\n")

    def test_regenerate_preserves_user_fields(self, tmp_path: Path) -> None:
        """Regenerating should preserve user-defined fields."""
        config_path = tmp_path / "config.yaml"

        # Create initial config with custom values
        initial_content = """appType: infra
appName: vcluster
platform: secrets-proxy
namespace: my-custom-namespace

cluster: enigma
createNamespace: false
prUpdateNamespace: true
prUpdateCluster: false

prOverrides:
  custom.key: custom-value
"""
        config_path.write_text(initial_content)

        # Load and regenerate
        existing = load_existing_config(config_path)
        ctx = ConfigContext(app_name="vcluster", parent_dir="secrets-proxy-infra")
        new_config = generate_config(ctx, existing)

        # Verify user fields are preserved
        assert new_config["namespace"] == "my-custom-namespace"
        assert new_config["prOverrides"]["custom.key"] == "custom-value"
