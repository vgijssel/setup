---
title: "Deploying PiKVM: 7 Lessons You Already Know"
description: Reacquaintance with valuable devops lessons through deploying PiKVM in various ways.
date: 2025-01-09 10:43:00
publish: true
slug: deploying-pikvm-7-lessons-you-already-know
tags: [lxc, pikvm, incus, ansible, packer]
categories:
  - devops
  - virtualisation
  - failure
image: ./images/pikvm-lessons-learned.jpeg
update: 2025-01-12 07:19:28
---

![](pikvm-lessons-learned.jpeg)

**TL;DR If you are thinking about using the Raspberry Pi 4 (Pi) which hosts PiKVM for multiple use cases, just get a second Pi. It will save you a lot of time.**

Having **not** read the [PiKVM](https://docs.pikvm.org/) documentation thoroughly (reading _is_ hard after all) I decided to purchase the [Geekworm KVM-A3](https://wiki.geekworm.com/KVM-A3) with a Pi 8GiB instead of the recommend 1GiB to host both the PiKVM OS and [Windmill](https://www.windmill.dev/) inside of [K3S](https://k3s.io). I was about to learn this was actually a lot harder than I imagined it would be.

<!-- more -->

## Windmill in PiKVM Host OS

PiKVM is based on Arch Linux, which supports K3s. The only notable difference? Its read-only filesystem! Let's change that.

<h4>Steps</h4>

1. Circumvent read-only file system as described [here](https://docs.pikvm.org/faq/). (Tip: Look for instructions between the giant warning banners 😂).
   ![[pikvm-read-write-warning.png]]
2. Install K3s
3. Setup [helmfile](https://helmfile.readthedocs.io/en/latest/) with the Windmill chart
4. Run `helmfile apply`
5. Watch it fail 🤦‍♂️

<h4>Result</h4>

I was surprised it took a really long time to start the Windmill pods. Checking out the kubectl logs I came to the realisation that k3s was unable to pull an image from the registry due to a mismatch in architecture. The [Windmill package](https://github.com/windmill-labs/windmill/pkgs/container/windmill) only supports `arm64`, while PiKVM runs on `armhf`.

> [!tip] Lesson 1
>
> Do your due diligence! Arm64 and armhf are different architectures, and software compatibility isn't guaranteed.

## PiKVM in ESXi-Arm Fling VM

PiKVM doesn't offer a 64-bit version of the OS ([source](https://github.com/pikvm/pi-builder/issues/4), [source](https://github.com/pikvm/pikvm/issues/711)), yet I needed to run 64-bit and 32-bit software on the same machine. Enter [ESXi-Arm Fling](https://williamlam.com/2024/10/new-esxi-arm-fling-based-on-8-0-update-3b.html). Success guaranteed of course, as ESXi is built and maintained by a reputable company.

<h4>Steps</h4>

1. Create an account on [the Broadcom website](https://access.broadcom.com/default/ui/v1/signin/) and download the documentation
2. From the documentation
	1. Update Raspberry Pi 4 EEPROM
	2. Flash UEFI to sdcard from [https://github.com/pftf/RPi4/releases](https://github.com/pftf/RPi4/releases)
	3. Make OSData partition 25gb by passing this in the boot screen (to not have ESXi take all the space in the thumb-drive)

		```bash
		systemMediaSize=min
		```

	4. When asked for a ESX OSData store when installing on a USB attached disk press enter to skip this, otherwise you'll get a cryptic error and have to start over.
3. Get license code from [this gist](https://gist.github.com/ayebrian/646775424393c9a35fb8257f44df1c8b) who is kind enough to share it with the rest of the world.
4. Add license code to ESXi
5. [Download official PiKVM v3 image](https://files.pikvm.org/images/v3-hdmi-rpi4-box-latest.img.xz)
6. Convert the image to vmdk

	```bash
	qemu-img convert -f raw -O vmdk ~/Downloads/v3-hdmi-rpi4-box-latest.img ~/Downloads/v3-hdmi-rpi4-box-latest.vmdk
	```

7. Upload `v3-hdmi-rpi4-box-latest.vmdk`
8. Configure the `pikvm` virtual machine
   ![[esxi-vm-settings.png]]
9. Attach the uploaded disk to the virtual machine
10. Boot the machine
11. Watch if fail 🤦‍♂️

<h4>Result</h4>

The VM wouldn't boot—a 32-bit PiKVM image can't run as a 64-bit VM. I also tried to run the virtual machine with the Debian net installer: [https://cdimage.debian.org/debian-cd/current/arm64/iso-cd/](https://cdimage.debian.org/debian-cd/current/arm64/iso-cd/) and trying add grub to the root file system, but with no success.

> [!tip] Lesson 2
>
> Details matter! Not all OS images work with hypervisors. The Pi has a unique boot process.

> [!tip] Lesson 3
>
> Temper expectations with early-access software. ESXi-Arm Fling doesn't support 32-bit arm VMs ([source](https://williamlam.com/2020/10/how-to-run-raspberry-pi-os-as-a-vm-on-esxi-arm.html), [source](https://bugs.freebsd.org/bugzilla/show_bug.cgi?id=250308#c2)).

## PiKVM in Pimox VM

Pimox (Proxmox + Pi) seemed promising based on [this Reddit post](https://www.reddit.com/r/Proxmox/comments/nvdb1z/proxmox_on_the_raspberry_pi_now_supports_32bit/) with support for 32-bit VMs.

<h4>Steps</h4>

1. Install Pimox ([source](https://github.com/jiangcuo/Proxmox-Port), [source](https://fleetstack.io/blog/install-proxmox-on-raspberry-pi), [source](https://pimylifeup.com/raspberry-pi-proxmox), [source](https://gist.github.com/enjikaka/52d62c9c5462748dbe35abe3c7e37f9a), [source](https://www.bachmann-lan.de/proxmox-8-auf-dem-raspberry-pi-4-installieren/))
2. Create and run an Ansible Playbook (see [pull request](https://github.com/vgijssel/setup/pull/676))
3. Initialise a Proxmox VM
4. Search for the device passthrough section to passthrough the following devices:
	1. OTG port for keyboard/mouse/mass storage device (msd) emulation on the target the PiKVM is attached to
	2. HDMI capture card and hardware H264 encoding for streaming target video output
	3. GPIO for ATX control for power on/off control
	4. I2C for the OLED screen
5. Fail 🤦‍♂️

<h4>Result</h4>

Hypervisors like Proxmox can't easily passthrough all devices from host to guest. I did some reading about [vfio passthrough](https://www.openeuler.org/en/blog/wxggg/2020-11-29-vfio-passthrough-2.html) but that was waaaay out of my comfort zone, so I decided to give up on running PiKVM inside a vm.

Thanks for [helping me set up PiKVM in a vm @srepac](https://discord.com/channels/1138148231180714085/1138148231663067258/1321907940382343209)!

> [!tip] Lesson 4
>
> Tackle highest risk first. Device passthrough in VMs is complex. Not all devices can be passed to guests.

## Kvmd-armbian in Pimox Host OS

Suffering from [sunk cost fallacy](https://en.wikipedia.org/wiki/Sunk_cost) big time I kept pursuing my goal. Determined I found [kvmd-armbian](https://github.com/srepac/kvmd-armbian) which is an unofficial port that supports 32-bit, 64-bit on arm AND x86 machines. Bonus points having a [Discord channel](https://discord.gg/64EQQuwjsB) for support.

<h4>Steps</h4>

1. Install Pimox
2. Create and run an Ansible Playbook
3. Run installer from kvmd-armbian
4. Disable the Pimox firewall to get access to the kvmd web ui (Tip: Please enable it again if you plan deploy like this 😅)

	```bash
	pve-firewall stop
	```

5. [Fix OLED screen for kvmd-armbian](#Fix%20OLED%20screen%20for%20kvmd-armbian)
6. Celebrate 🎉

<h4>Result</h4>

With help from the kvmd-armbian community ❤️ it worked, but running two unofficial setups (Pimox + kvmd-armbian) in the host OS felt unsustainable. If one of the projects would stop developing I'd have to start over.

> [!tip] Lesson 5
>
> Prioritize long-term maintainability.

## Kvmd-armbian in Pimox LXC

If I can't run kvmd-armbian on the host and not in a VM, what are my options? I looked into docker containers and [LXC containers](https://linuxcontainers.org/lxc/introduction/). As LXC is closer to a vm than Docker and PiKVM has specific host requirements like an additional partition for msd, I decided to go with LXC.

<h4>Steps</h4>

1. Download LXC Jammy and create a container template ([source](https://benheater.com/proxmox-lxc-using-external-templates/))
2. Create an LXC container with the following settings
	1. **Hostname**: pikvm
	2.  UNCHECK - unprivileged container (so **privileged** container)
	3. **Password**: Password1234 (Tip: don't)
3. Start the LXC container and attach the console
4. Run kvmd-installer
5. [Fix OLED screen for kvmd-armbian](#Fix%20OLED%20screen%20for%20kvmd-armbian)
6. Forward devices from host to guest (I have to admit this was _pretty_ time consuming 😅)
	1. [Passthrough GPIO for ATX control](#Passthrough%20GPIO%20for%20ATX%20control)
	2. [Passthrough OTG port for keyboard/mouse](#Passthrough%20OTG%20port%20for%20keyboard/mouse)
	3. [Passthrough OTG port for keyboard/mouse](#Passthrough%20OTG%20port%20for%20keyboard/mouse)
	4. [Passthrough HDMI capture card](#Passthrough%20HDMI%20capture%20card)
	5.  [Passthrough I2C for the OLED screen](#Passthrough%20I2C%20for%20the%20OLED%20screen)
7. Celebrate 🎉

<h4>Result</h4>

This separation enabled easier updates for both host and guest OS, leaving me less worried about potential future breakage.

> [!tip] Lesson 6
>
> Ask for help! LXC and device passthrough are pretty far out of my comfort zone, I used ChatGPT which was incredibly helpful!

## Kvmd-armbian in Incus LXC

Next I decided to see if it's possible to use a hypervisor which is officially supported on arm AND supports LXC out of the box. I investigated the following, not an exhaustive list:

| Hypervisor                                                                                      | Raspberry Pi 4 support                                                                                          | LXC support                                                     |
| ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [ESXI Arm Fling](https://williamlam.com/2024/10/new-esxi-arm-fling-based-on-8-0-update-3b.html) | ✅                                                                                                              | ❌                                                              |
| [Proxmox](https://github.com/jiangcuo/Proxmox-Port)                                             | ✅: Using unofficial Pimox port                                                                                 | ✅                                                              |
| [xcp ng](https://xcp-ng.org/)                                                                   | ❌: [Work in progress](https://xcp-ng.org/blog/2024/04/03/integrating-xen-on-the-ampere-platform-a-first-look/) | ❌: Abandoned initiative [RunX](https://github.com/xcp-ng/runx) |
| [Cloud hypervisor](https://github.com/cloud-hypervisor/cloud-hypervisor)                        | ✅                                                                                                              | ❌                                                              |
| [Incus](https://github.com/lxc/incus)                                                           | ✅                                                                                                              | ✅                                                              |

The choice landed on Incus (see [pull request](https://github.com/vgijssel/setup/pull/679)).

<h4>Steps</h4>

1. Using Raspberry Pi Imager:
	1. **OS**: Ubuntu Server 24.04 LTS 64-bit
	2. **Username**: deploy
	3. **Hostname**: provisioner
	4. **Password**: `Password1234`
2. Setup Incus host using Ansible playbook

        ```bash
        cd stacks/provisioner
        ansible-playbook -i ./production.local provisioner.yml --diff
        ```

3. Create [Incus kvmd-armbian LXC container with passthrough](#Incus%20kvmd-armbian%20LXC%20container%20with%20passthrough)
4. Start the LXC container

	```bash
	incus start kvmd
	```

5. Run the kvmd-armbian installer
6. [Fix OLED screen for kvmd-armbian](#Fix%20OLED%20screen%20for%20kvmd-armbian)
7. Restart the container

	```bash
	incus restart kvmd
	```

8. Celebrate 🎉

<h4>Result</h4>

A clean, supported hypervisor setup (many kudos to the Incus team 👏). At this point I'm pretty happy. But having spent all this time, it would be a waste not to spend **EVEN MORE** time trying to improve things.

## PiKVM in Incus LXC

Inspired by [pikvm-container](https://github.com/Prototyped/pikvm-container), a (dated) implementation of running PiKVM inside a docker container, I adapted the official PiKVM image for LXC (see [pull request](https://github.com/vgijssel/setup/pull/679) with [Packer](https://www.packer.io/) pipeline).

<h4>Steps</h4>

1. [Download official PiKVM v3 image](https://files.pikvm.org/images/v3-hdmi-rpi4-box-latest.img.xz)
2. Extract partitions using 7zip
3. Loop mount partitions

	```bash
	mkdir -p /mnt/rootfs
	mkdir -p /mnt/rootfs/boot
	mount -o loop 2.img /mnt/rootfs
	mount -o loop 0.fat /mnt/rootfs/boot
	```

4. Use [distrobuilder](https://github.com/lxc/distrobuilder) to convert`/mnt/rootfs` into an Incus LXC image with modifications
	1. Remove `/etc/fstab`
	2. Disable msd
	3. Add a systemd boot service to generate certificates
	4. Mask service `kvmd-pst`, `kvmd-fan`, `kvmd-watchdog` and `kvmd-bootconfig` because PiKVM works without those (and I don't want to spend more time fixing those services 😂)
5. Import the image into Incus

	```bash
	incus image import pikvm-rpi4.tar.xz --alias pikvm-rpi4/latest
	```

6. Create [Incus PiKVM LXC container with passthrough](#Incus%20PiKVM%20LXC%20container%20with%20passthrough)
7. Check the console for errors

	```bash
	incus console pikvm --show-log
	```

8. Celebrate 🎉

<h4>Result</h4>

Success! I'm running an officially supported hypervisor and a _hacky_-officially supported installation of PiKVM inside an LXC container! Now I can get back to what I was doing, spinning up Windmill.

> [!tip] Lesson 7
>
> The on holder wins 🇳🇱 (in regular English: Persistence pays off)

## Closing Thoughts

Thanks to the kvmd-armbian community, Google, Reddit, and ChatGPT, I've gained invaluable insights into the Raspberry Pi, hypervisors, and device passthrough. Would I recommend this journey? Probably not—just get a second Pi for PiKVM. But where's the fun in that? 😆

---

## Code Snippets

### Fix OLED Screen for Kvmd-armbian

Copied from [Discord comment](https://discord.com/channels/1138148231180714085/1138148231663067258/1323568386189295669)

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

### Passthrough GPIO for ATX Control

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

2. Running `kvmd -m` showed me what gpio device what was expected

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

### Passthrough OTG Port for keyboard/mouse

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

### Passthrough HDMI Capture Card

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

	```bash
	Dec 30 05:32:21 pikvm kvmd[237]: kvmd.apps.kvmd.streamer           INFO --- => -- ERROR [36989.079          ] -- H264: Can t open encoder device: No such file or directory
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

### Passthrough I2C for the OLED Screen

1. `journalctl` and `systemctl` didn't show the `kvmd-oled` service
2. Running `systemctl start kvmd-oled` showed the problem, the device `/dev/i2c-1` didn't exist

	```bash
	Jan 08 09:14:13 pikvm systemd[1]: PiKVM - A small OLED daemon was skipped because of an unmet condition check (ConditionPathExists=/dev/i2c-1).
	```

1. Easy peasy 🍋! Update the LXC template

	```yaml
	lxc.cgroup2.devices.allow: c 89:* rwm
	lxc.mount.entry: /dev/i2c-1 dev/i2c-1 none bind,optional,create=file 0 0
	```

2. Restart the LXC
3. BOOM
   ![[pikvm-oled-screen.png]]

### Incus Kvmd-armbian LXC Container with Passthrough

```bash
# create pikvm container using ubuntu/jammy as the base as mentioned in the kvmd-armbian repository
incus init images:ubuntu/jammy kvmd

# Passthrough all the video devices for hdmi video capture and hardware decoing of H264. Using uid/gid 999 here as that's the id of kvmd inside the LXC container.
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

### Incus PiKVM LXC Container with Passthrough

```bash
incus init provisioner:pikvm-rpi4/latest pikvm

# Make sure to disable apparmor and enable privileged container so we get read/write access to sys
incus config set pikvm raw.lxc "lxc.apparmor.profile=unconfined"
incus config set pikvm security.privileged true

# boot the instance at startup
incus config set pikvm boot.autorestart true
incus config set pikvm boot.autostart true

# Passthrough all the video devices for hdmi video capture and hardware decoing of H264
# Note I'm using gid/uid 968 instead of 999 because the user and group ids of kvmd are different in the official image!
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
