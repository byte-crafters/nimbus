#!/bin/bash
cd /var/nimbus-app/
docker-compose --file docker-compose.deploy.staging.yaml up -d
exit 0