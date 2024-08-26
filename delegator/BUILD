python_sources(
    name = "lib",
)

pex_binary(
    name = "delegator",
    entry_point = "delegator.py",
    # Specifing the output_path enables removing the `.pex` extension
    output_path = "delegator/delegator",
    shebang = "#!/usr/bin/env python3",
)
