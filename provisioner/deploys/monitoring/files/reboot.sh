#!/bin/sh

# Copied from https://askubuntu.com/questions/829526/ubuntu-server-reboot-command-in-crontab-trigger-only-if-required
if [ -f /var/run/reboot-required ]; then
  /sbin/shutdown -r now
fi