FROM node:22.14-slim as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base as builder

WORKDIR /app

COPY . .

RUN pnpm install
RUN pnpm build

EXPOSE 4173

CMD ["pnpm", "run", "serve"]