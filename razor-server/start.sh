#!/bin/bash

set -e
set +x

/etc/init.d/postgresql start

# dnsmasq

razor-admin -e production migrate-database

source /opt/puppetlabs/server/apps/razor-server/share/razor-server/razor-server.env

# This source contains things like the port number and config location
source /etc/sysconfig/razor-server

/opt/puppetlabs/server/apps/razor-server/share/torquebox/jboss/bin/standalone.sh -Djboss.server.log.dir=${JBOSS_LOG_DIR} -Dhttp.port=${RAZOR_HTTP_PORT} -Dhttps.port=${RAZOR_HTTPS_PORT} -b 0.0.0.0
