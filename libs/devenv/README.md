# Project Requirements Document

This document outlines the requirements for a Python-based script that interacts with `chezmoi` to manage user configuration files.

## Use Case 1: Backup Managed Files

**Goal:**  
Backup all files managed by `chezmoi` in the user's `$HOME` directory.

**Requirements:**
- The script must create a backup for each file managed by `chezmoi`.
- Backups must be stored in `$HOME/.setup/backup/YYYYMMDD-HHMMSS/`.
- Each script run must generate a new timestamped backup directory.

## Use Case 2: Handle Untracked Files

**Goal:**  
Backup original files which are about-to-be managed by `chezmoi` for easy recovery later

**Requirements:**
- The script must copy such files into `$HOME/.setup/unmanaged/`.
- Files should retain the same relative path structure.
- Only files that are managed by `chezmoi` should be considered for this operation.

## Use Case 3: Reconcile Missing Managed Files

**Goal:**  
Restore missing files listed in the `chezmoi` state database to the `$HOME` directory.

**Requirements:**
- If a file is recorded in the `chezmoi` state but not present in `$HOME`:
  - Copy the corresponding file from `$HOME/.setup/unmanaged/` to `$HOME`.
  - If the unmanaged version does not exist, delete the file from `$HOME` and remove it from the `chezmoi` state database.

## General Constraints

- The script must be implemented using Python.
- The script must use `uv` as the Python launcher for dependency isolation and reproducibility.
- The script must be self-contained and runnable from the project root.