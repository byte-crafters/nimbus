update:
	cd ./frontend && npm install
	cd ./backend && npm install

clear:
	./commands/clear.sh && ./commands/down.sh

run:
	./commands/rewind.sh

nimbus: run
nimbus-restart: clear run

# nimbus-win: run
# nimbus-restart-win: clear run

# Running services in docker
local-start-debug-main-services-docker: 
	docker compose --file docker-compose.local.dev.yaml up postgres -d --build
	docker compose --file docker-compose.local.dev.yaml up pgadmin -d --build
	docker compose --file docker-compose.local.dev.yaml up mongo -d --build --force-recreate
	docker compose --file docker-compose.local.dev.yaml up mongo-express -d --build
	docker compose --file docker-compose.local.dev.yaml up nimbus-redis -d --build
	
local-start-all-services-docker: 
	./rewind.sh

# Start services for debugging frontend and backend
caddy-run-locally:
	caddy start --config ./backend/caddy/Caddyfile

caddy-reload-locally:
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