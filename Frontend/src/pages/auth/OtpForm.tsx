import { toast } from "sonner";
import { usersAPI } from "../../features/users/usersAPI";
import OtpInput from "./OtpInput";
import { useState, FormEvent, MouseEvent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const OTPForm = () => {
  const [activateAccount] = usersAPI.useActivateAccountMutation();
  const [resendActivationCode] = usersAPI.useResendActivationCodeMutation();
  const [isLoading, setIsLoading] = useState({ activating: false, resending: false });
  const userId = useSelector((state: RootState) => state.user.user?.user_id ?? 0);

  const handleApiResponse = (response: any, successMessage: string) => {
    if ("error" in response) {
      const error = response.error as FetchBaseQueryError;
      const errorMessage = (error.data as { msg?: string })?.msg || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } else {
      toast.success(successMessage);
    }
  };

  const onOtpSubmit = async (activationCode: string | number) => {
    setIsLoading((prev) => ({ ...prev, activating: true }));
    try {
      const response = await activateAccount({ activationCode, user_id: userId });
      handleApiResponse(response, "Account Activated Successfully");
    } catch {
      toast.error("An error occurred while processing your request.");
    } finally {
      setIsLoading((prev) => ({ ...prev, activating: false }));
    }
  };

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const otpValue = Array.from(formData.values()).join("");

    if (otpValue.length === 6) {
      onOtpSubmit(Number(otpValue));
    } else {
      toast.error("Fill all OTP fields");
    }
  };

  const resendActivationCodeHandler = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading((prev) => ({ ...prev, resending: true }));
    try {
      const response = await resendActivationCode({ user_id: userId });
      handleApiResponse(response, "Activation Code sent successfully");
    } catch {
      toast.error("An error occurred while resending the activation code.");
    } finally {
      setIsLoading((prev) => ({ ...prev, resending: false }));
    }
  };

  return (
      <form onSubmit={onFormSubmit}>
        <OtpInput length={6} onOtpSubmit={onOtpSubmit} />
        <div className="flex justify-between items-center w-full max-w-sm mb-3 mt-6">
          <p className="label-text-alt"></p>
          <p className="label-text-alt">
            <button
              onClick={resendActivationCodeHandler}
              className="label-text-alt link text-blue-500 link-hover"
              disabled={isLoading.resending}
            >
              {isLoading.resending ? (
                <div className="flex items-center gap-x-2">
                  <span className="loading loading-spinner"></span>
                  <span> Sending...</span>
                </div>
              ) : (
                "Resend Verification code?"
              )}
            </button>
          </p>
        </div>

        <div className="w-full mt-4">
          <button type="submit" className="btn btn-secondary w-full mt-4" disabled={isLoading.activating}>
            {isLoading.activating ? (
              <>
                <span className="loading loading-spinner text-white"></span>
                <span> Activating...</span>
              </>
            ) : (
              "Activate"
            )}
          </button>
        </div>
      </form>
  );
};

export default OTPForm;