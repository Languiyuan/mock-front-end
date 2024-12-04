# build stage
FROM node:20.14.0-alpine as build-stage

WORKDIR /app

# COPY package.json ./

# RUN npm config set registry https://registry.npmmirror.com/

# RUN npm install -g pnpm

# RUN pnpm install

COPY dist ./dist
COPY nginx.conf ./

# RUN pnpm run build

# production stage
FROM nginx:stable-perl as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 9704

CMD ["nginx", "-g", "daemon off;"]
