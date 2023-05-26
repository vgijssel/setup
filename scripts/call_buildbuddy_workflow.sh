#!/usr/bin/env bash

set -Eeou pipefail

ref=$1
action_name=$2
buildbuddy_api_key=$3

invocation_id=$(curl \
        --fail \
        -d "{\"repo_url\":\"https://github.com/mvgijssel/setup\", \"ref\": \"$ref\", \"action_names\": [\"$action_name\"]}" \
        -H "x-buildbuddy-api-key: $buildbuddy_api_key" \
        -H 'Content-Type: application/json' \
        https://app.buildbuddy.io/api/v1/ExecuteWorkflow | jq -r .actionStatuses[0].invocationId);

printf "\nStarted workflow in BuildBuddy with invocation id $invocation_id\n"

interval_in_seconds=5

printf "\nPolling every $interval_in_seconds seconds, until 'success' is true or false\n"

while true;
do
    success=$(curl \
        --fail \
        -d "{\"selector\": {\"invocation_id\":\"$invocation_id\"}}" \
        -H "x-buildbuddy-api-key: $buildbuddy_api_key" \
        -H 'Content-Type: application/json' \
        https://app.buildbuddy.io/api/v1/GetInvocation | jq -r .invocation[0].success);

    printf "\r$(date +%H:%M:%S): $success";

    if [[ "$success" == "true" || "$success" == "false" ]]; then
        if [[ "$success" == "false" ]]; then
            printf "\n Workflow failed!"
            exit 1
        else
            printf "\nWorkflow succeeded!";
            exit 0
        fi
    fi;
    sleep $interval_in_seconds;
done