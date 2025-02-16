import { useEffect, useRef, useState, ChangeEvent, ClipboardEvent, KeyboardEvent } from "react";

interface OtpInputProps {
  length?: number;
  onOtpSubmit?: (verificationCode: string | number) => void;
  correctOtp?: string; // New prop for validating OTP
}

const OtpInput: React.FC<OtpInputProps> = ({ length = 6, onOtpSubmit = () => {}, correctOtp = "" }) => {
  const [otpValue, setOtpValue] = useState<string[]>(new Array(length).fill(""));
  const [isValid, setIsValid] = useState<boolean | null>(null); // Track OTP validity
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle input change
  const onOtpChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtpValue = [...otpValue];
    newOtpValue[index] = value.substring(value.length - 1);
    setOtpValue(newOtpValue);

    const combinedOtp = newOtpValue.join("");

    if (combinedOtp.length === length) {
      setIsValid(combinedOtp === correctOtp);
      onOtpSubmit(combinedOtp);
    }

    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle input click to adjust cursor
  const onOtpClick = (index: number) => {
    inputRefs.current[index]?.setSelectionRange(1, 1);
    if (index > 0 && !otpValue[index - 1]) {
      inputRefs.current[otpValue.indexOf("")]?.focus();
    }
  };

  // Handle keyboard events for navigation and deletion
  const onOtpKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    onOtpClick(index);
    switch (e.key) {
      case "Backspace":
        if (!otpValue[index] && index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
        break;

      case "Delete":
        if (index < length - 1) {
          const newOtpValue = [...otpValue];
          if (newOtpValue[index + 1]) {
            newOtpValue[index + 1] = "";
            setOtpValue(newOtpValue);
            inputRefs.current[index + 1]?.focus();
          }
        }
        break;

      case "ArrowRight":
        if (index < length - 1) {
          inputRefs.current[index + 1]?.focus();
        }
        break;

      case "ArrowLeft":
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
        break;

      default:
        break;
    }
  };

  // Handle pasting OTP values
  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const pasteData = e.clipboardData.getData("text").slice(0, length);

    if (/^\d+$/.test(pasteData)) {
      const newOtpValues = pasteData.split("" ).slice(0, length);
      setOtpValue(newOtpValues);

      const combinedOtp = newOtpValues.join("");
      setIsValid(combinedOtp === correctOtp);
      onOtpSubmit(combinedOtp);

      const nextInputIndex = Math.min(newOtpValues.length, length - 1);
      inputRefs.current[nextInputIndex]?.focus();
    }

    e.preventDefault();
  };

  // Auto-focus the first input on component mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div onPaste={handlePaste} className="flex flex-nowrap gap-x-2 justify-center items-center">
      {otpValue.map((value, index) => (
        <input
          key={index}
          ref={(input) => {
            inputRefs.current[index] = input;
          }}
          type="text"
          value={value}
          name={`otp-${index}`}
          id={`otp-input-${index}`}
          onChange={(e) => onOtpChange(e, index)}
          onClick={() => onOtpClick(index)}
          onKeyDown={(e) => onOtpKeyDown(e, index)}
          className={`w-8 sm:w-12 aspect-square border-2 rounded-md outline-none text-center transition-colors ${
            isValid === null
              ? 'border-gray-300'
              : isValid
              ? 'border-green-500'
              : 'border-red-500'
          }`}
        />
      ))}
    </div>
  );
};

export default OtpInput;
