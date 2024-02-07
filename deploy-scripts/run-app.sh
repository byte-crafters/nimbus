#!/bin/bash

# pwd
echo "--1"
ls $pwd
echo "--2"
# cd ./backend
docker-compose --file docker-compose.deploy.dev start caddy_reverse_proxy