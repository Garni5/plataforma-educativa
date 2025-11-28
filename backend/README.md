## ⚙️ Backend (Express + JavaScript)

### Requisitos previos

Antes de ejecutar la aplicación, asegúrate de tener instaladas las siguientes herramientas:

- **Node.js** (versión 18 o superior)  
  Puedes descargarlo desde [https://nodejs.org/](https://nodejs.org/)

- **npm** (viene con Node.js)  

- **Base de datos PostgreSQL** (o la que uses en `DATABASE_URL`)  
  Asegúrate de tener una base de datos creada y accesible.

- **Prisma CLI** (para ejecutar migraciones)  
  Se instala automáticamente con `npm install` si está en `package.json`.

---
### 0. Clonar el repositorio

Primero, clona el repositorio del proyecto desde GitHub (o tu plataforma de control de versiones):

```bash
git clone https://github.com/tu-usuario/tu-repositorio.git
````
### 1. Instalar dependencias

```bash
cd backend
npm install
````
### 2. Configurar variables de entorno
Crea un archivo .env en la carpeta backend y agrega tus variables, por ejemplo:
```bash
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_db?schema=public"
````
### 3. Ejecutar migraciones prisma
```bash
npx prisma migrate dev --name init
````
* Esto creará las tablas definidas en tu schema.prisma.
* Generará el cliente de Prisma para tu aplicación.
#### Para inspeccionar la base de datos en una interfaz web:
````
npx prisma studio
````
### 4. Ejecutar la aplicación

````
npm run dev

