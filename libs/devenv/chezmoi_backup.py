#!/usr/bin/env python3
"""
Chezmoi Backup Script

This script interacts with chezmoi to manage user configuration files according to the following use cases:
1. Backup all files managed by chezmoi
2. Handle unmanaged files
3. Reconcile missing managed files
"""

import json
import logging
import os
import shutil
import subprocess
import sys
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Global variables
HOME = os.path.expanduser("~")
SETUP_DIR = os.path.join(HOME, ".setup")
BACKUP_DIR = os.path.join(SETUP_DIR, "backup")
UNMANAGED_DIR = os.path.join(SETUP_DIR, "unmanaged")
TIMESTAMP = datetime.now().strftime("%Y%m%d-%H%M%S")
CURRENT_BACKUP_DIR = os.path.join(BACKUP_DIR, TIMESTAMP)


def ensure_directory_exists(directory):
    """Ensure that a directory exists, creating it if necessary."""
    os.makedirs(directory, exist_ok=True)
    logger.info(f"Ensured directory exists: {directory}")


def run_chezmoi_command(command):
    """Run a chezmoi command and return its output."""
    full_command = ["chezmoi-wrapper"] + command
    try:
        result = subprocess.run(
            full_command,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        logger.error(f"Error running command {full_command}: {e}")
        logger.error(f"stderr: {e.stderr}")
        sys.exit(1)


def get_managed_files():
    """Get a list of files managed by chezmoi."""
    output = run_chezmoi_command(["managed", "--include=files,symlinks"])
    if not output.strip():
        logger.warning("No managed files found")
        return []

    # Split the output into lines and filter out empty lines
    managed_files = [
        line.strip() for line in output.strip().split("\n") if line.strip()
    ]
    logger.info(f"Found {len(managed_files)} managed files")
    return managed_files


def get_state_files():
    """Get a list of files in the chezmoi state with absolute paths."""
    logger.info("Getting state files...")
    output = run_chezmoi_command(["state", "dump"])
    try:
        state_data = json.loads(output)
        entry_state = state_data.get("entryState", {})

        # Extract file paths from state entries (these are already absolute paths)
        state_files = []
        for file_path, info in entry_state.items():
            if info.get("type") == "file":
                state_files.append(file_path)

        logger.info(f"Found {len(state_files)} files in state")
        return state_files
    except json.JSONDecodeError:
        logger.error(
            "Failed to parse chezmoi state output as JSON. Check the format of the output."
        )
        return []


def backup_managed_files():
    """
    Backup all files managed by chezmoi.

    Creates backups in $HOME/.setup/backup/YYYYMMDD-HHMMSS/
    """
    logger.info("Starting backup of managed files")

    # Get list of managed files
    managed_files = get_managed_files()

    # Create backup for each file
    for file_path in managed_files:
        # Construct absolute source path
        source_path = os.path.join(HOME, file_path)

        # Construct backup path
        backup_path = os.path.join(CURRENT_BACKUP_DIR, file_path)

        # Ensure the directory exists
        os.makedirs(os.path.dirname(backup_path), exist_ok=True)

        # Copy the file if it exists
        if os.path.exists(source_path):
            if os.path.isfile(source_path):
                shutil.copy2(source_path, backup_path)
                logger.info(f"Backed up file: {source_path} to {backup_path}")
            elif os.path.isdir(source_path):
                if os.path.exists(backup_path):
                    shutil.rmtree(backup_path)
                shutil.copytree(source_path, backup_path)
                logger.info(f"Backed up directory: {source_path} to {backup_path}")
        else:
            logger.warning(f"Managed file not found: {source_path}")

    logger.info(f"Backup of managed files completed: {CURRENT_BACKUP_DIR}")


def get_unmanaged_files():
    """
    Get a list of files that are managed by chezmoi but don't exist yet in the target state.

    Uses 'chezmoi managed --path-style absolute' to get currently managed files with absolute paths,
    and 'chezmoi target-paths --path-style absolute' to get files in the target state.
    The difference represents files that are managed by chezmoi but not yet in the target state.
    """
    logger.info("Identifying unmanaged files...")

    # Get files currently managed by chezmoi with absolute paths
    managed_output = run_chezmoi_command(
        ["managed", "--include=files,symlinks", "--path-style=absolute"]
    )
    if not managed_output.strip():
        logger.warning("No managed files found")
        return []

    # Split the output into lines and filter out empty lines
    managed_files = [
        line.strip() for line in managed_output.strip().split("\n") if line.strip()
    ]
    logger.info(f"Found {len(managed_files)} managed files with absolute paths")
    state_files = get_state_files()

    return list(set(managed_files) - set(state_files))


def handle_unmanaged_files():
    """
    Handle unmanaged files by backing them up to the unmanaged directory.

    Copies files that are managed by chezmoi but don't exist yet in the target state
    from $HOME to $HOME/.setup/unmanaged/ with the same relative path structure.
    """
    logger.info("Starting handling of unmanaged files")

    # Get list of unmanaged files
    unmanaged_files = get_unmanaged_files()

    # Backup each unmanaged file
    for file_path in unmanaged_files:
        # The file_path is already an absolute path, so we don't need to join with HOME
        source_path = file_path

        # Extract the relative path by removing the HOME prefix
        if source_path.startswith(HOME):
            relative_path = source_path[len(HOME) + 1 :]  # +1 to remove the leading '/'
        else:
            logger.warning(f"Unexpected file path not under HOME: {source_path}")
            continue

        # Construct backup path
        backup_path = os.path.join(UNMANAGED_DIR, relative_path)

        # Skip if the file doesn't exist
        if not os.path.exists(source_path):
            logger.warning(f"Unmanaged file not found: {source_path}")
            continue

        # Ensure the directory exists
        os.makedirs(os.path.dirname(backup_path), exist_ok=True)

        # Copy the file
        if os.path.isfile(source_path):
            shutil.copy2(source_path, backup_path)
            logger.info(f"Backed up unmanaged file: {source_path} to {backup_path}")

    logger.info("Handling of unmanaged files completed")


def reconcile_missing_files():
    """
    Reconcile missing files listed in the chezmoi state database.

    For files that are in the chezmoi state but not in the managed list:
    - Copy the corresponding file from $HOME/.setup/unmanaged/ to $HOME if it exists.
    - If the unmanaged version does not exist, delete the file from $HOME.
    - After processing, remove the file from the chezmoi state database.
    """
    logger.info("Starting reconciliation of missing managed files")

    # Get files currently managed by chezmoi
    managed_files_output = run_chezmoi_command(
        ["managed", "--include=files,symlinks", "--path-style=absolute"]
    )
    managed_files = set(
        [
            line.strip()
            for line in managed_files_output.strip().split("\n")
            if line.strip()
        ]
    )
    logger.info(f"Found {len(managed_files)} files in chezmoi managed list")

    # Get files in the chezmoi state database
    state_output = run_chezmoi_command(["state", "dump"])
    try:
        state_data = json.loads(state_output)
        entry_state = state_data.get("entryState", {})

        # Find files in state but not in managed list
        for file_path, info in entry_state.items():
            if info.get("type") == "file" and file_path not in managed_files:
                logger.info(f"Found file in state but not managed: {file_path}")

                # Extract the relative path by removing the HOME prefix
                if file_path.startswith(HOME):
                    relative_path = file_path[
                        len(HOME) + 1 :
                    ]  # +1 to remove the leading '/'
                else:
                    logger.warning(f"Unexpected file path not under HOME: {file_path}")
                    continue

                # Check if unmanaged version exists
                unmanaged_path = os.path.join(UNMANAGED_DIR, relative_path)
                if os.path.exists(unmanaged_path) and os.path.isfile(unmanaged_path):
                    # Ensure the directory exists in HOME
                    os.makedirs(os.path.dirname(file_path), exist_ok=True)

                    # Copy from unmanaged to HOME
                    shutil.copy2(unmanaged_path, file_path)
                    logger.info(
                        f"Restored file from unmanaged: {unmanaged_path} to {file_path}"
                    )
                else:
                    # Delete the file from HOME if it exists
                    if os.path.exists(file_path):
                        try:
                            os.remove(file_path)
                            logger.info(f"Deleted file from HOME: {file_path}")
                        except Exception as e:
                            logger.error(f"Failed to delete file {file_path}: {e}")

                # Remove the file from the chezmoi state database
                try:
                    run_chezmoi_command(
                        [
                            "state",
                            "delete",
                            "--bucket",
                            "entryState",
                            "--key",
                            file_path,
                        ]
                    )
                    logger.info(f"Removed {file_path} from chezmoi state")
                except Exception as e:
                    logger.error(
                        f"Failed to remove {file_path} from chezmoi state: {e}"
                    )

        logger.info("Reconciliation of missing managed files completed")
    except json.JSONDecodeError:
        logger.error(
            "Failed to parse chezmoi state output as JSON. Check the format of the output."
        )
    except Exception as e:
        logger.error(f"Error reconciling missing files: {e}")


def main():
    """Main function that orchestrates the script execution."""
    # Create necessary directories
    ensure_directory_exists(SETUP_DIR)
    ensure_directory_exists(BACKUP_DIR)
    ensure_directory_exists(UNMANAGED_DIR)
    ensure_directory_exists(CURRENT_BACKUP_DIR)

    logger.info("Starting chezmoi backup script")

    # Implement Use Case 1 - Backup Managed Files
    backup_managed_files()

    # Implement Use Case 2 - Handle unmanaged Files
    handle_unmanaged_files()

    # Implement Use Case 3 - Reconcile Missing Managed Files
    reconcile_missing_files()

    logger.info("Chezmoi backup script completed successfully")


if __name__ == "__main__":
    main()
