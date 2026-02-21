import apiClient from "../../../assets/script/apiClient.js";
import { auth } from "../../../assets/script/firebase.auth.js";

const postDetails = async ({
  ownerName,
  bloodGroup,
  ownerPhoneNumber,
  vehicleRegistrationNumber,
}) => {
  const token = await auth.currentUser.getIdToken();
  try {
    const response = await apiClient("/user/details", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ownerName,
        bloodGroup,
        ownerPhoneNumber,
        vehicleRegistrationNumber,
      }),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getDetails = async () => {
  const token = await auth.currentUser.getIdToken();

  try {
    const response = await apiClient("/user/details", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateDetails = async (updates) => {
  const token = await auth.currentUser.getIdToken();
  try {
    const response = await apiClient(`/user/details`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { postDetails, getDetails, updateDetails };
