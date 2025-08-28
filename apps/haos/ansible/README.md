# HAOS Ansible Playbooks

## Install Unison

This playbook installs Unison version 2.53.7 on the HAOS host at `root@192.168.1.32`.

### Usage

```bash
cd /Users/maarten/Development/setup/apps/haos/ansible
ansible-playbook install-unison.yml
```

### What it does

1. Downloads Unison 2.53.7 from GitHub releases
2. Extracts and installs the binary to `/usr/local/bin/unison`
3. Sets proper permissions (755, root:root)
4. Verifies the installation
5. Ensures `/usr/local/bin` is in the system PATH

### Prerequisites

- SSH access to `root@192.168.1.32`
- Ansible installed locally
- Target host should be Linux x86_64

### Configuration

- **Target host**: Configured in `hosts` file
- **Ansible settings**: Configured in `ansible.cfg`
- **Role location**: Uses `haos` role from `../../../libs/ansible/roles/haos`