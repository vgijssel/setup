# query lima

import subprocess
import os
import json

limactl_binary = os.environ['LIMACTL_BINARY']

result = subprocess.run([limactl_binary, 'list', '--json', 'hypervisor'], capture_output=True, check=True)
server = json.loads(result.stdout)

hosts = [
	(server['name'], {'ssh_hostname': '127.0.0.1', 'ssh_port': server['sshLocalPort'] }),
]

# TODO: how can we ignore host keys missing on host?