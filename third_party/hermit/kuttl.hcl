binaries = ["kuttl"]
description = "KUbernetes Test TooL (kuttl)"
dont-extract = true

platform "darwin" "amd64" {
    source = "https://github.com/kudobuilder/kuttl/releases/download/v${version}/kubectl-kuttl_${version}_${os}_${xarch}"
  
    on "unpack" {
        rename {
            from = "${root}/kubectl-kuttl_${version}_${os}_${xarch}"
            to = "${root}/kuttl"
        }

        chmod {
            file = "${root}/kuttl"
            mode = 493
        }
    }
}

platform "darwin" "arm64" {
    source = "https://github.com/kudobuilder/kuttl/releases/download/v${version}/kubectl-kuttl_${version}_${os}_${arch}"

    on "unpack" {
        rename {
            from = "${root}/kubectl-kuttl_${version}_${os}_${arch}"
            to = "${root}/kuttl"
        }

        chmod {
            file = "${root}/kuttl"
            mode = 493
        }
    }
}

platform "linux" "amd64" {
    source = "https://github.com/kudobuilder/kuttl/releases/download/v${version}/kubectl-kuttl_${version}_${os}_${xarch}"

    on "unpack" {
        rename {
            from = "${root}/kubectl-kuttl_${version}_${os}_${xarch}"
            to = "${root}/kuttl"
        }

        chmod {
            file = "${root}/kuttl"
            mode = 493
        }
    }
}

platform "linux" "arm64" {
    source = "https://github.com/kudobuilder/kuttl/releases/download/v${version}/kubectl-kuttl_${version}_${os}_${arch}"

    on "unpack" {
        rename {
            from = "${root}/kubectl-kuttl_${version}_${os}_${arch}"
            to = "${root}/kuttl"
        }

        chmod {
            file = "${root}/kuttl"
            mode = 493
        }
    }
}

version "0.22.0" {
  auto-version {
    github-release = "kudobuilder/kuttl"
  }
}

sha256sums = {
  "https://github.com/kudobuilder/kuttl/releases/download/v0.22.0/kubectl-kuttl_0.22.0_linux_x86_64": "874bcea7b8820592018c660ce71f7f6dbfbdde35ee1f73cad7f560d1380e3868",
  "https://github.com/kudobuilder/kuttl/releases/download/v0.22.0/kubectl-kuttl_0.22.0_darwin_x86_64": "edbcd53741c36e6f616b0a3377e658f1cd4a447e1513697992e37cc8606be86a",
  "https://github.com/kudobuilder/kuttl/releases/download/v0.22.0/kubectl-kuttl_0.22.0_darwin_arm64": "3b3cde7c395d065711d0181891ff8e80de1a292953ce01bc455ddc373248cfd8",
  "https://github.com/kudobuilder/kuttl/releases/download/v0.22.0/kubectl-kuttl_0.22.0_linux_arm64": "9b4a0b5221c42076b97e08d8d5ef4d19cd7b998d383455e69641ba2fff710bb8",
}
