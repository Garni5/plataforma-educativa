import { useState } from 'react';
import './ProfesorEditorPage.css';

interface Resource {
  id: string;
  type: 'video' | 'document' | 'slides' | 'audio';
  title: string;
  description: string;
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

  // Agregar nuevo tópico
  const handleAddTopic = () => {
    if (newTopicTitle.trim()) {
      const newTopic = {
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
  const handleAddResource = (type: 'video' | 'document' | 'slides' | 'audio') => {
    const title = prompt(`Ingresa el título del ${labels[type]}:`);
    if (title && activeTopic) {
      const newResource = {
        id: Date.now().toString(),
        type,
        title,
        description: `Nuevo ${labels[type].toLowerCase()}`,
        ...(type === 'video' && { hasTranscription: false })
      };

      const updatedTopics = topics.map(t => {
        if (t.id === activeTopicId) {
          return { ...t, resources: [...t.resources, newResource] };
        }
        return t;
      });
      setTopics(updatedTopics);
      setShowModal(false);
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
                onClick={() => setShowModal(false)}
                className="profesor-close-btn"
              >
                ✕
              </button>
            </div>

            <div className="profesor-resource-options">
              {(Object.entries(icons) as Array<[keyof typeof icons, string]>).map(([type, icon]) => (
                <div
                  key={type}
                  className="profesor-resource-option"
                  onClick={() => handleAddResource(type)}
                >
                  <span className="profesor-option-icon">{icon}</span>
                  <span className="profesor-option-label">{labels[type]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfesorEditorPage;