# From https://forum.snapcraft.io/t/snapd-in-docker/177/13
FROM library/ubuntu:focal-20230308
ENV container docker
ENV PATH /snap/bin:$PATH
# ADD snap /usr/local/bin/snap
RUN apt-get update
RUN apt-get install -y snapd squashfuse fuse
RUN systemctl enable snapd
STOPSIGNAL SIGRTMIN+3
CMD [ "/sbin/init" ]