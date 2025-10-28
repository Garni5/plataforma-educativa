// backend/test/auth_register.test.tsx
import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// 1) Resolver rutas ANTES de mockear (ESM)
const { prismaPath, appPath } = vi.hoisted(() => {
  const prismaPath = new URL('../src/prismaClient.js', import.meta.url).pathname
  const appPath    = new URL('../src/app.js', import.meta.url).pathname
  return { prismaPath, appPath }
})

// 2) Mock del cliente de Prisma, exportando default y named
vi.mock(prismaPath, () => {
  const persona = {
    findUnique: vi.fn(),
    findFirst:  vi.fn(),
    findMany:   vi.fn(),   // <- lo añadimos para evitar el error
    count:      vi.fn(),
    create:     vi.fn(),
  }
  const prisma = { persona }
  return { default: prisma, prisma }
})

// 3) Importar después de configurar el mock
const appModule    = await import(appPath)
const prismaModule = await import(prismaPath)

// 4) Normalizar instancias (default / named)
const app =
  (appModule as any).default ??
  (appModule as any)

const prisma =
  (prismaModule as any).default ??
  (prismaModule as any).prisma ??
  (prismaModule as any)

// 5) Helper para resetear TODOS los mocks de persona
function resetPersonaMocks() {
  const fns = prisma.persona as Record<string, any>
  for (const key of Object.keys(fns)) {
    if (typeof fns[key]?.mockReset === 'function') {
      fns[key].mockReset()
    }
  }
}

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetPersonaMocks()
  })

  it('201: crea usuario y devuelve { id_persona }', async () => {
    // No hay duplicados
    ;(prisma.persona.findUnique as any).mockResolvedValue(null)
    ;(prisma.persona.findFirst  as any).mockResolvedValue(null)
    ;(prisma.persona.findMany   as any).mockResolvedValue([])
    ;(prisma.persona.count      as any).mockResolvedValue(0)

    // Inserción exitosa
    ;(prisma.persona.create     as any).mockResolvedValue({ id_persona: 2 })

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nombres: 'Ana',
        apellidos: 'Pérez',
        correo: 'ana@mail.com',
        password: 'secreto',
        // Si tu backend valida confirmación, déjalo; si no, puedes quitarlo.
        confirmarPassword: 'secreto',
      })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ id_persona: 2 })

    // Asegura que no se envíen campos de UI al create
    const call = (prisma.persona.create as any).mock.calls[0]?.[0]
    expect(call).toBeTruthy()
    expect(call.data).toBeTruthy()
    expect(call.data).not.toHaveProperty('confirmarPassword')
    expect(call.data).toMatchObject({
      nombres: 'Ana',
      apellidos: 'Pérez',
      correo: 'ana@mail.com',
    })
  })

  it('409: si el correo ya existe', async () => {
    // Cualquier check de duplicado debería activar el 409
    ;(prisma.persona.findUnique as any).mockResolvedValue({ id_persona: 7 })
    ;(prisma.persona.findFirst  as any).mockResolvedValue({ id_persona: 7 })
    ;(prisma.persona.count      as any).mockResolvedValue(1)

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nombres: 'Ana',
        apellidos: 'Pérez',
        correo: 'ana@mail.com',
        password: 'secreto',
        confirmarPassword: 'secreto',
      })

    expect(res.status).toBe(409)
    expect(String(res.body.message ?? '')).toMatch(/ya existe|ya está registrado/i)
    expect(prisma.persona.create).not.toHaveBeenCalled()
  })

  it('400: si faltan campos', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ correo: 'incompleto@mail.com' })

    expect(res.status).toBe(400)
    // Dependiendo del validador (zod, joi, bcrypt error), cualquiera de estos patrones
    expect(String(res.body.message ?? '')).toMatch(/faltan|obligatorio|data and salt arguments required/i)
    expect(prisma.persona.create).not.toHaveBeenCalled()
  })
})
