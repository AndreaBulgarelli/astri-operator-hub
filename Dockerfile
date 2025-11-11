# Build the React/Vite app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci || npm i
COPY . .
ARG VITE_WEBHOOK_WS_URL=ws://localhost:8082/ws
ARG VITE_OPAPI_BASE_URL=http://localhost:8090
ENV VITE_WEBHOOK_WS_URL=${VITE_WEBHOOK_WS_URL}
ENV VITE_OPAPI_BASE_URL=${VITE_OPAPI_BASE_URL}
RUN npm run build || npm run build --if-present

FROM nginx:1.25-alpine
# App bundle
COPY --from=build /app/dist /usr/share/nginx/html
# Also expose the loose helper pages (like opsb.html) at the root if present
COPY opsb.html /usr/share/nginx/html/opsb.html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
