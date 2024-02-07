#!/bin/bash
cd /var/nimbus-app/
docker-compose --file docker-compose.deploy.dev.yaml down -v && docker-compose --file docker-compose.deploy.dev.yaml up -d