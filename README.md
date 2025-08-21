# 🍳 Recipes App - Fullstack Monorepo

Full-featured recipe management application with modern architecture.

## 🏗️ Project Structure

```
recipes-fullstack/
├── backend/          # Node.js + Express + MongoDB API
├── frontend/         # React 19 + Redux + Vite
└── package.json      # Root package.json for monorepo
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install all dependencies (root + backend + frontend)
npm run install:all

# Or separately:
npm install                    # Root dependencies
cd backend && npm install     # Backend dependencies
cd frontend && npm install    # Frontend dependencies
```

### 2. Development Mode

```bash
# Start both servers simultaneously
npm run dev

# Or separately:
npm run dev:backend           # Backend only
npm run dev:frontend          # Frontend only
```

### 3. Production Mode

```bash
# Build both projects
npm run build

# Start backend
npm start

# Start frontend (preview)
npm run start:frontend
```

## 📋 Available Scripts

| Script               | Description                       |
| -------------------- | --------------------------------- |
| `npm run dev`        | Start both servers simultaneously |
| `npm run dev:backend`| Start backend only                |
| `npm run dev:frontend`| Start frontend only               |
| `npm run build`      | Build both projects               |
| `npm run lint`       | Run linting for both projects     |
| `npm run lint:fix`   | Fix linting issues                |
| `npm run format`     | Format code with Prettier         |
| `npm run install:all`| Install all dependencies          |

## 🌐 Ports

- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:3000/api-docs

## 🔧 Technologies

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication
- Cloudinary for images
- Swagger documentation

### Frontend
- React 19
- Redux Toolkit
- Vite
- Tailwind CSS
- React Router

## 📁 Workspaces

Project uses npm workspaces for monorepo management:

```json
{
  "workspaces": ["frontend", "backend"]
}
```

## 🚨 Important

1. **Environment Variables**: Create `.env` file in backend directory
2. **MongoDB**: Make sure MongoDB is running
3. **Ports**: Check that ports 3000 and 5173 are free

## 🐛 Troubleshooting

### If port is occupied:

```bash
# Find process on port
lsof -i :3000
lsof -i :5173

# Stop process
kill -9 <PID>
```

### If modules don't install:

```bash
# Clear cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 Code Quality

- **ESLint**: Code linting with modern configuration
- **Prettier**: Code formatting
- **Husky**: Git hooks (optional)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
