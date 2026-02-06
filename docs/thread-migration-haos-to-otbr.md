# Thread Network Migration: HAOS to Standalone OTBR

This guide describes how to migrate Thread network credentials from the Home Assistant OS (HAOS) OTBR add-on to the standalone OTBR container running on `peace-at-last` (pihole-prod).

## Prerequisites

- SSH access to HAOS
- SSH access to peace-at-last (192.168.1.15)
- OTBR container running on peace-at-last

## Step 1: Export Thread Credentials from HAOS

SSH into HAOS:

```bash
ssh root@<haos-ip>
```

Read the Thread datasets file:

```bash
cat /config/.storage/thread.datasets
```

This outputs JSON containing your Thread network credentials. Look for the `tlv` field inside the datasets array:

```json
{
  "version": 1,
  "minor_version": 4,
  "key": "thread.datasets",
  "data": {
    "datasets": [
      {
        "tlv": "0e080000000000010000000300001235..."
      }
    ]
  }
}
```

Copy the hex string from the `tlv` field.

## Step 2: Import Credentials to Standalone OTBR

SSH into peace-at-last:

```bash
ssh maarten@192.168.1.15
```

Set the active dataset in the OTBR container:

```bash
docker exec otbr ot-ctl dataset set active <PASTE_HEX_STRING_HERE>
```

Bring up the Thread interface:

```bash
docker exec otbr ot-ctl ifconfig up
```

Start Thread networking:

```bash
docker exec otbr ot-ctl thread start
```

## Step 3: Verify Thread Network

Check the Thread state (should become `leader`, `router`, or `child`):

```bash
docker exec otbr ot-ctl state
```

View network info:

```bash
docker exec otbr ot-ctl networkname
docker exec otbr ot-ctl panid
docker exec otbr ot-ctl channel
```

## Step 4: Validate Matter Devices in Home Assistant

1. Open Home Assistant
2. Go to **Settings > Devices & Services > Matter**
3. Verify your Matter-over-Thread devices are online and responsive
4. Test device controls to confirm functionality

## Troubleshooting

View OTBR logs:

```bash
docker logs otbr
```

Check Thread router/child tables:

```bash
docker exec otbr ot-ctl router table
docker exec otbr ot-ctl child table
```

Restart OTBR if needed:

```bash
docker restart otbr
```

## Related Infrastructure

- OTBR container: `peace-at-last` (192.168.1.15)
- OTBR Web UI: http://192.168.1.15:80
- OTBR REST API: http://192.168.1.15:8081
- Thread radio: Nabu Casa USB dongle (`/dev/ttyUSB0`)
- Ansible role: `libs/ansible/roles/otbr/`
