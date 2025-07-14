import { EyeIcon } from "lucide-react";
import auth from "../assets/Images/auth.jpg";

export default function VerifyCode() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-white rounded-l-[2rem]">
        <div className="w-full max-w-sm space-y-6">
          <button className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to login
          </button>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">Verify code</h2>
            <p className="text-sm text-gray-600 mt-1">
              An authentication code has been sent to your om@il.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter Code
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="W00bnl0k"
                className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <EyeIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 cursor-pointer" />
            </div>
            <div className="text-sm mt-2 text-gray-500">
              Didn’t receive a code?{" "}
              <button className="text-blue-600 hover:underline font-medium">
                Heeced
              </button>
            </div>
          </div>

          <button className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-md transition hover:bg-blue-700">
            Vodfy
          </button>
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