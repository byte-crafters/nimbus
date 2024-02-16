.PHONY : deploy-application-start deploy-application-start-mongo deploy-application-start-services

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
	deploy-application-start-mongo
	sleep 10s
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
	docker-compose --file docker-compose.deploy.staging.yaml up mongo-express -d --build
	docker-compose --file docker-compose.deploy.staging.yaml up nimbus-redis -d --build

deploy-application-stop:
	docker-compose --file docker-compose.deploy.staging.yaml down -v 