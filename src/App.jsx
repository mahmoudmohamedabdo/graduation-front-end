import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from './Pages/landingpage/LandingPage';
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
import VerifyCode from './Components/VerifyCode'
import CompanyDashboard from "./Components/CompanyDashboardMain/Dashboard/CompanyDashboard";
import JobPostForm from "./Components/CompanyDashboardMain/JobPostForm";
import CompanyProfile from "./Components/CompanyDashboardMain/CompanyProfile";
import { ResponsesView } from "./Components/CompanyDashboardMain/ResponsesView";
import { SidebarLayout } from "./layouts/SidebarLayout";
import "./App.css";
import "./App.css";
import Login from "./Components/login";
import Signup from "./Components/SignUp";
import TrackManager from "./Components/Admin Dashboard/TrackManager";
import AddExamQuestions from "./Pages/AddExamQuestions";
import AddQuestionOptions from "./Pages/AddQuestionOptions";
import CompaniesTable from "./Components/Admin Dashboard/CompaniesTable";
import { AdminDashboardLayout } from "./layouts/AdminDashboardLayout";
import { AdminDashboardHome } from "./Pages/AdminDashboardHome";

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
          <Route path="/" element={<LandingPage />} />
          <Route path="/landingpage" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/companydashboard" element={<CompanyDashboard />} />
          <Route path="/company-profile" element={<CompanyProfile />} />
          <Route path="/job-quiz/:id" element={<JobPostForm />} />
          <Route path="/ResponsesView" element={<SidebarLayout><ResponsesView /></SidebarLayout>} />
          <Route path="/quiz/:id" element={<JobQuizPage />} />
          <Route path="/verify" element={<VerifyCode />} />
          <Route path="/trackManager" element={<TrackManager/>} />
          <Route path="/admin/exams/:examId/add-questions" element={<AddExamQuestions />} />
          <Route path="/admin/questions/:questionId/add-options" element={<AddQuestionOptions />} />
          <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboardLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboardHome />} />
            <Route path="tracks" element={<TrackManager />} />
            <Route path="companies" element={<CompaniesTable />} />
          </Route>

          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/level" element={<ProtectedRoute><Level /></ProtectedRoute>} />
          <Route path="/myLearning" element={<ProtectedRoute><MyLearning /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/exam/:id" element={<ProtectedRoute><ExamPage /></ProtectedRoute>} />
          <Route path="/track/:id" element={<ProtectedRoute><Track /></ProtectedRoute>} />
          <Route path="/jops" element={<ProtectedRoute><Jops /></ProtectedRoute>} />
          <Route path="/jopDetails/:id" element={<ProtectedRoute><JopDetails /></ProtectedRoute>} />
          <Route path="/jopTask/:id" element={<ProtectedRoute><JopTask /></ProtectedRoute>} />

        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;