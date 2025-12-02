const topicoService = require("../services/topico.service");

// Obtener todos los tópicos del profesor autenticado
async function obtenerTopicos(req, res) {
  try {
    const id_persona = req.user.id_persona;
    const topicos = await topicoService.obtenerTopicosPorProfesor(id_persona);
    res.status(200).json({
      success: true,
      data: topicos,
      message: "Tópicos obtenidos correctamente"
    });
  } catch (err) {
    res.status(err.status || 400).json({
      success: false,
      message: err.message || "Error al obtener tópicos"
    });
  }
}

// Crear nuevo tópico
async function crearTopico(req, res) {
  try {
    const { titulo, descripcion } = req.body;
    const id_persona = req.user.id_persona;
    
    if (!titulo?.trim()) {
      return res.status(400).json({
        success: false,
        message: "El título del tópico es requerido"
      });
    }

    const topico = await topicoService.crearTopico({
      titulo,
      descripcion: descripcion || "",
      id_persona
    });

    res.status(201).json({
      success: true,
      data: topico,
      message: "Tópico creado correctamente"
    });
  } catch (err) {
    res.status(err.status || 400).json({
      success: false,
      message: err.message || "Error al crear tópico"
    });
  }
}

// Actualizar tópico
async function actualizarTopico(req, res) {
  try {
    const { id_topico } = req.params;
    const { titulo, descripcion } = req.body;
    const id_persona = req.user.id_persona;

    const topico = await topicoService.actualizarTopico(
      parseInt(id_topico),
      id_persona,
      { titulo, descripcion }
    );

    res.status(200).json({
      success: true,
      data: topico,
      message: "Tópico actualizado correctamente"
    });
  } catch (err) {
    res.status(err.status || 400).json({
      success: false,
      message: err.message || "Error al actualizar tópico"
    });
  }
}

// Eliminar tópico
async function eliminarTopico(req, res) {
  try {
    const { id_topico } = req.params;
    const id_persona = req.user.id_persona;

    await topicoService.eliminarTopico(parseInt(id_topico), id_persona);

    res.status(200).json({
      success: true,
      message: "Tópico eliminado correctamente"
    });
  } catch (err) {
    res.status(err.status || 400).json({
      success: false,
      message: err.message || "Error al eliminar tópico"
    });
  }
}

// Agregar recurso a un tópico
async function agregarRecurso(req, res) {
  try {
    const { id_topico } = req.params;
    const { titulo, descripcion, tipo } = req.body;
    const id_persona = req.user.id_persona;

    // Para este MVP, guardaremos la ruta del archivo en memoria o la URL del blob
    // En producción, usarías multer + S3/almacenamiento en servidor
    const url_archivo = req.body.url_archivo || null;
    const nombreArchivo = req.body.nombreArchivo || "archivo";
    const tamanioArchivo = req.body.tamanioArchivo || 0;

    const recurso = await topicoService.agregarRecurso({
      id_topico: parseInt(id_topico),
      id_persona,
      titulo,
      descripcion,
      tipo,
      url_archivo,
      nombreArchivo,
      tamanioArchivo
    });

    res.status(201).json({
      success: true,
      data: recurso,
      message: "Recurso agregado correctamente"
    });
  } catch (err) {
    res.status(err.status || 400).json({
      success: false,
      message: err.message || "Error al agregar recurso"
    });
  }
}

// Obtener recursos de un tópico
async function obtenerRecursos(req, res) {
  try {
    const { id_topico } = req.params;
    const id_persona = req.user.id_persona;

    const recursos = await topicoService.obtenerRecursos(
      parseInt(id_topico),
      id_persona
    );

    res.status(200).json({
      success: true,
      data: recursos,
      message: "Recursos obtenidos correctamente"
    });
  } catch (err) {
    res.status(err.status || 400).json({
      success: false,
      message: err.message || "Error al obtener recursos"
    });
  }
}

// Eliminar recurso
async function eliminarRecurso(req, res) {
  try {
    const { id_topico, id_recurso } = req.params;
    const id_persona = req.user.id_persona;

    await topicoService.eliminarRecurso(
      parseInt(id_recurso),
      parseInt(id_topico),
      id_persona
    );

    res.status(200).json({
      success: true,
      message: "Recurso eliminado correctamente"
    });
  } catch (err) {
    res.status(err.status || 400).json({
      success: false,
      message: err.message || "Error al eliminar recurso"
    });
  }
}

// Toggle transcripción en video
async function toggleTranscripcion(req, res) {
  try {
    const { id_recurso } = req.params;
    const id_persona = req.user.id_persona;

    const recurso = await topicoService.toggleTranscripcion(
      parseInt(id_recurso),
      id_persona
    );

    res.status(200).json({
      success: true,
      data: recurso,
      message: "Transcripción actualizada"
    });
  } catch (err) {
    res.status(err.status || 400).json({
      success: false,
      message: err.message || "Error al actualizar transcripción"
    });
  }
}

module.exports = {
  obtenerTopicos,
  crearTopico,
  actualizarTopico,
  eliminarTopico,
  agregarRecurso,
  obtenerRecursos,
  eliminarRecurso,
  toggleTranscripcion
};
