terramate {
  required_version = "~> 0.2.0"

  config {
    git {
      default_remote = "origin"
      default_branch = "master"
    #   check_untracked = false
    #   check_uncommitted = false
    #   check_remote = false
    }
  }

  config {
    run {
      env {
        TF_PLUGIN_CACHE_DIR = "${terramate.root.path.fs.absolute}/tmp/terraform-cache-dir"
      }
    }
  }
}