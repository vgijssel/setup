# requirements:
# markdown-it-py

import os

# Example of the markdown
"""
This comment is managed by Raket 🚀 

> [!TIP]
> Feel free to update this table to better reflect the type of change it is!

| Project           | Type  | Message                 | Pre Release?                                      |
| ----------------- | ----- | ----------------------- | ------------------------------------------------- |
| spacelift-ansible | chore | Update ansible to 2.9.6 | no |
| spacelift-terraform | chore | Update ansible to 2.9.6 | no |

- [ ] ♻️ Refresh
- [ ] ✅ Approve changes
"""

from markdown_it import MarkdownIt


def main(markdown_text: str):
    md = MarkdownIt("commonmark", {"breaks": True, "html": True}).enable("table")

    tokens = md.parse(markdown_text)
    print(tokens)
