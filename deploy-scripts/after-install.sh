#!/bin/bash
echo "start"
cd /var/nimbus-app/
echo "1. load env vars "
./secondary/load-envs.sh
echo "2. start docker containers"
\
    docker-compose --file docker-compose.deploy.staging.yaml down -v \
    && docker-compose --file docker-compose.deploy.staging.yaml up -d
cd backend
echo $USER
echo "3. run npm install"
# node --version
# npm --version
sudo npm install
sudo npm run start