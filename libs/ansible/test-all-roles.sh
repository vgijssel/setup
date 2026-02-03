#!/usr/bin/env bash
set -euo pipefail

# Install test dependencies if needed
if [[ ! -d ".venv" ]]; then
  python3 -m venv .venv
  .venv/bin/pip install --upgrade pip
  .venv/bin/pip install -r requirements-dev.txt
fi

# Test each role
for role in roles/*/
do
  role_name=$(basename "${role}")
  echo "Testing role: ${role_name}"
  cd "${role}" && ../../.venv/bin/molecule test && cd ../..
done
