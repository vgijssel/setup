import subprocess
import os
import json

is_dev = os.environ.get('SETUP_ENV', 'dev') == 'dev'
hosts = None

if is_dev:
	hosts = [
		('@vagrant/default', { 'ssh_strict_host_key_checking': 'no' }),
	]
else:
	ssh_host = os.environ['ssh_host']
	ssh_port = os.environ['ssh_port']
	ssh_user = os.environ['ssh_user']
	ssh_password = os.environ['ssh_password']

	hosts = [
		('packer', {'ssh_hostname': ssh_host, 'ssh_port': ssh_port, 'ssh_user': ssh_user, 'ssh_password': ssh_password, 'ssh_strict_host_key_checking': 'no' }),
	]