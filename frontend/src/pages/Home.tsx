import {  useState } from 'react'


function Home() {
  const [mensaje] = useState<string>('Cargando...')

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', marginTop: '50px' }}>
      <h1>Hola mundo</h1>
      <p>{mensaje}</p>
    </div>
  )
}

export default Home
