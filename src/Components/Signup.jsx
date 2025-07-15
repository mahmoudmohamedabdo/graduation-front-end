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

  const handleSendVerificationCode = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const userName = e.target.userName.value.trim();
    const password = e.target.password.value.trim();
    const confirmPassword = e.target.confirmPassword.value.trim();
    const companyName = e.target.companyName?.value?.trim();
    const firstName = e.target.firstName?.value?.trim();
    const lastName = e.target.lastName?.value?.trim();

    // Validation
    if (accountType === "user") {
      if (!firstName || !lastName || !userName || !email) {
        alert("Please fill all required fields: First Name, Last Name, Username, Email");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
    } else if (accountType === "company") {
      if (!companyName || !userName || !email) {
        alert("Please fill all required fields: Company Name, Username, Email");
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
    if (userName.length < 3 || userName.length > 100) {
      alert("Username must be between 3 and 100 characters");
      return;
    }

    // Store form data temporarily in localStorage
    // SECURITY NOTE: Storing passwords in localStorage is insecure. Clear after verification or use a secure backend session.
    const tempUserData = {
      email,
      userName,
      password,
      confirmPassword,
      accountType,
      ...(accountType === "user" ? { firstName, lastName } : { companyName }),
    };
    localStorage.setItem("tempUserData", JSON.stringify(tempUserData));
    localStorage.setItem("userEmail", email);
    localStorage.setItem("username", userName);
    localStorage.setItem("userRole", accountType === "user" ? "JobSeeker" : "Employer");

    try {
      // Send request to generate verification code
      const endpoint = 'http://fit4job.runasp.net/api/Authentication/Verification';
      const payload = {
        emailOrUsername: email,
      };

      console.log("Sending verification code request to:", endpoint);
      console.log("Request payload:", JSON.stringify(payload, null, 2));

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", [...response.headers.entries()]);
      const text = await response.text();
      console.log("Raw response:", text);

      if (!text) {
        throw new Error("Empty response from server");
      }

      let result;
      try {
        result = JSON.parse(text);
      } catch (error) {
        console.error("Failed to parse response:", text);
        throw new Error("Invalid response format from server");
      }

      console.log("Parsed response:", JSON.stringify(result, null, 2));

      if (response.ok) {
        alert("Verification code sent to your email. Please check your inbox.");
        navigate("/verify");
      } else {
        let errorMessage = result.message || result.detail || "Unknown error";
        if (response.status === 400 && result.errors?.VerificationCode) {
          errorMessage = "Verification code is required. The endpoint may be incorrect. Please check the API documentation or contact support.";
        } else if (response.status === 404) {
          errorMessage = "Verification code endpoint not found. Please verify the endpoint or contact support.";
        } else if (result.errorCode === 120) {
          errorMessage = "Email or Username is already registered.";
          localStorage.removeItem("tempUserData");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("username");
          localStorage.removeItem("userRole");
        } else if (result.errors && Object.keys(result.errors).length > 0) {
          errorMessage = Object.values(result.errors).flat().join(", ");
        }
        console.error("Failed to send verification code:", errorMessage, result);
        alert(`Failed to send verification code: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert(`An error occurred: ${error.message}. Please try again or contact support.`);
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
        <div className="w-1/2 hidden md:block">
          <img src={auth} alt="Professional workspace" className="w-full h-full object-cover" />
        </div>
        <div className="w-full md:w-1/2 relative overflow-hidden bg-gray-50 p-8 md:p-12">
          <div className="w-full max-w-sm">
            <button
              onClick={() => navigate("/login")}
              className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
            <h2 className="text-4xl font-extrabold mb-8 text-gray-900 text-center">
              Create an account
            </h2>
            <form className="space-y-5" onSubmit={handleSendVerificationCode}>
              {accountType === "user" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">First name</label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Enter your first name"
                      className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-[#2563EB] placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Last name</label>
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
                  <label className="block text-sm text-gray-600 mb-1">Company Name</label>
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
                <label className="block text-sm text-gray-600 mb-1">Username</label>
                <input
                  type="text"
                  name="userName"
                  placeholder="Enter your username"
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-[#2563EB] placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email Address</label>
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
              <button
                type="submit"
                className="w-full bg-[#2563EB] text-white py-3 rounded-md hover:bg-[#2546EB] transition font-semibold"
              >
                Send Verification Code
              </button>
            </form>
            <p className="mt-6 text-sm text-gray-500 text-center">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
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