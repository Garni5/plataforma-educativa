// src/controllers/topico.controller.js
const prisma = require('../prismaClient');

// Obtener todos los tópicos del profesor autenticado
async function obtenerTopicos(req, res) {
  try {
    const id_persona = req.user.id_persona;

    const topicos = await prisma.topico.findMany({
      where: { id_persona },
      include: { recursos: true },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: topicos
    });
  } catch (err) {
    console.error('Error al obtener tópicos:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Error al obtener tópicos'
    });
  }
}

// Crear un nuevo tópico
async function crearTopico(req, res) {
  try {
    const { titulo, descripcion } = req.body;
    const id_persona = req.user.id_persona;

    if (!titulo || titulo.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El título del tópico es requerido'
      });
    }

    const topico = await prisma.topico.create({
      data: {
        titulo,
        descripcion: descripcion || '',
        id_persona
      },
      include: { recursos: true }
    });

    res.status(201).json({
      success: true,
      data: topico,
      message: 'Tópico creado exitosamente'
    });
  } catch (err) {
    console.error('Error al crear tópico:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Error al crear tópico'
    });
  }
}

// Actualizar un tópico
async function actualizarTopico(req, res) {
  try {
    const { id } = req.params;
    const { titulo, descripcion } = req.body;
    const id_persona = req.user.id_persona;

    // Verificar que el tópico pertenece al profesor
    const topico = await prisma.topico.findUnique({
      where: { id_topico: parseInt(id) }
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
        message: 'No tienes permiso para actualizar este tópico'
      });
    }

    const topicoActualizado = await prisma.topico.update({
      where: { id_topico: parseInt(id) },
      data: {
        titulo: titulo || topico.titulo,
        descripcion: descripcion || topico.descripcion
      },
      include: { recursos: true }
    });

    res.status(200).json({
      success: true,
      data: topicoActualizado,
      message: 'Tópico actualizado exitosamente'
    });
  } catch (err) {
    console.error('Error al actualizar tópico:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Error al actualizar tópico'
    });
  }
}

// Eliminar un tópico
async function eliminarTopico(req, res) {
  try {
    const { id } = req.params;
    const id_persona = req.user.id_persona;

    // Verificar que el tópico pertenece al profesor
    const topico = await prisma.topico.findUnique({
      where: { id_topico: parseInt(id) }
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
        message: 'No tienes permiso para eliminar este tópico'
      });
    }

    await prisma.topico.delete({
      where: { id_topico: parseInt(id) }
    });

    res.status(200).json({
      success: true,
      message: 'Tópico eliminado exitosamente'
    });
  } catch (err) {
    console.error('Error al eliminar tópico:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Error al eliminar tópico'
    });
  }
}

module.exports = {
  obtenerTopicos,
  crearTopico,
  actualizarTopico,
  eliminarTopico
};
