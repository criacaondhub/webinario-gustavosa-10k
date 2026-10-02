# Build da landing page (Vite) → servida pelo nginx em /protocolo-10k/
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
# A página é publicada em https://dr.gustavosa.com.br/protocolo-10k → os arquivos ficam nessa subpasta
COPY --from=build /app/dist /usr/share/nginx/html/protocolo-10k
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
