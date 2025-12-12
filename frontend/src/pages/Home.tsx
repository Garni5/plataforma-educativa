import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const [mensaje] = useState<string>('Bienvenido a la Plataforma Educativa')
  const navigate = useNavigate()

  const handleGoToEditor = () => {
    navigate('/profesor-editor')
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Plataforma Educativa</h1>
        <p style={styles.subtitle}>{mensaje}</p>
        
        <button 
          onClick={handleGoToEditor}
          style={styles.button}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)'
          }}
        >
          📚 Profesor Editor
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 60px)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  } as React.CSSProperties,
  content: {
    textAlign: 'center' as const,
    color: 'white'
  } as React.CSSProperties,
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '10px',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
  } as React.CSSProperties,
  subtitle: {
    fontSize: '20px',
    marginBottom: '40px',
    opacity: 0.9
  } as React.CSSProperties,
  button: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: '2px solid white',
    color: 'white',
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
  } as React.CSSProperties
}

export default Home
