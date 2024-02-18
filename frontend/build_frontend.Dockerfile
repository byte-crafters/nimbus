FROM node:alpine3.19

ENV DATABASE_URL=$DATABASE_URL
ENV MONGO_DATABASE_URL=$MONGO_DATABASE_URL

EXPOSE 3001:3000

COPY ./ /var/nimbus-frontend/
WORKDIR /var/nimbus-frontend/

RUN npm install
RUN npm run build

CMD [ "npm", "run", "start" ]