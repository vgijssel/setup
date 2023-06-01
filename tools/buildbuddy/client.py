from tools.buildbuddy.service_grpc import ApiServiceStub

# TODO: implement proper
stub = ApiServiceStub(channel="app.buildbuddy.io:443")
stub.GetInvocation()

# import pdb

# pdb.set_trace()

# TODO: "@go_googleapis//google/rpc:status_proto",
# this dependency does not work with Python?
