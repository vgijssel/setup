## TODO
- install cockpit: https://cockpit-project.org/guide/201/feature-virtualmachines.html
- install compile terraform libvirt plugin with -w flag (https://github.com/golang/go/issues/32684#issuecomment-503862657)

## Status nested virtualisation on GitHub actions:

- Linux
  - No nested virtualisation possible
- Macos Sierra
  - Cannot install parallel, virtualbox or vmware due to kext constraint
  - HAXM does not have nested virtualisation
  - xhyve/hyperkit does not have nested virtualisation
