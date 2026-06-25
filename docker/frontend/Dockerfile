FROM node:22-alpine

WORKDIR /app

COPY front/package*.json ./
RUN npm ci

COPY front/ .

EXPOSE 4200

CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--poll", "500"]
