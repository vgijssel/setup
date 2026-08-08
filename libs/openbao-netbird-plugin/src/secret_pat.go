package main

import (
	"github.com/openbao/openbao/sdk/v2/framework"
)

func secretPAT(b *netbirdBackend) *framework.Secret {
	return &framework.Secret{
		Type: "netbird_pat",
	}
}
