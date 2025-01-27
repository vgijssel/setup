${yamlencode({
  "image": image_settings,
})}

# The source is a noop, because the rootfs will be generated
# outside of distrobuiler.
source:
  downloader: rootfs-http
  url: file://noop

files:
  - path: /etc/hostname
    generator: hostname

  # We're overriding the fstab file as we don't use those partitions anymore in LXC
  - path: /etc/fstab
    uid: 0
    gid: 0
    mode: 0644
    generator: dump
    content: |-
      /dev/cdrom	/media/cdrom	iso9660	noauto,ro 0 0
      /dev/usbdisk	/media/usb	vfat	noauto,ro 0 0

  # Disable the msd service by default as we're missing the msd partition
  - path: /etc/kvmd/override.d/disable-msd
    uid: 0
    gid: 0
    mode: 0644
    generator: dump
    content: |-
      kvmd:
        msd:
          type: disabled

  # Create a helper executable to update the certificate
  - path: /usr/sbin/kvmd-bootconfig-incus
    uid: 0
    gid: 0
    mode: 0744
    generator: dump
    content: |-
      #!/bin/sh
      set -eux

      # Generate a new certificate
      kvmd-gencert --do-the-thing

      # Generate a new certificate for vnc
      kvmd-gencert --do-the-thing --vnc

  # Run the helper executable during boot
  - path: /usr/lib/systemd/system/kvmd-bootconfig-incus.service
    uid: 0
    gid: 0
    mode: 0600
    generator: dump
    # Copied from https://github.com/pikvm/kvmd/blob/master/configs/os/services/kvmd-bootconfig.service
    content: |-
      [Unit]
        Description=PiKVM - Boot configuration for Incus
        After=systemd-modules-load.service kvmd-oled.service
        Before=kvmd-webterm.service kvmd-certbot.service kvmd-ipmi.service kvmd-janus-static.service kvmd-janus.service kvmd-nginx.service kvmd-otg.service kvmd-otgnet.service kvmd-pst.service kvmd-tc358743.service kvmd-vnc.service kvmd-watchdog.service kvmd.service pikvm-bootconfig.service sshd.service network-pre.target

        [Service]
        Type=oneshot
        ExecStart=/usr/bin/kvmd-bootconfig-incus
        ExecStop=/bin/true
        RemainAfterExit=true

        [Install]
        WantedBy=multi-user.target

packages:
  manager: pacman
  update: false
  cleanup: false
  sets: []

actions:
  - trigger: post-files
    action: |-
      #!/bin/sh
      set -eux

      # Don't need persistant storage service: https://docs.pikvm.org/pst/
      systemctl mask kvmd-pst

      # Don't need kvmd-fan service
      systemctl mask kvmd-fan

      # Unsure if the watchdog service is needed
      systemctl mask kvmd-watchdog

      # The original bootconfig does not work
      systemctl mask kvmd-bootconfig.service 

      # Enable the incus bootconfig
      systemctl enable kvmd-bootconfig-incus.service 

      # Enable the OLED service
      systemctl enable kvmd-oled
