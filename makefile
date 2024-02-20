.PHONY : deploy-application-start deploy-application-start-mongo deploy-application-start-services

local-prepare-dev:
	docker compose --file docker-compose.local.dev.yaml up caddy_reverse_proxy -d --build
	docker compose --file docker-compose.local.dev.yaml up postgres -d --build
	docker compose --file docker-compose.local.dev.yaml up pgadmin -d --build
	docker compose --file docker-compose.local.dev.yaml up mongo -d --build
	docker compose --file docker-compose.local.dev.yaml up mongo-express -d --build
	docker compose --file docker-compose.local.dev.yaml up nimbus-redis -d --build 

local-prepare-tests:
	docker compose --file docker-compose.local.dev.yaml up caddy_reverse_proxy -d --build
	docker compose --file docker-compose.local.dev.yaml up nimbus-api -d --build
	docker compose --file docker-compose.local.dev.yaml up nimbus-frontend -d --build
	docker compose --file docker-compose.local.dev.yaml up postgres -d --build
	docker compose --file docker-compose.local.dev.yaml up mongo -d --build
	docker compose --file docker-compose.local.dev.yaml up nimbus-redis -d --build

local-down:
	docker compose --file docker-compose.local.dev.yaml down -v
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

# mongo breaks -> use new docker compose
# multiple caddyfiles
# parametrized make commands
local-prepare-dbs:
	# docker exec mongo_container mongosh -u root -p root --eval "rs.initiate();"
	docker exec nimbus-api npm run postgres:prisma
	docker exec nimbus-api npm run mongo:prisma

local-run-api-tests:
	docker exec nimbus-api npm run test:local:run-all

local-run-db-test:
	docker exec nimbus-api npx jest --config ./jest.config.ts 

# deploy

deploy-clear:
	docker container prune --force
	docker image prune --force
	docker volume prune --force

deploy-clear-files:
	sudo rm -rf /var/nimbus-app

deploy-application-start: deploy-application-start deploy-application-start-mongo deploy-application-start-services
	deploy-application-start-mongo
	deploy-application-start-services

deploy-application-start-2:
	docker-compose --file docker-compose.deploy.staging.yaml up -d --build

deploy-application-start-mongo:
	docker-compose --file docker-compose.deploy.staging.yaml up mongo -d --build

deploy-application-start-services:
	docker-compose --file docker-compose.deploy.staging.yaml up caddy_reverse_proxy -d --build
	docker-compose --file docker-compose.deploy.staging.yaml up nimbus-api -d --build
	docker-compose --file docker-compose.deploy.staging.yaml up postgres -d --build
	docker-compose --file docker-compose.deploy.staging.yaml up pgadmin -d --build
	docker-compose --file docker-compose.deploy.staging.yaml up nimbus-redis -d --build

deploy-application-stop:
	docker-compose --file docker-compose.deploy.staging.yaml down -v 

