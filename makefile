local-remove: local-down local-clear

local-down:
	docker compose --file docker-compose.local.dev.yaml down -v
	docker ps

local-clear:
	docker container prune --force
	docker image prune --force
	docker volume prune --force

# Running services in docker
run-caddy-docker:
	docker compose --file docker-compose.local.dev.yaml up caddy_reverse_proxy -d --build

run-postgres-docker:
	docker compose --file docker-compose.local.dev.yaml up postgres -d --build

run-postgres-gui-docker:
	docker compose --file docker-compose.local.dev.yaml up pgadmin -d --build

run-mongo-docker:
	docker compose --file docker-compose.local.dev.yaml up mongo -d --build

run-mongo-gui-docker:
	docker compose --file docker-compose.local.dev.yaml up mongo-express -d --build

run-redis-docker:
	docker compose --file docker-compose.local.dev.yaml up nimbus-redis -d --build 

run-api-docker:
	docker compose --file docker-compose.local.dev.yaml up nimbus-api -d --build 

run-frontend-docker:
	docker compose --file docker-compose.local.dev.yaml up nimbus-frontend -d --build 

local-start-debug-main-services-docker: run-postgres-docker run-postgres-gui-docker run-mongo-docker run-mongo-gui-docker run-redis-docker
	
local-start-all-services-docker: run-postgres-docker run-postgres-gui-docker run-mongo-docker run-mongo-gui-docker run-redis-docker run-api-docker run-frontend-docker


# Start services for debugging frontend and backend
win-run-caddy:
	caddy start --config ./backend/caddy/Caddyfile

win-caddy-reload:
	caddy reload --config ./backend/caddy/Caddyfile

start-dev: local-start-debug-main-services-docker run-caddy-docker

win-start-dev: local-start-debug-main-services-docker win-run-caddy

restart-dev: local-remove start-dev

win-restart-dev: win-caddy-reload local-remove win-start-dev

# Run tests
local-prepare-tests: local-start-all-services-docker run-caddy-docker

win-local-prepare-tests: local-start-all-services-docker win-run-caddy
	


local-remove-nginx:
	sudo systemctl disable nginx
	sudo systemctl stop nginx

local-check:
	curl localhost:3000/health

local-prepare-dbs:
	# docker exec mongo_container mongosh -u root -p root --eval "rs.initiate();"
	docker exec nimbus-api npm run postgres:prisma
	docker exec nimbus-api npm run mongo:prisma

local-run-api-tests:
	docker exec nimbus-api npm run test:local:run-all

local-run-db-test:
	docker exec nimbus-api npx jest --config ./jest.config.ts 

# Deploy

deploy-clear:
	docker container prune --force
	docker image prune --force
	docker volume prune --force

deploy-clear-files:
	sudo rm -rf /var/nimbus-app

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