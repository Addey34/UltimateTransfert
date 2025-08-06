import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from './AuthService';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const error = params.get('error');

      if (error || !token) {
        localStorage.removeItem('token');
        navigate('/');
        return;
      }
      try {
        await AuthService.handleCallback(token);
        navigate('/');
      } catch (err) {
        console.error('Error during auth callback', err);
        navigate('/');
      }
    };

    handleCallback();
  }, [navigate]);

  return null;
};

export default AuthCallback;
