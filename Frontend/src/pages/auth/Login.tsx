import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginAPI, LoginFormData } from "../../features/login/loginAPI";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from 'sonner';
import { useDispatch } from "react-redux";
import Navbar from "../../components/Navbar/Navbar";
import { loginSuccess } from "../../features/users/userSlice";
import { ApiDomain } from "../../utils/ApiDomain";

type FormData = {
  email: string;
  password: string;
};

const schema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginUser] = loginAPI.useLoginUserMutation();
  const [isLoggingIn, setIsLoggingIn] = useState(false); // login loader

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: yupResolver(schema) });

  // submit form
  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    console.log("Submitting login request:", JSON.stringify(data));
    try {
      setIsLoggingIn(true); // Show logging in loader

      const response = await fetch("http://localhost:8081/login", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    });
    const responseData = await response.json();
        console.log("Login response:", response.status, responseData);

        if (!response.ok) {
            toast.error(responseData.message || "Invalid credentials");

            console.error("API error:", responseData.message);

            return;
        }

        // ✅ Save user data in localStorage
localStorage.setItem("user", JSON.stringify(responseData));

dispatch(loginSuccess(responseData));
toast.success("Login successful");


      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      // console.error("API error:", err); // error
      toast.error("Invalid credentials");
    } finally {
      setIsLoggingIn(false); // Hide loader
    }
  };

  return (
    <div>
      <Toaster
        toastOptions={{
          classNames: {
            error: 'bg-red-400',
            success: 'text-green-400',
            warning: 'text-yellow-400',
            info: 'bg-blue-400',
          },
        }} />
      <Navbar />
      <div className="hero-content flex-col lg:flex-row-reverse lg:gap-16 h-screen max-w-full border-2">
        <div className="card bg-base-100 w-full lg:w-[40%] shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body">
            <div className="form-control">
              <input type="email" placeholder="email" className="input input-bordered" required {...register("email")} />
              <p className="text-red-500">{errors.email?.message}</p>
            </div>

            <div className="form-control">
              <input type="password" placeholder="password" className="input input-bordered" required {...register("password")} />
              <p className="text-red-500">{errors.password?.message}</p>
            </div>

            <div>
              <label className="label">
                <a href="/forgot-password" className="label-text-alt link link-hover">Forgot password?</a>
              </label>
            </div>

            <div className="form-control mt-2">
              <button type="submit" className="btn bg-webcolor text-text-light hover:text-black border-none">
                {isLoggingIn ? (
                  <>
                    <span className="loading loading-spinner text-text-light"></span>
                    <span className='text-text-light'>Logging in...</span>
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>

            <div className="form-control mt-2">
              <Link to="/register" className="label-text-alt link link-hover">Don't have an account? Register </Link>
            </div>
          </form>
        </div>

        <div className="hidden lg:block w-full lg:w-[25%]">
          <img src="https://www.gitsoftwaresolutions.com/assets/whyUs/4.png" alt="auth" className="w-full h-full object-cover lg:object-fill rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export default Login;
