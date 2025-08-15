# 🍳 Recipes App - Fullstack Monorepo

Повноцінна додаток для управління рецептами з сучасною архітектурою.

## 🏗️ Структура проєкту

```
recipes-app/
├── backend/          # Node.js + Express + MongoDB API
├── frontend/         # React 19 + Redux + Vite
└── package.json      # Кореневий package.json для монорепо
```

## 🚀 Швидкий старт

### 1. Встановлення залежностей

```bash
# Встановити всі залежності (корінь + backend + frontend)
npm run install:all

# Або окремо:
npm install                    # Кореневі залежності
cd backend && npm install     # Backend залежності
cd frontend && npm install    # Frontend залежності
```

### 2. Запуск в режимі розробки

```bash
# Запустити обидва сервери одночасно
npm run dev

# Або окремо:
npm run dev:backend-only      # Тільки backend
npm run dev:frontend-only     # Тільки frontend
```

### 3. Запуск в продакшн режимі

```bash
# Збудувати обидва проєкти
npm run build

# Запустити backend
npm start

# Запустити frontend (preview)
npm run start:frontend
```

## 📋 Доступні скрипти

| Скрипт | Опис |
|--------|------|
| `npm run dev` | Запустити обидва сервери одночасно |
| `npm run dev:backend` | Запустити тільки backend |
| `npm run dev:frontend` | Запустити тільки frontend |
| `npm run build` | Збудувати обидва проєкти |
| `npm run lint` | Запустити linting для обох проєктів |
| `npm run install:all` | Встановити всі залежності |

## 🌐 Порти

- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:3000/api-docs

## 🔧 Технології

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT аутентифікація
- Cloudinary для зображень
- Swagger документація

### Frontend
- React 19
- Redux Toolkit
- Vite
- Tailwind CSS
- React Router

## 📁 Workspaces

Проєкт використовує npm workspaces для управління монорепо:

```json
{
  "workspaces": [
    "frontend",
    "backend"
  ]
}
```

## 🚨 Важливо

1. **Environment Variables**: Створіть `.env` файл в backend директорії
2. **MongoDB**: Переконайтеся, що MongoDB запущена
3. **Порти**: Перевірте, що порти 3000 та 5173 вільні

## 🐛 Розв'язання проблем

### Якщо порт зайнятий:
```bash
# Знайти процес на порту
lsof -i :3000
lsof -i :5173

# Зупинити процес
kill -9 <PID>
```

### Якщо модулі не встановлюються:
```bash
# Очистити кеш
npm cache clean --force

# Перевстановити
rm -rf node_modules package-lock.json
npm install
```
