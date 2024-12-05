docker compose --file docker-compose.local.dev.yaml down -v
docker rmi nimbus/mongo --force
docker container prune --force
docker image prune --force
docker volume prune --force

docker image rm nimbus/mongo || 1
docker container rm mongo_container || 1
