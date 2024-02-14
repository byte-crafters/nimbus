#!/bin/bash
echo "start"
cd /var/nimbus-app/
echo "1. load env vars "

echo "2. start docker containers"
docker-compose --file docker-compose.deploy.staging.yaml down -v \
    && docker-compose --file docker-compose.deploy.staging.yaml up -d

echo "3. run npm install"
echo "4. install"
echo "5. start"
echo "6. DONE"
exit 0