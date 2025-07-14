import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import BrandLogo from "../assets/Images/BrandLogo.png";
import auth from "../assets/Images/auth.jpg";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Signup = () => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const userName = e.target.userName.value.trim();
    const password = e.target.password.value.trim();
    const confirmPassword = e.target.confirmPassword.value.trim();
    const companyName = e.target.companyName?.value?.trim(); // Optional for company
    const firstName = e.target.firstName?.value?.trim(); // Optional for user
    const lastName = e.target.lastName?.value?.trim(); // Optional for user

    if (accountType === "user") {
      if (!firstName || !lastName || !userName || !email) {
        alert("Please fill all required fields");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
    } else if (accountType === "company") {
      if (!companyName || !userName || !email) {
        alert("Please fill all required fields (Company Name, Username, Email)");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    const userData = accountType === "user"
      ? {
          firstName,
          lastName,
          userName,
          email,
          password,
          confirmPassword,
          role: "JobSeeker",
        }
      : {
          email,
          userName,
          password,
          confirmPassword,
          companyName,
          role: "Employer",
        };

    try {
      const response = await fetch(
        accountType === "user"
          ? "/api/Auth/Registration/JobSeeker"
          : "http://fit4job.runasp.net/api/Auth/Registration/Company",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );

      console.log("Response status:", response.status);
      console.log("Content-Type:", response.headers.get("content-type"));

      const text = await response.text();
      if (!text) throw new Error("Empty response from server");

      let result;
      try {
        result = JSON.parse(text);
      } catch (error) {
        console.error("Failed to parse response:", text);
        throw new Error("Invalid response format");
      }

      if (response.ok && result.success) { // Check both response.ok and result.success
        localStorage.setItem("userId", result.data.id || result.data.userId); // Fallback to userId if id is named differently

        if (result.data?.token) { // Only store token if it exists
          localStorage.setItem("authToken", result.data.token);
          localStorage.setItem("userEmail", result.data.email);
          localStorage.setItem("username", result.data.username || userName);
        } else {
          console.warn("No token returned in response:", result);
        }

        if (result.errorCode === 120) {
          alert("Email or Username is already registered.");
          return;
        }
        alert("Account created successfully!");
        navigate(accountType === "user" ? "/verify" : "/companydashboard");
      } else {
        console.error("Registration failed:", result);
        let errorMessage = result.message || result.detail || "Unknown error";
        if (result.errors && Object.keys(result.errors).length > 0) {
          errorMessage = Object.values(result.errors).flat().join(", ");
        } else if (result.message) {
          errorMessage = result.message; // Use the specific password validation message
        }
        alert(`Failed to register: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div
        className="w-full max-w-5xl rounded-[4rem] overflow-hidden shadow-2xl bg-white flex flex-row-reverse md:flex-row"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Image Section */}
        <div className="w-1/2 hidden md:block">
          <img src={auth} alt="Professional workspace" className="w-full h-full object-cover" />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 relative overflow-hidden bg-gray-50 p-8 md:p-12">
          <div className="w-full max-w-sm">
            <button
              onClick={() => navigate('/login')}
              className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
            <h2 className="text-4xl font-extrabold mb-8 text-gray-900 text-center">
              Create an account
            </h2>

            <form className="space-y-5" onSubmit={handleSignup}>
              {accountType === "user" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      First name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Enter your first name"
                      className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-[#2563EB] placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Last name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Enter your last name"
                      className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-[#2563EB] placeholder-gray-400"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Enter your company name"
                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-[#2563EB] placeholder-gray-400"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="userName"
                  placeholder="Enter your username"
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-[#2563EB] placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-[#2563EB] placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#9794AA] mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] placeholder-gray-400 pr-10"
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

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#9794AA] mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] placeholder-gray-400 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mt-2">
                <label
                  className={`flex-1 py-2 text-center border rounded-md cursor-pointer ${accountType === "user"
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
                  As a Job seeker
                </label>
                <label
                  className={`flex-1 py-2 text-center border rounded-md cursor-pointer ${accountType === "company"
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

              <button
                type="submit"
                className="w-full bg-[#2563EB] text-white py-3 rounded-md hover:bg-[#2546EB] transition font-semibold"
              >
                Create an account
              </button>
            </form>

            <p className="mt-6 text-sm text-gray-500 text-center">
              Already have an account?{" "}
              <button
                onClick={() => navigate('/login')}
                className="text-[#2563EB] font-medium hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;