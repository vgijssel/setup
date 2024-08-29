python_sources(
    name = "lib",
)

pex_binary(
    name = "delegator",
    dependencies = [
        ":server-pex",
    ],
    entry_point = "delegator.py",
    # Specifing the output_path enables removing the `.pex` extension
    output_path = "delegator/delegator",
    shebang = "#!/usr/bin/env python3",
)

pex_binary(
    name = "server",
    entry_point = "server.py",
    environment = "local_linux_python",
    shebang = "#!/usr/bin/env python3",
)

package_resource(
    name = "server-pex",
    output_files = [
        "delegator/server.pex",
    ],
    source = ":server",
)
