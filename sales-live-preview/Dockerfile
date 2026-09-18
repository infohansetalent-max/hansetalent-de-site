FROM node:22-bookworm-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends unzip ca-certificates && rm -rf /var/lib/apt/lists/*
COPY chunk*.b64 /tmp/bundle/
RUN cat /tmp/bundle/chunk*.b64 | tr -d '\n\r' | base64 -d > /tmp/app.zip \
 && unzip -q /tmp/app.zip -d /tmp/unpacked \
 && cp -a /tmp/unpacked/hansetalent-live/. /app/ \
 && rm -rf /tmp/app.zip /tmp/unpacked /tmp/bundle
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node","server/index.mjs"]
