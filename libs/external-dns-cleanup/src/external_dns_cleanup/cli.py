"""Main CLI module for external-dns-cleanup."""

import os
import sys

import click
from dotenv import load_dotenv

from .cleanup import cleanup_dns_records

# Load .env file if it exists
load_dotenv()


@click.command()
@click.option(
    "--domain-filter",
    required=True,
    help="Domain filter (e.g., vgijssel-dev.nl)",
)
@click.option(
    "--txt-owner-id",
    required=True,
    help="TXT owner ID for external-dns records (e.g., internal-dns)",
)
@click.option(
    "--txt-prefix",
    default="_externaldns-",
    help="TXT prefix for external-dns records (default: _externaldns-)",
)
@click.option(
    "--dry-run",
    is_flag=True,
    help="Show what would be deleted without actually deleting",
)
@click.option("--verbose", "-v", is_flag=True, help="Enable verbose output")
def cli(domain_filter, txt_owner_id, txt_prefix, dry_run, verbose):
    """Cleanup Cloudflare DNS records after external-dns shutdown.

    This tool queries the Cloudflare API for DNS records matching the domain filter,
    checks ownership using TXT records with the specified owner ID, and removes
    matching records.
    """
    # Check for CF_API_TOKEN environment variable
    api_token = os.getenv("CF_API_TOKEN")
    if not api_token:
        click.echo("Error: CF_API_TOKEN environment variable is not set", err=True)
        sys.exit(1)

    try:
        deleted_count = cleanup_dns_records(
            api_token=api_token,
            domain_filter=domain_filter,
            txt_owner_id=txt_owner_id,
            txt_prefix=txt_prefix,
            dry_run=dry_run,
            verbose=verbose,
        )

        if dry_run:
            click.echo(f"\nDry run: Would delete {deleted_count} DNS record(s)")
        else:
            click.echo(f"\n✓ Successfully deleted {deleted_count} DNS record(s)")

    except Exception as e:
        click.echo(f"Error: {e}", err=True)
        if verbose:
            import traceback

            traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    cli()
