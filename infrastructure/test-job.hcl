job "test-job" {
  datacenters = ["dc1"]
  type = "service"

  group "master" {
    count = 1

    network {
      port "ssh" {
      }

      port "sidecar" {
      }
    }

    service {
      name = "kubernetes-master"
    }

    task "register-proxy" {
      lifecycle {
        hook = "prestart"
      }

      template {
        data = <<EOH
service {
  name = "kubernetes-master-proxy"
  kind = "connect-proxy"

  proxy = {
    destination_service_name  = "kubernetes-master"
    destination_service_id  = "kubernetes-master"

    upstreams {
      destination_name = "kubernetes-worker"
      local_bind_port = 8081
    }
  }

  port = {{ env "NOMAD_HOST_PORT_sidecar" }}
}
        EOH

        destination = "local/proxy.hcl"
      }

      driver = "raw_exec"

      config {
        command = "consul"
        args = ["services", "register", "local/proxy.hcl"]
      }
    }

    task "deregister-proxy" {
      lifecycle {
        hook = "poststop"
      }

      driver = "raw_exec"
      config {
        command = "consul"
        args = ["services", "deregister", "-id", "kubernetes-master-proxy"]
      }
    }

    ephemeral_disk {
      migrate = true
      size    = 10000
      sticky  = true
    }

    task "master" {
      driver = "qemu"

      resources {
        cpu    = 100
        memory = 2048
      }

      config {
        image_path  = "local/image.qcow2"
        accelerator = "hvf"
        graceful_shutdown = true
        args = [
          "-cdrom", 
          "local/cidata.iso",
          "-netdev",
          "user,id=user.0,hostname=kubernetes-master,hostfwd=tcp::${NOMAD_HOST_PORT_ssh}-:22,hostfwd=tcp::${NOMAD_HOST_PORT_sidecar}-:${NOMAD_HOST_PORT_sidecar}",
          "-device",
          "virtio-net,netdev=user.0",
        ]
      }

      artifact {
        source = "http://localhost:8080/image.qcow2"
      }

      artifact {
        source = "http://localhost:8080/cidata.iso"
      }
    }
  }

  group "worker" {
    count = 1

    network {
      port "ssh" {
      }

      port "sidecar" {
      }
    }

    service {
      name = "kubernetes-worker"
    }

    task "register-proxy" {
      lifecycle {
        hook = "prestart"
      }

      template {
        data = <<EOH
service {
  name = "kubernetes-worker-proxy"
  kind = "connect-proxy"

  proxy = {
    destination_service_name  = "kubernetes-worker"
    destination_service_id  = "kubernetes-worker"
    local_service_port = 8080
  }

  port = {{ env "NOMAD_HOST_PORT_sidecar" }}
}
        EOH

        destination = "local/proxy.hcl"
      }

      driver = "raw_exec"

      config {
        command = "consul"
        args = ["services", "register", "local/proxy.hcl"]
      }
    }

    task "deregister-proxy" {
      lifecycle {
        hook = "poststop"
      }

      driver = "raw_exec"
      config {
        command = "consul"
        args = ["services", "deregister", "-id", "kubernetes-worker-proxy"]
      }
    }

    ephemeral_disk {
      migrate = true
      size    = 10000
      sticky  = true
    }

    task "worker" {
      driver = "qemu"

      resources {
        cpu    = 100
        memory = 2048
      }

      config {
        image_path  = "local/image.qcow2"
        accelerator = "hvf"
        graceful_shutdown = true
        args = [
          "-cdrom", 
          "local/cidata.iso",
          "-netdev",
          "user,id=user.0,hostname=kubernetes-worker,hostfwd=tcp::${NOMAD_HOST_PORT_ssh}-:22,hostfwd=tcp::${NOMAD_HOST_PORT_sidecar}-:${NOMAD_HOST_PORT_sidecar}",
          "-device",
          "virtio-net,netdev=user.0",
        ]
      }

      artifact {
        source = "http://localhost:8080/image.qcow2"
      }

      artifact {
        source = "http://localhost:8080/cidata.iso"
      }
    }
  }
}