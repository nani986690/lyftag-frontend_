import { createPayment } from "./payments.api.js";

async function startPayment(paymentSessionId) {
  const cashfree = Cashfree({
    mode: "sandbox", // change to production later
  });

  const result = await cashfree.checkout({
    paymentSessionId: paymentSessionId,
    redirectTarget: "_modal",
  });

  if (result.error) {
    console.error("Payment error:", result.error);
    alert("Payment failed: " + result.error.message);
    return;
  }

  if (result.paymentDetails) {
    console.log("Payment success:", result.paymentDetails);
    alert("Payment successful!");

  }
}

const initCashfree = async (plan) => {
  try {
    const createPaymentResponse = await createPayment({ plan });

    if (!createPaymentResponse.success) {
      alert("Failed to create payment");
      return;
    }

    const { paymentSessionId } = createPaymentResponse.data;

    await startPayment(paymentSessionId);
  } catch (error) {
    console.log(error);
    alert(error.message);
  }
};

export default initCashfree;
