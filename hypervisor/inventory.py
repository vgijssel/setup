from rules_python.python.runfiles import runfiles
import subprocess
import os
import json

is_dev = os.environ.get('SETUP_ENV', 'dev') == 'dev'
hosts = None

# 1. get the location of the vagrantfile into the inventory
# 2. get the vagrant binary location, take the dirname and add this to the os.PATH so Pyinfra picks it up.
# 3. set the necessary env variables before running the vagrant command

if is_dev:
	r = runfiles.Create()
	vagrant_binary = r.Rlocation('setup/tools/vagrant/vagrant_runtime')
	os.environ['PATH'] = os.path.dirname(vagrant_binary) + ':' + os.environ['PATH']

	print(os.environ['PATH'])

	hosts = [
		('@vagrant/hypervisor')
	]
else:
	ssh_host = os.environ['ssh_host']
	ssh_port = os.environ['ssh_port']
	ssh_user = os.environ['ssh_user']
	ssh_password = os.environ['ssh_password']

	hosts = [
		('packer', {'ssh_hostname': ssh_host, 'ssh_port': ssh_port, 'ssh_user': ssh_user, 'ssh_password': ssh_password, 'ssh_strict_host_key_checking': 'no' }),
	]