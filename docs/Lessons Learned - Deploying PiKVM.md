NOTES

- Create table which represents which setups work and link to sections?
- Remove Windmill from the titles? To make it easier to navigate

**TL;DR Having a dedicated Raspberry Pi for PiKVM is definitely the quickest way to go 😅**

Having **not** read the [PiKVM](https://docs.pikvm.org/) documentation thoroughly (reading _is_ hard) I decided to purchase a Raspberry Pi 8GiB to host both the PiKVM OS and other services inside of [K3S](https://k3s.io). The service I wanted to run next to PiKVM inside K3S was [Windmill](https://www.windmill.dev/). Using the [KVM-A3]([https://wiki.geekworm.com/KVM-A3](https://wiki.geekworm.com/KVM-A3)casing.

### Table of contents

- [[#Windmill inside PiKVM OS]]
- [[#Deploy Windmill and PiKVM inside ESXi-Arm Fling vms]]
- [[#Deploy Windmill and PiKVM inside Proxmox-Port vms]]
- [[#Deploy Windmill inside Proxmox-Port vm and kvmd-armbian on host]]
- [[#Deploy Windmill inside Proxmox-Port vm and kvmd-armbian in LXC]]
- [[#Deploy Windmill inside Incus vm and PiKVM in LXC]]
- [[#Deploy Windmill inside Incus vm and PiKVM in LXC]]

### Windmill inside PiKVM OS

1. Circumvent read-only file system as described [here](https://docs.pikvm.org/faq/)ignoring the warning
   ![[Pasted image 20250107094015.png]]
1. Install K3s
1. Setup [helmfile](https://helmfile.readthedocs.io/en/latest/) with the Windmill chart
1. Run `helmfile apply`

Here I realised it took a really long time to start the windmill pods. Checking out the kubectl logs I came to the realisation that k3s was unable to pull an image from the registry due to a mismatch in architecture. Checking the [latest Windmill package](https://github.com/windmill-labs/windmill/pkgs/container/windmill) it showed that an arm variant was published, but only `arm64` and not `armhf` the OS type of PiKVM.

**Lesson 1: arm64 and armhf are not the same architecture!!**

### Deploy Windmill and PiKVM inside ESXi-Arm Fling vms

I came across [this](https://williamlam.com/2024/10/new-esxi-arm-fling-based-on-8-0-update-3b.html)post which made me excited to use ESXi yet again, this time on a Raspberry Pi. Success guaranteed of course, as ESXi is built by a reputable company.

Assumption: ESXi is a hypervisor therefore I should be able to virtualise and run any OS architecture

1. Create an account on Broadcom website
2. Download documentation
3. From the documentation
   1. Update Raspberry Pi 4 EEPROM
   2. Flash UEFI to sdcard from [https://github.com/pftf/RPi4/releases](https://github.com/pftf/RPi4/releases)
   3. Make OSData partition 25gb by passing this in the boot screen (to not have ESXi take all the space in the thumb-drive)
      ```
      systemMediaSize=min
      ```
   4. When asked for a ESX OSData store when installing on a USB attached disk press enter to skip this, otherwise you'll get a cryptic error and have to start over.
4. Get license code from: [https://gist.github.com/ayebrian/646775424393c9a35fb8257f44df1c8b](https://gist.github.com/ayebrian/646775424393c9a35fb8257f44df1c8b)
5. Add license code to ESXi
6. Download V3 pre-assembled image: [https://pikvm.org/download/](https://pikvm.org/download/)
7. Convert the image to vmdk
   ```bash
   qemu-img convert -f raw -O vmdk ~/Downloads/v3-hdmi-rpi4-box-latest.img ~/Downloads/v3-hdmi-rpi4-box-latest.vmdk
   ```
8. Upload `v3-hdmi-rpi4-box-latest.vmdk`
9. Configure the `pikvm` virtual machine
   ![[image.png]]
10. Attach the uploaded disk to the virtual machine
11. Boot the machine

I quickly realised that the machine wouldn't boot (and boot never boot for that matter). I was trying to run a Raspberry Pi armhf 32-bit image as a regular 64-bit virtual machine. I tried to run the virtual machine with the Debian net installer: [https://cdimage.debian.org/debian-cd/current/arm64/iso-cd/](https://cdimage.debian.org/debian-cd/current/arm64/iso-cd/) and trying add grub to the root file system, but with no success.

**Lesson 2: The PiKVM image is not a regular VM, it's built for flashing onto a sdcard not booting using UEFI**

**Lesson 3: ESXi doesn't support running 32-bit arm virtual machines [here](https://williamlam.com/2020/10/how-to-run-raspberry-pi-os-as-a-vm-on-esxi-arm.html) and [here](https://bugs.freebsd.org/bugzilla/show_bug.cgi?id=250308#c2)**

### Deploy Windmill and PiKVM inside Proxmox-Port vms

Following [this reddit post](https://www.reddit.com/r/Proxmox/comments/nvdb1z/proxmox_on_the_raspberry_pi_now_supports_32bit/)I decided to try Proxmox (or Pimox) next as according to that post supported running 32-bit arm machines on 64-bit Proxmox.

**Lesson 4: You can't simply passthrough any device from a host to a guest OS**

### Deploy Windmill inside Proxmox-Port vm and kvmd-armbian on host

Amazing work trying to port PiKVM to armbian resulted in the ability to run a installer on lot's of different 32-bit OR 64-bit operating systems.

https://github.com/srepac/kvmd-armbian

**Lesson 5: kvmd-armbian works really well, but prefer have something more isolated**

### Deploy Windmill inside Proxmox-Port vm and kvmd-armbian in LXC

Works as well! With more isolation!

### Deploy Windmill inside Incus vm and kvmd-armbian in LXC

Proxmox (or Pimox) is not officially supported. Now we have a working solution, move to a hypervisor which is supported on arm AND support running LXC containers

Works just as well as Pimox.

### Deploy Windmill inside Incus vm and PiKVM in LXC

Following the approach from https://github.com/Prototyped/pikvm-container

1. Download image
2. Extract partitions
3. loop mount boot/rootfs partitions
4. Using distrobuilder convert this into a Incus image
5.

Works! Now have a supported hypervisor and using hacky-official way to run
