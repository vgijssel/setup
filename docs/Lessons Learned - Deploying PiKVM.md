NOTES

- Create table which represents which setups work and link to sections?
- Remove Windmill from the titles? To make it easier to navigate
- Add links to pull requests
- issue linking to running pikvm on 64-bit mode
- final remarks: didn't figure out mass-storage-device as I don't need it right now
- Final working template for LXC
- Final working template for Incus
- Is it called a "LXC container"? Or just "LXC"? Fix this in the copy

**TL;DR Having a dedicated Raspberry Pi for PiKVM is definitely the quickest way to go 😅**

Me being stubborn and wanting to make the most use out of the Raspberry Pi.

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

\*\*Lesson 1: arm64 and armhf are not the same architecture and it's no guarantee all software will work on all these different architectures.

### Windmill and PiKVM inside ESXi-Arm Fling vm's

This meant I needed to get the host OS to be 64-bit somehow. Once way to achieve this is by having a type-1 hypervisor which virtualises PiKVM and Windmill in a virtual machine (vm). After some searching I came across [this](https://williamlam.com/2024/10/new-esxi-arm-fling-based-on-8-0-update-3b.html)post which made me excited to use ESXi again, this time on a Raspberry Pi. Success guaranteed of course, as ESXi is built and maintained by a reputable company.

Assumption: ESXi is a hypervisor therefore I should be able to virtualise and run any OS architecture

1. Create an account on [the Broadcom website](https://access.broadcom.com/default/ui/v1/signin/)
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

**Lesson 3: ESXi doesn't support running 32-bit arm virtual machines see [here](https://williamlam.com/2020/10/how-to-run-raspberry-pi-os-as-a-vm-on-esxi-arm.html) and [here](https://bugs.freebsd.org/bugzilla/show_bug.cgi?id=250308#c2)**

### Windmill and PiKVM inside Pimox vm's

Following [this reddit post](https://www.reddit.com/r/Proxmox/comments/nvdb1z/proxmox_on_the_raspberry_pi_now_supports_32bit/)I decided to try Pimox, which is an unofficial [port of Proxmox](https://github.com/pimox/pimox7) for the Raspberry Pi, as that post claims Pimox supports running a 32-bit vm on the 64-bit arm hypervisor.

Having installed Pimox I decided first to try a simple vm before running PiKVM, to see if I'm able to get near the place I need to be. This meant playing around with device passthrough, as PiKVM needs access to a lot of devices on the Rasperry Pi:

- OTG port for keyboard/mouse/mass storage device emulation on the target the PiKVM is attached to
- HDMI capture card and hardware H264 encoding for streaming target video output
- GPIO for ATX control for power on/off control
- I2C for the OLED screen
- ...and probably something else I'm missing...

I quickly realised that Proxmox (and ESXi and others for that matter) aren't able to just passthrough any device from the host to the guest. I did some reading about [vfio passthrough](https://www.openeuler.org/en/blog/wxggg/2020-11-29-vfio-passthrough-2.html) but as that was way out of my comfort zone, I decided to give up on running PiKVM inside a vm.

Thanks for the help @srepac https://discord.com/channels/1138148231180714085/1138148231663067258/1321907940382343209

**Lesson 4: You can't simply passthrough any host device from a host to a guest OS using a hypervisor**

### Windmill inside Pimox vm and kvmd-armbian on the host OS

Suffering from [sunk cost fallacy](https://en.wikipedia.org/wiki/Sunk_cost)I kept pursuing my original goal: being able to run multiple things on a single Raspberry Pi 4. If I wasn't able to run the official PiKVM image, there's maybe an unofficial port which does support 64-bit? There is and it's called [kvmd-armian](https://github.com/srepac/kvmd-armbian) one if the forks is maintained by [srepac](https://github.com/srepac)which also has a [Discord channel](https://discord.gg/64EQQuwjsB)where folks are very eager to help out and answer any questions! kvmd-armbian works on both 32-bit and 64-bit arm AND x86 machines 👏.

1. Install Pimox using the following guides
   1. https://github.com/jiangcuo/Proxmox-Port
   2. [https://fleetstack.io/blog/install-proxmox-on-raspberry-pi](https://fleetstack.io/blog/install-proxmox-on-raspberry-pi)
   3. [https://pimylifeup.com/raspberry-pi-proxmox/](https://pimylifeup.com/raspberry-pi-proxmox/)
   4. [https://gist](https://gist.github.com/enjikaka/52d62c9c5462748dbe35abe3c7e37f9a)
   5. [https://www.bachmann-lan.de/proxmox-8-auf-dem-raspberry-pi-4-installieren/](https://www.bachmann-lan.de/proxmox-8-auf-dem-raspberry-pi-4-installieren/)
2. Create and run an Ansible Playbook [pull request in my own repo](https://github.com/vgijssel/setup/pull/676)
3. Run installer from kvmd-armbian
4. Disable the Pimox firewall to get access to the kvmd web ui
   ```bash
   pve-firewall stop
   ```
5. Fix the OLED screen [Discord comment](https://discord.com/channels/1138148231180714085/1138148231663067258/1323568386189295669)

   ```bash
   apt-get install -y python3-usb python3-luma.core python3-luma.lcd python3-luma.oled

   mkdir -p /usr/share/fonts/TTF
   curl -L https://github.com/pikvm/kvmd/raw/ebda7ea03d178ebf93f115eaa75cf059e010cd96/kvmd/apps/oled/fonts/ProggySquare.ttf --output /usr/share/fonts/TTF/ProggySquare.ttf

   curl -L https://kvmnerds.com/REPO/NEW/kvmd-oled-0.26-1-any.pkg.tar.xz --output /tmp/kvmd-oled-0.26-1-any.pkg.tar.xz
   cd /
   tar xfJ /tmp/kvmd-oled-0.26-1-any.pkg.tar.xz

   systemctl enable /usr/lib/systemd/system/kvmd-oled-reboot.service
   systemctl enable /usr/lib/systemd/system/kvmd-oled.service
   systemctl enable /usr/lib/systemd/system/kvmd-oled-shutdown.service
   ```

6. Partyyy 🎉🕺

With help from the kvmd-armbian community ❤️ I got everything running.

Taking a step back and looking what I had, I realised having an unofficial installation of Proxmox next to an unofficial installation of PiKVM in a single host OS didn't sit well with me, wanted to have something a little more isolated to prevent breakage in the future.

**Lesson 5: kvmd-armbian works really well, but prefer have something more isolated**

### Windmill inside Pimox vm and kvmd-armbian in LXC

If I can't run kvmd-armbian, what is the closest I can get to a full vm? [LXC](https://linuxcontainers.org/lxc/introduction/) of course! It's also a container like docker, but more similar to a vm, a lightweight vm.

1. Using article: [https://benheater.com/proxmox-lxc-using-external-templates/](https://benheater.com/proxmox-lxc-using-external-templates/) download LXC jammy CT template using Proxmox ui
2. Create CT
   1. hostname: pikvm
   2. UNCHECK - unprivileged container (so **privileged** container)
   3. password: Password1234 (yes I changed this 🤣)
   4. disk: 32gb
   5. ipv4: DHCP
   6. Set DNS to 192.168.1.1 otherwise DNS doesn’t work? Using dns settings from host doesn’t work for some reason..
3. Start the LXC and attach to the terminal
4. Install openssh `apt install openssh-server`
5. Run installer [https://github.com/srepac/kvmd-armbian?tab=readme-ov-file#hardware-for-kvmd-armbian-project](https://github.com/srepac/kvmd-armbian?tab=readme-ov-file#hardware-for-kvmd-armbian-project)
6. Forward devices from host to guest

As LXC and device passthrough is pretty far out of my comfort zone, I used ChatGPT which was incredibily helpful! This saved me a lot of time going through the documentation!

##### Passthrough GPIO for ATX control

1. I used the output of `journalctl -f` to figure out where kvmd-armbian would break:

```bash
	Dec 29 19:36:40 pikvm kvmd[602]: File "/usr/bin/kvmd", line 8, in <module>
	Dec 29 19:36:40 pikvm kvmd[602]: sys.exit(main())
	Dec 29 19:36:40 pikvm kvmd[602]: File "/usr/lib/python3/dist-packages/kvmd/apps/kvmd/__init__.py", line 75, in main
	Dec 29 19:36:40 pikvm kvmd[602]: KvmdServer(
	Dec 29 19:36:40 pikvm kvmd[602]: File "/usr/lib/python3/dist-packages/kvmd/apps/kvmd/server.py", line 263, in run
	Dec 29 19:36:40 pikvm kvmd[602]: comp.sysprep()
	Dec 29 19:36:40 pikvm kvmd[602]: File "/usr/lib/python3/dist-packages/kvmd/apps/kvmd/ugpio.py", line 294, in sysprep
	Dec 29 19:36:40 pikvm kvmd[602]: driver.prepare()
	Dec 29 19:36:40 pikvm kvmd[602]: File "/usr/lib/python3/dist-packages/kvmd/plugins/ugpio/gpio.py", line 86, in prepare
	Dec 29 19:36:40 pikvm kvmd[602]: self.__chip = gpiod.Chip(self.__device_path) Dec 29 19:36:40 pikvm kvmd[602]: PermissionError: [Errno 1] Operation not permitted
```

2. Running `kvmd -m` showed me what gpio device what was spected
   ```yaml
   kvmd:
     atx:
       device: /dev/gpiochip0
   ```
3. Update the LXC template
   ```yaml
   # 254 is the major number as can be seen by the ls command OR stat /dev/gpiochip0
   lxc.cgroup2.devices.allow = c 254:* rwm
   lxc.mount.entry = /dev/gpiochip0 dev/gpiochip0 none bind,optional,create=file
   ```
4. Restart the LXC using the UI
5. Works!

##### Passthrough OTG port for keyboard/mouse

1. Failure from `journalctl`
   ```bash
   Dec 30 04:52:47 pikvm systemd[1]: Starting PiKVM - OTG setup...
   Dec 30 04:52:48 pikvm kvmd-otg[182]: kvmd.apps.otg                     INFO --- Using UDC fe980000.usb
   Dec 30 04:52:48 pikvm kvmd-otg[182]: kvmd.apps.otg                     INFO --- Creating gadget 'kvmd' ...
   Dec 30 04:52:48 pikvm kvmd-otg[182]: kvmd.apps.otg                     INFO --- MKDIR --- /sys/kernel/config/usb_gadget/kvmd
   Dec 30 04:52:48 pikvm kvmd-otg[182]: Traceback (most recent call last):
   Dec 30 04:52:48 pikvm kvmd-otg[182]:   File "/usr/bin/kvmd-otg", line 8, in <module>
   Dec 30 04:52:48 pikvm kvmd-otg[182]:     sys.exit(main())
   Dec 30 04:52:48 pikvm kvmd-otg[182]:   File "/usr/lib/python3/dist-packages/kvmd/apps/otg/__init__.py", line 348, in main
   Dec 30 04:52:48 pikvm kvmd-otg[182]:     options.cmd(config)
   Dec 30 04:52:48 pikvm kvmd-otg[182]:   File "/usr/lib/python3/dist-packages/kvmd/apps/otg/__init__.py", line 212, in _cmd_start
   Dec 30 04:52:48 pikvm kvmd-otg[182]:     _mkdir(gadget_path)
   Dec 30 04:52:48 pikvm kvmd-otg[182]:   File "/usr/lib/python3/dist-packages/kvmd/apps/otg/__init__.py", line 50, in _mkdir
   Dec 30 04:52:48 pikvm kvmd-otg[182]:     os.mkdir(path)
   Dec 30 04:52:48 pikvm kvmd-otg[182]: FileNotFoundError: [Errno 2] No such file or directory: '/sys/kernel/config/usb_gadget/kvmd'
   ```
2. Check which devices are expected from `kvmd -m`

   ```yaml
   hid:
     keyboard:
       device: /dev/kvmd-hid-keyboard

     mouse:
       device: /dev/kvmd-hid-mouse

     mouse_alt:
       device: /dev/kvmd-hid-mouse-alt
   ```

3. Ensure kernel module in the host `i2c-dev` is loaded
4. Mount `/sys/kernel/config` in LXC by updating the template
   ```yaml
   lxc.mount.entry: /sys/kernel/config sys/kernel/config none bind,optional
   # 236 is the major group of the hidg* devices
   lxc.cgroup2.devices.allow: c 236:* rwm
   ```
5. Once the `kvmd-otg` service starts the usb_gadget devices are created in the host, not in the guest
   ```bash
   crw-rw----  1 root kvmd    236,   0 Dec 30 15:52 hidg0
   crw-rw----  1 root kvmd    236,   1 Dec 30 15:52 hidg1
   crw-rw----  1 root kvmd    236,   2 Dec 30 15:52 hidg2
   ```
6. Now it's a bit of a 🐔 and 🥚 situation, where we need the `/dev/hidg*` devices to exist on the host before starting the container. But once the container starts these devices are created on the host 😅. Therefore inside the LXC we need to add these devices manually
   ```bash
   mknod /dev/kvmd-hid-keyboard c 236 0
   mknod /dev/kvmd-hid-mouse c 236 1
   mknod /dev/kvmd-hid-mouse-alt c 236 2
   ```
7. Ensure the permissions on these devices are correct so the kvmd group can control them
   ```bash
   chown root:kvmd /dev/kvmd-hid-keyboard /dev/kvmd-hid-mouse /dev/kvmd-hid-mouse-alt
   chmod 0660  /dev/kvmd-hid-keyboard /dev/kvmd-hid-mouse /dev/kvmd-hid-mouse-alt
   ```
8. Login to the web UI validate that the keyboard works! (Note the kvmd is attached to a server, so unable to test the mouse)

##### Passthrough HDMI capture card

1. Failure from `journalctl`
   ```bash
   Dec 30 05:03:41 pikvm systemd[1]: Starting PiKVM - EDID loader for TC358743...
   Dec 30 05:03:41 pikvm v4l2-ctl[182]: Cannot open device /dev/kvmd-video, exiting.
   Dec 30 05:03:41 pikvm systemd[1]: kvmd-tc358743.service: Main process exited, code=exited, status=1/FAILURE
   Dec 30 05:03:41 pikvm systemd[1]: kvmd-tc358743.service: Failed with result 'exit-code'.
   Dec 30 05:03:41 pikvm systemd[1]: Failed to start PiKVM - EDID loader for TC358743.
   ```
2. The error message mentions the relevant device!
3. Update the LXC template
   ```yaml
   lxc.cgroup2.devices.allow: c 81:* rwm
   lxc.mount.entry: /dev/video0 dev/kvmd-video none bind,optional,create=file
   ```
4. Restart the LXC
5. Now we see a different error
   ```
   Dec 30 05:32:21 pikvm kvmd[237]: kvmd.apps.kvmd.streamer           INFO --- => -- INFO  [36989.079          ] -- H264: Configuring encoder: DMA=1 ...
   Dec 30 05:32:21 pikvm kvmd[237]: kvmd.apps.kvmd.streamer           INFO --- => -- ERROR [36989.079          ] -- H264: Can't open encoder device: No such file or directory
   Dec 30 05:32:21 pikvm kvmd[237]: kvmd.apps.kvmd.streamer           INFO --- => -- ERROR [36989.079          ] -- H264: Encoder destroyed due an error (prepare)
   ```
6. This is because the H264 encoder is a separate video device. I decided to simply passthrough all video devices, but you can be probably be smarter about this
   ```yaml
   lxc.cgroup2.devices.allow: c 81:* rwm
   lxc.mount.entry: /dev/video0  dev/kvmd-video none bind,optional,create=file
   lxc.mount.entry: /dev/video10 dev/video10 none bind,optional,create=file
   lxc.mount.entry: /dev/video11 dev/video11 none bind,optional,create=file
   lxc.mount.entry: /dev/video12 dev/video12 none bind,optional,create=file
   lxc.mount.entry: /dev/video13 dev/video13 none bind,optional,create=file
   lxc.mount.entry: /dev/video14 dev/video14 none bind,optional,create=file
   lxc.mount.entry: /dev/video15 dev/video15 none bind,optional,create=file
   lxc.mount.entry: /dev/video16 dev/video16 none bind,optional,create=file
   lxc.mount.entry: /dev/video18 dev/video18 none bind,optional,create=file
   lxc.mount.entry: /dev/video19 dev/video19 none bind,optional,create=file
   lxc.mount.entry: /dev/video20 dev/video20 none bind,optional,create=file
   lxc.mount.entry: /dev/video21 dev/video21 none bind,optional,create=file
   lxc.mount.entry: /dev/video22 dev/video22 none bind,optional,create=file
   lxc.mount.entry: /dev/video23 dev/video23 none bind,optional,create=file
   lxc.mount.entry: /dev/video31 dev/video31 none bind,optional,create=file
   ```
7. Restart the LXC
8. Navigate to the web UI and validate it works 🎉

##### Passthrough I2C for the OLED screen

... TODO ...

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
