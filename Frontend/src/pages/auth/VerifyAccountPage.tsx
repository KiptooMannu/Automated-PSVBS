import { useEffect, useState } from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VerifyAccountPage = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'invalid' | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      verifyUser(token);
    } else {
      setStatus('invalid');
      setMessage('Invalid verification link. No token provided.');
    }
  }, []);

  const verifyUser = async (token: string) => {
    setStatus('loading');
    try {
      const response = await fetch(`http://localhost:8081/verify/${token}`);
      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Account successfully verified!');
      } else {
        throw new Error(data.message || 'Verification failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Verification failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-sm text-center space-y-4">
        {status === 'loading' && (
          <>
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto" />
            <p className="text-gray-700">Verifying your account...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-800">Account Verified!</h2>
            <p className="text-gray-600">{message}</p>
            <button
              className="mt-4 bg-webcolor text-white px-4 py-2 rounded hover:bg-opacity-90"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="h-12 w-12 text-red-600 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-800">Verification Failed</h2>
            <p className="text-gray-600">{message}</p>
            <button
              className="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              onClick={() => navigate('/register')}
            >
              Register Again
            </button>
          </>
        )}

        {status === 'invalid' && (
          <>
            <XCircle className="h-12 w-12 text-red-600 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-800">Invalid Link</h2>
            <p className="text-gray-600">{message}</p>
            <button
              className="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              onClick={() => navigate('/register')}
            >
              Register Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyAccountPage;
