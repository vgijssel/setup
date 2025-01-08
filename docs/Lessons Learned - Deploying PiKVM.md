NOTES

- Create table which represents which setups work and link to sections?
- Remove Windmill from the titles? To make it easier to navigate
- Add links to pull requests
- issue linking to running pikvm on 64-bit mode
- final remarks: didn't figure out mass-storage-device as I don't need it right now
- Final working template for LXC
- Final working template for Incus
- Is it called a "LXC container"? Or just "LXC"? Fix this in the copy
- Ask ChatGPT what a good length for an article is! Bottom right we the see number of works and characters.
- More general lessons learned
- Rename all references to Raspberry Pi to just Pi

**TL;DR Having a dedicated Raspberry Pi for PiKVM is definitely the quickest way to go 😅**

Me being stubborn and wanting to make the most use out of the Raspberry Pi.

Having **not** read the [PiKVM](https://docs.pikvm.org/) documentation thoroughly (reading _is_ hard) I decided to purchase a Raspberry Pi 8GiB to host both the PiKVM OS and other services inside of [K3S](https://k3s.io). The service I wanted to run next to PiKVM inside K3S was [Windmill](https://www.windmill.dev/). Using the [KVM-A3]([https://wiki.geekworm.com/KVM-A3](https://wiki.geekworm.com/KVM-A3)casing.

### Table of ~~contents~~ experiments

- [[#Windmill inside PiKVM OS]]
- [[#Deploy Windmill and PiKVM inside ESXi-Arm Fling vms]]
- [[#Deploy Windmill and PiKVM inside Proxmox-Port vms]]
- [[#Deploy Windmill inside Proxmox-Port vm and kvmd-armbian on host]]
- [[#Deploy Windmill inside Proxmox-Port vm and kvmd-armbian in LXC]]
- [[#Deploy Windmill inside Incus vm and PiKVM in LXC]]
- [[#Deploy Windmill inside Incus vm and PiKVM in LXC]]

### Windmill inside PiKVM OS

#### Steps

1. Circumvent read-only file system as described [here](https://docs.pikvm.org/faq/)ignoring the warning
   ![[pikvm-read-write-warning.png]]
1. Install K3s
1. Setup [helmfile](https://helmfile.readthedocs.io/en/latest/) with the Windmill chart
1. Run `helmfile apply`
1. Fail 🤔

#### Result

Here I realised it took a really long time to start the windmill pods. Checking out the kubectl logs I came to the realisation that k3s was unable to pull an image from the registry due to a mismatch in architecture. Checking the [latest Windmill package](https://github.com/windmill-labs/windmill/pkgs/container/windmill) it showed that an arm variant was published, but only `arm64` and not `armhf` the OS type of PiKVM.

> [!Lesson 1]
>
> arm64 and armhf are not the same architecture and it's no guarantee all software will work / is built for all these different architectures.

### Windmill and PiKVM inside ESXi-Arm Fling vm's

This meant I needed to get the host OS to be 64-bit somehow. Once way to achieve this is by having a type-1 hypervisor which virtualises PiKVM and Windmill in a virtual machine (vm). After some searching I came across [this](https://williamlam.com/2024/10/new-esxi-arm-fling-based-on-8-0-update-3b.html)post which made me excited to use ESXi again, this time on a Raspberry Pi. Success guaranteed of course, as ESXi is built and maintained by a reputable company.

Assumption: ESXi is a hypervisor therefore I should be able to virtualise and run any OS architecture

#### Steps

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
   ![[esxi-vm-settings.png]]
10. Attach the uploaded disk to the virtual machine
11. Boot the machine
12. Fail 🤔

#### Result

I quickly realised that the machine wouldn't boot (and boot never boot for that matter). I was trying to run a Raspberry Pi armhf 32-bit image as a regular 64-bit virtual machine. I tried to run the virtual machine with the Debian net installer: [https://cdimage.debian.org/debian-cd/current/arm64/iso-cd/](https://cdimage.debian.org/debian-cd/current/arm64/iso-cd/) and trying add grub to the root file system, but with no success.

> [!Lesson 2]
>
> The PiKVM image is not a regular VM, it's built for flashing onto a sdcard not booting using UEFI

> [!Lesson 3]
>
> ESXi doesn't support running 32-bit arm virtual machines see [here](https://williamlam.com/2020/10/how-to-run-raspberry-pi-os-as-a-vm-on-esxi-arm.html) and [here](https://bugs.freebsd.org/bugzilla/show_bug.cgi?id=250308#c2)\*\*

### Windmill and PiKVM inside Pimox vm's

Following [this reddit post](https://www.reddit.com/r/Proxmox/comments/nvdb1z/proxmox_on_the_raspberry_pi_now_supports_32bit/)I decided to try Pimox, which is an unofficial [port of Proxmox](https://github.com/pimox/pimox7) for the Raspberry Pi, as that post claims Pimox supports running a 32-bit vm on the 64-bit arm hypervisor.

Having installed Pimox I decided first to try a simple vm before running PiKVM, to see if I'm able to get near the place I need to be. This meant playing around with device passthrough, as PiKVM needs access to a lot of devices on the Rasperry Pi:

- OTG port for keyboard/mouse/mass storage device (msd) emulation on the target the PiKVM is attached to
- HDMI capture card and hardware H264 encoding for streaming target video output
- GPIO for ATX control for power on/off control
- I2C for the OLED screen
- ...and probably something else I'm missing...

#### Steps

1. Initialise a Proxmox VM
2. Search for the device passthrough section
3. Fail 🤔

#### Result

I quickly realised that Proxmox (and ESXi and others for that matter) aren't able to just passthrough any device from the host to the guest. I did some reading about [vfio passthrough](https://www.openeuler.org/en/blog/wxggg/2020-11-29-vfio-passthrough-2.html) but as that was way out of my comfort zone, I decided to give up on running PiKVM inside a vm.

Thanks for the help @srepac https://discord.com/channels/1138148231180714085/1138148231663067258/1321907940382343209

> [!Lesson 4]
>
> You can't simply passthrough any host device from a host to a guest OS using a hypervisor!

### Windmill inside Pimox vm and kvmd-armbian on the host OS

Suffering from [sunk cost fallacy](https://en.wikipedia.org/wiki/Sunk_cost)big time I kept pursuing my original goal: being able to run multiple things on a single Raspberry Pi 4. If I wasn't able to run the official PiKVM image, there's maybe an unofficial port which does support 64-bit? There is and it's called [kvmd-armian](https://github.com/srepac/kvmd-armbian) one if the forks is maintained by [srepac](https://github.com/srepac)which also has a [Discord channel](https://discord.gg/64EQQuwjsB)where folks are very eager to help out and answer any questions! kvmd-armbian works on both 32-bit and 64-bit arm AND x86 machines 👏.

#### Steps

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
5. Fix the OLED screen [Discord comment](https://discord.com/channels/1138148231180714085/1138148231663067258/1323568386189295669) ^oled-fix

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

6. Celebrate 🎉

#### Result

With help from the kvmd-armbian community ❤️ I got everything running.

Taking a _small_ step back and looking what I had, I realised having an unofficial installation of Proxmox next to an unofficial installation of PiKVM in a single host OS didn't sit well with me, wanted to have something a little more isolated to prevent breakage in the future.

> [!Lesson 5]
>
> kvmd-armbian works really well, but prefer have something more isolated if something is not officially supported.

### Windmill inside Pimox vm and kvmd-armbian in LXC

If I can't run kvmd-armbian, what is the closest I can get to a full vm? [LXC](https://linuxcontainers.org/lxc/introduction/) of course! It's also a container like docker, but more similar to a vm, a lightweight vm.

#### Steps

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
6. Run the OLED screen install script [[#^oled-fix]]
7. Forward devices from host to guest
8. Celebrate 🎉

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
6. This is because the H264 encoder is a separate video device on the Raspberry Pi. I decided to simply passthrough all video devices, but there is probably a smarter way to go about this 🙈
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

1. `journalctl` and `systemctl` didn't show the `kvmd-oled` service
2. Running `systemctl start kvmd-oled` showed the problem, the device `/dev/i2c-1` didn't exist

```bash
Jan 08 09:14:13 pikvm systemd[1]: PiKVM - A small OLED daemon was skipped because of an unmet condition check (ConditionPathExists=/dev/i2c-1).
```

3. Easy peasy! Update the LXC template
   ```yaml
   lxc.cgroup2.devices.allow: c 89:* rwm
   lxc.mount.entry: /dev/i2c-1 dev/i2c-1 none bind,optional,create=file 0 0
   ```
4. Restart the LXC
5. BOOM
   ![[pikvm-oled-screen.png]]

#### Results

> [!Lesson 6]
>
> As LXC and device passthrough is pretty far out of my comfort zone, I used ChatGPT which was incredibily helpful! This saved me a lot of time going through the documentation!

### Deploy Windmill inside Incus vm and kvmd-armbian in LXC

As mentioned, Pimox is not an officially supported port of Promox. Now we have a working solution, I decided to see if it's possible to use a hypervisor which is supported on arm AND supports LXC out of the box.

| Hypervisor                                                                                      | Raspberry Pi 4 support                                                                                                | LXC support                                                     |
| ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [ESXI Arm Fling](https://williamlam.com/2024/10/new-esxi-arm-fling-based-on-8-0-update-3b.html) | ✅                                                                                                                    | ❌                                                              |
| [Proxmox](https://github.com/jiangcuo/Proxmox-Port)                                             | ✅: using unofficial Pimox port                                                                                       | ✅                                                              |
| [xcp ng](https://xcp-ng.org/)                                                                   | ❌: but a [work in progress](https://xcp-ng.org/blog/2024/04/03/integrating-xen-on-the-ampere-platform-a-first-look/) | ❌: Abandoned initiative [RunX](https://github.com/xcp-ng/runx) |
| [Cloud hypervisor](https://github.com/cloud-hypervisor/cloud-hypervisor)                        | ✅                                                                                                                    | ❌                                                              |
| [Incus](https://github.com/lxc/incus)                                                           | ✅                                                                                                                    | ✅                                                              |

The choice landed on Incus! See [pull request](https://github.com/vgijssel/setup/pull/679).

#### Steps

1. Using Raspberry Pi Imager:
   - **OS**: Ubuntu Server 24.04 LTS 64-bit
   - **Username**: deploy
   - **Hostname**: provisioner
   - **Password**: `Password1234`
2. Setup Incus host using Ansible playbook
   ```bash
   ansible-playbook -i ./production.local provisioner.yml --diff
   ```
3. Create Incus LXC

   ```bash
   # create pikvm container using ubuntu/jammy as the base as mentioned in the kvmd-armbian repository
   incus init images:ubuntu/jammy kvmd

   # Passthrough all the video devices for hdmi video capture and hardware decoing of H264
   incus config device add kvmd kvmd-video unix-char  path=/dev/kvmd-video source=/dev/video0   required=true gid=999 uid=999
   incus config device add kvmd video10 unix-char path=/dev/video10 source=/dev/video10 required=true gid=999 uid=999
   incus config device add kvmd video11 unix-char path=/dev/video11 source=/dev/video11 required=true gid=999 uid=999
   incus config device add kvmd video12 unix-char path=/dev/video12 source=/dev/video12 required=true gid=999 uid=999
   incus config device add kvmd video13 unix-char path=/dev/video13 source=/dev/video13 required=true gid=999 uid=999
   incus config device add kvmd video14 unix-char path=/dev/video14 source=/dev/video14 required=true gid=999 uid=999
   incus config device add kvmd video15 unix-char path=/dev/video15 source=/dev/video15 required=true gid=999 uid=999
   incus config device add kvmd video16 unix-char path=/dev/video16 source=/dev/video16 required=true gid=999 uid=999
   incus config device add kvmd video18 unix-char path=/dev/video18 source=/dev/video18 required=true gid=999 uid=999
   incus config device add kvmd video19 unix-char path=/dev/video19 source=/dev/video19 required=true gid=999 uid=999
   incus config device add kvmd video20 unix-char path=/dev/video20 source=/dev/video20 required=true gid=999 uid=999
   incus config device add kvmd video21 unix-char path=/dev/video21 source=/dev/video21 required=true gid=999 uid=999
   incus config device add kvmd video22 unix-char path=/dev/video22 source=/dev/video22 required=true gid=999 uid=999
   incus config device add kvmd video23 unix-char path=/dev/video23 source=/dev/video23 required=true gid=999 uid=999
   incus config device add kvmd video31 unix-char path=/dev/video31 source=/dev/video31 required=true gid=999 uid=999

   # Passthrough the gpiochip0 to enable ATX control
   incus config device add kvmd gpiochip0 unix-char path=/dev/gpiochip0 source=/dev/gpiochip0 required=true gid=999 uid=999

   # Make sure to disable apparmor so we get read/write access to sys
   incus config set kvmd raw.lxc "lxc.apparmor.profile=unconfined"

   # Add the /sys/kernel/config directory as a mount to enable the guest to create usb devices in the host to enable otg based keyboard/mouse emulation.
   incus config device add kvmd sys-kernel disk source=/sys/kernel/config path=/sys/kernel/config required=true

   # We passthrough the hidgX devices from the host to the guest when they appear. The guest first needs to boot and create the usb_gadget devices before the /dev/hidgX devices appear in the host therefore the devices are marked as "required=false". Once the device appears it's hotplugged and added to the guest.
   # See https://linuxcontainers.org/incus/docs/main/reference/devices_unix_char/
   incus config device add kvmd hidg0 unix-char path=/dev/kvmd-hid-keyboard source=/dev/hidg0 required=false gid=999 uid=999
   incus config device add kvmd hidg1 unix-char path=/dev/kvmd-hid-mouse source=/dev/hidg1 required=false gid=999 uid=999
   incus config device add kvmd hidg2 unix-char path=/dev/kvmd-hid-mouse-alt source=/dev/hidg2 required=false gid=999 uid=999

   # We passthrough the i2c-1 device to enable access to the OLED device
   incus config device add kvmd i2c-1 unix-char path=/dev/i2c-1 source=/dev/i2c-1 required=true gid=999 uid=999
   ```

4. Start the LXC using `incus start kvmd`
5. Apply the Ansible playbook for kvmd
   ```bash
   ansible-playbook -i production.local kvmd.yml
   ```
6. Run the kvmd-armbian installer
7. Restart the container using `incus restart kvmd`
8. Celebrate 🎉

#### Results

Celebrate! Now running kvmd-armbian using supported hypervisor on the Raspberry Pi! (Which works really well, kudos to the Incus team 👏). At this point I'm pretty happy. But having spent all this time, it would be a waste not to spend EVEN MORE time on trying to improve the setup.

> [!Lesson 6]
>
> Incus is super sweet piece of software!

### Windmill inside Incus vm and PiKVM in LXC

I also found https://github.com/Prototyped/pikvm-container which is a dated docker implementation of running PiKVM inside a docker container. So I was thinking: If it's possible to run it a docker container, it should also be possible to run it inside LXC right? I used a similar approach as the

#### Steps

1. [Download official PiKVM v3 image](https://files.pikvm.org/images/v3-hdmi-rpi4-box-latest.img.xz -O pikvm-rpi4.img.xz)
2. Extract partitions using 7zip
3. Loop mount rootfs and boot partitions into `/mnt/rootfs` and `/mnt/rootfs/boot` respectively
4. Use [distrobuilder](https://github.com/lxc/distrobuilder) to convert that rootfs into an Incus LXC with some modifications
   1. Remove `/etc/fstab`
   2. Disable msd
   3. A boot helper to generate a certificate
   4. Mask service `kvmd-pst`, `kvmd-fan`, `kvmd-watchdog` and `kvmd-bootconfig` because PiKVM works without those (and I don't want to spend more time fixing those services 😂)
5. Import that image into Incus
   ```bash
   incus image import pikvm-rpi4.tar.xz --alias pikvm-rpi4/latest
   ```
6. Create a new instance with that base image. Note I'm using gid/uid 968 instead of 999 because the user and group ids of kvmd are different in the official image!

   ```bash
   incus init provisioner:pikvm-rpi4/latest pikvm

   # Make sure to disable apparmor and enable privileged container so we get read/write access to sys
   incus config set pikvm raw.lxc "lxc.apparmor.profile=unconfined"
   incus config set pikvm security.privileged true

   # boot the instance at startup
   incus config set pikvm boot.autorestart true
   incus config set pikvm boot.autostart true

   # Passthrough all the video devices for hdmi video capture and hardware decoing of H264
   incus config device add pikvm kvmd-video unix-char path=/dev/kvmd-video source=/dev/video0  required=true gid=968 uid=968
   incus config device add pikvm video10    unix-char path=/dev/video10    source=/dev/video10 required=true gid=968 uid=968
   incus config device add pikvm video11    unix-char path=/dev/video11    source=/dev/video11 required=true gid=968 uid=968
   incus config device add pikvm video12    unix-char path=/dev/video12    source=/dev/video12 required=true gid=968 uid=968
   incus config device add pikvm video13    unix-char path=/dev/video13    source=/dev/video13 required=true gid=968 uid=968
   incus config device add pikvm video14    unix-char path=/dev/video14    source=/dev/video14 required=true gid=968 uid=968
   incus config device add pikvm video15    unix-char path=/dev/video15    source=/dev/video15 required=true gid=968 uid=968
   incus config device add pikvm video16    unix-char path=/dev/video16    source=/dev/video16 required=true gid=968 uid=968
   incus config device add pikvm video18    unix-char path=/dev/video18    source=/dev/video18 required=true gid=968 uid=968
   incus config device add pikvm video19    unix-char path=/dev/video19    source=/dev/video19 required=true gid=968 uid=968
   incus config device add pikvm video20    unix-char path=/dev/video20    source=/dev/video20 required=true gid=968 uid=968
   incus config device add pikvm video21    unix-char path=/dev/video21    source=/dev/video21 required=true gid=968 uid=968
   incus config device add pikvm video22    unix-char path=/dev/video22    source=/dev/video22 required=true gid=968 uid=968
   incus config device add pikvm video23    unix-char path=/dev/video23    source=/dev/video23 required=true gid=968 uid=968
   incus config device add pikvm video31    unix-char path=/dev/video31    source=/dev/video31 required=true gid=968 uid=968
   incus config device add pikvm vcio    unix-char path=/dev/vcio    source=/dev/vcio required=true gid=968 uid=968


   # Passthrough the gpiochip0 to enable ATX control
   incus config device add pikvm gpiochip0 unix-char path=/dev/gpiochip0 source=/dev/gpiochip0 required=true gid=968 uid=968

   # Add the /sys/kernel/config directory as a mount to enable the guest to create usb devices in the host to enable otg based keyboard/mouse emulation.
   incus config device add pikvm sys-kernel disk source=/sys/kernel/config path=/sys/kernel/config required=true

   # We passthrough the hidgX devices from the host to the guest when they appear. The guest first needs to boot and create the usb_gadget devices before the /dev/hidgX devices appear in the host therefore the devices are marked as "required=false". Once the device appears it's hotplugged and added to the guest.
   # See https://linuxcontainers.org/incus/docs/main/reference/devices_unix_char/
   incus config device add pikvm hidg0 unix-char path=/dev/kvmd-hid-keyboard  source=/dev/hidg0 required=false gid=968 uid=968
   incus config device add pikvm hidg1 unix-char path=/dev/kvmd-hid-mouse     source=/dev/hidg1 required=false gid=968 uid=968
   incus config device add pikvm hidg2 unix-char path=/dev/kvmd-hid-mouse-alt source=/dev/hidg2 required=false gid=968 uid=968

   # We passthrough the i2c-1 device to enable access to the OLED device
   incus config device add pikvm i2c-1 unix-char path=/dev/i2c-1 source=/dev/i2c-1 required=true gid=968 uid=968

   incus start pikvm
   ```

7. Check the console for errors
   ```bash
   incus console pikvm --show-log
   ```
8. Celebrate 🎉

#### Results

Works! Now have a officially supported hypervisor and a _hacky_-officially supported installation of PiKVM! I'm happy and can start leveraging the rest of the Raspberry Pi CPU and RAM.

> [!Lesson 6]
>
> The shareholder wins 🇳🇱 (or in regular English: if you're persistent you can git it done)

### Closing Thoughts

Thanks to the kvmd-armbian community, Google, Reddit and ChatGPT I've learned a lot about the Raspberry Pi, hypervisors and device passthrough. Do you really need to? No probably not 😆! It's cheaper to just get a second Raspberry Pi which runs PiKVM than to spend all this time trying to combine two things in pi. But what's the fun in that?!
