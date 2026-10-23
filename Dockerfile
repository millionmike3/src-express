FROM node:18

WORKDIR /app

COPY package*.json ./

# Install dependencies AND TypeScript globally
RUN npm install
RUN npm install -g typescript

COPY . .

# Build TypeScript
RUN tsc

EXPOSE 3000

CMD ["node", "dist/index.js"]
