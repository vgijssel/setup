## Our own customisations on the base image from
# https://github.com/digitalrebar/provision/blob/v4/Dockerfile

FROM debian:stable-slim as builder

ARG DRP_VERSION={{ DIGITALREBAR_VERSION.value }}

ENV LANG=C.UTF-8
ENV DEBIAN_FRONTEND=noninteractive

# digital rebar provision install starts here
WORKDIR /provision/
COPY {{ archive.location }}/provision-$DRP_VERSION/tools/install.sh .
# install provision and its deps
RUN echo "DRP_VERSION=v${DRP_VERSION}" && \
    apt-get update && \
    apt-get install -y sudo curl procps iproute2 ipmitool libarchive-tools p7zip && \
    ./install.sh --isolated install --drp-version=v${DRP_VERSION}

# Copy binaries following symlinks. This is used for easier copying from builder image.
RUN mkdir /provision/binaries && \
    cp -L /provision/dr-provision /provision/drpcli /provision/drpjoin /provision/binaries/

# Build final container
FROM debian:stable-slim
ENV LANG=C.UTF-8
RUN apt-get update && \
    apt-get install --no-install-recommends -y ca-certificates curl iproute2 ipmitool jq libarchive-tools p7zip && \
    rm -rf /var/lib/apt/lists/* && \
    mkdir -p /provision/drp-data

COPY --from=builder /provision/binaries/ /usr/bin/
RUN chmod +x /usr/bin/dr*

# run the api server so we can install sledgehammer image
RUN dr-provision --version || true

EXPOSE 8091 8092 69 67 4011
VOLUME ["/provision/drp-data"]

ENTRYPOINT ["dr-provision", "--base-root=/provision/drp-data"]
CMD []

#####
# Our own customizations on the base image
# TODO: the seeding does not seem to work for the arm build?

ENV DATA_DIRECTORY=/provision/drp-data
ENV SEED_DIRECTORY=/provision/seed-data

# Copy all the files from the sledgehammer directory into the target directory
COPY {{ sledgehammer.location }}/* /provision/seed-data/tftpboot/isos/

COPY {{ scripts.location }}/with_seed_server.sh {{ scripts.location }}/seed_config.sh {{ scripts.location }}/is_healthy.sh ./scripts/
# RUN ./scripts/with_seed_server.sh ./scripts/seed_config.sh

HEALTHCHECK --interval=30s --timeout=3s CMD /scripts/is_healthy.sh

COPY {{ scripts.location }}/entrypoint.sh ./scripts/
ENTRYPOINT ["/scripts/entrypoint.sh"]

COPY {{ scripts.location }}/seed_content.sh ./scripts/
COPY {{ base.location }} ./base

# TODO: Instead of running digitalrebar and running the seed
# can we also directly copy the seed files into the image?
# Running the server is hackish and generates the ha-state.json file
# RUN ./scripts/with_seed_server.sh ./scripts/seed_content.sh