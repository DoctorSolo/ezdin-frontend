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
import AdminUserManagement from "./pages/AdminUserManagement";
import { AuthProvider } from "./contexts/AuthContext";
import { LessonsProvider } from "./contexts/LessonsContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <LessonsProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route 
              path="/plataforma" 
              element={
                <ProtectedRoute>
                  <CoursePlatformPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/perfil" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/aula/:id" 
              element={
                <ProtectedRoute>
                  <LessonPageWrapper />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminContentBuilder />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute>
                  <AdminUserManagement />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </LessonsProvider>
    </AuthProvider>
  );
}

export default App;
