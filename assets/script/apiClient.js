// const BASE_URL = "http://localhost:3000";
// const BASE_URL = "https://annette-nondesignate-cryptically.ngrok-free.dev";
const BASE_URL = "https://lyftag-backend-production.up.railway.app";

const apiClient = async (endPoint, options = {}) => {
  try {
    const defaultHeaders = {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    };

    const configs = {
      method: options.method || "POST",
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
    };
    const response = await fetch(`${BASE_URL}${endPoint}`, configs);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP Error: ${response.status}`);
    }

    return {
      success: true,
      data: data,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to connect to server",
      error: error.toString(),
    };
  }
};

export default apiClient;
