import { useState, useEffect } from 'react';
import './ProfesorEditorPage.css';

interface Recurso {
  id_recurso: number;
  titulo: string;
  descripcion?: string;
  tipo: 'video' | 'document' | 'slides' | 'audio';
  url_archivo?: string;
  nombreArchivo?: string;
  tamanioArchivo?: number;
  tieneTranscripcion: boolean;
  id_topico: number;
  createdAt: string;
  updatedAt: string;
  file?: File;
  fileUrl?: string;
}

interface Topico {
  id_topico: number;
  titulo: string;
  descripcion?: string;
  id_persona: number;
  recursos?: Recurso[];
  createdAt: string;
  updatedAt: string;
}

interface User {
  id_persona: number;
  nombres: string;
  apellidos: string;
  correo: string;
}

const API_BASE = 'http://localhost:3000/api/protected';

const ProfesorEditorPage = () => {
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [activeTopicId, setActiveTopicId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [selectedResourceType, setSelectedResourceType] = useState<'video' | 'document' | 'slides' | 'audio' | null>(null);
  const [resourceTitle, setResourceTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [noAuthorized, setNoAuthorized] = useState(false);

  const activeTopic = topicos.find(t => t.id_topico === activeTopicId);

  // Iconos por tipo
  const icons = {
    video: '🎥',
    document: '📄',
    slides: '🎞️',
    audio: '🎵'
  };

  const labels = {
    video: 'Video',
    document: 'Documento HTML',
    slides: 'Slides',
    audio: 'Audio'
  };

  const fileAccept = {
    video: 'video/*',
    document: '.html,.pdf,.doc,.docx,.txt',
    slides: '.ppt,.pptx,.pdf',
    audio: 'audio/*'
  };

  // Obtener token del localStorage
  const getToken = () => localStorage.getItem('token') || '';

  // Obtener usuario del localStorage
  const obtenerUsuario = (): User | null => {
    try {
      const id_persona = localStorage.getItem('userId');
      const nombres = localStorage.getItem('userName') || '';
      const correo = localStorage.getItem('userEmail') || '';
      
      if (!id_persona) return null;
      
      return {
        id_persona: parseInt(id_persona),
        nombres,
        apellidos: '',
        correo
      };
    } catch {
      return null;
    }
  };

  // Cargar tópicos al montar el componente
  useEffect(() => {
    verificarAutenticacion();
  }, []);

  // Verificar que el usuario esté autenticado
  const verificarAutenticacion = async () => {
    try {
      setLoading(true);
      setError('');

      const usuarioGuardado = obtenerUsuario();
      if (!usuarioGuardado || !getToken()) {
        setNoAuthorized(true);
        setLoading(false);
        return;
      }

      setUser(usuarioGuardado);
      await cargarTopicos();
    } catch (err: any) {
      setError('Error de autenticación: ' + err.message);
      setNoAuthorized(true);
    } finally {
      setLoading(false);
    }
  };

  // Cargar tópicos desde el backend (solo del usuario autenticado)
  const cargarTopicos = async () => {
    try {
      setError('');
      const token = getToken();
      
      if (!token) {
        setNoAuthorized(true);
        return;
      }

      const response = await fetch(`${API_BASE}/topicos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        setNoAuthorized(true);
        localStorage.clear();
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setTopicos(data.data || []);
        if (data.data.length > 0 && !activeTopicId) {
          setActiveTopicId(data.data[0].id_topico);
        }
      }
    } catch (err: any) {
      setError('Error al cargar tópicos: ' + err.message);
      console.error(err);
    }

  // Agregar nuevo tópico
  const handleAddTopic = async () => {
    if (!newTopicTitle.trim()) {
      alert('Por favor ingresa un título');
      return;
    }

    if (!user) {
      setError('No hay usuario autenticado');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/topicos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          titulo: newTopicTitle,
          descripcion: ''
        })
      });

      if (response.status === 401) {
        setNoAuthorized(true);
        localStorage.clear();
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        const nuevoTopico = data.data;
        setTopicos([...topicos, nuevoTopico]);
        setActiveTopicId(nuevoTopico.id_topico);
        setNewTopicTitle('');
      }
    } catch (err: any) {
      setError('Error al crear tópico: ' + err.message);
    }
  };

  // Agregar nuevo recurso
  const handleAddResource = async () => {
    if (!resourceTitle.trim()) {
      alert('Por favor ingresa un título');
      return;
    }

    if (!selectedResourceType) {
      alert('Por favor selecciona un tipo de recurso');
      return;
    }

    if (!selectedFile) {
      alert(`Por favor selecciona un ${labels[selectedResourceType].toLowerCase()}`);
      return;
    }

    if (!activeTopicId) {
      alert('Por favor selecciona un tópico');
      return;
    }

    try {
      // Crear URL de blob para el archivo
      const fileUrl = URL.createObjectURL(selectedFile);

      const response = await fetch(`${API_BASE}/topicos/${activeTopicId}/recursos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          titulo: resourceTitle,
          descripcion: `${labels[selectedResourceType]} - ${selectedFile.name}`,
          tipo: selectedResourceType,
          url_archivo: fileUrl,
          nombreArchivo: selectedFile.name,
          tamanioArchivo: selectedFile.size
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        // Actualizar los tópicos localmente
        setTopicos(topicos.map(t => {
          if (t.id_topico === activeTopicId) {
            return {
              ...t,
              recursos: [...(t.recursos || []), { ...data.data, fileUrl }]
            };
          }
          return t;
        }));

        // Limpiar modal
        setShowModal(false);
        setSelectedResourceType(null);
        setResourceTitle('');
        setSelectedFile(null);
      }
    } catch (err: any) {
      setError('Error al agregar recurso: ' + err.message);
    }
  };

  // Eliminar recurso
  const handleDeleteResource = async (recursoId: number) => {
    if (!activeTopicId) return;

    try {
      const response = await fetch(`${API_BASE}/topicos/${activeTopicId}/recursos/${recursoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      setTopicos(topicos.map(t => {
        if (t.id_topico === activeTopicId) {
          return {
            ...t,
            recursos: (t.recursos || []).filter(r => r.id_recurso !== recursoId)
          };
        }
        return t;
      }));
    } catch (err: any) {
      setError('Error al eliminar recurso: ' + err.message);
    }
  };

  // Toggle transcripción
  const handleToggleTranscription = async (recursoId: number) => {
    try {
      const response = await fetch(`${API_BASE}/recursos/${recursoId}/transcripcion`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setTopicos(topicos.map(t => {
          if (t.id_topico === activeTopicId) {
            return {
              ...t,
              recursos: (t.recursos || []).map(r => {
                if (r.id_recurso === recursoId) {
                  return { ...r, tieneTranscripcion: data.data.tieneTranscripcion };
                }
                return r;
              })
            };
          }
          return t;
        }));
      }
    } catch (err: any) {
      setError('Error al actualizar transcripción: ' + err.message);
    }
  };

  // Descargar recurso
  const handleDownloadResource = (resource: Recurso) => {
    if (resource.fileUrl && resource.nombreArchivo) {
      const link = document.createElement('a');
      link.href = resource.fileUrl;
      link.download = resource.nombreArchivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="profesor-container">
        <div className="profesor-header">
          <h1>Cargando...</h1>
        </div>
      </div>
    );
  }

  if (noAuthorized || !user) {
    return (
      <div className="profesor-container">
        <div className="profesor-header">
          <h1>❌ Acceso Denegado</h1>
          <p>Debes iniciar sesión para acceder a esta página</p>
          <button
            onClick={() => window.location.href = '/login'}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profesor-container">
      {/* Header */}
      <div className="profesor-header">
        <div>
          <h1>Editor de Contenido del Curso</h1>
          <p>Gestiona tópicos y recursos para tus estudiantes</p>
          {user && <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>👤 {user.nombres}</p>}
        </div>
        {error && <div style={{ color: 'red', marginTop: '10px', marginBottom: '10px' }}>{error}</div>}
      </div>

      {/* Topics Navigation */}
      <div className="profesor-topics-section">
        <div className="profesor-topics-buttons">
          {topicos.map(topic => (
            <button
              key={topic.id_topico}
              className={`profesor-topic-btn ${activeTopicId === topic.id_topico ? 'active' : ''}`}
              onClick={() => setActiveTopicId(topic.id_topico)}
            >
              {topic.titulo}
            </button>
          ))}
        </div>

        {/* Add Topic */}
        <div className="profesor-add-topic">
          <input
            type="text"
            value={newTopicTitle}
            onChange={(e) => setNewTopicTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTopic()}
            placeholder="Nombre del nuevo tópico..."
            className="profesor-input"
          />
          <button
            onClick={handleAddTopic}
            className="profesor-btn profesor-btn-success"
          >
            ➕ Agregar Tópico
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="profesor-content-area">
        <div className="profesor-content-header">
          <div className="profesor-content-title">
            <h2>{activeTopic?.titulo || 'Selecciona un tópico'}</h2>
            <p>{activeTopic?.recursos?.length || 0} recursos</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="profesor-btn profesor-btn-primary"
            disabled={!activeTopicId}
          >
            ➕ Agregar Recurso
          </button>
        </div>

        {/* Resources Grid */}
        <div className="profesor-resources-grid">
          {activeTopic && activeTopic.recursos && activeTopic.recursos.length > 0 ? (
            activeTopic.recursos.map(resource => (
              <div key={resource.id_recurso} className="profesor-resource-card">
                <div className="profesor-resource-header">
                  <div className="profesor-resource-icon">
                    {icons[resource.tipo]}
                  </div>
                  <button
                    onClick={() => handleDeleteResource(resource.id_recurso)}
                    className="profesor-btn-delete"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>

                <div className="profesor-resource-info">
                  <p className="profesor-resource-type">
                    {labels[resource.tipo]}
                  </p>
                  <h3 className="profesor-resource-title">{resource.titulo}</h3>
                  <p className="profesor-resource-description">
                    {resource.descripcion}
                  </p>
                </div>

                {resource.fileUrl && (
                  <div className="profesor-resource-actions">
                    {resource.tipo === 'video' && (
                      <div className="profesor-resource-preview">
                        <video width="100%" height="150" controls>
                          <source src={resource.fileUrl} />
                          Tu navegador no soporta videos HTML5
                        </video>
                      </div>
                    )}
                    {resource.tipo === 'audio' && (
                      <div className="profesor-resource-preview">
                        <audio controls style={{ width: '100%' }}>
                          <source src={resource.fileUrl} />
                          Tu navegador no soporta audios HTML5
                        </audio>
                      </div>
                    )}
                    <button
                      onClick={() => handleDownloadResource(resource)}
                      className="profesor-btn profesor-btn-small"
                      title="Descargar"
                    >
                      ⬇️ Descargar
                    </button>
                  </div>
                )}

                {resource.tipo === 'video' && (
                  <div className="profesor-resource-transcription">
                    <button
                      onClick={() => handleToggleTranscription(resource.id_recurso)}
                      className={`profesor-transcription-btn ${
                        resource.tieneTranscripcion ? 'active' : ''
                      }`}
                    >
                      {resource.tieneTranscripcion
                        ? '✓ Con transcripción'
                        : 'Sin transcripción'}
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="profesor-empty-state">
              <div className="profesor-empty-icon">📄</div>
              <p className="profesor-empty-text">
                No hay recursos aún. ¡Agrega uno para comenzar!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="profesor-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="profesor-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="profesor-modal-header">
              <h3>Agregar Nuevo Recurso</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedResourceType(null);
                  setResourceTitle('');
                  setSelectedFile(null);
                }}
                className="profesor-close-btn"
              >
                ✕
              </button>
            </div>

            {!selectedResourceType ? (
              <div className="profesor-resource-options">
                {(Object.entries(icons) as Array<[keyof typeof icons, string]>).map(([type, icon]) => (
                  <div
                    key={type}
                    className="profesor-resource-option"
                    onClick={() => setSelectedResourceType(type)}
                  >
                    <span className="profesor-option-icon">{icon}</span>
                    <span className="profesor-option-label">{labels[type]}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="profesor-resource-form">
                <button
                  onClick={() => setSelectedResourceType(null)}
                  className="profesor-back-btn"
                >
                  ← Volver
                </button>

                <div className="profesor-form-group">
                  <label htmlFor="resourceTitle">Título del {labels[selectedResourceType].toLowerCase()}</label>
                  <input
                    id="resourceTitle"
                    type="text"
                    value={resourceTitle}
                    onChange={(e) => setResourceTitle(e.target.value)}
                    placeholder={`Ej: ${labels[selectedResourceType]} #1`}
                    className="profesor-input"
                  />
                </div>

                <div className="profesor-form-group">
                  <label htmlFor="resourceFile">Selecciona el archivo</label>
                  <input
                    id="resourceFile"
                    type="file"
                    accept={fileAccept[selectedResourceType]}
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="profesor-file-input"
                  />
                  {selectedFile && (
                    <p className="profesor-file-info">
                      ✓ {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                <button
                  onClick={handleAddResource}
                  className="profesor-btn profesor-btn-success profesor-btn-full"
                  disabled={!resourceTitle.trim() || !selectedFile}
                >
                  ✓ Agregar Recurso
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfesorEditorPage;