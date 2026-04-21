import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import StudyPlanner from './pages/StudyPlanner';
import './App.css';

// Layouts
import AppLayout from "./layouts/AppLayout";
import MentorLayout from "./layouts/MentorLayout";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Student Pages
import Dashboard from "./student/Dashboard";
import SyllabusView from "./student/SyllabusView";
import RevisionPlanner from "./student/RevisionPlanner";
import WeakTopics from "./student/WeakTopics";
import Notes from './student/Notes'; 
import AISummary from "./student/AISummary";

// Mentor Pages
import MentorDashboard from "./mentor/MentorDashboard";
import StudentDirectory from "./mentor/StudentDirectory";
import SyllabusManager from "./mentor/SyllabusManager";
import ProgressTracker from "./mentor/ProgressTracker";
import MaterialsManager from "./mentor/MaterialsManager";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Student Layout Routes */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/syllabus" element={<SyllabusView />} />
          <Route path="/revision-plan" element={<RevisionPlanner />} />
          <Route path="/weak-topics" element={<WeakTopics />} />
          <Route path="/planner" element={<StudyPlanner />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/ai-summary" element={<AISummary />} />
        </Route>

        {/* Mentor Layout Routes */}
        <Route element={<MentorLayout />}>
          <Route path="/mentor/dashboard" element={<MentorDashboard />} />
          <Route path="/mentor/students" element={<StudentDirectory />} />
          <Route path="/mentor/syllabus" element={<SyllabusManager />} />
          <Route path="/mentor/progress" element={<ProgressTracker />} />
          <Route path="/mentor/materials" element={<MaterialsManager />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}