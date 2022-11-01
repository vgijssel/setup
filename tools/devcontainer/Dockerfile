# NOTE: not pinning on sha here so we are pulling the right image for the right arch
FROM ubuntu:focal-20220826

ARG TARGETARCH

# Setup right locale
ENV LC_ALL="en_US.UTF-8" 
ENV LANG="en_US.UTF-8" 
ENV LANGUAGE="en_US.UTF-8"
RUN apt-get update \
    && apt-get install -y locales locales-all \
    && locale-gen en_US.UTF-8 \
    && update-locale LANG=en_US.UTF-8 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Setup the Europe/Amsterdam timezone
ENV TZ=Europe/Amsterdam
RUN apt-get update \
    && apt-get install -y tzdata \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Setup non-root user for the container
# with the ability to use passwordless sudo
RUN apt-get update \
    && apt-get install -y sudo \
    && useradd -u 1000 -m devcontainer -s /bin/bash \
    && adduser devcontainer sudo \
    && echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /project

# Install docker
RUN apt-get update \
    && apt-get install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common \
    && curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add - \
    && add-apt-repository "deb [arch=$(dpkg --print-architecture)] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
    && apt-get update \
    && apt-get install -y docker-ce-cli \
    && groupadd docker \
    && adduser devcontainer docker \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install latest git to support ssh commit signing
RUN add-apt-repository ppa:git-core/ppa -y \
    && apt-get update \
    && apt-get install -y git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install xdg-utils so we can open browser windows from inside the devcontainer!
RUN apt-get update \
    && apt-get install -y xdg-utils \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# From https://asdf-vm.com/guide/getting-started.html#_3-install-asdf
# Install asdf
RUN apt-get update \
    && apt-get install -y \
    # asdf dependencies
    curl git \
    # python-build dependencies
    build-essential zlib1g-dev libssl-dev libncurses5-dev libffi-dev libreadline6-dev liblzma-dev libbz2-dev libsqlite3-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
USER devcontainer
ENV ASDF_VERSION 0.10.2 
RUN git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v${ASDF_VERSION}
RUN echo ". $HOME/.asdf/asdf.sh" >> $HOME/.bashrc \
    && echo ". $HOME/.asdf/completions/asdf.bash" >> $HOME/.bashrc \
    && echo ". $HOME/.asdf/asdf.sh" >> $HOME/.bash_profile \
    && echo ". $HOME/.asdf/completions/asdf.bash" >> $HOME/.bash_profile
SHELL ["/bin/bash", "--login",  "-c"]
# NOTE: this environment variable here is to just bust the docker layer caching
# it's not being used directly for this fork https://github.com/mvgijssel/asdf-bazel/commits/master
ENV ASDF_BAZEL_PLUGIN_COMMIT d2f60922fe7094ac6c6c240fcebfbb933751e860
RUN asdf plugin-add python \
    && asdf plugin-add nodejs \
    # NOTE: using a fork here to make it work with arm64 architecture
    && asdf plugin-add bazel https://github.com/mvgijssel/asdf-bazel.git

# Installing the tool versions locally so they are picked up by vscode as well
COPY --chown=devcontainer:devcontainer tools/devcontainer/.tool-versions /home/devcontainer/.tool-versions
RUN asdf install && asdf reshim

# Install tools using languages from asdf
ENV BLACK_VERSION=22.10.0
RUN pip install --no-cache-dir black==${BLACK_VERSION}

ENV PRETTIER_VERSION=2.7.1
ENV LEFTHOOK_VERSION=1.1.3
ENV BUILDIFIER_VERSION=5.1.0
RUN npm install -g prettier@${PRETTIER_VERSION} \
    && npm install -g @evilmartians/lefthook@${LEFTHOOK_VERSION} \
    && npm install -g @bazel/buildifier@${BUILDIFIER_VERSION}

# Install platformio deps
USER root
RUN apt-get update \
    && apt-get install -y python3-venv \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install task
ENV TASK_VERSION=3.17.0
RUN case ${TARGETARCH} in \
    "amd64")  TASK_ARCH=amd64 ;; \
    "arm64")  TASK_ARCH=arm  ;; \
    esac \
    && curl --fail -L "https://github.com/go-task/task/releases/download/v{$TASK_VERSION}/task_linux_amd64.tar.gz" -o /tmp/task.tar.gz \
    && tar -xzf /tmp/task.tar.gz -C /usr/local/bin/ \
    && chmod +x /usr/local/bin/task \
    && rm /tmp/task.tar.gz \
    && apt-get update \
    && apt-get install -y netcat \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Ensure that VSCode uses bash as the default shell
SHELL ["/bin/bash", "--login",  "-c"]

# Setup the default user of the container to devcontainer
USER devcontainer

# Run some basic assertions
RUN bazel --version \
    && python --version \
    && node --version \
    && prettier --version \
    && black --version \
    && git --version \
    && asdf --version