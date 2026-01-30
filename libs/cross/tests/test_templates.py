"""Tests for Jinja2 template variable substitution."""

from cross.templates import render_command


class TestRenderCommand:
    """Tests for render_command function."""

    def test_render_single_variable_os(self) -> None:
        """Test rendering single OS variable."""
        result = render_command(["echo", "{{ os }}"], os="linux", arch="amd64")
        assert result == ["echo", "linux"]

    def test_render_single_variable_arch(self) -> None:
        """Test rendering single arch variable."""
        result = render_command(["echo", "{{ arch }}"], os="linux", arch="amd64")
        assert result == ["echo", "amd64"]

    def test_render_multiple_variables(self) -> None:
        """Test rendering multiple variables in one argument."""
        result = render_command(
            ["path/{{ os }}_{{ arch }}/file"], os="linux", arch="arm64"
        )
        assert result == ["path/linux_arm64/file"]

    def test_render_no_variables(self) -> None:
        """Test that arguments without variables pass through unchanged."""
        result = render_command(["echo", "hello", "world"], os="linux", arch="amd64")
        assert result == ["echo", "hello", "world"]

    def test_render_mixed_args(self) -> None:
        """Test rendering with mix of variable and literal arguments."""
        result = render_command(
            ["cmd", "--os={{ os }}", "literal", "{{ arch }}"],
            os="darwin",
            arch="arm64",
        )
        assert result == ["cmd", "--os=darwin", "literal", "arm64"]

    def test_render_empty_command(self) -> None:
        """Test rendering empty command list."""
        result = render_command([], os="linux", arch="amd64")
        assert result == []

    def test_render_complex_path(self) -> None:
        """Test rendering complex path with variables."""
        result = render_command(
            ["pex", ".", "-o", "dist/{{ os }}_{{ arch }}/app.pex"],
            os="linux",
            arch="amd64",
        )
        assert result == ["pex", ".", "-o", "dist/linux_amd64/app.pex"]

    def test_render_multiple_occurrences(self) -> None:
        """Test rendering multiple occurrences of same variable."""
        result = render_command(["echo", "{{ os }}-{{ os }}"], os="linux", arch="amd64")
        assert result == ["echo", "linux-linux"]

    def test_render_preserves_whitespace(self) -> None:
        """Test that whitespace is preserved."""
        result = render_command(
            ["echo", "Building for {{ os }}  "], os="linux", arch="amd64"
        )
        assert result == ["echo", "Building for linux  "]

    def test_render_with_special_characters(self) -> None:
        """Test rendering with special characters in arguments."""
        result = render_command(["cmd", "--flag='{{ os }}'"], os="linux", arch="amd64")
        assert result == ["cmd", "--flag='linux'"]
