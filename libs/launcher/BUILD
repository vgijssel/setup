# from: https://www.pantsbuild.org/dev/docs/python/overview/pex
python_sources(name = "lib")

pex_binary(
    name = "launcher",
    dependencies = [
        ":lib",
    ],
    entry_point = "launcher.py",
)
