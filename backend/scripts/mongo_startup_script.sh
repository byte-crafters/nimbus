# sleep 10000
(sleep 5; mongosh -u root -p root --eval "rs.initiate();") & 
# if login into mongosh is successful, then root user was created and we can run rs.iniate()
echo $?


# ls /etc/mongo/keys

# tail -f /dev/null