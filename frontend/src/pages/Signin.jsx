import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useLoginMutation, useRequest_login_otpMutation } from "../redux/api/users";
import { useDispatch } from "react-redux";
import { setUserCredentials } from '../redux/features/auth/authSlice';

function Signin() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [login, { isLoading: login_isLoading }] = useLoginMutation();
  const [request_otp, { isLoading: request_otp_isLoading }] = useRequest_login_otpMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showOtp) {
      try {
        const response = await login({
          email,
          otp
        }).unwrap();

        dispatch(setUserCredentials(response));
        navigate('/');
        toast.success("You Are Successfully Signin.");
      } catch (err) {
        console.error("Registration error:", err);
        const message = err?.data?.error || err?.data?.message || "Registration failed. Please try again.";
        toast.error(message);
      }
    } else {
      if (email === "") {
        toast.warning("Please enter email.");
      } else {
        try {
          await request_otp({
            email
          }).unwrap();
          setShowOtp(true);
          toast.success("Otp Sent Successfully To Your Email.");
        } catch (err) {
          console.error("Registration error:", err);
          const message = err?.data?.error || err?.data?.message || "Registration failed. Please try again.";
          toast.error(message);
        }
      }
    }
  };

  return (
    <div className="pt-20 pb-20 flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white w-[360px] p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

        {/* Email */}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg mb-4
          focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* OTP (button click ke baad hi) */}
        {showOtp && (
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg mb-4
            focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        {/* Button */}
        <button className="w-full bg-[#232f3e] text-white py-3 rounded-lg text-lg hover:bg-orange-500 hover:text-black">
          {showOtp ? login_isLoading ? "Sign In..." : "Sign In" : request_otp_isLoading ? "Sending..." : "Send Otp"}
        </button>

        <p className="text-center text-sm mt-4">
          Don’t Have An Account?
          <Link to={'/signup'} className="text-blue-600 cursor-pointer ml-1 font-bold hover:underline">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}

export default Signin;
