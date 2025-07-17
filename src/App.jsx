import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import LandingPage from './Pages/landingpage/LandingPage';
import Login from "./Components/login";
import Signup from "./Components/SignUp";
import VerifyCode from './Components/VerifyCode';

import HomePage from './Pages/HomePage/HomePage';
import Level from "./Pages/Level/Level";
import ExamPage from "./Pages/student/ExamPage";
import Track from "./Pages/Track/Track";
import Jops from "./Pages/Jops/Jops";
import JopDetails from "./Pages/JopDetails/JopDetails";
import JopTask from "./Pages/JopTask/JopTask";
import JobQuizPage from "./Pages/JobQuizPage";
import Profile from "./Pages/Profile";
import MyLearning from "./Pages/MyLearning";
import ProtectedRoute from "./Pages/ProtectedRoute";

import CompanyDashboard from "./Components/CompanyDashboardMain/Dashboard/CompanyDashboard";
import JobPostForm from "./Components/CompanyDashboardMain/JobPostForm";
import AddExamForm from "./Components/CompanyDashboardMain/AddExamForm";
import CompanyProfile from "./Components/CompanyDashboardMain/CompanyProfile";
// import ResponsesView from "./Components/CompanyDashboardMain/ResponsesView";

import TrackManager from "./Components/Admin Dashboard/TrackManager";

import "./app.css";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/landingpage" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<VerifyCode />} />

          {/* Company Dashboard */}
          <Route path="/companydashboard" element={<CompanyDashboard />} />
          <Route path="/company-profile" element={<CompanyProfile />} />
          <Route path="/job-post/:id" element={<JobPostForm />} />
          <Route path="/add-exam/:jobId" element={<AddExamForm />} />

          {/* Admin Dashboard */}
          <Route path="/trackManager" element={<TrackManager />} />

          {/* Protected Routes */}
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/level" element={<ProtectedRoute><Level /></ProtectedRoute>} />
          <Route path="/myLearning" element={<ProtectedRoute><MyLearning /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/quiz" element={<ProtectedRoute><JobQuizPage /></ProtectedRoute>} />
          <Route path="/exam/:id" element={<ProtectedRoute><ExamPage /></ProtectedRoute>} />
          <Route path="/track/:id" element={<ProtectedRoute><Track /></ProtectedRoute>} />
          <Route path="/jops" element={<ProtectedRoute><Jops /></ProtectedRoute>} />
          <Route path="/jopDetails/:id" element={<ProtectedRoute><JopDetails /></ProtectedRoute>} />
          <Route path="/jopTask/:id" element={<ProtectedRoute><JopTask /></ProtectedRoute>} />

          {/* Future Features */}
          {/* <Route path="/ResponsesView" element={<ProtectedRoute><ResponsesView /></ProtectedRoute>} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
