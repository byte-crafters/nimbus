#!/bin/bash
cd /var/nimbus-app/
# source ./deploy-scripts/secondary/load-envs.sh
docker pull 913580947034.dkr.ecr.eu-north-1.amazonaws.com/nimbus-image-registry:nimbus_api-latest
docker-compose --file docker-compose.deploy.staging.yaml up -d
exit 1