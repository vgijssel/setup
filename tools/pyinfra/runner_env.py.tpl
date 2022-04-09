from rules_python.python.runfiles import runfiles
r = runfiles.Create()

inventory_file = r.Rlocation("{inventory_file}")
deploy_file = r.Rlocation("{deploy_file}")