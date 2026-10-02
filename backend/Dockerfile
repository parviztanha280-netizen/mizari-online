FROM node:20-bookworm-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src
COPY .env.example ./
EXPOSE 3000
CMD ["node","src/server.js"]
