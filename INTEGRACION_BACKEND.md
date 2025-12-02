# ProfesorEditorPage - Integración con Backend

## ✅ Cambios Realizados

### 1. **Backend - Modelos de Datos (Prisma)**
Se agregaron dos nuevas tablas:
- **`topico`**: Almacena los temas/unidades de cada profesor
- **`recurso`**: Almacena los recursos (videos, documentos, etc.) de cada tópico

### 2. **Backend - Nuevos Endpoints**

#### Tópicos
- `GET /api/protected/topicos` - Obtener todos los tópicos del profesor
- `POST /api/protected/topicos` - Crear nuevo tópico
- `PUT /api/protected/topicos/:id_topico` - Actualizar tópico
- `DELETE /api/protected/topicos/:id_topico` - Eliminar tópico

#### Recursos
- `GET /api/protected/topicos/:id_topico/recursos` - Obtener recursos de un tópico
- `POST /api/protected/topicos/:id_topico/recursos` - Agregar recurso a un tópico
- `DELETE /api/protected/topicos/:id_topico/recursos/:id_recurso` - Eliminar recurso
- `PUT /api/protected/recursos/:id_recurso/transcripcion` - Toggle transcripción

### 3. **Frontend - ProfesorEditorPage**
Actualizado para:
- Cargar tópicos desde el backend al iniciar (`useEffect`)
- Persistir nuevos tópicos en BD
- Persistir nuevos recursos en BD
- Eliminar tópicos/recursos de BD
- Toggle de transcripción en videos
- Manejo de errores y estados de carga

## 🚀 Cómo Funciona

### Flujo de Usuario

1. **Profesor inicia sesión** → Se guarda token JWT en `localStorage`
2. **Entra a ProfesorEditorPage** → Se cargan sus tópicos desde `/api/protected/topicos`
3. **Crea nuevo tópico** → POST a `/api/protected/topicos` → Aparece en la lista
4. **Selecciona un tópico** → Muestra sus recursos
5. **Agrega recurso** → POST a `/api/protected/topicos/:id/recursos` → Se guarda en BD
6. **Puede descargar/previsualizar** → Usa la URL del blob del archivo
7. **Toggle transcripción** → PUT a `/api/protected/recursos/:id/transcripcion`

### Autenticación

Todos los endpoints requieren:
```
Authorization: Bearer <JWT_TOKEN>
```

El token se envía desde el frontend automáticamente en los headers.

### Validación

- ✅ Profesor solo puede ver sus propios tópicos
- ✅ Profesor solo puede modificar sus recursos
- ✅ Archivos se guardan como URLs de blob en memoria
- ✅ Validaciones en controller y service

## 📝 Estructura de Datos

### Topico (BD)
```javascript
{
  id_topico: number,
  titulo: string,
  descripcion: string,
  id_persona: number,         // FK a profesor
  recursos: Recurso[],        // relación
  createdAt: datetime,
  updatedAt: datetime
}
```

### Recurso (BD)
```javascript
{
  id_recurso: number,
  titulo: string,
  descripcion: string,
  tipo: 'video'|'document'|'slides'|'audio',
  url_archivo: string,        // URL del blob
  nombreArchivo: string,
  tamanioArchivo: number,     // bytes
  id_topico: number,          // FK a topico
  tieneTranscripcion: boolean,
  createdAt: datetime,
  updatedAt: datetime
}
```

## 🔧 Para Usar

### Backend
```bash
cd backend
npm install
npx prisma db push
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Base de datos
```bash
# Ver los datos en interfaz gráfica
cd backend
npx prisma studio
```

## ⚠️ Notas Importantes

1. **Almacenamiento de archivos**: Actualmente usa URLs de blob (en memoria). Para producción, usa `multer` + almacenamiento en servidor/S3
2. **Transcripciones**: Solo es un toggle booleano. Para transcripciones reales, integra un servicio como Google Cloud Speech
3. **Límites de archivo**: No hay límite configurado. Añade validaciones en middleware si es necesario

## 🐛 Troubleshooting

### Error: "No token found"
- Asegúrate de iniciar sesión primero
- Verifica que el token esté en `localStorage`

### Error: "Topic not found"
- El tópico no existe o pertenece a otro profesor
- Recarga la página

### Error de CORS
- Verifica que `http://localhost:5173` esté habilitado en backend app.js
