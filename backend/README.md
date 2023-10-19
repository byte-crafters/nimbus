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