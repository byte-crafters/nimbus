#!/bin/bash
cd /var/nimbus-app/
source ./deploy-scripts/secondary/load-envs.sh
docker-compose --file docker-compose.deploy.staging.yaml up -d
exit 0