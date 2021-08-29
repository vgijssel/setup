#!/bin/bash

# TODO: change this to port 8092 and query something that results in a http 200 response
curl --fail http://localhost:8091 > /dev/null || exit 1