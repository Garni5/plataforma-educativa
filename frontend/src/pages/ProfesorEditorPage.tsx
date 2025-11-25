import React, { useState } from 'react';
import { Upload, Video, FileText, Music, Trash2, Plus, X } from 'lucide-react';
import './ProfesorEditorPage.css';


interface Resource {
  id: string;
  type: 'video' | 'document' | 'slides' | 'audio';
  title: string;
  description?: string;
  url?: string;
  hasTranscription?: boolean;
}

interface Topic {
  id: string;
  title: string;
  resources: Resource[];
}

const ProfesorEditorPage: React.FC = () => {
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
  const [showNewResourceModal, setShowNewResourceModal] = useState(false);
  const [newTopic, setNewTopic] = useState('');

  const activeTopic = topics.find(t => t.id === activeTopicId);

  const addTopic = () => {
    if (newTopic.trim()) {
      const topic: Topic = {
        id: Date.now().toString(),
        title: newTopic,
        resources: []
      };
      setTopics([...topics, topic]);
      setActiveTopicId(topic.id);
      setNewTopic('');
    }
  };

  const addResource = (type: Resource['type'], title: string) => {
    if (activeTopic && title.trim()) {
      const updatedTopics = topics.map(t => {
        if (t.id === activeTopicId) {
          return {
            ...t,
            resources: [
              ...t.resources,
              {
                id: Date.now().toString(),
                type,
                title,
                description: `Nuevo ${type === 'video' ? 'video' : type === 'document' ? 'documento' : type === 'slides' ? 'slide' : 'audio'}`,
                ...(type === 'video' && { hasTranscription: false })
              }
            ]
          };
        }
        return t;
      });
      setTopics(updatedTopics);
      setShowNewResourceModal(false);
    }
  };

  const deleteResource = (resourceId: string) => {
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

  const toggleTranscription = (resourceId: string) => {
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

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-6 h-6 text-blue-500" />;
      case 'document':
        return <FileText className="w-6 h-6 text-green-500" />;
      case 'slides':
        return <FileText className="w-6 h-6 text-orange-500" />;
      case 'audio':
        return <Music className="w-6 h-6 text-purple-500" />;
    }
  };

  const getResourceTypeLabel = (type: Resource['type']) => {
    const labels = {
      video: 'Video',
      document: 'Documento HTML',
      slides: 'Slides',
      audio: 'Audio'
    };
    return labels[type];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Editor de Contenido del Curso</h1>
          <p className="text-slate-600">Gestiona tópicos y recursos para tus estudiantes</p>
        </div>

        {/* Topics Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 mb-4">
            {topics.map(topic => (
              <button
                key={topic.id}
                onClick={() => setActiveTopicId(topic.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTopicId === topic.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400'
                }`}
              >
                {topic.title}
              </button>
            ))}
          </div>

          {/* Add New Topic */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTopic()}
              placeholder="Nombre del nuevo tópico..."
              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addTopic}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Agregar Tópico
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeTopic && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{activeTopic.title}</h2>
                <p className="text-slate-600 mt-1">{activeTopic.resources.length} recursos</p>
              </div>
              <button
                onClick={() => setShowNewResourceModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Agregar Recurso
              </button>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTopic.resources.map(resource => (
                <div
                  key={resource.id}
                  className="border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-slate-50 to-white"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-slate-100 rounded-lg">
                      {getResourceIcon(resource.type)}
                    </div>
                    <button
                      onClick={() => deleteResource(resource.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-blue-600 mb-1">
                      {getResourceTypeLabel(resource.type)}
                    </p>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{resource.title}</h3>
                    {resource.description && (
                      <p className="text-sm text-slate-600">{resource.description}</p>
                    )}
                  </div>

                  {resource.type === 'video' && (
                    <div className="pt-4 border-t border-slate-200">
                      <button
                        onClick={() => toggleTranscription(resource.id)}
                        className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          resource.hasTranscription
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {resource.hasTranscription ? '✓ Con transcripción' : 'Sin transcripción'}
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {activeTopic.resources.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No hay recursos aún. ¡Agrega uno para comenzar!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Resource Modal */}
      {showNewResourceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Agregar Nuevo Recurso</h3>
              <button
                onClick={() => setShowNewResourceModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { type: 'video' as const, label: 'Video', icon: Video },
                { type: 'document' as const, label: 'Documento HTML', icon: FileText },
                { type: 'slides' as const, label: 'Slides', icon: FileText },
                { type: 'audio' as const, label: 'Audio', icon: Music }
              ].map(({ type, label, icon: Icon }) => (
                <ResourceTypeButton
                  key={type}
                  type={type}
                  label={label}
                  icon={Icon}
                  onSelect={(resourceType) => {
                    const title = prompt(`Ingresa el título del ${label}:`);
                    if (title) {
                      addResource(resourceType, title);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ResourceTypeButtonProps {
  type: Resource['type'];
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onSelect: (type: Resource['type']) => void;
}

function ResourceTypeButton({ type, label, icon: Icon, onSelect }: ResourceTypeButtonProps) {
  return (
    <button
      onClick={() => onSelect(type)}
      className="w-full flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-blue-400 transition-all text-left"
    >
      <Icon className="w-6 h-6 text-slate-600" />
      <span className="font-medium text-slate-900">{label}</span>
    </button>
  );
}

export default ProfesorEditorPage;