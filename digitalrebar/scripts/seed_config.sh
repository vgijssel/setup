#!/bin/bash

set -Eeoux pipefail

# Install required community content
drpcli catalog item install drp-community-content

# Upload default content
drpcli contents upload catalog:task-library-stable

# Ensure logs are forwarded to console port
drpcli profiles set global param kernel-console to "console=tty0 console=ttyS0,115200"

# Install image deploy content pack
drpcli catalog item install image-deploy