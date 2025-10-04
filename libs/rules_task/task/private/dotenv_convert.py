import shlex
import sys

_, input_file, output_file = sys.argv

with open(input_file, "r") as file:
    bazel_content = file.read()

results = []

for line in bazel_content.split("\n"):
    if not line:
        continue

    key, value = line.split(" ", 1)
    safe_value = shlex.quote(value)

    results.append(f"export {key}=${{{key}:-{safe_value}}}")

with open(output_file, "w") as file:
    file.write("\n".join(results))


print(f"input_file: {input_file}")
print(f"output_file: {output_file}")
