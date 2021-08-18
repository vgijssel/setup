terraform {
  required_providers {
    vagrant = {
      source  = "bmatcuk/vagrant"
      version = "4.1.0"
    }

    docker = {
      source  = "kreuzwerker/docker"
      version = "2.14.0"
    }

    null = {
      source  = "hashicorp/null"
      version = "3.1.0"
    }
  }
}