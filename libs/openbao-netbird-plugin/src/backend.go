package main

import (
	"context"

	"github.com/openbao/openbao/sdk/v2/framework"
	"github.com/openbao/openbao/sdk/v2/logical"
)

type netbirdBackend struct {
	*framework.Backend
}

func Factory(ctx context.Context, conf *logical.BackendConfig) (logical.Backend, error) {
	b := &netbirdBackend{}

	b.Backend = &framework.Backend{
		BackendType: logical.TypeLogical,
		Help:        "The NetBird secrets engine generates and manages NetBird credentials.",
	}

	if err := b.Setup(ctx, conf); err != nil {
		return nil, err
	}

	return b, nil
}
