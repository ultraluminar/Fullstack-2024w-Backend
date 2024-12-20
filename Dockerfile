FROM node:23.4-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
COPY . .

ENTRYPOINT ["npm", "start"]
