#!/bin/bash
echo "start"
cd /var/nimbus-app/
echo "1. load env vars "
./secondary/load-envs.sh


echo "2. start docker containers"
\
    docker-compose --file docker-compose.deploy.staging.yaml down -v \
    && docker-compose --file docker-compose.deploy.staging.yaml up -d

sleep 10s

echo $USER
# ./before-install.sh

# curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
# . ~/.nvm/nvm.sh
# nvm install --lts

cd backend
echo "3. run npm install"

node --version
npm --version

npm install --global yarn
echo "4. install"
yarn --version
npm install
# yarn install
echo "5. start"

npm install pm2 -g
pm2 stop main
pm2 delete main
rm -rf ./backend/dist

yarn run build
yarn run start:pm2

echo "6. DONE"
exit 1