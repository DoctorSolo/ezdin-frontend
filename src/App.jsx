import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CoursePlatformPage from "./pages/CoursePlatformPage";
import ProfilePage from "./pages/ProfilePage";
import LessonPageWrapper from "./pages/LessonPageWrapper";
import AdminContentBuilder from "./pages/AdminContentBuilder";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/plataforma" element={<CoursePlatformPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/aula/:id" element={<LessonPageWrapper />} />
        <Route path="/admin" element={<AdminContentBuilder />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
