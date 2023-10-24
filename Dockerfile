# Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Production
FROM node:18-alpine AS production
ENV NODE_ENV production
WORKDIR /app
COPY --from=builder ./app/dist ./dist
COPY package*.json .
RUN npm install --production

# NGINX
FROM nginx:alpine
ENV NODE_ENV production
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=production ./app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]