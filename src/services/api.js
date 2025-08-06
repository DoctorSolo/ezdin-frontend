// Configuração da URL base da API
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://ezdin-backend.onrender.com"
    : "http://localhost:5000";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // Importante para manter sessões
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // =============== AUTH ENDPOINTS ===============
  async registerUser(userData) {
    return this.makeRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async loginUser(credentials) {
    return this.makeRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async logoutUser() {
    return this.makeRequest("/api/auth/logout", {
      method: "POST",
    });
  }

  async getUserStatus() {
    return this.makeRequest("/api/auth/status");
  }

  async updateProfile(profileData) {
    return this.makeRequest("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  // =============== LESSONS ENDPOINTS ===============
  async getLessons() {
    return this.makeRequest("/api/lessons/");
  }

  async getLessonById(lessonId) {
    return this.makeRequest(`/api/lessons/${lessonId}`);
  }

  async completeLesson(lessonId, answer) {
    return this.makeRequest(`/api/lessons/${lessonId}/complete`, {
      method: "POST",
      body: JSON.stringify({ answer }),
    });
  }

  async getUserProgress() {
    return this.makeRequest("/api/lessons/current_user_progress");
  }

  async createLesson(lessonData) {
    return this.makeRequest("/api/lessons/", {
      method: "POST",
      body: JSON.stringify(lessonData),
    });
  }
}

const apiService = new ApiService();
export default apiService;
