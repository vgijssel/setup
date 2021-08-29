subinclude("//build_helpers/defs:docker")

subinclude("//tools/template")

DIGITALREBAR_VERSION = "4.6.5"

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

    DRP_COMMUNITY_URL=$(cat rackn-catalog.json | jq -r '.sections.catalog_items."drp-community-content-v{DIGITALREBAR_VERSION}".Source')
    wget $DRP_COMMUNITY_URL -O drp-community.json

    SLEDGEHAMMER_URL=$(cat drp-community.json | jq -r '.sections.bootenvs.sledgehammer.OS.SupportedArchitectures.amd64.IsoUrl')
    mkdir -p $OUTS
    cd $OUTS
    wget $SLEDGEHAMMER_URL
    """,
)

template(
    name = "dockerfile",
    srcs = ["./Dockerfile"],
    subs = [
        "./base",
        "./scripts",
        ":archive",
        ":sledgehammer",
        template_value("DIGITALREBAR_VERSION", DIGITALREBAR_VERSION),
    ],
)

docker_build(
    name = "digitalrebar",
    srcs = [
        "./base",
        "./scripts",
        ":archive",
        ":sledgehammer",
    ],
    dockerfile = ":dockerfile",
    visibility = ["PUBLIC"],
)
