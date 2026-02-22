import apiClient from "../../../assets/script/apiClient.js";
import { auth } from "../../../assets/script/firebase.auth.js";

const createPayment = async ({ plan }) => {
  const token = await auth.currentUser.getIdToken();
  const response = await apiClient("/payments/create-order", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      plan,
    }),
  });

  return response;
};

const verifyPayment = async ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  const token = await auth.currentUser.getIdToken();
  const response = await apiClient("/payments/verify-order", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    }),
  });

  return response;
};

export { createPayment, verifyPayment };
