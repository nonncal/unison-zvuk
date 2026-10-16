FROM public.ecr.aws/docker/library/node:24.20.0-alpine AS build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
ENV VITE_APP_MODE=api VITE_API_ORIGIN=""
RUN npm run build

FROM public.ecr.aws/docker/library/nginx:1.30.6-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY infra/nginx/templates/ /etc/nginx/templates/
COPY --from=build /app/dist /usr/share/nginx/html
ENV NGINX_ENVSUBST_FILTER="^(S3_BUCKET|APP_HOST)$"
EXPOSE 8080 8443
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=10 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/nginx-health || exit 1
