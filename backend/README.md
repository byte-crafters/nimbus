# nimbus-backend

## Запуск сервера

1. Останавливаем вс контейнеры
`docker compose down -v`
2. Запускаем все контейнеры
`docker compose up -d --build`
3. Запускаем миграции для базы данных с пользователями
`npm run postgres:prisma`
4. Запускаем тесты
`npm run test:run`