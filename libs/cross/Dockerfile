#### BASE STAGE
#### Installs moon and system dependencies.

FROM ubuntu:22.04 AS base
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y curl git && rm -rf /var/lib/apt/lists/*

# Install moon binary
RUN curl -fsSL https://moonrepo.dev/install/moon.sh | bash
ENV PATH="/root/.moon/bin:$PATH"

# Set cross-compilation marker to prevent infinite loops
ENV CROSS_MOON=true

#### SKELETON STAGE
#### Scaffolds repository skeleton structures.

FROM base AS skeleton

ARG CROSS_MOON_PROJECT_ID

# Copy entire repository and scaffold
COPY . .
RUN moon docker scaffold $CROSS_MOON_PROJECT_ID

#### BUILD STAGE
#### Builds the project.

FROM base AS build

ARG CROSS_MOON_PROJECT_ID
ARG CROSS_MOON_TASK_ID

# Copy workspace configs
COPY --from=skeleton /app/.moon/docker/workspace .

# Install dependencies
# RUN moon docker setup

# Copy project sources
COPY --from=skeleton /app/.moon/docker/sources .

# Build the project
RUN moon run $CROSS_MOON_PROJECT_ID:$CROSS_MOON_TASK_ID
