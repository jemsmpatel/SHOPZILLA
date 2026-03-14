import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../redux/api/users";
import { toast } from "react-toastify";

function Signup() {
  const [email, setEmail] = useState("");
  const [fname, setFname] = useState("");
  const [contact, setContact] = useState("");
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({
        fname,
        email,
        contact,
      }).unwrap();

      navigate("/signin");
      toast.success("User successfully registered.");
    } catch (err) {
      console.error("Registration error:", err);
      const message =
        err?.data?.error ||
        err?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="pt-20 pb-20 flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-[360px] p-8 rounded-2xl shadow-xl text-center"
      >
        <h1 className="text-3xl font-bold mb-6">Sign Up</h1>

        {/* Full Name */}
        <input
          type="text"
          placeholder="Full Name"
          value={fname}
          onChange={(e) => setFname(e.target.value)}
          className="w-full px-4 py-3 mb-4 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 mb-4 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Contact */}
        <input
          type="text"
          placeholder="Contact"
          value={contact}
          maxLength={10}
          onChange={(e) => setContact(e.target.value)}
          className="w-full px-4 py-3 mb-6 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-[#232f3e] text-white py-3 rounded-lg text-lg font-semibold hover:bg-orange-500 hover:text-black"
        >
          {isLoading ? "Sign Up..." : "Sign Up"}
        </button>

        <hr className="my-6" />

        <p className="text-sm text-gray-700">
          Already Have An Account?
          <Link
            to={"/signin"}
            className="text-blue-600 cursor-pointer ml-1 font-bold hover:underline"
          >
            Sign In
          </Link>
          . By Clicking Sign Up, You Agree To The Terms Of Use.
        </p>
      </form>
    </div>
  );
}

export default Signup;
