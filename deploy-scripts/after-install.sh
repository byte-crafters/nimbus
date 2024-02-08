#!/bin/bash
echo "start"
cd /var/nimbus-app/
echo "1. load env vars "
./secondary/load-envs.sh
echo "2. start docker containers"
\
    docker-compose --file docker-compose.deploy.staging.yaml down -v \
    && docker-compose --file docker-compose.deploy.staging.yaml up -d
echo $USER
# ./before-install.sh

# curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
. ~/.nvm/nvm.sh
nvm install --lts

cd backend
echo "3. run npm install"
# node --version
npm --version
echo "4. start"
# npm install
npm run start