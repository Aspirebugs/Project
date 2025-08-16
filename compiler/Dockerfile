FROM node:24-alpine
WORKDIR /compiler

RUN apk update && apk add --no-cache g++

COPY . .
RUN npm install
EXPOSE 4001

CMD ["node","index.js"]