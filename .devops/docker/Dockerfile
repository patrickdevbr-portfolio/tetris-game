FROM node:22.17.0-alpine

WORKDIR /app

COPY .next/standalone ./
COPY .next/static ./.next/static/
COPY public ./.next/public
COPY public ./public

RUN chown 1001:1001 /app  -R
USER 1001

EXPOSE 3000
ENV PORT 3000

ENTRYPOINT ["node", "/app/server.js"]
