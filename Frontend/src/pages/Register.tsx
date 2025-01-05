
import { useForm, SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
// import authImage from "../../assets/images/auth/authimg.png"
import { usersAPI } from "../features/users/usersAPI"
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from 'sonner'
import Navbar from "../components/Navbar/Navbar"


type FormData = {
  full_name: string
  email: string
  contact_phone: string
  address: string
  password: string
  confirmPassword: string
}

const schema = yup.object().shape({
  full_name: yup.string().required("Full name is required"),
  email: yup.string().email().required("Email is required"),
  contact_phone: yup.string().required("Phone number is required"),
  address: yup.string().required("Address is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords must match").required("Confirm password is required")
})

const Register = () => {
  const navigate = useNavigate();
  const [createUser, { error }] = usersAPI.useCreateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    // reset
  } = useForm<FormData>({ resolver: yupResolver(schema) })

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log("Submitting data:", data);
    try {
      const response = await createUser(data);
      console.log("Response data:", response); // success
      toast.success("Registration successful")
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      if (error) {
        console.error("API error:", error); // error
        if ('data' in error && error.data) { //parse and display error details from the response
          toast.error("Invalid credentials")
          console.error("Error details:", error.data);
        }
      }
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

      <div className="hero-content flex-col lg:flex-row-reverse lg:gap-16 h-full max-w-full border-2">
        <div className="card bg-base-100 w-full lg:w-[40%] shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body">
            <div className="form-control">
              <input type="text" placeholder="fullname" className="input input-bordered" required {...register("full_name")} />
              <p className="text-red-500">{errors.full_name?.message}</p>
            </div>
            <div className="form-control">
              <input type="email" placeholder="email" className="input input-bordered" required {...register("email")} />
              <p className="text-red-500">{errors.email?.message}</p>
            </div>

            <div className="form-control">
              <input type="string" placeholder="phone number" className="input input-bordered" required {...register("contact_phone")} />
              <p className="text-red-500">{errors.contact_phone?.message}</p>
            </div>

            {/* for address */}
            <div className="form-control">
              <input type="string" placeholder="address" className="input input-bordered" required {...register("address")} />
              <p className="text-red-500">{errors.address?.message}</p>
            </div>

            <div className="form-control">
              <input type="password" placeholder="password" className="input input-bordered" required {...register("password")} />
              <p className="text-red-500">{errors.password?.message}</p>
            </div>

            <div className="form-control">
              <input type="password" placeholder="confirm password" className="input input-bordered" required {...register("confirmPassword")} />
              <p className="text-red-500">{errors.confirmPassword?.message}</p>
            </div>
            <div>
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
              </label>
            </div>

            <div className="form-control mt-2">
              <button type="submit" className="btn bg-webcolor text-text-light hover:text-black border-none">Register</button>
            </div>

            <div className="form-control mt-2">
            <Link to="/login" className="label-text-alt link link-hover">Already have an account? Login </Link>
            </div>

          </form>
        </div>


        <div className="hidden lg:block w-full lg:w-[35%] ">
          {/* <img src={authImage} alt="auth" className="w-full h-full object-cover lg:object-fill rounded-lg" /> */}
        </div>

      </div>
    </div>


  )
}

export default Register