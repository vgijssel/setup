#!/bin/bash

curl --fail --insecure https://localhost:8092/swagger.json > /dev/null || exit 1
