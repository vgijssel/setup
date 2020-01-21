ARG IMAGE_SHA_TAG=latest
FROM docker.pkg.github.com/mvgijssel/setup/base-image:${IMAGE_SHA_TAG}

WORKDIR /app

RUN apt-get update && \
    apt-get install -y curl wget ca-certificates gnupg \
    && wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - \
    && echo "deb http://apt.postgresql.org/pub/repos/apt/ ${RELEASE}-pgdg main" >> /etc/apt/sources.list.d/pgdg.list \
    && wget -O razor-server.deb https://apt.puppetlabs.com/puppetlabs-release-pc1-xenial.deb \
    && dpkg -i razor-server.deb \
    && rm razor-server.deb \
    && apt-get update && apt-get install -y postgresql-10 razor-server dnsmasq \
    && rm -rf /var/lib/apt/lists/*

ENV PATH "/opt/puppetlabs/bin/:${PATH}"

RUN mkdir -p /repo
RUN wget -O microkernel.tar http://pup.pt/razor-microkernel-latest \
    && tar -xf microkernel.tar -C /repo \
    && rm microkernel.tar

RUN mkdir -p /tftpboot
RUN wget -O /tftpboot/undionly.kpxe.0 http://boot.ipxe.org/undionly.kpxe

USER postgres
RUN /etc/init.d/postgresql start \
    && psql --command "CREATE USER razor WITH SUPERUSER PASSWORD 'razor';" \
    && createdb -O razor razor_prd \
    && /etc/init.d/postgresql stop

USER root

ADD config.yaml /etc/puppetlabs/razor-server/config.yaml
ADD start.sh ./
ADD etc /etc
ADD tasks /tasks
ADD tftpboot /tftpboot

# razor-server
EXPOSE 8150

# dhcp dnsmasq
EXPOSE 67

CMD ["./start.sh"]
