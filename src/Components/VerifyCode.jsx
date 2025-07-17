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
    const tempUserData = JSON.parse(localStorage.getItem("tempUserData"));

    if (!emailOrUsername || !userRole || !tempUserData) {
      setError("No account details found. Please sign up again.");
      setIsLoading(false);
      navigate("/signup");
      return;
    }

    if (!code.trim()) {
      setError("Please enter the verification code.");
      setIsLoading(false);
      return;
    }

    try {
      const verifyEndpoint = 'http://fit4job.runasp.net/api/Authentication/Verification';
      const verifyPayload = {
        emailOrUsername,
        verificationCode: code.trim(),
      };

      console.log("Verification request:", verifyPayload);
      const verifyResponse = await fetch(verifyEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(verifyPayload),
      });

      console.log("Verification response status:", verifyResponse.status);
      const verifyText = await verifyResponse.text();
      console.log("Raw verification response:", verifyText);

      if (!verifyText) {
        throw new Error("Empty response from server");
      }

      let verifyResult;
      try {
        verifyResult = JSON.parse(verifyText);
      } catch (error) {
        console.error("Failed to parse verification response:", verifyText);
        throw new Error("Invalid response format from server");
      }

      console.log("Parsed verification response:", JSON.stringify(verifyResult, null, 2));

      if (verifyResponse.ok && verifyResult.success) {
        alert("Account verified successfully!");
        localStorage.removeItem("tempUserData");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("username");
        localStorage.removeItem("userRole");
        navigate(userRole === "JobSeeker" ? "/home" : "/companydashboard");
      } else {
        let errorMessage = verifyResult.message || verifyResult.detail || "Invalid verification code";
        if (verifyResult.errorCode === 120) {
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
    const userRole = localStorage.getItem("userRole");
    const tempUserData = JSON.parse(localStorage.getItem("tempUserData"));

    if (!email || !userRole || !tempUserData) {
      setError("No account details found. Please sign up again.");
      setIsLoading(false);
      navigate("/signup");
      return;
    }

    try {
      // Try sending verification code via /Verification endpoint
      const verifyEndpoint = "http://fit4job.runasp.net/api/Authentication/Verification";
      const resendPayload = { emailOrUsername: email };

      console.log("Resend verification request to:", verifyEndpoint);
      console.log("Resend payload:", JSON.stringify(resendPayload, null, 2));

      const response = await fetch(verifyEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resendPayload),
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

      console.log("Parsed resend response:", JSON.stringify(result, null, 2));

      if (response.ok && result.success) {
        alert("Verification code resent successfully! Check your email.");
      } else {
        // Fallback to re-registering
        const endpoint =
          userRole === "JobSeeker"
            ? "http://fit4job.runasp.net/api/Authentication/Registration/JobSeeker"
            : "http://fit4job.runasp.net/api/Authentication/Registration/Company";

        const payload = {
          email: tempUserData.email,
          userName: tempUserData.userName,
          password: tempUserData.password,
          confirmPassword: tempUserData.confirmPassword,
          role: userRole,
          ...(userRole === "JobSeeker"
            ? { firstName: tempUserData.firstName, lastName: tempUserData.lastName }
            : { companyName: tempUserData.companyName }),
        };

        console.log("Fallback resend registration request to:", endpoint);
        console.log("Fallback request payload:", JSON.stringify({ ...payload, password: "****", confirmPassword: "****" }, null, 2));

        const fallbackResponse = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        console.log("Fallback resend response status:", fallbackResponse.status);
        const fallbackText = await fallbackResponse.text();
        console.log("Raw fallback resend response:", fallbackText);

        if (!fallbackText) {
          throw new Error("Empty response from server");
        }

        let fallbackResult;
        try {
          fallbackResult = JSON.parse(fallbackText);
        } catch (error) {
          console.error("Failed to parse fallback resend response:", fallbackText);
          throw new Error("Invalid response format from server");
        }

        if (fallbackResponse.ok && fallbackResult.success) {
          alert("Verification code resent successfully! Check your email.");
        } else {
          let errorMessage = fallbackResult.message || fallbackResult.detail || "Unknown error";
          if (fallbackResult.errorCode === 120) {
            errorMessage = "Email or Username is already registered. Please sign up with a different email.";
            navigate("/signup");
          }
          setError(`Failed to resend code: ${errorMessage}. If you didn’t receive a code, please contact support.`);
        }
      }
    } catch (error) {
      console.error("Resend error:", error.message);
      setError(`Failed to resend code: ${error.message}. If you didn’t receive a code, please contact support.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
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
                className={`w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? "border-red-500" : "border-gray-300"}`}
                required
                disabled={isLoading}
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