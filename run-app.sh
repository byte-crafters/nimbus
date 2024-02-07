#!/bin/bash

cd ./backend
docker-compose --file docker-compose.deploy.dev start caddy_reverse_proxy