"""DNS cleanup logic for external-dns records."""

from typing import List, Set

import click
from cloudflare import Cloudflare


def cleanup_dns_records(
    api_token: str,
    domain_filter: str,
    txt_owner_id: str,
    txt_prefix: str,
    dry_run: bool = False,
    verbose: bool = False,
) -> int:
    """Clean up Cloudflare DNS records managed by external-dns.

    Args:
        api_token: Cloudflare API token
        domain_filter: Domain to filter records (e.g., vgijssel-dev.nl)
        txt_owner_id: Owner ID to match in TXT records
        txt_prefix: Prefix for external-dns TXT records
        dry_run: If True, don't actually delete records
        verbose: Enable verbose output

    Returns:
        Number of records deleted (or would be deleted in dry-run mode)
    """
    client = Cloudflare(api_token=api_token)

    # Get the zone ID for the domain
    if verbose:
        click.echo(f"Looking up zone for domain: {domain_filter}")

    zones = client.zones.list(name=domain_filter)
    if not zones.result:
        raise ValueError(f"No zone found for domain: {domain_filter}")

    zone_id = zones.result[0].id
    if verbose:
        click.echo(f"Found zone ID: {zone_id}")

    # Get all DNS records for the zone
    if verbose:
        click.echo(f"Fetching DNS records for zone: {domain_filter}")

    all_records = []
    page = 1
    while True:
        response = client.dns.records.list(zone_id=zone_id, per_page=100, page=page)
        if not response.result:
            break
        all_records.extend(response.result)
        # Check if there are more pages
        if len(response.result) < 100:
            break
        page += 1

    if verbose:
        click.echo(f"Found {len(all_records)} total DNS records")

    # Find all TXT records with the owner ID
    owned_records: Set[str] = set()
    txt_records_to_delete: List[str] = []

    for record in all_records:
        if record.type == "TXT" and record.name.startswith(txt_prefix):
            # Parse the TXT record content to check ownership
            if record.content and txt_owner_id in record.content:
                # Extract the record name this TXT record is protecting
                # Format: _externaldns-<record-name>.<domain>
                protected_name = record.name[len(txt_prefix) :]
                owned_records.add(protected_name)
                txt_records_to_delete.append(record.id)
                if verbose:
                    click.echo(
                        f"Found ownership TXT record: {record.name} -> {protected_name}"
                    )

    if verbose:
        click.echo(f"Found {len(owned_records)} owned records")
        click.echo(f"Found {len(txt_records_to_delete)} TXT records to delete")

    # Find all records that match the owned records
    records_to_delete: List[str] = []
    for record in all_records:
        if record.type != "TXT" and record.name in owned_records:
            records_to_delete.append(record.id)
            if verbose:
                click.echo(f"Will delete record: {record.name} ({record.type})")

    # Delete the records
    total_deleted = 0

    # Delete owned records first
    for record_id in records_to_delete:
        record = next(r for r in all_records if r.id == record_id)
        if dry_run:
            click.echo(f"Would delete: {record.name} ({record.type})")
        else:
            if verbose:
                click.echo(f"Deleting: {record.name} ({record.type})")
            client.dns.records.delete(zone_id=zone_id, dns_record_id=record_id)
        total_deleted += 1

    # Delete TXT records
    for record_id in txt_records_to_delete:
        record = next(r for r in all_records if r.id == record_id)
        if dry_run:
            click.echo(f"Would delete TXT: {record.name}")
        else:
            if verbose:
                click.echo(f"Deleting TXT: {record.name}")
            client.dns.records.delete(zone_id=zone_id, dns_record_id=record_id)
        total_deleted += 1

    return total_deleted
