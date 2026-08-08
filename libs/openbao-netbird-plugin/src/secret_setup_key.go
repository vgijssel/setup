package main

import (
	"github.com/openbao/openbao/sdk/v2/framework"
)

func secretSetupKey(b *netbirdBackend) *framework.Secret {
	return &framework.Secret{
		Type: "netbird_setup_key",
	}
}
