local-up:
	docker compose --file docker-compose.local-deploy.dev.yaml up -d --build 
	docker ps

local-down:
	docker compose --file docker-compose.local-deploy.dev.yaml down -v
	docker ps

local-clear:
	docker container prune --force
	docker image prune --force
	docker volume prune --force

local-remove-nginx:
	sudo systemctl disable nginx
	sudo systemctl stop nginx

local-check:
	curl localhost:3000/health

local-run-api-tests:
	docker exec nimbus-api npm run postgres:prisma
	docker exec nimbus-api npm run mongo:prisma
	docker exec nimbus-api npm run test:local:run-all

local-test-db:
	docker exec nimbus-api npm run postgres:prisma
	docker exec nimbus-api npm run mongo:prisma
	docker exec nimbus-api npx jest --config ./jest.config.ts 

# deploy

deploy-application-start:
	. ./deploy-scripts/secondary/load-envs.sh
	echo $POSTGRES_USER
	echo $POSTGRES_PASSWORD
	echo $PGADMIN_DEFAULT_EMAIL
	echo $PGADMIN_DEFAULT_PASSWORD
	echo $MONGO_ADMIN_USERNAME
	echo $MONGO_ADMIN_PASSWORD
	echo $MONGO_GUI_USERNAME
	echo $MONGO_GUI_PASSWORD
	echo $MONGO_INITDB_ROOT_USERNAME
	echo $MONGO_INITDB_ROOT_PASSWORD
	echo $MONGO_DATABASE_URL
	echo $DATABASE_URL
	echo $AWS_DEFAULT_REGION
	echo $AWS_ACCOUNT_ID
	docker-compose --file docker-compose.deploy.staging.yaml up -d --build
	exit 1

deploy-application-stop:
	docker-compose --file docker-compose.deploy.staging.yaml down -v 
	exit 0