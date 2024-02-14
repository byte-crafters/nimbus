#!/bin/bash
cd /var/nimbus-app/
source ./deploy-scripts/secondary/load-envs.sh
# exit 1
# docker pull $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/nimbus-image-registry:nimbus_api-latest
docker-compose --file docker-compose.deploy.staging.yaml up -d --build
exit 0