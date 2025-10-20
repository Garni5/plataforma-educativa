import { useEffect, useState } from 'react'
import { getHola, type HolaResponse } from '../services/prueba' // ajusta la ruta si es diferente

function Home() {
  const [mensaje, setMensaje] = useState<string>('Cargando...')

  useEffect(() => {
    getHola()
      .then((data: HolaResponse) => setMensaje(data.mensaje))
      .catch(() => setMensaje('Error al conectar con el backend'))
  }, [])

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', marginTop: '50px' }}>
      <h1>Hola mundo</h1>
      <p>{mensaje}</p>
    </div>
  )
}

export default Home
