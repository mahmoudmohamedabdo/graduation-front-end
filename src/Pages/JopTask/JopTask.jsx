import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TaskOverlay from './Components/TaskOvelay';
import JopNav from '../../layouts/JopNav';

export default function JopTask() {
  const { id: jobId } = useParams();
  const [showOverlay, setShowOverlay] = useState(false);
  const [task, setTask] = useState(null);
  const [jobApplicationId, setJobApplicationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");
   console.log("first",userId)
  const handleOpenOverlay = () => setShowOverlay(true);
  const handleCloseOverlay = () => setShowOverlay(false);

  // ✅ طباعة القيم عند تغيرها
  useEffect(() => {
    console.log('✅ userId:', userId);
    console.log('✅ jobId:', jobId);
  }, [userId, jobId]);

  // ✅ طباعة jobApplicationId بعد التحديث
  useEffect(() => {
    if (jobApplicationId !== null) {
      console.log('✅ jobApplicationId:', jobApplicationId);
    }
  }, [jobApplicationId]);

  // 🟢 جلب بيانات المهمة
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`http://fit4job.runasp.net/api/CompanyTasks/job/${jobId}`);
        if (res.data.success && res.data.data) {
          setTask(res.data.data);
          setError(null);
        } else {
          setTask(null);
          setError('This job has no task');
        }
      } catch (err) {
        setTask(null);
        setError('This job has no task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [jobId]);

  // 🟢 جلب JobApplicationId
  useEffect(() => {
    const fetchJobApplication = async () => {
      try {
        const res = await axios.get(
          `http://fit4job.runasp.net/api/JobApplications/job/${jobId}/user/${userId}`
        );

        if (res.data.success && res.data.data) {
          const applicationId = res.data.data.id;
          setJobApplicationId(applicationId);
          localStorage.setItem("applicationId", applicationId);
          console.log('✅ Job Application found and saved:', applicationId);
        } else {
          console.warn('⚠️ Job Application not found for this user and job.');
          setJobApplicationId(null);
        }
      } catch (err) {
        console.error('❌ Error fetching job application:', err);
        setJobApplicationId(null);
      }
    };

    if (userId && jobId) {
      fetchJobApplication();
    }
  }, [userId, jobId]);

  useEffect(() => {
    document.body.style.overflow = showOverlay ? 'hidden' : 'auto';
  }, [showOverlay]);

  return (
    <div className="container px-4 mx-auto w-sm-full">
      {/* Header */}
      <div className="p-6 bg-gray-50 shadow-md">
        <div className="bg-white p-4 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">Frontend Development</h2>
        </div>
        <JopNav id={jobId} />
      </div>

      {/* Task Section */}
      <h2 className="text-xl font-bold mx-2 my-6">Technical Task</h2>

      {loading ? (
        <p className="text-gray-600 m-5">Loading...</p>
      ) : error ? (
        <p className="text-red-600 font-medium m-5">{error}</p>
      ) : (
        <div className="bg-white p-6 rounded shadow-sm m-5">
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold text-gray-900 mb-6">{task.title}</span>
            <span className="inline-flex mb-3 items-center gap-1 text-[#166534] text-[13px] bg-[#DCFCE7] rounded-2xl px-3 py-1">
              submitted
            </span>
          </div>
          <span className="font-normal my-5 mb-6 block">{task.description}</span>
          <h3 className="text-md my-1 font-semibold text-gray-800 mb-2">Requirements:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
            {task.requirements.split('\n').map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
          <div className="flex justify-between items-center my-2">
            <span className="text-[#6B7280] font-light text-[11px]">
              Deadline: {new Date(task.deadline).toLocaleDateString()}
            </span>
            <button
              className="btn bg-[#16A34A] text-white rounded-lg px-8 py-2"
              onClick={handleOpenOverlay}
            >
              View Details
            </button>
          </div>
        </div>
      )}

      <TaskOverlay
        isClose={handleCloseOverlay}
        isOpen={showOverlay}
        userId={userId}
        jobApplicationId={jobApplicationId}
        task={task}
      />
    </div>
  );
}
