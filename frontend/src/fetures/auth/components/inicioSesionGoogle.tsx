import React, { useState } from 'react';
import './inicioSesionGoogle.css';

const IniciarConGoogle = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = () => {
    setLoading(true);
    setError(null);
    // Navegación al backend para iniciar OAuth
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
  };

  return (
    <div className="google-login-container">
      <button onClick={handleGoogleLogin} disabled={loading} className="google-login-btn">
        {loading ? "Cargando..." : "Iniciar sesión con Google"}
      </button>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default IniciarConGoogle;