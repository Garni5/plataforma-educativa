import React, { useState } from 'react'
 import './ProfesorEditorPage.css'
import basurero from '../../../assets/basurero.png'  // Importamos la imagen del basurero
import lapiEditar from '../../../assets/lapiEditar.png' // Importamos la imagen del lápiz
interface Topic {
  id: number
  name: string
}

const ProfesorEditorPage: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([
    { id: 1, name: 'Sintaxis básica' },
    { id: 2, name: 'Variables' },
    { id: 3, name: 'Tipos de datos' },
  ])
  const [nextTopicId, setNextTopicId] = useState(4)
  const [modalInput, setModalInput] = useState('')
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete' | null>(null)
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null)

  // Abrir el modal según el tipo
  const openModal = (type: 'add' | 'edit' | 'delete', id?: number) => {
    setModalType(type)
    setSelectedTopicId(id || null)
    if (type === 'edit' && id) {
      const topic = topics.find(t => t.id === id)
      setModalInput(topic?.name || '')
    } else {
      setModalInput('')
    }
  }

  // Cerrar modal
  const closeModal = () => {
    setModalType(null)
    setSelectedTopicId(null)
    setModalInput('')
  }

  // Agregar, editar o eliminar tópico
  const handleModalAccept = () => {
    if (modalType === 'add') {
      const newTopic = { id: nextTopicId, name: modalInput }
      setTopics([...topics, newTopic])
      setNextTopicId(nextTopicId + 1)
    }
    if (modalType === 'edit' && selectedTopicId) {
      setTopics(topics.map(t => t.id === selectedTopicId ? { ...t, name: modalInput } : t))
    }
    if (modalType === 'delete' && selectedTopicId) {
      setTopics(topics.filter(t => t.id !== selectedTopicId))
    }
    closeModal()
  }

  return (
    <div className="editor-page">
      <h2 className="editor-title">Curso Activo : Python</h2>

      {/* --- Tarjetas de tópicos --- */}
      <div className="topics-container">
        {topics.slice(0, 3).map((topic) => (
          <div key={topic.id} className="topic-card">
            <div className="topic-card-body">
              <p>{topic.name}</p>
            </div>
            <div className="topic-card-actions">
              {/* Botones con imágenes en lugar de iconos */}
              <button onClick={() => openModal('edit', topic.id)} className="action-btn">
                <img src={lapiEditar} alt="Editar" className="action-icon" />
              </button>
              <button onClick={() => openModal('delete', topic.id)} className="action-btn">
                <img src={basurero} alt="Eliminar" className="action-icon" />
              </button>
            </div>
          </div>
        ))}
        {topics.length > 3 && <button className="show-more-btn">Mostrar más</button>}
        <button onClick={() => openModal('add')} className="add-topic-btn">+</button>
      </div>

      {/* --- Modal --- */}
      {modalType && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{modalType === 'add' ? 'Añadir Tópico' : modalType === 'edit' ? 'Editar Tópico' : 'Eliminar Tópico'}</h3>
            </div>
            <input
              className="modal-input"
              value={modalInput}
              onChange={(e) => setModalInput(e.target.value)}
              autoFocus
            />
            <div className="modal-actions">
              <button className="btn-primary" onClick={handleModalAccept}>Aceptar</button>
              <button className="btn-danger" onClick={closeModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfesorEditorPage
