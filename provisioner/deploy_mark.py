import requests
import os
import sys

url = "https://api.eu.newrelic.com/graphql"
entity_guid = os.environ["ENTITY_GUID"]
_, commit_sha = sys.argv
new_relic_api_key = os.environ["NEW_RELIC_API_KEY"]
group_id = commit_sha

headers = {
    "Content-Type": "application/json",
    "API-Key": new_relic_api_key,
}

query = """
mutation {
  changeTrackingCreateDeployment(deployment: {
    entityGuid: "%s",
    commit: "%s",
    groupId: "%s",
    deploymentType: ROLLING,
    version: "0.1",
  }) {
    changelog
    commit
    deepLink
    deploymentId
    deploymentType
    description
    groupId
    user
  }
}
""" % (
    entity_guid,
    commit_sha,
    group_id,
)

response = requests.post(url, json={"query": query}, headers=headers)

if response.ok:
    print("Request was successful.")
else:
    print(response.text)
    response.raise_for_status()
