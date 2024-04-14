docker compose --file docker-compose.local.dev.yaml down -v
docker rmi nimbus/mongo --force
docker container prune --force
docker image prune --force
docker volume prune --force
