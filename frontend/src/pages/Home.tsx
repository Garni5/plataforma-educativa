import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHola, type HolaResponse } from '../services/prueba'

function Home() {
  const [mensaje, setMensaje] = useState<string>('Cargando...')
  const navigate = useNavigate()

  // Detectar si está logeado
  const token = localStorage.getItem('token')

  useEffect(() => {
    getHola()
      .then((data: HolaResponse) => setMensaje(data.mensaje))
      .catch(() => setMensaje('Error al conectar con el backend'))
  }, [])

  return (
    <div
      style={{
        fontFamily: 'Poppins, sans-serif',
        textAlign: 'center',
        marginTop: '50px'
      }}
    >
      <h1>Hola mundo</h1>
      <p>{mensaje}</p>

      {/* Mostrar botón solo si está logeado */}
      {token && (
        <button
          onClick={() => navigate('/ProfesorEditorPage')}
          style={{
            marginTop: '20px',
            padding: '12px 18px',
            backgroundColor: '#2563eb',
            color: 'white',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Ir al Editor de Profesor
        </button>
      )}
    </div>
  )
}

export default Home
