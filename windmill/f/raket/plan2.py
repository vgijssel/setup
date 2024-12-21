import os

import wmill
from wmill import Windmill, task

client = Windmill()


def execute_on_local_worker():
    # List all the files in the local ephemeral worker
    files = os.listdir("/opt/setup")
    return files


def main(worker_uuid: str):
    if not worker_uuid:
        raise ValueError(f"worker_uuid is invalid: {worker_uuid}")

    # Collect the current custom tags and add the given worker_uuid as a new tag
    current_custom_tags = set(client.get("/workers/custom_tags").json())
    current_custom_tags.add(worker_uuid)
    current_custom_tags = list(current_custom_tags)

    # Update the new allowed custom tags in Windmill
    result = client.post(
        "/settings/global/custom_tags", json={"value": current_custom_tags}
    )
    print(f"new tags: {current_custom_tags}")

    # Hacky way to schedule a job using the given worker_uuid
    @task(tag=worker_uuid)
    def execute_on_local_worker():
        pass

    result = execute_on_local_worker()
    print(f"from main: {result}")
