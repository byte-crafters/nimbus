#!/bin/sh
delay.sh &
docker-entrypoint.sh mongod --replSet rs0 --keyFile /etc/mongo/keys/mongo-keyfile --bind_ip_all