FROM node:20-alpine

RUN npm install -g pm2

WORKDIR /app/DBManager/

COPY ./DBManager/package*.json /app/DBManager/

RUN npm install

COPY ./DBManager /app/DBManager

RUN npm run build

EXPOSE 3000

CMD ["pm2-runtime", "ecosystem.config.js"]