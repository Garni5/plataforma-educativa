import { useState } from 'react';
import './ProfesorEditorPage.css';

interface Resource {
  id: string;
  type: 'video' | 'document' | 'slides' | 'audio';
  title: string;
  description: string;
  file?: File;
  fileUrl?: string;
  hasTranscription?: boolean;
}

interface Topic {
  id: string;
  title: string;
  resources: Resource[];
}

const ProfesorEditorPage = () => {
  const [topics, setTopics] = useState<Topic[]>([
    {
      id: '1',
      title: 'Introducción a React',
      resources: [
        {
          id: 'r1',
          type: 'video',
          title: 'Conceptos básicos de React',
          description: 'Video introductorio sobre componentes',
          hasTranscription: true
        },
        {
          id: 'r2',
          type: 'document',
          title: 'Guía de instalación',
          description: 'Documento HTML con pasos de instalación'
        }
      ]
    }
  ]);

  const [activeTopicId, setActiveTopicId] = useState('1');
  const [showModal, setShowModal] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [selectedResourceType, setSelectedResourceType] = useState<'video' | 'document' | 'slides' | 'audio' | null>(null);
  const [resourceTitle, setResourceTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const activeTopic = topics.find(t => t.id === activeTopicId);

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

  // Agregar nuevo tópico
  const handleAddTopic = () => {
    if (newTopicTitle.trim()) {
      const newTopic: Topic = {
        id: Date.now().toString(),
        title: newTopicTitle,
        resources: []
      };
      setTopics([...topics, newTopic]);
      setActiveTopicId(newTopic.id);
      setNewTopicTitle('');
    }
  };

  // Agregar nuevo recurso
  const handleAddResource = () => {
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

    if (activeTopic) {
      const fileUrl = URL.createObjectURL(selectedFile);

      const newResource: Resource = {
        id: Date.now().toString(),
        type: selectedResourceType,
        title: resourceTitle,
        description: `${labels[selectedResourceType]} - ${selectedFile.name}`,
        file: selectedFile,
        fileUrl: fileUrl,
        ...(selectedResourceType === 'video' && { hasTranscription: false })
      };

      const updatedTopics = topics.map(t => {
        if (t.id === activeTopicId) {
          return { ...t, resources: [...t.resources, newResource] };
        }
        return t;
      });
      setTopics(updatedTopics);

      // Limpiar modal
      setShowModal(false);
      setSelectedResourceType(null);
      setResourceTitle('');
      setSelectedFile(null);
    }
  };

  // Eliminar recurso
  const handleDeleteResource = (resourceId: string) => {
    const updatedTopics = topics.map(t => {
      if (t.id === activeTopicId) {
        return {
          ...t,
          resources: t.resources.filter(r => r.id !== resourceId)
        };
      }
      return t;
    });
    setTopics(updatedTopics);
  };

  // Toggle transcripción
  const handleToggleTranscription = (resourceId: string) => {
    const updatedTopics = topics.map(t => {
      if (t.id === activeTopicId) {
        return {
          ...t,
          resources: t.resources.map(r => {
            if (r.id === resourceId && r.type === 'video') {
              return { ...r, hasTranscription: !r.hasTranscription };
            }
            return r;
          })
        };
      }
      return t;
    });
    setTopics(updatedTopics);
  };

  // Descargar recurso
  const handleDownloadResource = (resource: Resource) => {
    if (resource.fileUrl && resource.file) {
      const link = document.createElement('a');
      link.href = resource.fileUrl;
      link.download = resource.file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="profesor-container">
      {/* Header */}
      <div className="profesor-header">
        <h1>Editor de Contenido del Curso</h1>
        <p>Gestiona tópicos y recursos para tus estudiantes</p>
      </div>

      {/* Topics Navigation */}
      <div className="profesor-topics-section">
        <div className="profesor-topics-buttons">
          {topics.map(topic => (
            <button
              key={topic.id}
              className={`profesor-topic-btn ${activeTopicId === topic.id ? 'active' : ''}`}
              onClick={() => setActiveTopicId(topic.id)}
            >
              {topic.title}
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
            <h2>{activeTopic?.title || 'Selecciona un tópico'}</h2>
            <p>{activeTopic?.resources.length || 0} recursos</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="profesor-btn profesor-btn-primary"
          >
            ➕ Agregar Recurso
          </button>
        </div>

        {/* Resources Grid */}
        <div className="profesor-resources-grid">
          {activeTopic && activeTopic.resources.length > 0 ? (
            activeTopic.resources.map(resource => (
              <div key={resource.id} className="profesor-resource-card">
                <div className="profesor-resource-header">
                  <div className="profesor-resource-icon">
                    {icons[resource.type]}
                  </div>
                  <button
                    onClick={() => handleDeleteResource(resource.id)}
                    className="profesor-btn-delete"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>

                <div className="profesor-resource-info">
                  <p className="profesor-resource-type">
                    {labels[resource.type]}
                  </p>
                  <h3 className="profesor-resource-title">{resource.title}</h3>
                  <p className="profesor-resource-description">
                    {resource.description}
                  </p>
                </div>

                {resource.fileUrl && (
                  <div className="profesor-resource-actions">
                    {resource.type === 'video' && (
                      <div className="profesor-resource-preview">
                        <video width="100%" height="150" controls>
                          <source src={resource.fileUrl} />
                          Tu navegador no soporta videos HTML5
                        </video>
                      </div>
                    )}
                    {resource.type === 'audio' && (
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

                {resource.type === 'video' && (
                  <div className="profesor-resource-transcription">
                    <button
                      onClick={() => handleToggleTranscription(resource.id)}
                      className={`profesor-transcription-btn ${
                        resource.hasTranscription ? 'active' : ''
                      }`}
                    >
                      {resource.hasTranscription
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