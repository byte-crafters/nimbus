if [[ -z "${NIMBUS_DEV_ENV_OS}" ]]; then
    echo "Set 'NIMBUS_DEV_ENV_OS' variable to 'win' if you are running services on Windows. Default value is 'linux'"
    ENV_OS="linux"
else
    ENV_OS="${NIMBUS_DEV_ENV_OS}"
fi

docker compose --file docker-compose.local.dev.yaml build --no-cache mongo
docker compose --file docker-compose.local.dev.yaml up postgres -d --build
docker compose --file docker-compose.local.dev.yaml up pgadmin -d --build
docker compose --file docker-compose.local.dev.yaml up mongo -d --build
docker compose --file docker-compose.local.dev.yaml up mongo-express -d --build
docker compose --file docker-compose.local.dev.yaml up nimbus-redis -d --build

if [[ "${ENV_OS}" = "linux" ]]; then
    docker compose --file docker-compose.local.dev.yaml up caddy_reverse_proxy -d --build
else 
    caddy stop
    caddy start --config ./backend/caddy/Caddyfile
fi

TRY_COUNT=0
TRY_CONNECT_CODE=-1
until [ $TRY_CONNECT_CODE -eq 0 -o $TRY_COUNT -eq 10 ]; do
    docker exec mongo_container mongosh -u root -p root --eval "rs.initiate();"
    TRY_CONNECT_CODE=$?
    ((TRY_COUNT = TRY_COUNT + 1))
    echo "Waiting for mongo to start up ... ($TRY_COUNT s) code=$TRY_CONNECT_CODE"
    sleep 1
done

npm run be:migrate

GREEN='\033[0;32m'
NC='\033[0m'
echo -e "${GREEN}All services are up. Happy coding!${NC}"
