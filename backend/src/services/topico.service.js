const prisma = require("../prismaClient");

// Obtener todos los tópicos de un profesor
async function obtenerTopicosPorProfesor(id_persona) {
  try {
    const topicos = await prisma.topico.findMany({
      where: { id_persona },
      include: {
        recursos: {
          orderBy: { createdAt: "desc" }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    return topicos;
  } catch (err) {
    throw { status: 500, message: "Error al obtener tópicos: " + err.message };
  }
}

// Crear nuevo tópico
async function crearTopico({ titulo, descripcion, id_persona }) {
  try {
    const topico = await prisma.topico.create({
      data: {
        titulo,
        descripcion,
        id_persona
      }
    });
    return topico;
  } catch (err) {
    throw { status: 500, message: "Error al crear tópico: " + err.message };
  }
}

// Actualizar tópico (verificar que pertenece al profesor)
async function actualizarTopico(id_topico, id_persona, datos) {
  try {
    // Verificar que el tópico pertenece al profesor
    const topico = await prisma.topico.findFirst({
      where: { id_topico, id_persona }
    });

    if (!topico) {
      throw { status: 404, message: "Tópico no encontrado" };
    }

    const topicoActualizado = await prisma.topico.update({
      where: { id_topico },
      data: datos,
      include: { recursos: true }
    });

    return topicoActualizado;
  } catch (err) {
    if (err.status) throw err;
    throw { status: 500, message: "Error al actualizar tópico: " + err.message };
  }
}

// Eliminar tópico (y sus recursos en cascada)
async function eliminarTopico(id_topico, id_persona) {
  try {
    const topico = await prisma.topico.findFirst({
      where: { id_topico, id_persona }
    });

    if (!topico) {
      throw { status: 404, message: "Tópico no encontrado" };
    }

    await prisma.topico.delete({
      where: { id_topico }
    });
  } catch (err) {
    if (err.status) throw err;
    throw { status: 500, message: "Error al eliminar tópico: " + err.message };
  }
}

// Agregar recurso a un tópico
async function agregarRecurso({
  id_topico,
  id_persona,
  titulo,
  descripcion,
  tipo,
  url_archivo,
  nombreArchivo,
  tamanioArchivo
}) {
  try {
    // Verificar que el tópico pertenece al profesor
    const topico = await prisma.topico.findFirst({
      where: { id_topico, id_persona }
    });

    if (!topico) {
      throw { status: 404, message: "Tópico no encontrado" };
    }

    const recurso = await prisma.recurso.create({
      data: {
        titulo,
        descripcion,
        tipo,
        url_archivo,
        nombreArchivo,
        tamanioArchivo,
        id_topico,
        tieneTranscripcion: false
      }
    });

    return recurso;
  } catch (err) {
    if (err.status) throw err;
    throw { status: 500, message: "Error al agregar recurso: " + err.message };
  }
}

// Obtener recursos de un tópico
async function obtenerRecursos(id_topico, id_persona) {
  try {
    const topico = await prisma.topico.findFirst({
      where: { id_topico, id_persona }
    });

    if (!topico) {
      throw { status: 404, message: "Tópico no encontrado" };
    }

    const recursos = await prisma.recurso.findMany({
      where: { id_topico },
      orderBy: { createdAt: "desc" }
    });

    return recursos;
  } catch (err) {
    if (err.status) throw err;
    throw { status: 500, message: "Error al obtener recursos: " + err.message };
  }
}

// Eliminar recurso
async function eliminarRecurso(id_recurso, id_topico, id_persona) {
  try {
    // Verificar que el tópico pertenece al profesor
    const topico = await prisma.topico.findFirst({
      where: { id_topico, id_persona }
    });

    if (!topico) {
      throw { status: 404, message: "Tópico no encontrado" };
    }

    const recurso = await prisma.recurso.findFirst({
      where: { id_recurso, id_topico }
    });

    if (!recurso) {
      throw { status: 404, message: "Recurso no encontrado" };
    }

    await prisma.recurso.delete({
      where: { id_recurso }
    });
  } catch (err) {
    if (err.status) throw err;
    throw { status: 500, message: "Error al eliminar recurso: " + err.message };
  }
}

// Toggle transcripción
async function toggleTranscripcion(id_recurso, id_persona) {
  try {
    const recurso = await prisma.recurso.findUnique({
      where: { id_recurso },
      include: { topico: true }
    });

    if (!recurso) {
      throw { status: 404, message: "Recurso no encontrado" };
    }

    // Verificar que pertenece al profesor
    if (recurso.topico.id_persona !== id_persona) {
      throw { status: 403, message: "No tienes permiso para modificar este recurso" };
    }

    if (recurso.tipo !== "video") {
      throw { status: 400, message: "Solo los videos pueden tener transcripción" };
    }

    const recursoActualizado = await prisma.recurso.update({
      where: { id_recurso },
      data: {
        tieneTranscripcion: !recurso.tieneTranscripcion
      }
    });

    return recursoActualizado;
  } catch (err) {
    if (err.status) throw err;
    throw { status: 500, message: "Error al actualizar transcripción: " + err.message };
  }
}

module.exports = {
  obtenerTopicosPorProfesor,
  crearTopico,
  actualizarTopico,
  eliminarTopico,
  agregarRecurso,
  obtenerRecursos,
  eliminarRecurso,
  toggleTranscripcion
};
