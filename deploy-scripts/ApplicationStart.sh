#!/bin/bash
cd /var/nimbus-app/

POSTGRES_USER=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."POSTGRES_USER"')
POSTGRES_PASSWORD=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."POSTGRES_PASSWORD"')
PGADMIN_DEFAULT_EMAIL=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."PGADMIN_DEFAULT_EMAIL"')
PGADMIN_DEFAULT_PASSWORD=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."PGADMIN_DEFAULT_PASSWORD"')
MONGO_ADMIN_USERNAME=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."MONGO_ADMIN_USERNAME"')
MONGO_ADMIN_PASSWORD=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."MONGO_ADMIN_PASSWORD"')
MONGO_GUI_USERNAME=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."MONGO_GUI_USERNAME"')
MONGO_GUI_PASSWORD=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."MONGO_GUI_PASSWORD"')
MONGO_INITDB_ROOT_USERNAME=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."MONGO_INITDB_ROOT_USERNAME"')
MONGO_INITDB_ROOT_PASSWORD=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."MONGO_INITDB_ROOT_PASSWORD"')
MONGO_DATABASE_URL=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."MONGO_DATABASE_URL"')
DATABASE_URL=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."DATABASE_URL"')
AWS_DEFAULT_REGION=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."AWS_DEFAULT_REGION"')
AWS_ACCOUNT_ID=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."AWS_ACCOUNT_ID"')

NODE_TLS_REJECT_UNAUTHORIZED=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."NODE_TLS_REJECT_UNAUTHORIZED"')
NIMBUS_API_HOST=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."NIMBUS_API_HOST"')
NEXT_PUBLIC_NIMBUS_API_HOST=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."NEXT_PUBLIC_NIMBUS_API_HOST"')


export POSTGRES_USER=$POSTGRES_USER
export POSTGRES_PASSWORD=$POSTGRES_PASSWORD
export PGADMIN_DEFAULT_EMAIL=$PGADMIN_DEFAULT_EMAIL
export PGADMIN_DEFAULT_PASSWORD=$PGADMIN_DEFAULT_PASSWORD
export MONGO_ADMIN_USERNAME=$MONGO_ADMIN_USERNAME
export MONGO_ADMIN_PASSWORD=$MONGO_ADMIN_PASSWORD
export MONGO_GUI_USERNAME=$MONGO_GUI_USERNAME
export MONGO_GUI_PASSWORD=$MONGO_GUI_PASSWORD
export MONGO_INITDB_ROOT_USERNAME=$MONGO_INITDB_ROOT_USERNAME
export MONGO_INITDB_ROOT_PASSWORD=$MONGO_INITDB_ROOT_PASSWORD
export MONGO_DATABASE_URL=$MONGO_DATABASE_URL
export DATABASE_URL=$DATABASE_URL
export AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION
export AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID

export NODE_TLS_REJECT_UNAUTHORIZED=$NODE_TLS_REJECT_UNAUTHORIZED
export NIMBUS_API_HOST=$NIMBUS_API_HOST
export NEXT_PUBLIC_NIMBUS_API_HOST=$NEXT_PUBLIC_NIMBUS_API_HOST

# make deploy-application-start
# make deploy-application-start

docker-compose --file docker-compose.deploy.staging.yaml up caddy_reverse_proxy -d --build
docker-compose --file docker-compose.deploy.staging.yaml up nimbus-api -d --build
docker-compose --file docker-compose.deploy.staging.yaml up postgres -d --build
docker-compose --file docker-compose.deploy.staging.yaml up nimbus-redis -d --build
docker-compose --file docker-compose.deploy.staging.yaml up mongo -d --build
docker-compose --file docker-compose.deploy.staging.yaml up nimbus-frontend -d --build
# docker-compose --file docker-compose.deploy.staging.yaml up pgadmin -d --build
# docker-compose --file docker-compose.deploy.staging.yaml up mongo-express -d --build

sleep 30s
# docker exec mongo_container mongosh -u root -p root --eval "rs.initiate();"
# docker stats --no-stream

exit 0