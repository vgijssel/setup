# Network

## LAN - admin

The default network. For all of the personal devices like laptops, phones, tablets, etc.

| Setting        | value                          |
| -------------- | ------------------------------ |
| VLAN           | None                           |
| Subnet         | 192.168.1.1/24                 |
| DHCP Range     | 192.168.1.100 - 192.168.1.254  |
| IGMP Snooping  | Enabled                        |
| MLD Snooping   | Enabled                        |
| LAN Interfaces | WAN/LAN1, WAN/LAN2, LAN1, LAN2 |

## LAN - guest

For guests that need access to the internet but not to anything else.

| Setting        | value                           |
| -------------- | ------------------------------- |
| VLAN           | 20                              |
| Subnet         | 192.168.20.1/24                 |
| DHCP Range     | 192.168.20.100 - 192.168.20.254 |
| IGMP Snooping  | Disabled                        |
| MLD Snooping   | Disabled                        |
| LAN Interfaces | LAN2                            |

## LAN - iot (internet of things)

Devices that need access to the internet but not to anything else.

| Setting        | value                           |
| -------------- | ------------------------------- |
| VLAN           | 30                              |
| Subnet         | 192.168.30.1/24                 |
| DHCP Range     | 192.168.30.100 - 192.168.30.254 |
| IGMP Snooping  | Disabled                        |
| MLD Snooping   | Disabled                        |
| LAN Interfaces | LAN2                            |

## Wireless - not

#### Devices

- x-sense hub

## VLAN - not (network of things)

Devices that don't need access to anything.

| Setting        | value                           |
| -------------- | ------------------------------- |
| VLAN           | 40                              |
| Subnet         | 192.168.40.1/24                 |
| DHCP Range     | 192.168.40.100 - 192.168.40.254 |
| IGMP Snooping  | Disabled                        |
| MLD Snooping   | Disabled                        |
| LAN Interfaces | LAN2                            |

## Wireless - koekebrood

## Wireless - guest

## Wireless - iot

| Setting | value   |
| ------- | ------- |
| Name    | iot     |
| Band    | 2.4 GHz |
| VLAN    | iot(30) |

## Resources

- https://www.youtube.com/watch?v=7i17jvrIjD0

# IPS

192.168.178.1 - modem

192.168.1.1 - Unifi USG
192.168.1.3 - Unifi gangkast-switch
192.168.1.4 - Unifi woonkamer-switch
192.168.1.5 - Unifi kantoor-switch

192.168.1.1 - TP-Link hallway-router
192.168.1.2 - Unifi Cloud Key
192.168.1.3 - TP-Link hallway-switch
192.168.1.4 - TP-Link office-switch
192.168.1.5 - TP-Link living-room-switch
192.168.1.6 - TP-Link hallway-controller
192.168.1.10 - TP-Link hallway-ap
192.168.1.11 - TP-Link living-room-ap
192.168.1.12 - TP-Link baby-room-ap
192.168.1.13 - TP-Link garden-ap
192.168.1.14 - TP-Link office-ap

192.168.1.100 - 192.168.1.254 DHCP Range

192.168.1.20 - Unifi babykamer-cam _
192.168.1.21 - Unifi oprit-cam _

192.168.1.25 - Apple Tv Woonkamer
192.168.1.26 - Apple Tv Slaapkamer

192.168.1.30 - hypervisor
192.168.1.31 - provisioner
192.168.1.32 - haos
192.168.1.40 - 192.168.1.49 - opennebula \_ + port forward

192.168.1.60 - baby-room-shelly
192.168.1.61 - bathroom-shelly
192.168.1.62 - bedroom-shelly
192.168.1.63 - driveway-shelly
192.168.1.64 - garden-shelly
192.168.1.65 - hallway-shelly
192.168.1.66 - kitchen-shelly
192.168.1.67 - landing-shelly
192.168.1.68 - laundry-room-shelly
192.168.1.69 - living-room-shelly
192.168.1.70 - office-shelly
192.168.1.71 - supply-closet-shelly
192.168.1.72 - toilet-shelly

192.168.1.73 - baby-room-moon-light-moko
192.168.1.74 - kitchen-oven-moko
192.168.1.75 - living-room-tv-moko
192.168.1.76 - hallway-vacuum-moko
192.168.1.77 - bedroom-charger-moko
192.168.1.78 - office-server-moko
192.168.1.79 - living-room-monkey-moko
192.168.1.80 - bedroom-tv-moko
192.168.1.81 - baby-room-bed-light-moko
192.168.1.82 - office-human-moko
192.168.1.83 - bathroom-human-moko

192.168.1.84 - test-shelly

192.168.1.85 - slimmelezer

192.168.1.90 - hallway-epo

subnet mask: 255.255.255.0
gateway: 192.168.1.1
preferred dns: 192.168.1.1
