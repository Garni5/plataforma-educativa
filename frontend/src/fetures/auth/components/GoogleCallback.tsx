// GoogleCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/home', { replace: true }); // evita bucle
      console.log('Token recibido:', token);
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return <p>Autenticando con Google...</p>;
};

export default GoogleCallback;
