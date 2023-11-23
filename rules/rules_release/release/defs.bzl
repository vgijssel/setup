load("//release/private:release.bzl", _release = "release")
load("//release/private:release_manager.bzl", _release_manager = "release_manager")
load("//release/private:publish_github_release.bzl", _publish_github_release = "publish_github_release")

release = _release
release_manager = _release_manager
publish_github_release = _publish_github_release
