import apiClient from "../../../assets/script/apiClient.js";

const syncUserWithBackend = async (token, referredById = null) => {
  try {
    const referredBy = referredById || "NO_REFERRAL";
    const response = await apiClient("/auth/sync-user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ referredBy }),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export { syncUserWithBackend };
