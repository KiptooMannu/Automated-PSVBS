

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyAccountPage = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      verifyToken(token);
    } else {
      setError('Invalid or missing verification token.');
      setMessage(null);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`http://localhost:8081/verify/${token}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Account successfully verified!');
        setError(null);
        // delay redirect to login page
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      }
       else {
        setError(data.error || 'Verification failed.');
        setMessage(null);
      }
    } catch (err) {
      setError('An error occurred while verifying your account.');
      setMessage(null);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm w-full">
        {message && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Success!</h2>
            <p className="text-gray-700 mb-4">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Go to Login
            </button>
          </div>
        )}
        {error && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Verification Failed</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Go to Registration Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyAccountPage;
