import os
import sys
from pre_commit.main import main

if __name__ == "__main__":
    os.chdir(os.environ["BUILD_WORKSPACE_DIRECTORY"])
    del os.environ["RUNFILES_MANIFEST_FILE"]
    main()
