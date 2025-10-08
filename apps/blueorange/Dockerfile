# Production stage
FROM nginx:1.27.3-alpine

LABEL org.opencontainers.image.source="https://github.com/vgijssel/setup"
LABEL org.opencontainers.image.description="Blue Orange landing page application"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.title="blueorange"
LABEL org.opencontainers.image.url="https://github.com/vgijssel/setup"
LABEL org.opencontainers.image.vendor="vgijssel"

COPY dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
