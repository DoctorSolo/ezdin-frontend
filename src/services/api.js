const API_BASE_URL = "http://localhost:5000";

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
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`,
        );
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async registerUser(userData) {
    return this.makeRequest("/api/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async loginUser(credentials) {
    return this.makeRequest("/api/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async logoutUser() {
    return this.makeRequest("/api/logout", {
      method: "POST",
    });
  }

  async getCurrentUser() {
    return this.makeRequest("/api/user");
  }
}

const apiService = new ApiService();
export default apiService;
