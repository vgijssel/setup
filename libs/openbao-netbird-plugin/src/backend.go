package main

import (
	"context"
	"fmt"
	"sync"

	"github.com/openbao/openbao/sdk/v2/framework"
	"github.com/openbao/openbao/sdk/v2/logical"
)

type netbirdBackend struct {
	*framework.Backend
	lock   sync.RWMutex
	client *NetBirdClient
}

func Factory(ctx context.Context, conf *logical.BackendConfig) (logical.Backend, error) {
	b := &netbirdBackend{}

	b.Backend = &framework.Backend{
		BackendType:  logical.TypeLogical,
		Help:         "The NetBird secrets engine generates and manages NetBird credentials.",
		PathsSpecial: &logical.Paths{},
		Paths: framework.PathAppend(
			pathConfigRoot(b),
			pathConfigPAT(b),
			pathConfigProxyToken(b),
			pathConfigSetupKey(b),
			pathPAT(b),
			pathProxyToken(b),
			pathSetupKey(b),
		),
		Secrets: []*framework.Secret{
			secretPAT(b),
			secretProxyToken(b),
			secretSetupKey(b),
		},
		Invalidate: b.invalidate,
	}

	if err := b.Setup(ctx, conf); err != nil {
		return nil, err
	}

	return b, nil
}

func (b *netbirdBackend) invalidate(ctx context.Context, key string) {
	if key == "config/root" {
		b.lock.Lock()
		b.client = nil
		b.lock.Unlock()
	}
}

func (b *netbirdBackend) getClient(ctx context.Context, s logical.Storage) (*NetBirdClient, error) {
	b.lock.RLock()
	if b.client != nil {
		defer b.lock.RUnlock()
		return b.client, nil
	}
	b.lock.RUnlock()

	b.lock.Lock()
	defer b.lock.Unlock()

	if b.client != nil {
		return b.client, nil
	}

	config, err := getConfigRoot(ctx, s)
	if err != nil {
		return nil, err
	}
	if config == nil {
		return nil, fmt.Errorf("root configuration not set")
	}

	b.client = NewNetBirdClient(config.APIURL, config.ServiceAccountToken, 0)
	return b.client, nil
}
