import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import BrandLogo from "../assets/Images/BrandLogo.png";
import auth from "../assets/Images/auth.jpg";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState("user");

  const handleLogIn = async (e) => {
    e.preventDefault();
    const emailOrUsername = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const rememberMe = e.target.rememberMe.checked;

    // Validation
    if (!emailOrUsername || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrUsername)) {
      alert("Please enter a valid email address");
      return;
    }
    if (!password || password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    const userData = {
      emailOrUsername,
      password,
      rememberMe,
      // Include role only if API expects it
      // role: accountType === "user" ? "JobSeeker" : "Employer",
    };

    try {
      const endpoint = "http://fit4job.runasp.net/api/Authentication/Test/Login";
      console.log("Sending request to:", endpoint);
      console.log("Request payload:", JSON.stringify({ ...userData, password: "****" }, null, 2));

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      console.log("Response status:", response.status);
      console.log("Content-Type:", response.headers.get("content-type"));

      const text = await response.text();
      if (!text) {
        throw new Error("Empty response from server");
      }

      let result;
      try {
        result = JSON.parse(text);
      } catch (error) {
        console.error("Failed to parse response:", text);
        throw new Error("Invalid response format");
      }

      console.log("Full API response:", JSON.stringify(result, null, 2));

      if (response.ok && result.success) {
        const data = result.data || result;
        console.log("Raw response data:", data); // Log raw data to inspect all fields
        const userId = data.id || data.userId || data.companyId;
        const userRole = data.role || data.userRole || (accountType === "user" ? "JobSeeker" : "Employer");

        if (!userId) {
          throw new Error("Invalid response: Missing id or companyId");
        }

        // Validate userRole
        const validRoles = ["JobSeeker", "Employer"];
        const finalRole = validRoles.includes(userRole) ? userRole : (accountType === "user" ? "JobSeeker" : "Employer");

        if (!validRoles.includes(userRole)) {
          console.warn(`Unknown user role: ${userRole}. Using fallback: ${finalRole}`);
        }

        console.log("Login successful:", data);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userRole", finalRole);
        console.log("Logged User ID:", userId, "Role:", finalRole);

        if (rememberMe) {
          if (data.token) localStorage.setItem("authToken", data.token);
          if (data.email) localStorage.setItem("userEmail", data.email);
          if (data.username) localStorage.setItem("username", data.username);
          if (data.companyId) localStorage.setItem("companyId", data.companyId);
        }

        if (finalRole === "Employer") {
          navigate("/companydashboard");
        } else {
          navigate("/home");
        }
      } else {
        let errorMessage = result.message || result.detail || "Unknown error";
        if (result.errors) {
          errorMessage = Object.entries(result.errors)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join("; ");
        }
        console.error("Login failed:", errorMessage, result);
        alert(
          `Failed to login: ${errorMessage}. Please verify your credentials, ensure the correct account type is selected, or sign up for a new ${accountType === "user" ? "Job Seeker" : "Employer"} account at /signup.`
        );
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert(`Failed to login: ${error.message}. Please try again or sign up at /signup.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div
        className="w-full max-w-5xl rounded-[4rem] overflow-hidden shadow-2xl bg-white flex flex-row-reverse md:flex-row"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="w-1/2 hidden md:block">
          <img src={auth} alt="Professional workspace" className="w-full h-full object-cover" />
        </div>
        <div className="w-full md:w-1/2 relative overflow-hidden bg-gray-50 p-8 md:p-12">
          <div className="w-full max-w-sm">
            <button
              onClick={() => navigate('/signup')}
              className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
            <div className="flex justify-center mb-6">
              <img src={BrandLogo} alt="Brand Logo" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
              Welcome Back to Fit 4 Job
            </h2>
            <form className="space-y-5" onSubmit={handleLogIn}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="example@domain.com"
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-[#2563EB] placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="************"
                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-[#2563EB] placeholder-gray-400 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>
              <div className="flex gap-4 mt-2">
                <label
                  className={`flex-1 py-2 text-center border rounded-md cursor-pointer ${
                    accountType === "user"
                      ? "border-blue-500 text-blue-600 font-semibold"
                      : "border-gray-300 text-gray-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="accountType"
                    value="user"
                    className="hidden"
                    onChange={() => setAccountType("user")}
                    checked={accountType === "user"}
                  />
                  As a Job Seeker
                </label>
                <label
                  className={`flex-1 py-2 text-center border rounded-md cursor-pointer ${
                    accountType === "company"
                      ? "border-blue-500 text-blue-600 font-semibold"
                      : "border-gray-300 text-gray-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="accountType"
                    value="company"
                    className="hidden"
                    onChange={() => setAccountType("company")}
                    checked={accountType === "company"}
                  />
                  As a Company
                </label>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-500">
                  <input type="checkbox" name="rememberMe" className="mr-2" />
                  Remember me
                </label>
                <a href="/forgot-password" className="text-sm text-[#2563EB] hover:underline">
                  Forgot your password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full bg-[#2563EB] text-white py-3 rounded-md hover:bg-[#2546EB] transition font-semibold"
              >
                Login
              </button>
            </form>
            <p className="mt-6 text-sm text-gray-500 text-center">
              Don't have an account?{" "}
              <button
                onClick={() => navigate('/signup')}
                className="text-[#2563EB] font-medium hover:underline"
              >
                Signup
              </button>
            </p>
            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-gray-300" />
              <span className="px-4 text-gray-400 text-sm">Or</span>
              <div className="flex-grow h-px bg-gray-300" />
            </div>
            <div className="flex justify-center gap-4">
              <img
                src="https://img.icons8.com/color/48/google-logo.png"
                alt="Google"
                className="w-8 h-8 cursor-pointer"
              />
              <img
                src="https://img.icons8.com/ios-filled/50/000000/mac-os.png"
                alt="Apple"
                className="w-8 h-8 cursor-pointer"
              />
              <img
                src="https://img.icons8.com/color/48/facebook.png"
                alt="Facebook"
                className="w-8 h-8 cursor-pointer"
              />
              <img
                src="https://img.icons8.com/color/48/twitter--v1.png"
                alt="Twitter"
                className="w-8 h-8 cursor-pointer"
              />
            </div>
          </div>
        </div>
   </motion.div>
    </div>
  );
};

export default Login;