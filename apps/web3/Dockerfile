# Build context = repo root:  docker build -f apps/web3/Dockerfile -t dreamdot-web3 .
FROM node:20-bookworm-slim AS build
WORKDIR /app

COPY . .

RUN npm ci --ignore-scripts
RUN npm run build --workspace=@repo/database-mongo

FROM node:20-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=3005
COPY --from=build /app /app
EXPOSE 3005
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||3005)+'/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"
USER node
CMD ["node", "apps/web3/server.js"]
