FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
RUN mkdir -p /etc/nginx/http.d \
    && sed -i 's|include /etc/nginx/conf.d/\*.conf;|include /etc/nginx/http.d/*.conf;|' /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/http.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]