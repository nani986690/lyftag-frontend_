import { createPayment, verifyPayment } from "./payments.api.js";

const RAZORPAY_KEY_ID = "rzp_test_S1HTg3qd801pNt";

const razorpayCheckout = async ({ planId }) => {
  try {
    const createPaymentResponse = await createPayment({ plan: planId });

    if (!createPaymentResponse.success) {
      alert("Failed to create payment");
      return;
    }

    const { razorpayOrderId, amount } = createPaymentResponse.data;

    const RAZORPAY_OPTIONS = {
      key: RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: "INR",
      name: "LyfTag",
      description: "LyfTag Subscription",
      order_id: razorpayOrderId,
      handler: async (response) => {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
          response;

        const verifyResponse = await verifyPayment({
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        });

        if (verifyResponse.success) {
          alert("Payment successful");
        } else {
          alert("Payment failed");
        }
      },
    };

    const rzp = new Razorpay(RAZORPAY_OPTIONS);
    rzp.open();
  } catch (error) {
    console.log(error);
    alert(error.message);
  }
};

export default razorpayCheckout;
