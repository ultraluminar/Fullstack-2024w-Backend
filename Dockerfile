FROM node:23.4-bookworm-slim

WORKDIR /app
RUN mkdir /interface

COPY /backend/package.json /backend/package-lock.json ./
RUN npm ci --production
COPY /backend .
COPY /interface /interface

RUN npx tsc

ENTRYPOINT ["npm", "start"]
