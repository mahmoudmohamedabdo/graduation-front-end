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
import AuthSwitcher from "./Components/AuthSwitcher";
import Profile from "./Pages/Profile";
import MyLearning from "./Pages/MyLearning";
import ProtectedRoute from "./Pages/ProtectedRoute";
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
          {/* صفحات عامة */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/landingpage" element={<LandingPage />} />
          <Route path="/auth" element={<AuthSwitcher />} />
          <Route path="/quiz" element={<JobQuizPage />} />

          {/* صفحات محمية */}
          <Route path="/home" element={
            <ProtectedRoute><HomePage /></ProtectedRoute>
          } />
          <Route path="/level" element={
            <ProtectedRoute><Level /></ProtectedRoute>
          } />
          <Route path="/myLearning" element={
            <ProtectedRoute><MyLearning /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/exam" element={
            <ProtectedRoute><ExamPage /></ProtectedRoute>
          } />
          <Route path="/track/:id" element={
            <ProtectedRoute><Track /></ProtectedRoute>
          } />
          <Route path="/jops" element={
            <ProtectedRoute><Jops /></ProtectedRoute>
          } />
          <Route path="/jopDetails" element={
            <ProtectedRoute><JopDetails /></ProtectedRoute>
          } />
          <Route path="/jopTask" element={
            <ProtectedRoute><JopTask /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
