# ⚙️ React + TypeScript + Vite

### Requisitos previos

Antes de ejecutar la aplicación, asegúrate de tener instaladas las siguientes herramientas:

- **Node.js** (versión 18 o superior)  
  Puedes descargarlo desde [https://nodejs.org/](https://nodejs.org/)

- **npm** (viene con Node.js)

### 0. Clonar el repositorio

Primero, clona el repositorio del proyecto desde GitHub (o tu plataforma de control de versiones):

```bash
git clone https://github.com/tu-usuario/tu-repositorio.git
```

### 1. Instalar dependencias

```bash
cd Frontend
npm install
```

### 4. Ejecutar la aplicación

```
npm run dev
```

---

## La estructura de carpetas

```
src/
├── app/
│   ├── App.tsx                   # Componente raíz
│   └── router/
│       ├── AppRouter.tsx         # Rutas globales
│       └── ProtectedRoute.tsx    # Ruta protegida por login
│
├── core/                        # Config global y assets reutilizables
│   ├── assets/
│   │   ├── css/
│   │   │   └── App.css
│   │   ├── images/
│   │   │   └── logo.png
│   │   └── icons/
│   │       └── stock-icon.svg
│   └── config/
│       └── env.ts               # Constantes y variables globales
│
├── layouts/                     # Layouts reutilizables
│   ├── Header.tsx
│   └── FullLayout.tsx           # Sidebar + Header + Footer
│
├── pages/                       # Páginas principales
│   ├── HomePage/
│   │   └── HomePage.tsx
│   └── DashboardPage/
│       └── DashboardPage.tsx
│
├── features/                    # Cada feature independiente
│   ├── feature1/
│   │   ├── api/
│   │   │   └── productsService.ts
│   │   ├── components/
│   │   │   ├── ProductCard.tsx
│   │   │   └── ProductList.tsx
│   │   ├── hooks/
│   │   │   └── useProducts.ts
│   │   ├── types/
│   │   │   └── product.types.ts
│   │   └── assets/               # Assets específicos de la feature
│   │       └── product-icon.svg
│   │
│   ├── feature2/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── assets/
│   │
├── entities/                    # Modelos de negocio reutilizables
│   ├── Product/
│   │   └── index.ts
│   ├── Stock/
│   └── Supplier/
│
├── shared/                      # Componentes, widgets y utilidades compartidas
│   ├── ui/
│   │   └── widgets/
│   │       ├── Button.tsx
│   │       ├── Table.tsx
│   │       └── UserCard.tsx
│   ├── hooks/
│   │   └── useMediaQuery.ts
│   ├── api/
│   │   └── httpClient.ts
│   └── utils/
│       └── formatDate.ts
│
├── main.tsx                     # Entry point
└── index.html                   # HTML base

```
