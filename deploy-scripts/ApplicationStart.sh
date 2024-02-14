#!/bin/bash
cd /var/nimbus-app/
source ./deploy-scripts/secondary/load-envs.sh
docker pull $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/nimbus-image-registry:nimbus_api-latest
docker-compose --file docker-compose.deploy.staging.yaml up -d
exit 0