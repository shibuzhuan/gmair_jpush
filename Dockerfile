FROM node:16 AS test-build-stage

WORKDIR /usr/src/app

COPY . .

ENV CI=true

RUN npm config set registry https://registry.npm.taobao.org \
    && npm ic \
    && npm run build

FROM nginx

WORKDIR /usr/share/nginx/html

COPY --from=test-build-stage /usr/src/app/build .