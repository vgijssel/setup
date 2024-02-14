FROM homeassistant/home-assistant:2024.2

RUN wget -O /usr/local/bin/wait-for https://github.com/eficode/wait-for/releases/download/v2.2.3/wait-for && chmod +x /usr/local/bin/wait-for

ADD configuration.yaml /config/configuration.yaml
ADD automations.yaml /config/automations.yaml
ADD custom_components /config/custom_components

# NOTE: this is a hack to bypass onboarding copied from here
# https://github.com/home-assistant/core/issues/35696
ADD onboarding /config/.storage/onboarding