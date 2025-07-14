import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import auth from "../assets/Images/auth.jpg";
import { FiEye, FiEyeOff } from "react-icons/fi";
import BrandLogo from "../assets/Images/BrandLogo.png";
import { useNavigate } from "react-router-dom";
const AuthSwitcher = ({ onClose }) => {
  const navigate=useNavigate()
  const [isLogin, setIsLogin] = useState(true);
  const [accountType, setAccountType] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const handleLogIn = async (e) => {
    e.preventDefault();
    const emailOrUsername = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const rememberMe = e.target.rememberMe.checked;

    // Validate email and password
    if (!emailOrUsername || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrUsername)) {
      alert("Please enter a valid email");
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
    };

    try {
      const response = await fetch("/api/Auth/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      if (response.ok) {

       console.log("Login successful:", result);
       localStorage.setItem("userId", result.data.id);
       console.log("Logged User",result.data.id)
        // Store token if rememberMe is checked
        if (rememberMe) {
          localStorage.setItem("authToken", result.data.token);
          localStorage.setItem("userEmail", result.data.email);
          localStorage.setItem("username", result.data.username);
        }
        alert("Logged in successfully!");
        setIsLogin(true);
        navigate('/home')
      } else {
        alert("Invalid Credentials")
        console.error("Login failed:", result);
        const errorMessage = result.message || result.detail || "Unknown error";
        alert(`Failed to login: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`Invalid Credentials`);
    }
  };

 const handleSignup = async (e) => {
  e.preventDefault();

  const firstName = e.target.firstName.value.trim();
  const lastName = e.target.lastName.value.trim();
  const userName = e.target.userName.value.trim();
  const email = e.target.email.value.trim();
  const password = e.target.password.value.trim();
  const confirmPassword = e.target.confirmPassword.value.trim();

  // Validate fields
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }
  if (!firstName || !lastName || !userName || !email) {
    alert("Please fill all required fields");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Please enter a valid email");
    return;
  }
  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  const userData = {
    firstName,
    lastName,
    userName,
    email,
    password,
    confirmPassword,
    role: accountType === "user" ? "JobSeeker" : "Employer",
  };

  try {
    const response = await fetch("/api/Auth/Registration/JobSeeker", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

    if (response.ok) {
      // Store token if returned
      if (result.data?.token && result.data?.email) {
        localStorage.setItem("authToken", result.data.token);
        localStorage.setItem("userEmail", result.data.email);
        localStorage.setItem("username", result.data.username || userName);
      }
      if (result.errorCode === 120) {
        alert("Email or Username is already registered.");
        return;
      }
      alert("Account created successfully!");
      // Navigate to verification page
      navigate('/verify', { state: { email: email } }); // Pass email if needed in verify page
    } else {
      console.error("Registration failed:", result);
      // Handle validation errors
      let errorMessage = result.message || result.detail || "Unknown error";
      if (result.errors && Object.keys(result.errors).length > 0) {
        errorMessage = Object.values(result.errors)
          .flat()
          .join(", ");
      }
      alert(`Failed to register: ${errorMessage}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert(`An error occurred: ${error.message}`);
  }
};

  return (
    <div className="fixed inset-0 bg-gray-50 bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="relative w-full max-w-5xl h-[700px] rounded-[4rem] overflow-hidden shadow-2xl bg-white flex flex-row-reverse md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Section */}
        <div className="w-1/2 hidden md:block">
          <img src={auth} alt="Professional workspace" className="w-full h-full object-cover" />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 relative overflow-hidden bg-gray-50">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ x: isLogin ? "100%" : "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isLogin ? "-100%" : "100%", opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className={`absolute top-0 ${isLogin ? "left-0" : "right-0"} w-full h-full flex items-center justify-center p-8 md:p-12`}
            >
              <div className="w-full max-w-sm relative">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 text-2xl"
                  title="Close"
                >
                  ×
                </button>
                {isLogin ? (
                  <>
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

                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-500">
                          <input type="checkbox" name="rememberMe" className="mr-2" />
                          Remember me
                        </label>
                        <a href="#" className="text-sm text-[#2563EB] hover:underline">
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
                        onClick={() => setIsLogin(false)}
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
                  </>
                ) : (
                  <>
                    <h2 className="text-4xl font-extrabold mb-8 text-gray-900 text-center">
                      Create an account
                    </h2>

                    <form className="space-y-5" onSubmit={handleSignup}>
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
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-[#9794AA] mb-2"
                        >
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
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-[#9794AA] mb-2"
                        >
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

                    <p className="mt-4 text-sm text-center text-gray-500">
                      Already have an account?{" "}
                      <button
                        onClick={() => setIsLogin(true)}
                        className="text-[#2563EB] font-medium hover:underline"
                      >
                        Login
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
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthSwitcher;