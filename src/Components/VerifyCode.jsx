import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import auth from "../assets/Images/auth.jpg";

export default function VerifyCode() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const emailOrUsername = localStorage.getItem("userEmail") || localStorage.getItem("username");
    const userRole = localStorage.getItem("userRole");

    if (!emailOrUsername) {
      setError("No email or username found. Please sign up again.");
      setIsLoading(false);
      return;
    }

    if (!code.trim()) {
      setError("Please enter the verification code.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://fit4job.runasp.net/api/Authentication/Verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername, verificationCode: code.trim() }),
      });

      console.log("Verification request:", { emailOrUsername, verificationCode: code.trim() });
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
        alert("Verification successful!");
        navigate(userRole === "JobSeeker" ? "/jobs" : "/companydashboard");
      } else {
        let errorMessage = result.message || result.detail || "Unknown error";
        if (result.errorCode === 120) {
          errorMessage = "Invalid or expired verification code.";
        }
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error:", error.message);
      setError(`An error occurred: ${error.message}. Please try again or contact support.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError(null);
    setIsLoading(true);

    const email = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("username");
    const userRole = localStorage.getItem("userRole");

    if (!email || !userName || !userRole) {
      setError("No account details found. Please sign up again.");
      setIsLoading(false);
      return;
    }

    const userData = {
      email,
      userName,
      password: "TempPassword123!", // Dummy password, as backend may require it
      confirmPassword: "TempPassword123!",
      role: userRole,
      ...(userRole === "JobSeeker" ? {
        firstName: "Temp",
        lastName: "User"
      } : {
        companyName: "Temp Company"
      }),
    };

    try {
      const endpoint = userRole === "JobSeeker"
        ? "http://fit4job.runasp.net/api/Authentication/Registration/JobSeeker"
        : "http://fit4job.runasp.net/api/Authentication/Registration/Company";

      console.log("Resending code to:", endpoint);
      console.log("Request payload:", JSON.stringify({ ...userData, password: "****", confirmPassword: "****" }, null, 2));

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      console.log("Resend response status:", response.status);

      const text = await response.text();
      console.log("Raw resend response:", text);

      if (!text) {
        throw new Error("Empty response from server");
      }

      let result;
      try {
        result = JSON.parse(text);
      } catch (error) {
        console.error("Failed to parse resend response:", text);
        throw new Error("Invalid response format from server");
      }

      if (response.ok && result.success) {
        alert("Verification code resent successfully! Check your email.");
      } else {
        let errorMessage = result.message || result.detail || "Unknown error";
        if (result.errorCode === 120) {
          errorMessage = "Email or Username is already registered.";
        }
        setError(`Failed to resend code: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Resend error:", error.message);
      setError(`Failed to resend code: ${error.message}. Please try again or contact support.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-white rounded-l-[2rem]">
        <div className="w-full max-w-sm space-y-6">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to login
          </button>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">Verify Code</h2>
            <p className="text-sm text-gray-600 mt-1">
              An authentication code has been sent to your email.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="W00bnl0k"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
              <div className="text-sm mt-2 text-gray-500">
                Didn’t receive a code?{" "}
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-blue-600 hover:underline font-medium"
                  disabled={isLoading}
                >
                  Resend Code
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-md transition hover:bg-blue-700 disabled:bg-blue-400"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      </div>

      {/* Right: Image */}
      <div className="hidden md:block w-1/2">
        <img
          src={auth}
          alt="Verification background"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}