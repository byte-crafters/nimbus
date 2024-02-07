#!/bin/bash
cd /var/nimbus-app/
docker-compose --file docker-compose.deploy.dev.yaml start caddy_reverse_proxy