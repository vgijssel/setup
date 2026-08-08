package main

import (
	"os"

	"github.com/openbao/openbao/sdk/v2/plugin"
)

func main() {
	meta := &plugin.ServeOpts{
		BackendFactoryFunc: Factory,
	}

	if err := plugin.ServeMultiplex(meta); err != nil {
		os.Exit(1)
	}
}
