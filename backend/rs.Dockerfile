FROM mongo:7.0.2

WORKDIR /

RUN mkdir -p /var/lib/mongo/
RUN mkdir -p /etc/mongo/keys

# COPY ./mongod.conf /etc/mongo/mongod.conf

COPY ./scripts /usr/local/bin/

EXPOSE 27017:27017

WORKDIR /etc/mongo

RUN openssl rand -base64 741 > ./keys/mongo-keyfile && \
    chmod 600 ./keys/mongo-keyfile && \
    chown mongodb:mongodb ./keys/mongo-keyfile 

ENTRYPOINT start.sh