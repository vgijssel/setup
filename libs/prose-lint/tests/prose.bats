#!/usr/bin/env bats

setup_file() {
    REPO_ROOT="$(cd "${BATS_TEST_DIRNAME}/../../.." && pwd -P)"
    export REPO_ROOT
    export TRUNK="${REPO_ROOT}/bin/trunk"
    export WORKSPACE="${BATS_FILE_TMPDIR}/workspace"
    mkdir -p "${WORKSPACE}/.trunk" "${WORKSPACE}/.vale" "${WORKSPACE}/libs/prose-lint"
    cp "${REPO_ROOT}/.trunk/trunk.yaml" "${WORKSPACE}/.trunk/trunk.yaml"
    cp "${REPO_ROOT}/.vale.ini" "${WORKSPACE}/.vale.ini"
    cp "${REPO_ROOT}/.vale/.gitignore" "${WORKSPACE}/.vale/.gitignore"
    cp "${REPO_ROOT}/libs/prose-lint/comments.py" "${WORKSPACE}/libs/prose-lint/comments.py"
    cp "${REPO_ROOT}/libs/prose-lint/line.tmpl" "${WORKSPACE}/libs/prose-lint/line.tmpl"
    git -C "${WORKSPACE}" init --initial-branch=main --quiet
    git -C "${WORKSPACE}" add .
    GIT_AUTHOR_NAME="Prose tests" GIT_AUTHOR_EMAIL="prose@example.invalid" \
        GIT_COMMITTER_NAME="Prose tests" GIT_COMMITTER_EMAIL="prose@example.invalid" \
        git -C "${WORKSPACE}" -c core.hooksPath=/dev/null -c commit.gpgsign=false \
        commit --quiet -m 'test: initialize prose fixtures'
}

setup() {
    cd "${WORKSPACE}"
}

fixture() {
    mkdir -p "$(dirname "$2")"
    cp "${BATS_TEST_DIRNAME}/fixtures/$1.fixture" "$2"
}

lint() {
    run "${TRUNK}" check --filter=vale --no-fix --no-progress --color=false --cache=false "$@"
    printf '%s\n' "$output"
    [[ "$output" != *"FAILURES"* ]]
    [[ "$output" != *"config-error"* ]]
}

correct() {
    sed 's/This will work\./This works./g' "$1" > "${BATS_TEST_TMPDIR}/corrected"
    cp "${BATS_TEST_TMPDIR}/corrected" "$1"
}

@test "clean Trunk initialization installs pinned styles without a global Vale" {
    [ ! -d .vale/styles/Google ]
    fixture document.md openspec/specs/bootstrap/spec.md
    correct openspec/specs/bootstrap/spec.md
    lint openspec/specs/bootstrap/spec.md
    [ "$status" -eq 0 ]
    [ -f .vale/styles/Google/Will.yml ]
}

@test "OpenSpec specs, active changes, and archives report original lines" {
    for path in openspec/specs/sample/spec.md openspec/changes/sample/specs/sample/spec.md openspec/changes/archive/2026-10-28-sample/specs/sample/spec.md; do
        fixture document.md "$path"
        lint "$path"
        [ "$status" -ne 0 ]
        [[ "$output" == *"${path}:14:6"* ]]
        [[ "$output" == *"1 new lint issue"* ]]
        correct "$path"
        lint "$path"
        [ "$status" -eq 0 ]
    done
}

@test "first-party Markdown excludes fenced and inline code" {
    fixture document.md guide.md
    sed '3s/ADDED Requirements/Requirements/' guide.md > "${BATS_TEST_TMPDIR}/guide"
    cp "${BATS_TEST_TMPDIR}/guide" guide.md
    lint guide.md
    [ "$status" -ne 0 ]
    [[ "$output" == *"guide.md:14:6"* ]]
    mkdir -p openspec/specs/code
    sed '14s/This will work\./This works./' guide.md > openspec/specs/code/spec.md
    lint openspec/specs/code/spec.md
    [ "$status" -eq 0 ]
}

@test "Python comments and module, class, and function docstrings are checked" {
    fixture python.py apps/prose-sample/deploy.py
    lint apps/prose-sample/deploy.py
    [ "$status" -ne 0 ]
    for line in 1 4 12 15; do
        [[ "$output" == *" ${line}:"* ]]
    done
    [[ "$output" == *"4 new lint issues"* ]]
    sed -e '1s/will work/works/' -e '4s/will work/works/' -e '12s/will work/works/' -e '15s/will work/works/' apps/prose-sample/deploy.py > "${BATS_TEST_TMPDIR}/python"
    cp "${BATS_TEST_TMPDIR}/python" apps/prose-sample/deploy.py
    lint apps/prose-sample/deploy.py
    [ "$status" -eq 0 ]
}

