from rules_python.python.runfiles import runfiles
import subprocess
import os
import json

is_dev = os.environ.get('SETUP_ENV', 'dev') == 'dev'
hosts = None

if is_dev:
	r = runfiles.Create()
	limactl_binary = r.Rlocation('lima/limactl/bin/limactl')

	result = subprocess.run([limactl_binary, 'list', '--json', 'hypervisor'], capture_output=True, check=True)
	server = json.loads(result.stdout)

	hosts = [
		(server['name'], {'ssh_hostname': '127.0.0.1', 'ssh_port': server['sshLocalPort'], 'ssh_strict_host_key_checking': 'no' }),
	]
else:
	ssh_host = os.environ['ssh_host']
	ssh_port = os.environ['ssh_port']
	ssh_user = os.environ['ssh_user']
	ssh_password = os.environ['ssh_password']

	hosts = [
		('packer', {'ssh_hostname': ssh_host, 'ssh_port': ssh_port, 'ssh_user': ssh_user, 'ssh_password': ssh_password, 'ssh_strict_host_key_checking': 'no' }),
	]