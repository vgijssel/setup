load("//release/private:release.bzl", _release = "release")
load("//release/private:release_manager.bzl", _release_manager = "release_manager")

release = _release
release_manager = _release_manager

def publish_github_release(name, changelog_file, prefix, version_file, before_cmd):
    pass
