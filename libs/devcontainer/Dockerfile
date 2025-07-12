FROM ubuntu:latest

RUN apt-get update && apt-get install -y \
    tmux \
    git \
    curl \
    vim \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/setup

CMD ["sleep", "infinity"]