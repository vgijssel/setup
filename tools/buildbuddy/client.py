from tools.buildbuddy.service_grpc import ApiServiceStub
from tools.buildbuddy.invocation_pb2 import GetInvocationRequest, InvocationSelector
from tools.buildbuddy.workflow_pb2 import ExecuteWorkflowRequest
from grpclib.client import Channel
import asyncio
import os


async def start_workflow():
    async with Channel("app.buildbuddy.io", 1986, ssl=True) as channel:
        stub = ApiServiceStub(channel)
        token = os.environ["BUILDBUDDY_TOKEN"]
        invocation_id = os.environ["BUILDBUDDY_INVOCATION_ID"]
        reply = await stub.ExecuteWorkflow(
            ExecuteWorkflowRequest(
                repo_url="https://github.com/mvgijssel/setup",
                ref="master",
                action_names=["Test all targets"],
            ),
            metadata={"x-buildbuddy-api-key": token},
        )

        reply.action_statuses[0].invocation_id

        import pdb

        pdb.set_trace()

        print(reply)

    # reply = await stub.GetInvocation(
    #     GetInvocationRequest(
    #         selector=InvocationSelector(invocation_id=invocation_id),
    #         # include_metadata=True,
    #     ),
    #     metadata={"x-buildbuddy-api-key": token},
    # )


# duration_usec used to determine if invocation is done or not.
# success=True only present when invocation is done and successful
async def main():
    await start_workflow()

    async with Channel("app.buildbuddy.io", 1986, ssl=True) as channel:
        stub = ApiServiceStub(channel)
        token = os.environ["BUILDBUDDY_TOKEN"]
        invocation_id = os.environ["BUILDBUDDY_INVOCATION_ID"]
        reply = await stub.GetInvocation(
            GetInvocationRequest(
                selector=InvocationSelector(invocation_id=invocation_id),
                # include_metadata=True,
            ),
            metadata={"x-buildbuddy-api-key": token},
        )

        import pdb

        pdb.set_trace()

        print(reply)


if __name__ == "__main__":
    asyncio.run(main())

# import pdb

# pdb.set_trace()

# TODO: "@go_googleapis//google/rpc:status_proto",
# this dependency does not work with Python?
