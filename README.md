# Full Stack Application

Проект полностекового веб-приложения с использованием Docker.

## Структура проекта

- `frontend/` - Frontend приложение
- `backend/` - Backend API
- `docker-compose.yml` - Docker конфигурация

## Технологии

- Frontend: Node.js
- Backend: Node.js
- База данных: PostgreSQL
- Контейнеризация: Docker

## Установка и запуск

1. Убедитесь, что у вас установлен Docker и Docker Compose

2. Клонируйте репозиторий:
```bash
git clone <your-repo-url>
cd <project-directory>
```

3. Запустите приложение:
```bash
docker-compose up
```

## Порты

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Prisma Studio: http://localhost:5555
- PostgreSQL: 5432

## Разработка

Для разработки используется режим hot-reload. Изменения в коде автоматически отражаются в запущенных контейнерах. 