terraform {
  required_providers {
    vagrant = {
      source  = "bmatcuk/vagrant"
      version = "4.1.0"
    }

    docker = {
      source  = "kreuzwerker/docker"
      version = "2.15.0"
    }

    null = {
      source  = "hashicorp/null"
      version = "3.1.0"
    }

    tls = {
      source = "hashicorp/tls"
      version = "3.1.0"
    }
  }
}