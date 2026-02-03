# Ansible Role Testing with Molecule and Goss

This directory contains Ansible roles with comprehensive testing using Molecule and the Goss testing framework.

## Overview

Each role in `roles/` has a `molecule/default/` directory containing:
- `molecule.yml` - Molecule configuration (Docker driver, platform setup)
- `converge.yml` - Playbook that applies the role
- `verify.yml` - Playbook that runs Goss tests
- `tests/goss.yaml` - Goss test specifications

## Prerequisites

- Docker (for running test containers)
- Python 3.8+
- Moon build system

## Running Tests

### Test All Roles

```bash
moon run ansible:test
```

This will:
1. Create a Python virtual environment if it doesn't exist
2. Install Molecule, Goss, and dependencies
3. Run `molecule test` for each role sequentially

### Test a Specific Role

```bash
ROLE=common moon run ansible:test-role
```

Or manually:

```bash
cd libs/ansible
python3 -m venv .venv
.venv/bin/pip install -r requirements-dev.txt
cd roles/common
../../.venv/bin/molecule test
```

### Molecule Test Phases

The `molecule test` command runs through these phases:

1. **dependency** - Install Ansible Galaxy collections from requirements.yml
2. **cleanup** - Remove any existing test containers
3. **destroy** - Ensure clean state
4. **syntax** - Check playbook syntax
5. **create** - Create Docker test container
6. **prepare** - Run preparation steps (if defined)
7. **converge** - Apply the role to the container
8. **idempotence** - Apply again to ensure idempotency
9. **verify** - Run Goss tests
10. **cleanup** - Remove test container
11. **destroy** - Final cleanup

### Interactive Testing

For development and debugging:

```bash
cd roles/common
../../.venv/bin/molecule create    # Create test container
../../.venv/bin/molecule converge  # Apply the role
../../.venv/bin/molecule verify    # Run tests
../../.venv/bin/molecule login     # SSH into container for debugging
../../.venv/bin/molecule destroy   # Clean up
```

## Test Structure

### Molecule Configuration (molecule.yml)

```yaml
driver:
  name: docker  # Uses Docker for test containers
platforms:
  - name: ubuntu-rolename
    image: geerlingguy/docker-ubuntu2204-ansible:latest
    privileged: true  # Required for systemd
verifier:
  name: goss  # Uses Goss for testing
```

### Goss Tests (tests/goss.yaml)

Goss provides a simple YAML-based testing framework. Example tests:

```yaml
# Test packages are installed
package:
  docker.io:
    installed: true

# Test services are running
service:
  docker:
    enabled: true
    running: true

# Test files exist with correct permissions
file:
  /etc/docker/daemon.json:
    exists: true
    mode: "0644"
    owner: root

# Test commands execute successfully
command:
  docker --version:
    exit-status: 0
    stdout:
      - "Docker version"

# Test ports are listening
port:
  tcp:22:
    listening: true
```

## Available Roles and Tests

- **common** - Base system configuration (SSH, users, networking)
- **tailscale** - Tailscale VPN installation and configuration
- **k3s** - Lightweight Kubernetes installation
- **pihole** - Pi-hole DNS ad blocker with Docker
- **proxmox** - Proxmox VE configuration
- **incus** - Incus container manager
- **pikvm** - PiKVM configuration

## Continuous Integration

The tests are designed to run in CI environments:

```bash
# In CI pipeline
moon run ansible:test
```

## Troubleshooting

### Docker Permission Issues

If you get Docker socket permission errors:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Container Won't Start

Check Docker daemon is running:

```bash
sudo systemctl status docker
```

### Goss Tests Failing

Debug by logging into the container:

```bash
cd roles/rolename
../../.venv/bin/molecule converge
../../.venv/bin/molecule login
# Inside container:
goss --gossfile /tmp/molecule/goss/tests/goss.yaml validate
```

### Clean Up Dangling Containers

```bash
docker ps -a | grep molecule
docker rm -f $(docker ps -a -q --filter "name=molecule")
```

## Best Practices

1. **Keep tests simple** - Test the role's intended outcomes, not implementation
2. **Use idempotent tests** - Tests should pass on repeated runs
3. **Test service state** - Verify services are enabled and running
4. **Test file permissions** - Ensure security-sensitive files have correct modes
5. **Avoid testing external dependencies** - Mock or skip tests requiring internet
6. **Pin all versions** - Use exact versions in requirements-dev.txt

## References

- [Molecule Documentation](https://molecule.readthedocs.io/)
- [Goss Manual](https://github.com/goss-org/goss/blob/master/docs/manual.md)
- [Jeff Geerling's Ansible Testing](https://www.jeffgeerling.com/blog/2018/testing-your-ansible-roles-molecule)
