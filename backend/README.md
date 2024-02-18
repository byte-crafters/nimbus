# nimbus-backend

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Запуск сервера

1. Останавливаем вс контейнеры
`docker compose down -v`
2. Запускаем все контейнеры. Необходимо подождать, пока все сервисы запустятся
`docker compose up -d --build`
3. Запускаем миграции для базы данных с пользователями
`npm run postgres:prisma`
4. Запускаем тесты
`npm run test:run`

## Запуск тестов

1. Запуск всех тестов
`npm run test:run-all`

## Запуск проверки правописания

1. Запуск проверки
`npm run lint:run`



## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## How to deploy to aws
Open an SSH client.

Locate your private key file. The key used to launch this instance is nimbus-backend-test-key.pem

Run this command, if necessary, to ensure your key is not publicly viewable.
 chmod 400 "nimbus-backend-test-key.pem"

Connect to your instance using its Public DNS:


## How to install docker in EC2
$ sudo yum update -y
% for docker
$ sudo yum install docker
<!-- for docker compose -->
wget https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) 
sudo mv docker-compose-$(uname -s)-$(uname -m) /usr/local/bin/docker-compose
sudo chmod -v +x /usr/local/bin/docker-compose
sudo usermod -a -G docker ec2-user

sudo systemctl enable docker.service
sudo systemctl start docker.service

$ sudo service docker start
$ sudo usermod -a -G docker ec2-user
sudo dnf install nodejs






[dwarfie@fedorastation nimbus]$ aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin 913580947034.dkr.ecr.eu-north-1.amazonaws.com

Unable to locate credentials. You can configure credentials by running "aws configure".
Error: Cannot perform an interactive login from a non TTY device
[dwarfie@fedorastation nimbus]$ aws configure
AWS Access Key ID [None]: 913580947034
AWS Secret Access Key [None]: ^C
[dwarfie@fedorastation nimbus]$ aws configure
AWS Access Key ID [None]: AKIA5JNNK6ZNDB2V6JVL
AWS Secret Access Key [None]: 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
Default region name [None]: 
Default output format [None]: 
[dwarfie@fedorastation nimbus]$ aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin 913580947034.dkr.ecr.eu-north-1.amazonaws.com
WARNING! Your password will be stored unencrypted in /home/dwarfie/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
[dwarfie@fedorastation nimbus]$ 




## building docker image for remote startup
docker build -t nimbus-mongo-image-for-remote ./backend --file ./backend/rs.Dockerfile 
// and then tag
docker tag nimbus-mongo-image-for-remote:latest 913580947034.dkr.ecr.eu-north-1.amazonaws.com/nimbus-image-registry:latest
// and then push
docker push 913580947034.dkr.ecr.eu-north-1.amazonaws.com/nimbus-image-registry:latest



to make cady work in browser - install intermediate cert




scp -r -i nimbus-backend-test-key.pem ../backend/** ec2-user@16.171.7.102:~/nimbus/backend
scp -i nimbus-backend-test-key.pem ../docker-* ec2-user@16.171.7.102:~/nimbus/

## on ec2 when npm install hangs (as sudo)
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap  /swapfile
swapon /swapfile
swapon  --show
free -h
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab



##
чтобы нормально отдебажить codedeploy надо запустить docker-compose без флага -d


sudo dnf install jq.



## when using node on ec2 without sudo, we get `node not found`
sudo ln -s /usr/local/bin/node /usr/bin/node
sudo ln -s /usr/local/lib/node /usr/lib/node
sudo ln -s /usr/local/bin/npm /usr/bin/npm
sudo ln -s /usr/local/bin/node-waf /usr/bin/node-waf


npm gavno, в ес2 не запускается, с yarn все норм

AccessDeniedException
User: arn:aws:sts::913580947034:assumed-role/AWSReservedSSO_SystemAdministrator_18c32b51bdf42e3b/artembell is not authorized to perform: codebuild:BatchGetBuilds on resource: arn:aws:codebuild:eu-north-1:913580947034:project/github-nimbus-build-test-project because no identity-based policy allows the codebuild:BatchGetBuilds action


docker compose -f docker-compose.local-deploy.dev.yaml up nimbus-api --build -d


в codedeploy не нужны секреты и переменные окружения, т.к. там должны быть уже сбилдженные images (in codebuild we must build images)


## building images
docker compose -f docker-compose.build.staging.yaml build nimbus-api --no-cache

docker build ./backend -t 913580947034.dkr.ecr.eu-north-1.amazonaws.com/nimbus-image-registry:nimbus_api-latest -f ./backend/build_api.Dockerfile
docker tag c50e1ffe2cb0 913580947034.dkr.ecr.eu-north-1.amazonaws.com/nimbus-image-registry:nimbus_api-latest
aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin 913580947034.dkr.ecr.eu-north-1.amazonaws.com


# иногда deploy ломается, т.к. сбрасываются credentials from aws cli
