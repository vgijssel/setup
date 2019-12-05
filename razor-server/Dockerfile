# syntax = docker/dockerfile:experimental
FROM ubuntu:xenial

WORKDIR /app

ENV DISTRO xenial

RUN --mount=id=${DISTRO},type=cache,target=/var/cache/apt \
    --mount=id=${DISTRO},type=cache,target=/var/lib/apt \
    apt-get update \
    && apt-get install -y locales \
    && localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8

ENV LANG en_US.utf8

# Setup the timezone
ENV TZ 'Europe/Amsterdam'

RUN --mount=id=${DISTRO},type=cache,target=/var/cache/apt \
    --mount=id=${DISTRO},type=cache,target=/var/lib/apt \
    echo $TZ > /etc/timezone \
    && apt-get install -y tzdata \
    && rm /etc/localtime \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && dpkg-reconfigure -f noninteractive tzdata

RUN --mount=id=${DISTRO},type=cache,target=/var/cache/apt \
    --mount=id=${DISTRO},type=cache,target=/var/lib/apt \
    apt-get install -y wget ca-certificates \
    && wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - \
    && echo "deb http://apt.postgresql.org/pub/repos/apt/ ${DISTRO}-pgdg main" >> /etc/apt/sources.list.d/pgdg.list \
    && wget -O razor-server.deb https://apt.puppetlabs.com/puppetlabs-release-pc1-${DISTRO}.deb \
    && dpkg -i razor-server.deb \
    && apt-get update && apt-get install -y postgresql-10 razor-server

ENV PATH "/opt/puppetlabs/bin/:${PATH}"

RUN mkdir -p /repo

RUN wget -O microkernel.tar http://pup.pt/razor-microkernel-latest \
    && tar -xf microkernel.tar -C /repo \
    && rm microkernel.tar

USER postgres
RUN /etc/init.d/postgresql start \
    && psql --command "CREATE USER razor WITH SUPERUSER PASSWORD 'razor';" \
    && createdb -O razor razor_prd \
    && /etc/init.d/postgresql stop

USER root

ADD config.yaml /etc/puppetlabs/razor-server/config.yaml
ADD start.sh ./

EXPOSE 8150
CMD ["./start.sh"]
