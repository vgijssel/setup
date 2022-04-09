from rules_python.python.runfiles import runfiles
import subprocess
import os
import json

r = runfiles.Create()
limactl_binary = r.Rlocation('lima/limactl/bin/limactl')

result = subprocess.run([limactl_binary, 'list', '--json', 'hypervisor'], capture_output=True, check=True)
server = json.loads(result.stdout)

hosts = [
	(server['name'], {'ssh_hostname': '127.0.0.1', 'ssh_port': server['sshLocalPort'] }),
]