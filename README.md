# test-app-auth

Веб-приложение для аутентификации на NestJS + Next.js с Docker.

## 🚀 Быстрый старт через Docker (рекомендуется)

1. **Клонируйте репозиторий:**
```bash
git clone https://github.com/7RIPL/test-app-auth.git
cd test-app-auth
```

2. **Запустите приложение:**
```bash
docker compose up -d --build
```

3. **Откройте в браузере:**
- 🌐 Web: http://localhost:3001
- 🔌 API: http://localhost:3000
- 📊 Swagger: http://localhost:3000/api
- 🗄️ PgAdmin: http://localhost:5050 (admin@example.com / admin123)

**Готово!** Все работает без дополнительных настроек.

### Регистрация PostgreSQL в PgAdmin (первый запуск):

1. Откройте http://localhost:5050 и войдите
2. Правой кнопкой на "Servers" → "Register" → "Server"
3. Вкладка **Connection**:
   - Host: `postgres` (не localhost!)
   - Port: `5432`
   - Database: `authdb`
   - Username: `authuser`
   - Password: `authpass`
   - ✅ "Save password"

---

## 💻 Локальный запуск (без Docker)

### Требования:
- Node.js 20+
- PostgreSQL 15+ (или запустите только БД через Docker: `docker compose up -d postgres pgadmin`)

### Настройка сервера (NestJS):

1. **Установите зависимости:**
```bash
cd server
npm install
```

2. **Создайте `server/.env`:**
```ini
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=authuser
DATABASE_PASSWORD=authpass
DATABASE_NAME=authdb
JWT_SECRET=dev_secret_key_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

3. **Запустите:**
```bash
npm run start:dev
```

Сервер: http://localhost:3000

### Настройка веб-приложения (Next.js):

1. **Установите зависимости:**
```bash
cd web
npm install
```

2. **Создайте `web/.env.local`:**
```ini
NEXT_PUBLIC_API_URL=http://localhost:3000
PORT=3001
```

3. **Запустите:**
```bash
npm run dev
```

Веб: http://localhost:3001

---

## 🗄️ Подключение к БД

**Параметры подключения:**
- Host: `localhost` (локально) или `postgres` (в Docker сети)
- Port: `5432`
- Database: `authdb`
- Username: `authuser`
- Password: `authpass`

**PgAdmin:** http://localhost:5050 (admin@example.com / admin123)

---

## 📝 Docker команды

```bash
# Запуск
docker compose up -d --build

# Остановка
docker compose down

# Логи
docker compose logs -f

# Полная пересборка
docker compose down -v
docker compose up -d --build
```

---

## 🔐 API Endpoints

**Регистрация:**
```http
POST /auth/register
{
  "login": "user123",
  "email": "user@example.com",
  "password": "Password123",
  "displayName": "User Name"
}
```

**Вход:**
```http
POST /auth/login
{
  "loginOrEmail": "user123",
  "password": "Password123"
}
```

**Профиль (требует Bearer токен):**
```http
GET /users/me
PATCH /users/me
```

📖 Полная документация: http://localhost:3000/api

---

## 📚 Технологии

- **Backend:** NestJS, TypeORM, PostgreSQL, JWT
- **Frontend:** Next.js 14, React Hook Form, Tailwind CSS
- **Infrastructure:** Docker, Docker Compose
