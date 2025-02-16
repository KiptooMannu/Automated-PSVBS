import { MailCheck } from "lucide-react";

const VerificationNotice = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-sm text-center space-y-4">
        <MailCheck className="h-12 w-12 text-green-600 mx-auto" />
        <h2 className="text-xl font-semibold text-gray-800">Check your email</h2>
        <p className="text-gray-600">
          We’ve sent a verification link to your email. Please check your inbox and click on the link to verify your account.
        </p>
      </div>
    </div>
  );
};

export default VerificationNotice;