#!/bin/bash
cd /var/nimbus-app/
./secondary/load-envs.sh
\
    docker-compose --file docker-compose.deploy.staging.yaml down -v \
    && docker-compose --file docker-compose.deploy.staging.yaml up -d
cd backend
npm install
npm run start