#!/bin/bash

set -e

DIR=""
TIMEOUT=60

while [[ $# -gt 0 ]]; do
    case $1 in
        --dir)
            DIR="$2"
            shift 2
            ;;
        --timeout)
            TIMEOUT="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 --dir <directory> [--timeout <seconds>]"
            exit 1
            ;;
    esac
done

if [[ -z "${DIR}" ]]; then
    echo "Error: --dir argument is required"
    echo "Usage: $0 --dir <directory> [--timeout <seconds>]"
    exit 1
fi

echo "⏳ Waiting for git repository at ${DIR} to be available..."

WAIT_TIME=0

while [[ "${WAIT_TIME}" -lt "${TIMEOUT}" ]]; do
    if [[ -d "${DIR}/.git" ]]; then
        if cd "${DIR}" 2>/dev/null && \
           git status >/dev/null 2>&1 && \
           [[ -f "${DIR}/.git/index" ]] && \
           [[ -d "${DIR}/.git/refs" ]] && \
           [[ "$(find "${DIR}/.git/refs" -type f 2>/dev/null | head -n 1)" != "" ]]; then
            echo "✅ Git repository clone completed successfully"
            echo "📋 Current branch: $(git branch --show-current 2>/dev/null || echo 'unknown')"
            echo "📋 Repository status:"
            git status --short
            exit 0
        else
            echo "⏳ Git clone in progress... (.git exists but clone not complete)"
        fi
    fi

    if [[ "${WAIT_TIME}" -eq 0 ]]; then
        echo "⏳ Git repository not found yet, waiting up to ${TIMEOUT} seconds..."
    elif [[ $((${WAIT_TIME} % 10)) -eq 0 ]]; then
        echo "⏳ Still waiting... (${WAIT_TIME}/${TIMEOUT} seconds)"
    fi

    sleep 1
    WAIT_TIME=$((WAIT_TIME + 1))
done

echo "❌ Timeout: Git repository at ${DIR} not available after ${TIMEOUT} seconds"
echo "Directory contents of $(dirname "${DIR}"):"
ls -la "$(dirname "${DIR}")" 2>/dev/null || echo "Cannot list $(dirname "${DIR}")"
exit 1