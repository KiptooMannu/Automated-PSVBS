import { MailCheck } from "lucide-react";

const VerificationNotice = () => {
  const handleResendEmail = () => {
    // Call your API to resend the verification email
    console.log("Resending verification email...");
    alert("Verification email has been resent. Please check your inbox.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-sm text-center space-y-4">
        <MailCheck className="h-12 w-12 text-green-600 mx-auto" />
        <h2 className="text-xl font-semibold text-gray-800">Check your email</h2>
        <p className="text-gray-600">
          We’ve sent a verification link to your email. Please check your inbox and click on the link to verify your account.
        </p>

        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={handleResendEmail}
            className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Resend Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationNotice;