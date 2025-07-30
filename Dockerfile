# --- Stage 1: Build Frontend ---
FROM node:20 AS build
WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем весь проект и билдим фронтенд
COPY . .
RUN npm run build

# --- Stage 2: Run Backend ---
FROM node:20
WORKDIR /app

# Устанавливаем только prod-зависимости
COPY package*.json ./
RUN npm install --omit=dev

# Копируем серверный код + статические файлы фронтенда
COPY --from=build /app/dist ./dist
COPY . .

# Переменные окружения (лучше переопределять при запуске)
ENV PORT=3001

# Экспонируем порт
EXPOSE 3001

# Запуск сервера
CMD ["node", "index.js"]
