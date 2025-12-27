import React, { useState, useEffect } from "react";
import { RegisterAPI, getAllCategoriesAPI } from "../api/AuthAPI";
// Using JobGate logo instead of LinkedIn logo
const LinkedinLogo = "/b528c485-1cc6-41f6-8521-404788fdef37.jpg";
import { useNavigate } from "react-router-dom";
import { getUniqueID } from "../helpers/getUniqueId";
import { toast } from "react-toastify";

export default function RegisterComponent() {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    role: "candidate", // default role
  });
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [companyCategories, setCompanyCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from backend
    const fetchCategories = async () => {
      try {
        const categories = await getAllCategoriesAPI();
        setCompanyCategories(categories.map(cat => cat.name));
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to default categories if fetch fails
        setCompanyCategories(["Technology", "Finance", "Healthcare", "Retail", "Education", "Other"]);
      }
    };

    fetchCategories();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size should be less than 5MB");
        return;
      }
      setCvFile(file);
      toast.success("CV uploaded successfully");
    }
  };

  const register = async () => {
    try {
      setLoading(true);

      // Validation
      if (!credentials.name || !credentials.email || !credentials.password) {
        toast.error("Please fill all required fields");
        setLoading(false);
        return;
      }

      if (credentials.role === "candidate" && !cvFile) {
        toast.error("Please upload your CV");
        setLoading(false);
        return;
      }

      if (credentials.role === "company") {
        if (!credentials.location || !credentials.category || !credentials.about) {
          toast.error("Please fill all company details");
          setLoading(false);
          return;
        }
      }

      const userData = {
        userID: getUniqueID(),
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        role: credentials.role,
        imageLink: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
      };

      // Add role-specific data
      if (credentials.role === "candidate") {
        userData.cvFileName = cvFile?.name;
      } else if (credentials.role === "company") {
        userData.location = credentials.location;
        userData.category = credentials.category;
        userData.about = credentials.about;
      }

      const response = await RegisterAPI(userData);
      toast.success("Account Created Successfully!");

      // Navigate based on role
      if (response.role === "company") {
        navigate("/company");
      } else if (response.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error(err.message || "Cannot Create your Account");
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
          Make the most of your professional life
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
          <div className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCredentials({ ...credentials, role: "candidate" })}
                  className={`py-3 px-4 border-2 rounded-lg text-sm font-medium transition-all ${credentials.role === "candidate"
                    ? "border-[#2FA4A9] bg-blue-50 text-[#2FA4A9]"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                >
                  👤 Candidate
                </button>
                <button
                  type="button"
                  onClick={() => setCredentials({ ...credentials, role: "company" })}
                  className={`py-3 px-4 border-2 rounded-lg text-sm font-medium transition-all ${credentials.role === "company"
                    ? "border-[#2FA4A9] bg-blue-50 text-[#2FA4A9]"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                >
                  🏢 Company
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                {credentials.role === "company" ? "Company Name" : "Full Name"}
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  type="text"
                  required
                  placeholder={credentials.role === "company" ? "e.g. Tech Corp Inc." : "e.g. John Doe"}
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-[#2FA4A9] focus:border-transparent transition-all"
                  onChange={(event) =>
                    setCredentials({ ...credentials, name: event.target.value })
                  }
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="Ex: user@example.com"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-[#2FA4A9] focus:border-transparent transition-all"
                  onChange={(event) =>
                    setCredentials({ ...credentials, email: event.target.value })
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password (6+ characters)
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="Password"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-[#2FA4A9] focus:border-transparent transition-all"
                  onChange={(event) =>
                    setCredentials({ ...credentials, password: event.target.value })
                  }
                />
              </div>
            </div>

            {/* Candidate-specific fields */}
            {credentials.role === "candidate" && (
              <div>
                <label htmlFor="cv" className="block text-sm font-medium text-gray-700">
                  Upload CV/Resume <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    id="cv"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="file-input file-input-bordered w-full focus:outline-none focus:ring-2 focus:ring-[#2FA4A9]"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Accepted formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                  {cvFile && (
                    <p className="mt-1 text-xs text-green-600">
                      ✓ {cvFile.name}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Company-specific fields */}
            {credentials.role === "company" && (
              <>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Company Location <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="location"
                      type="text"
                      required
                      placeholder="e.g. San Francisco, CA"
                      className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-[#2FA4A9] focus:border-transparent transition-all"
                      onChange={(event) =>
                        setCredentials({ ...credentials, location: event.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Company Category <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <select
                      id="category"
                      required
                      className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-[#2FA4A9] focus:border-transparent transition-all"
                      onChange={(event) =>
                        setCredentials({ ...credentials, category: event.target.value })
                      }
                    >
                      <option value="">Select a category</option>
                      {companyCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                    About Company <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="about"
                      rows="3"
                      required
                      placeholder="Brief description of your company..."
                      className="textarea textarea-bordered w-full focus:outline-none focus:ring-2 focus:ring-[#2FA4A9] focus:border-transparent transition-all"
                      onChange={(event) =>
                        setCredentials({ ...credentials, about: event.target.value })
                      }
                    />
                  </div>
                </div>
              </>
            )}

            <div className="text-xs text-gray-500 text-center">
              By clicking Agree & Join, you agree to the LinkedIn User Agreement, Privacy Policy, and Cookie Policy.
            </div>

            <div>
              <button
                onClick={register}
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-[#2FA4A9] hover:bg-[#258A8E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2FA4A9] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Agree & Join"}
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
                  Already on LinkedIn?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate("/login")}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2FA4A9] transition-colors duration-200"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
