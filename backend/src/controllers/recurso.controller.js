// src/controllers/recurso.controller.js
const prisma = require('../prismaClient');

// Crear un nuevo recurso
async function crearRecurso(req, res) {
  try {
    const { id_topico } = req.params;
    const { titulo, descripcion, tipo, url_archivo, nombreArchivo, tamanioArchivo } = req.body;
    const id_persona = req.user.id_persona;

    // Validar entrada
    if (!titulo || !tipo) {
      return res.status(400).json({
        success: false,
        message: 'Título y tipo de recurso son requeridos'
      });
    }

    // Verificar que el tópico pertenece al profesor
    const topico = await prisma.topico.findUnique({
      where: { id_topico: parseInt(id_topico) }
    });

    if (!topico) {
      return res.status(404).json({
        success: false,
        message: 'Tópico no encontrado'
      });
    }

    if (topico.id_persona !== id_persona) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para agregar recursos a este tópico'
      });
    }

    const recurso = await prisma.recurso.create({
      data: {
        titulo,
        descripcion: descripcion || '',
        tipo,
        url_archivo: url_archivo || null,
        nombreArchivo: nombreArchivo || null,
        tamanioArchivo: tamanioArchivo || null,
        tieneTranscripcion: false,
        id_topico: parseInt(id_topico)
      }
    });

    res.status(201).json({
      success: true,
      data: recurso,
      message: 'Recurso creado exitosamente'
    });
  } catch (err) {
    console.error('Error al crear recurso:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Error al crear recurso'
    });
  }
}

// Obtener recursos de un tópico
async function obtenerRecursos(req, res) {
  try {
    const { id_topico } = req.params;

    const recursos = await prisma.recurso.findMany({
      where: { id_topico: parseInt(id_topico) },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: recursos
    });
  } catch (err) {
    console.error('Error al obtener recursos:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Error al obtener recursos'
    });
  }
}

// Actualizar un recurso
async function actualizarRecurso(req, res) {
  try {
    const { id_topico, id_recurso } = req.params;
    const { titulo, descripcion, tipo } = req.body;
    const id_persona = req.user.id_persona;

    // Verificar permisos
    const topico = await prisma.topico.findUnique({
      where: { id_topico: parseInt(id_topico) }
    });

    if (!topico || topico.id_persona !== id_persona) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para actualizar este recurso'
      });
    }

    const recurso = await prisma.recurso.update({
      where: { id_recurso: parseInt(id_recurso) },
      data: {
        titulo: titulo || undefined,
        descripcion: descripcion || undefined,
        tipo: tipo || undefined
      }
    });

    res.status(200).json({
      success: true,
      data: recurso,
      message: 'Recurso actualizado exitosamente'
    });
  } catch (err) {
    console.error('Error al actualizar recurso:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Error al actualizar recurso'
    });
  }
}

// Eliminar un recurso
async function eliminarRecurso(req, res) {
  try {
    const { id_topico, id_recurso } = req.params;
    const id_persona = req.user.id_persona;

    // Verificar permisos
    const topico = await prisma.topico.findUnique({
      where: { id_topico: parseInt(id_topico) }
    });

    if (!topico || topico.id_persona !== id_persona) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar este recurso'
      });
    }

    await prisma.recurso.delete({
      where: { id_recurso: parseInt(id_recurso) }
    });

    res.status(200).json({
      success: true,
      message: 'Recurso eliminado exitosamente'
    });
  } catch (err) {
    console.error('Error al eliminar recurso:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Error al eliminar recurso'
    });
  }
}

// Toggle transcripción
async function toggleTranscripcion(req, res) {
  try {
    const { id_recurso } = req.params;

    const recurso = await prisma.recurso.findUnique({
      where: { id_recurso: parseInt(id_recurso) }
    });

    if (!recurso) {
      return res.status(404).json({
        success: false,
        message: 'Recurso no encontrado'
      });
    }

    const recursoActualizado = await prisma.recurso.update({
      where: { id_recurso: parseInt(id_recurso) },
      data: {
        tieneTranscripcion: !recurso.tieneTranscripcion
      }
    });

    res.status(200).json({
      success: true,
      data: recursoActualizado,
      message: 'Transcripción actualizada'
    });
  } catch (err) {
    console.error('Error al actualizar transcripción:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Error al actualizar transcripción'
    });
  }
}

module.exports = {
  crearRecurso,
  obtenerRecursos,
  actualizarRecurso,
  eliminarRecurso,
  toggleTranscripcion
};
