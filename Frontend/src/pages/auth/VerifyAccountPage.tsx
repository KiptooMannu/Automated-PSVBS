// # Extracts token from URL and triggers verification process
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { usersAPI } from "../../features/users/usersAPI";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const VerifyAccountPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

const [verifyUser, { isLoading, isSuccess, isError }] = usersAPI.useVerifyUserMutation();

  useEffect(() => {
    if (token) {
      verifyUser({ token });
    }
  }, [token, verifyUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-sm text-center space-y-4">
        {isLoading && (
          <>
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto" />
            <p className="text-gray-700">Verifying your account...</p>
          </>
        )}

        {isSuccess && (
          <>
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-800">Account Verified!</h2>
            <p className="text-gray-600">Your account has been successfully verified. You can now log in.</p>
          </>
        )}

        {isError && (
          <>
            <XCircle className="h-12 w-12 text-red-600 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-800">Verification Failed</h2>
            <p className="text-gray-600">Something went wrong. Please try again later or contact support.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyAccountPage;