# Build context = repo root:  docker build -f apps/chat/Dockerfile -t dreamdot-chat .
FROM node:20-bookworm-slim AS build
WORKDIR /app

# .dockerignore keeps node_modules / .next / apps/web build artefacts out of the context.
COPY . .

RUN npm ci --ignore-scripts
RUN npm run build --workspace=@repo/database-mongo \
 && npm run build --workspace=chat-server

FROM node:20-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=3001
COPY --from=build /app /app
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||3001)+'/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"
USER node
CMD ["node", "apps/chat/server.js"]
