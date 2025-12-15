# SSH Key Resource
resource "hcloud_ssh_key" "gateway" {
  name       = "${var.server_name}-key"
  public_key = var.ssh_public_key
}

# Firewall Resource
resource "hcloud_firewall" "gateway" {
  name = "${var.server_name}-firewall"

  # SSH - For provisioning and management
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "22"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  # HTTP - Public ingress
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "80"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  # HTTPS - Public ingress
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "443"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  # Talos API - Initial setup only
  # TODO: Restrict to specific IPs or remove after initial cluster bootstrap
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "50000"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  # WireGuard - Kubespan
  rule {
    direction  = "in"
    protocol   = "udp"
    port       = "51820"
    source_ips = ["0.0.0.0/0", "::/0"]
  }
}

# Server Resource
resource "hcloud_server" "gateway" {
  name        = var.server_name
  server_type = var.server_type
  datacenter  = var.datacenter
  image       = "ubuntu-24.04"
  ssh_keys    = [hcloud_ssh_key.gateway.id]
  firewall_ids = [hcloud_firewall.gateway.id]

  labels = {
    environment = "production"
    role        = "gateway"
    managed_by  = "terraform"
  }

  lifecycle {
    ignore_changes = [user_data]
  }

  # Cloud-init user data to run boot-to-talos automatically
  user_data = <<-EOT
    #cloud-config
    runcmd:
      - |
        #!/bin/bash
        set -x
        exec > /var/log/boot-to-talos.log 2>&1
        echo "Starting boot-to-talos process at $(date)"
        sleep 30
        cd /tmp
        curl -sL https://github.com/cozystack/boot-to-talos/releases/download/v0.5.0/boot-to-talos-linux-amd64.tar.gz | tar xzf -
        ./boot-to-talos -yes -disk /dev/sda -image ${var.talos_image}
        echo "boot-to-talos completed at $(date)"
  EOT
}

# Note: boot-to-talos is triggered via cloud-init user_data in the server resource above
# After the server is created, cloud-init will automatically download and run boot-to-talos
# The system will reboot into Talos Linux after boot-to-talos completes
