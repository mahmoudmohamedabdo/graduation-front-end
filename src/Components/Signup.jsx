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
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    api: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSendVerificationCode = async (e) => {
    e.preventDefault();
    setErrors({
      firstName: "",
      lastName: "",
      companyName: "",
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      api: "",
    });
    setIsLoading(true);

    const email = e.target.email.value.trim();
    const userName = e.target.userName.value.trim();
    const password = e.target.password.value.trim();
    const confirmPassword = e.target.confirmPassword.value.trim();
    const companyName = e.target.companyName?.value?.trim();
    const firstName = e.target.firstName?.value?.trim();
    const lastName = e.target.lastName?.value?.trim();

    // Validation
    let hasErrors = false;
    const newErrors = { ...errors };

    if (accountType === "user") {
      if (!firstName) {
        newErrors.firstName = "First Name is required";
        hasErrors = true;
      }
      if (!lastName) {
        newErrors.lastName = "Last Name is required";
        hasErrors = true;
      }
    } else if (accountType === "company") {
      if (!companyName) {
        newErrors.companyName = "Company Name is required";
        hasErrors = true;
      }
    }

    if (!userName) {
      newErrors.userName = "Username is required";
      hasErrors = true;
    } else if (userName.length < 3 || userName.length > 100) {
      newErrors.userName = "Username must be between 3 and 100 characters";
      hasErrors = true;
    }

    if (!email) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
      hasErrors = true;
    } else if (email.length < 3 || email.length > 100) {
      newErrors.email = "Email must be between 3 and 100 characters";
      hasErrors = true;
    }

    if (!password) {
      newErrors.password = "Password is required";
      hasErrors = true;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      hasErrors = true;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
      hasErrors = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Save to localStorage
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
      // Attempt registration to trigger verification code
      const endpoint =
        accountType === "user"
          ? "http://fit4job.runasp.net/api/Authentication/Registration/JobSeeker"
          : "http://fit4job.runasp.net/api/Authentication/Registration/Company";

      const payload = {
        email,
        userName,
        password,
        confirmPassword,
        role: accountType === "user" ? "JobSeeker" : "Employer",
        ...(accountType === "user" ? { firstName, lastName } : { companyName }),
      };

      console.log("Email value:", email);
      console.log("Registration request to:", endpoint);
      console.log("Request payload:", JSON.stringify({ ...payload, password: "****", confirmPassword: "****" }, null, 2));

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);
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

      if (response.ok && result.success) {
        alert("Verification code sent to your email. Please check your inbox.");
        navigate("/verify");
      } else {
        let errorMessage = result.message || result.detail || "Unknown error";
        if (response.status === 400 && result.errors) {
          // Map API errors to fields
          if (result.errors.Email) {
            newErrors.email = result.errors.Email.join(", ");
          }
          if (result.errors.UserName) {
            newErrors.userName = result.errors.UserName.join(", ");
          }
          if (result.errors.Password) {
            newErrors.password = result.errors.Password.join(", ");
          }
          if (result.errors.ConfirmPassword) {
            newErrors.confirmPassword = result.errors.ConfirmPassword.join(", ");
          }
          if (result.errors.CompanyName) {
            newErrors.companyName = result.errors.CompanyName.join(", ");
          }
          if (result.errors.FirstName) {
            newErrors.firstName = result.errors.FirstName.join(", ");
          }
          if (result.errors.LastName) {
            newErrors.lastName = result.errors.LastName.join(", ");
          }
          setErrors(newErrors);
        } else if (response.status === 404) {
          setErrors({ ...newErrors, api: "Registration endpoint not found. Please contact support." });
        } else if (result.errorCode === 120) {
          newErrors.email = "This email is already registered.";
          setErrors({ ...newErrors, api: "Email or Username is already registered. Please use a different email or username." });
          localStorage.removeItem("tempUserData");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("username");
          localStorage.removeItem("userRole");
        } else {
          setErrors({ ...newErrors, api: errorMessage });
        }
      }
    } catch (error) {
      console.error("Error:", error.message);
      setErrors({ ...errors, api: `An error occurred: ${error.message}. Please try again or contact support.` });
    } finally {
      setIsLoading(false);
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
            {errors.api && <p className="text-sm text-red-500 mb-4 text-center">{errors.api}</p>}
            <form className="space-y-5" onSubmit={handleSendVerificationCode}>
              {accountType === "user" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">First name</label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Enter your first name"
                      className={`w-full border p-3 rounded-md focus:ring-2 focus:ring-[#2563EB] placeholder-gray-400 ${
                        errors.firstName ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={isLoading}
                    />
                    {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Last name</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Enter your last name"
                      className={`w-full border p-3 rounded-md focus:ring-2 focus:ring-[#2563EB] placeholder-gray-400 ${
                        errors.lastName ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={isLoading}
                    />
                    {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Enter your company name"
                    className={`w-full border p-3 rounded-md focus:ring-2 focus:ring-[#2563EB] placeholder-gray-400 ${
                      errors.companyName ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isLoading}
                  />
                  {errors.companyName && <p className="text-sm text-red-500 mt-1">{errors.companyName}</p>}
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Username</label>
                <input
                  type="text"
                  name="userName"
                  placeholder="Enter your username"
                  className={`w-full border p-3 rounded-md focus:ring-2 focus:ring-[#2563EB] placeholder-gray-400 ${
                    errors.userName ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                />
                {errors.userName && <p className="text-sm text-red-500 mt-1">{errors.userName}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className={`w-full border p-3 rounded-md focus:ring-2 focus:ring-[#2563EB] placeholder-gray-400 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
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
                    className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] placeholder-gray-400 pr-10 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500"
                    disabled={isLoading}
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
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
                    className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] placeholder-gray-400 pr-10 ${
                      errors.confirmPassword ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-500"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                  As a Company
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-[#2563EB] text-white py-3 rounded-md hover:bg-[#2546EB] transition font-semibold disabled:bg-[#2546EB]/50"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Send Verification Code"}
              </button>
            </form>
            <p className="mt-6 text-sm text-gray-500 text-center">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-[#2563EB] font-medium hover:underline"
                disabled={isLoading}
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