@test "Kubernetes comments exclude quoted hashes and block or plain scalars" {
    for extension in yaml yml; do
        path="apps/prose-sample/configmap-example.${extension}"
        fixture manifest.yaml "$path"
        lint "$path"
        [ "$status" -ne 0 ]
        [[ "$output" == *"${path}:1:8"* ]]
        [[ "$output" == *" 5:24"* ]]
        [[ "$output" == *"2 new lint issues"* ]]
        sed -e '1s/will work/works/' -e '5s/will work/works/' "$path" > "${BATS_TEST_TMPDIR}/yaml"
        cp "${BATS_TEST_TMPDIR}/yaml" "$path"
        lint "$path"
        [ "$status" -eq 0 ]
    done
}

@test "Helm comments include trimmed delimiters and exclude template expressions" {
    for path in apps/prose-sample/templates/configmap.yaml libs/prose-sample/templates/_helpers.tpl; do
        fixture helm.yaml "$path"
        lint "$path"
        [ "$status" -ne 0 ]
        for line in 1 3 19 20; do
            [[ "$output" == *" ${line}:"* ]]
        done
        [[ "$output" == *"4 new lint issues"* ]]
        sed -e '1s/will work/works/' -e '3s/will work/works/' -e '19s/will work/works/' -e '20s/will work/works/' "$path" > "${BATS_TEST_TMPDIR}/helm"
        cp "${BATS_TEST_TMPDIR}/helm" "$path"
        lint "$path"
        [ "$status" -eq 0 ]
    done
}

@test "managed, generated, downloaded, and third-party content stays excluded" {
    for path in specs/example.md third_party/example.md tmp/example.md .vale/styles/example.md apps/pikvm/files/example.md apps/sample/charts/dependency/example.md libs/sample/vendor/example.md .claude/commands/opsx/apply.md .claude/commands/speckit.analyze.md .claude/skills/openspec-apply-change/SKILL.md; do
        fixture document.md "$path"
        lint "$path"
        [ "$status" -eq 0 ]
    done
    fixture manifest.yaml openspec/config.yaml
    lint openspec/config.yaml
    [ "$status" -eq 0 ]
}

@test "malformed Helm expressions fail rather than silently losing comments" {
    mkdir -p apps/prose-sample/templates
    printf '{{- /* Unclosed comment\n' > apps/prose-sample/templates/broken.yaml
    lint apps/prose-sample/templates/broken.yaml
    [ "$status" -ne 0 ]
    [[ "$output" == *"Unclosed Helm comment"* ]]
    [[ "$output" == *"vale/prose-parser"* ]]
}

@test "incremental checks reject new findings without blocking on historical findings" {
    mkdir -p docs
    printf 'This will start.\n' > docs/incremental.md
    git add docs/incremental.md
    GIT_AUTHOR_NAME="Prose tests" GIT_AUTHOR_EMAIL="prose@example.invalid" \
        GIT_COMMITTER_NAME="Prose tests" GIT_COMMITTER_EMAIL="prose@example.invalid" \
        git -c core.hooksPath=/dev/null -c commit.gpgsign=false \
        commit --quiet -m 'test: record historical prose finding'
    printf '\nThis will finish.\n' >> docs/incremental.md
    lint docs/incremental.md
    [ "$status" -ne 0 ]
    [[ "$output" == *"1 new lint issue"* ]]
    [[ "$output" == *"docs/incremental.md:3:6"* ]]
    printf 'This will start.\n\nThis finishes.\n' > docs/incremental.md
    lint docs/incremental.md
    [ "$status" -eq 0 ]
    [[ "$output" == *"1 existing issue"* ]]
}

@test "representative repository files run without integration failures" {
    for path in apps/pikvm/deploy.py apps/platform/src/envoy-gateway/templates/gatewayclass-envoy.yaml; do
        mkdir -p "$(dirname "$path")"
        cp "${REPO_ROOT}/${path}" "$path"
        lint "$path"
        [[ "$output" == *"Checked 1 file"* ]]
    done
}
