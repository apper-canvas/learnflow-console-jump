import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import CourseCatalog from "@/components/pages/CourseCatalog";
import CourseDetail from "@/components/pages/CourseDetail";
import LearningView from "@/components/pages/LearningView";
import Dashboard from "@/components/pages/Dashboard";
import QuizScreen from "@/components/pages/QuizScreen";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>
        <Routes>
          <Route path="/" element={<CourseCatalog />} />
          <Route path="/course/:courseId" element={<CourseDetail />} />
          <Route path="/learn/:courseId" element={<LearningView />} />
          <Route path="/learn/:courseId/quiz/:quizId" element={<QuizScreen />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default App;