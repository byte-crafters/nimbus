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