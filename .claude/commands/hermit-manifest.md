---
description: Create Hermit manifest for tool $ARGUMENTS
---

First use `hermit search $ARGUMENTS` to see if a manifest already exists for the tool. If it does, you can use the existing manifest instead of creating a new one.

Otherwise create a new Hermit HCL manifest inside third_party/hermit for tool $ARGUMENTS. 
Use `hermit manifest create` and use a url from the Github releases page of the tool
Make sure the manifest works both for macOS and Linux. 

Validate the manifest by running `hermit manifest add-digests` passing the file name of Hermit HCL file.
NEVER manually add digests to the HCL file, always use `hermit manifest add-digests` to do so.

Once the manifest is correct install the tool using `hermit install` and validate that the tool works as expected.
You can validate if the tool works by running `--help` or `--version` on the installed binary.