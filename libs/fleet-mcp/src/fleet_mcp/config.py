"""Centralized configuration for fleet-mcp"""

import os

# Coder API configuration
CODER_BASE_URL = os.getenv("CODER_URL", "https://coder.example.com")
CODER_TOKEN = os.getenv("CODER_TOKEN", "changeme")
