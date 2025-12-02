# Imagen base
FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install 

# Copiar el resto del proyecto
COPY . .

# Generar cliente de Prisma
RUN npx prisma generate

# Exponer puerto
ENV PORT=5000
EXPOSE 5000

# Ejecutar migraciones y levantar servidor en modo desarrollo
CMD ["sh", "-c", "npx prisma migrate dev --name init && npm run dev"] 