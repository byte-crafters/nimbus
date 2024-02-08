#!/bin/bash
cd /var/nimbus-app/
docker-compose --file docker-compose.local-deploy.dev.yaml down -v \
    && docker-compose --file docker-compose.local-deploy.dev.yaml up caddy_reverse_proxy -d
cd backend
npm install
npm run start