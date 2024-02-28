FROM mongo:7.0.2

WORKDIR /

RUN mkdir -p /var/lib/mongo/
RUN mkdir -p /etc/mongo/keys

# COPY ./mongod.conf /etc/mongo/mongod.conf

COPY ./scripts /usr/local/bin/
RUN chmod +x ./usr/local/bin/

EXPOSE 27017:27017

WORKDIR /etc/mongo

RUN openssl rand -base64 741 > ./keys/mongo-keyfile && \
    chmod 600 ./keys/mongo-keyfile && \
    chown mongodb:mongodb ./keys/mongo-keyfile

# ENTRYPOINT ls /usr/local/bin
# ENTRYPOINT start.sh
# ENTRYPOINT /usr/local/bin/start.sh
# ENTRYPOINT ["start.sh"]
# ENTRYPOINT [ "tail -f /dev/null" ]

CMD [ "start.sh" ]