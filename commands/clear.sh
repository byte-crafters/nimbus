docker container prune --force
docker image prune --force
docker volume prune --force

docker image rm nimbus/mongo || 1
docker container rm mongo_container || 1
