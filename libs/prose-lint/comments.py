import json
import re
import subprocess
import sys
import tempfile
import textwrap
from pathlib import Path

import tree_sitter_yaml
from tree_sitter import Language, Parser


def template_spans(source):
    position = 0
    while (start := source.find("{{", position)) >= 0:
        cursor = start + 2
        if source[cursor : cursor + 1] == "-":
            cursor += 1
        while cursor < len(source) and source[cursor].isspace():
            cursor += 1
        if source[cursor : cursor + 2] == "/*":
            body = cursor + 2
            end = source.find("*/", body)
            if end < 0:
                raise ValueError("Unclosed Helm comment")
            closing = re.match(r"\s*-?}}", source[end + 2 :])
            if closing is None:
                raise ValueError("Invalid Helm comment closing delimiter")
            position = end + 2 + closing.end()
            yield start, position, (body, end)
            continue
        quote = None
        while cursor < len(source):
            char = source[cursor]
            if quote:
                if char == "\\" and quote != "`":
                    cursor += 2
                    continue
                if char == quote:
                    quote = None
            elif char in ('"', "'", "`"):
                quote = char
            elif source[cursor : cursor + 2] == "}}":
                position = cursor + 2
                yield start, position, None
                break
            cursor += 1
        else:
            raise ValueError("Unclosed Helm expression")


def fragments(source, helm):
    masked = list(source)
    if helm:
        for start, end, body in template_spans(source):
            for offset in range(start, end):
                if source[offset] not in "\r\n":
                    masked[offset] = " "
            if body:
                yield body[0], source[body[0] : body[1]]
            else:
                line_start = source.rfind("\n", 0, start) + 1
                line_end = source.find("\n", end)
                if line_end < 0:
                    line_end = len(source)
                if source[line_start:start].strip() or source[end:line_end].strip():
                    masked[start] = "x"
    text = "".join(masked)
    encoded = text.encode()
    parser = Parser(Language(tree_sitter_yaml.language()))
    tree = parser.parse(encoded)
    nodes = [tree.root_node]
    while nodes:
        node = nodes.pop()
        if node.type == "comment":
            start = len(encoded[: node.start_byte].decode()) + 1
            end = len(encoded[: node.end_byte].decode())
            yield start, text[start:end]
        else:
            nodes.extend(reversed(node.children))


def check(path):
    source = path.read_text()
    helm = "templates" in path.parts
    blocks = []
    previous_end = 0
    for offset, fragment in sorted(fragments(source, helm)):
        if not fragment.strip():
            continue
        if blocks and re.fullmatch(r"\r?\n[ \t]*#", source[previous_end:offset]):
            blocks[-1].append((offset, fragment))
        else:
            blocks.append([(offset, fragment)])
        previous_end = offset + len(fragment)
    locations = {}
    with tempfile.TemporaryDirectory(prefix="prose-lint-") as directory:
        for block in blocks:
            contents = []
            positions = []
            for offset, fragment in block:
                line = source.count("\n", 0, offset) + 1
                column = offset - source.rfind("\n", 0, offset)
                for index, content in enumerate(fragment.splitlines()):
                    contents.append(content)
                    positions.append((line + index, column if index == 0 else 1))
            text = textwrap.dedent("\n".join(contents))
            target = Path(directory) / f"{len(locations)}.md"
            target.write_text(text)
            for index, (original, content) in enumerate(
                zip(contents, text.splitlines())
            ):
                padding = len(original) - len(content)
                line, column = positions[index]
                positions[index] = (line, column + padding)
            locations[str(target)] = positions
        if not locations:
            return False
        result = subprocess.run(
            [
                "vale",
                "--no-global",
                "--output=JSON",
                directory,
            ],
            text=True,
            capture_output=True,
            check=False,
        )
        if result.returncode not in (0, 1):
            raise ValueError(result.stderr or result.stdout)
        diagnostics = json.loads(result.stdout)
    found = False
    for filename, alerts in diagnostics.items():
        for alert in alerts:
            line, column = locations[filename][alert["Line"] - 1]
            column += alert["Span"][0] - 1
            print(
                f"{path}:{line}:{column}:{alert['Severity']}:"
                f"{alert['Check']}: {alert['Message']}"
            )
            found = True
    return found


def main():
    found = False
    for filename in sys.argv[1:]:
        try:
            found = check(Path(filename)) or found
        except (OSError, ValueError, KeyError, TypeError, IndexError) as error:
            print(f"{filename}:1:1:error:prose-parser: {error}")
            found = True
    return int(found)


if __name__ == "__main__":
    sys.exit(main())
