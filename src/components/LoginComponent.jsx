import React, { useState } from "react";
import { LoginAPI } from "../api/AuthAPI";
// Using JobGate logo instead of LinkedIn logo
const LinkedinLogo = "/b528c485-1cc6-41f6-8521-404788fdef37.jpg";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginComponent() {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({});
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);

      if (!credentials.email || !credentials.password) {
        toast.error("Please enter email and password");
        setLoading(false);
        return;
      }

      const response = await LoginAPI(credentials.email, credentials.password);
      toast.success("Signed In Successfully!");

      // Navigate based on role
      if (response.role === "admin") {
        navigate("/admin");
      } else if (response.role === "company") {
        navigate("/company");
      } else {
        navigate("/home");
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error(err.message || "Please Check your Credentials");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-['Inter']">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <span
          className="block mx-auto text-4xl font-bold text-center select-none"
          style={{
            background: 'linear-gradient(135deg,  #2FA4A9 0%, #5BC0BE 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          JobGate
        </span>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your professional world
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Ex: user@example.com"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-[#2FA4A9] focus:border-transparent transition-all"
                  onChange={(event) =>
                    setCredentials({ ...credentials, email: event.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Password"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-[#2FA4A9] focus:border-transparent transition-all"
                  onChange={(event) =>
                    setCredentials({ ...credentials, password: event.target.value })
                  }
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      login();
                    }
                  }}
                />
              </div>
            </div>

            <div className="text-xs text-gray-500">
              <a href="#" className="text-[#2FA4A9] hover:underline">
                Forgot password?
              </a>
            </div>

            <div>
              <button
                onClick={login}
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-[#2FA4A9] hover:bg-[#258A8E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2FA4A9] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  New to JobGate?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate("/register")}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2FA4A9] transition-colors duration-200"
              >
                Join now
              </button>
            </div>
          </div>

          {/* Admin Login Hint */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Admin access: jobgate@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
