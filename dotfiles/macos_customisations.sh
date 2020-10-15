#!/bin/bash

set -Eeoux pipefail

# Copied from
# https://www.going-flying.com/blog/macos-automatic-customization-script.html#
# https://gist.github.com/mbinna/2357277
# https://gist.github.com/vraravam/5e28ca1720c9dddacdc0e6db61e093fe

# TODO: Enable "Reduce Motion" in Accessibility > Display
# TODO: Enable "Use scroll gesture with modified keys to zoom" in Accessibility > Zoom
# defaults write com.apple.universalaccess closeViewScrollWheelToggle -int 1
# TODO: Enable "Night Shift" in Displays > Night Shift
# TODO: Map Caps Lock to Escape for "Apple Internal Keyboard / Trackpad" in Keyboard > Modified Keys
# TODO: Set "Secondary click" to "Click in bottom right corner" in Trackpad

# Disable "Correct spelling automatically"
defaults write NSGlobalDomain NSAutomaticSpellingCorrectionEnabled -int 0

# Disable "Capitalize words automatically"
defaults write NSGlobalDomain NSAutomaticCapitalizationEnabled -int 0

# Disable "Add period with double-space"
defaults write NSGlobalDomain NSAutomaticPeriodSubstitutionEnabled -int 0

# Set "Key Repeat" to be really fast. "2" is the lowest from the Macos UI
defaults write NSGlobalDomain KeyRepeat -int 1

# Set "Delay Until Repeat" to be faster
defaults write NSGlobalDomain InitialKeyRepeat -int 12

# https://apple.stackexchange.com/a/298826
# Enable "Automatically hide and show the Docker"
defaults write com.apple.dock autohide -bool true

# Set a 1000 second delay before the dock appears
defaults write com.apple.dock autohide-delay -float 1000

# Disable "Animate opening applications"
defaults write com.apple.dock no-bouncing -bool TRUE
killall Dock
killall Finder

# Check for updates automatically, daily, and auto-install security updates
defaults write com.apple.SoftwareUpdate AutomaticCheckEnabled -bool true
defaults write com.apple.SoftwareUpdate ScheduleFrequency -int 1
defaults write com.apple.SoftwareUpdate AutomaticDownload -int 1
defaults write com.apple.SoftwareUpdate CriticalUpdateInstall -int 1

# Prevent .DS_Store from being written on network drives
defaults write com.apple.desktopservices DSDontWriteNetworkStores true

# Prevent .DS_Store from being created on USB Drives
defaults write com.apple.desktopservices DSDontWriteUSBStores -bool true
