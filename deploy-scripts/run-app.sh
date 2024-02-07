#!/bin/bash

# pwd
echo "--1"
ls $pwd
echo "--2"
ls /var/nimbus-app/
echo "--3"
cd /var/nimbus-app/
# cd ./backend
docker-compose --file docker-compose.deploy.dev start caddy_reverse_proxy