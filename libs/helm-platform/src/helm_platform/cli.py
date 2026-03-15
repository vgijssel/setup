"""Click CLI for helm-platform."""

import difflib
import sys
from pathlib import Path

import click

from .generator import config_to_string, process_directory, write_config


@click.group()
def main() -> None:
    """Generate and validate config.yaml files for ArgoCD ApplicationSet configuration."""
    pass


@main.command()
@click.option(
    "--path",
    type=click.Path(exists=True, file_okay=False, dir_okay=True, path_type=Path),
    default=".",
    help="Directory to process (defaults to current directory)",
)
def generate(path: Path) -> None:
    """Generate config.yaml files for all subdirectories."""
    path = path.resolve()
    results = process_directory(path)

    if not results:
        click.echo(f"No app directories found in {path}")
        return

    for config_path, config, _ in results:
        write_config(config, config_path)
        click.echo(f"Generated: {config_path}")


@main.command()
@click.option(
    "--path",
    type=click.Path(exists=True, file_okay=False, dir_okay=True, path_type=Path),
    default=".",
    help="Directory to validate (defaults to current directory)",
)
def validate(path: Path) -> None:
    """Validate that existing config.yaml files match what would be generated."""
    path = path.resolve()
    results = process_directory(path)

    if not results:
        click.echo(f"No app directories found in {path}")
        sys.exit(0)

    has_diff = False

    for config_path, generated_config, existing_content in results:
        if existing_content is None:
            # File doesn't exist - would be created by generate
            click.echo(f"Missing: {config_path} (would be created by generate)")
            continue

        generated_content = config_to_string(generated_config)

        if existing_content != generated_content:
            has_diff = True
            click.echo(f"\nDiff for {config_path}:")
            diff = difflib.unified_diff(
                existing_content.splitlines(keepends=True),
                generated_content.splitlines(keepends=True),
                fromfile=str(config_path),
                tofile=f"{config_path} (generated)",
            )
            for line in diff:
                # Color diff output
                if line.startswith("+") and not line.startswith("+++"):
                    click.echo(click.style(line.rstrip(), fg="green"))
                elif line.startswith("-") and not line.startswith("---"):
                    click.echo(click.style(line.rstrip(), fg="red"))
                else:
                    click.echo(line.rstrip())

    if has_diff:
        click.echo("\nValidation failed: files differ from generated content")
        sys.exit(1)
    else:
        click.echo("All config.yaml files are up to date")
        sys.exit(0)


if __name__ == "__main__":
    main()
