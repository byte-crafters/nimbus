#!/bin/bash
cd /var/nimbus-app/
ls

# . ./.env.deploy
# . ./deploy-scripts/secondary/load-envs.sh
# docker-compose --file docker-compose.deploy.staging.yaml up -d --build

# POSTGRES_USER=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."POSTGRES_USER"')
# POSTGRES_PASSWORD=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."POSTGRES_PASSWORD"')
# PGADMIN_DEFAULT_EMAIL=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."PGADMIN_DEFAULT_EMAIL"')
# PGADMIN_DEFAULT_PASSWORD=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."PGADMIN_DEFAULT_PASSWORD"')
# MONGO_ADMIN_USERNAME=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."MONGO_ADMIN_USERNAME"')
# MONGO_ADMIN_PASSWORD=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."MONGO_ADMIN_PASSWORD"')
# MONGO_GUI_USERNAME=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."MONGO_GUI_USERNAME"')
# MONGO_GUI_PASSWORD=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."MONGO_GUI_PASSWORD"')
# MONGO_INITDB_ROOT_USERNAME=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."MONGO_INITDB_ROOT_USERNAME"')
# MONGO_INITDB_ROOT_PASSWORD=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."MONGO_INITDB_ROOT_PASSWORD"')
# MONGO_DATABASE_URL=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."MONGO_DATABASE_URL"')
# DATABASE_URL=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."DATABASE_URL"')
# AWS_DEFAULT_REGION=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."AWS_DEFAULT_REGION"')
# AWS_ACCOUNT_ID=$(aws secretsmanager get-secret-value --secret-id nimbus-db-credentials --query SecretString --output text | jq -r '."AWS_ACCOUNT_ID"')

export POSTGRES_USER=NIMBUS_POSTGRES_USER
export POSTGRES_PASSWORD=NIMBUS_POSTGRES_PASSWORD
export PGADMIN_DEFAULT_EMAIL=NIMBUS_PGADMIN_DEFAULT_EMAIL
export PGADMIN_DEFAULT_PASSWORD=NIMBUS_PGADMIN_DEFAULT_PASSWORD
export MONGO_ADMIN_USERNAME=NIMBUS_MONGO_ADMIN_USERNAME
export MONGO_ADMIN_PASSWORD=NIMBUS_MONGO_ADMIN_PASSWORD
export MONGO_GUI_USERNAME=NIMBUS_MONGO_GUI_USERNAME
export MONGO_GUI_PASSWORD=NIMBUS_MONGO_GUI_PASSWORD
export MONGO_INITDB_ROOT_USERNAME=NIMBUS_MONGO_INITDB_ROOT_USERNAME
export MONGO_INITDB_ROOT_PASSWORD=NIMBUS_MONGO_INITDB_ROOT_PASSWORD
export MONGO_DATABASE_URL=NIMBUS_MONGO_DATABASE_URL
export DATABASE_URL=NIMBUS_DATABASE_URL
export AWS_DEFAULT_REGION=NIMBUS_AWS_DEFAULT_REGION
export AWS_ACCOUNT_ID=NIMBUS_AWS_ACCOUNT_ID


echo $POSTGRES_USER
# export
# printenv
exit 1
# make deploy-application-start