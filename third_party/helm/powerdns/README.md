# PowerDNS Authoritative Server

**Version**: powerdns/pdns-auth-50
**Type**: DNS Server
**Purpose**: Internal-only authoritative DNS storage

## Description

PowerDNS Authoritative Server is a high-performance, standards-compliant DNS server with a modular backend architecture. It supports SQLite for simple, local DNS record storage.

## Usage in internal-dns-xp

Used as the DNS backend in the internal DNS deployment:
- Provides authoritative DNS responses for internal domains
- Stores DNS records in SQLite database on PVC
- Exposes HTTP API for external-dns integration
- Serves DNS queries on port 53 (UDP/TCP)

## Configuration

```ini
launch=gsqlite3
gsqlite3-database=/var/lib/powerdns/pdns.sqlite3
webserver=yes
webserver-address=0.0.0.0
webserver-port=8081
api=yes
local-address=0.0.0.0
local-port=53
```

## Storage

- **Type**: PersistentVolumeClaim (PVC)
- **Default Size**: 1Gi
- **Access Mode**: ReadWriteOnce
- **Database**: SQLite3 at `/var/lib/powerdns/pdns.sqlite3`

## References

- **Image**: `powerdns/pdns-auth-50`
- **Documentation**: https://doc.powerdns.com/authoritative/
- **API**: https://doc.powerdns.com/authoritative/http-api/
