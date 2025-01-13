print("kerk")

# 1. get dependency information from pants
# pants --loop dependencies --dependencies-transitive --dependencies-format=json 3rdparty/python:reqs#mkdocs-publisher
#
# first problem: calling pants from pants will get stuck with message: "Another pants invocation is running."
#

import subprocess

result = subprocess.run(
    [
        "pants",
        "dependencies",
        "--dependencies-transitive",
        "--dependencies-format=json",
        "3rdparty/python:reqs#mkdocs-publisher",
    ]
)

print(result.stdout)
print(result.stderr)


# 2. generate unique sha for the dependency graph
# 3. update hermit installation with new sha
