FROM node:20-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build


# Instalar serve para servir el build
RUN npm install -g serve

EXPOSE 4173

CMD ["serve", "-s", "dist", "-l", "4173"]