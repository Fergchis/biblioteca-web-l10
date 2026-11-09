# biblioteca-web: dos etapas. Node compila el Angular; nginx sirve lo compilado.
FROM node:24-alpine AS compilar
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx ng build

FROM nginx:1.29-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=compilar /app/dist/biblioteca-web/browser /usr/share/nginx/html
EXPOSE 80
