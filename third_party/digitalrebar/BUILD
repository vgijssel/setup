package(default_visibility = ["PUBLIC"])

DIGITALREBAR_VERSION = "4.6.5"

text_file(
    name = "version",
    content = DIGITALREBAR_VERSION,
)

http_archive(
    name = "archive",
    urls = [
        f"https://github.com/digitalrebar/provision/archive/refs/tags/v{DIGITALREBAR_VERSION}.tar.gz",
    ],
)

genrule(
    name = "sledgehammer",
    outs = ["sledgehammer_out"],
    cmd = f"""
    set -Eeou pipefail

    # From https://provision.readthedocs.io/en/latest/doc/operations/airgap.html
    wget -O - https://rebar-catalog.s3-us-west-2.amazonaws.com/rackn-catalog.json | gunzip -c > rackn-catalog.json

    DRP_COMMUNITY_URL=$(cat rackn-catalog.json | $TOOLS_JQ -r '.sections.catalog_items."drp-community-content-v{DIGITALREBAR_VERSION}".Source')
    wget $DRP_COMMUNITY_URL -O drp-community.json

    SLEDGEHAMMER_URL=$(cat drp-community.json | $TOOLS_JQ -r '.sections.bootenvs.sledgehammer.OS.SupportedArchitectures.amd64.IsoUrl')
    mkdir -p $OUTS
    cd $OUTS
    wget $SLEDGEHAMMER_URL
    """,
    tools = {
        "jq": "//third_party/jq",
    },
)

genrule(
    name = "drpcli",
    outs = ["drpcli"],
    binary = True,
    cmd = f"""
    set -Eeou pipefail

    # From https://provision.readthedocs.io/en/latest/doc/operations/airgap.html
    wget -O - https://rebar-catalog.s3-us-west-2.amazonaws.com/rackn-catalog.json | gunzip -c > rackn-catalog.json

    # From provision/tools/install.sh
    DRP_URL=$(cat rackn-catalog.json | $TOOLS_JQ -r '.sections.catalog_items."drp-v{DIGITALREBAR_VERSION}".Source')
    wget $DRP_URL -O dr-provision.zip

    mkdir -p out
    tar -xf dr-provision.zip -C out

    cp out/bin/{CONFIG.HOSTOS}/{CONFIG.HOSTARCH}/drpcli $OUTS
    """,
    tools = {
        "jq": "//third_party/jq",
    },
)