import pprint
from tools.buildbuddy.service_grpc import ApiServiceStub
from tools.buildbuddy.invocation_pb2 import GetInvocationRequest, InvocationSelector
from tools.buildbuddy.workflow_pb2 import ExecuteWorkflowRequest
from tools.buildbuddy.log_pb2 import GetLogRequest, LogSelector
from grpclib.client import Channel
import asyncio
import os
import sys


async def start_workflow(stub, action_name):
    token = os.environ["BUILDBUDDY_API_KEY"]
    reply = await stub.ExecuteWorkflow(
        ExecuteWorkflowRequest(
            repo_url="https://github.com/mvgijssel/setup",
            ref="master",
            action_names=[action_name],
        ),
        metadata={"x-buildbuddy-api-key": token},
    )
    # print(reply)
    return reply.action_statuses[0].invocation_id


async def get_log(stub, invocation_id):
    token = os.environ["BUILDBUDDY_API_KEY"]
    reply = await stub.GetLog(
        GetLogRequest(selector=LogSelector(invocation_id=invocation_id)),
        metadata={"x-buildbuddy-api-key": token},
    )
    # print(reply)
    return reply


async def get_invocation(stub, invocation_id):
    token = os.environ["BUILDBUDDY_API_KEY"]
    reply = await stub.GetInvocation(
        GetInvocationRequest(
            selector=InvocationSelector(invocation_id=invocation_id),
        ),
        metadata={"x-buildbuddy-api-key": token},
    )
    # print(reply)
    return reply.invocation[0]


async def main():
    async with Channel("app.buildbuddy.io", 1986, ssl=True) as channel:
        stub = ApiServiceStub(channel)
        action_name = "Deploy Provisioner"
        invocation_id = await start_workflow(stub, action_name=action_name)

        while True:
            invocation = await get_invocation(stub, invocation_id)

            if invocation.duration_usec > 0:
                break

            print("Not yet ready. Sleeping 5...")
            await asyncio.sleep(1)

        log = await get_log(stub, invocation_id)

        print(log.log.contents)

        if invocation.success:
            sys.exit(0)
        else:
            sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
