// ENTRY POINT FOR CHECKOUT PAGE
import { getCurrentUser } from "../../../assets/script/firebase.auth.js";
import { PLAN_DETAILS } from "../../../assets/script/data.js";
// import razorpayCheckout from "./razorpay.js";
import initCashfree from "./cashfree.js";

const getParams = () => {
  const params = new URLSearchParams(window.location.search);
  const plan = params.get("plan");

  if (!plan) {
    alert("invalid plan");
    throw new Error("invalid plan");
  }

  return plan;
};

const renderPlanDetails = (plan) => {
  const planDetails = PLAN_DETAILS[plan];
  const planDetailsContainer = document.getElementById("plan-details");
  planDetailsContainer.innerHTML = `
    <h2>${planDetails.title}</h2>
    <p>${planDetails.price}</p>
    <ul>
      ${planDetails.features.map((feature) => `<li>${feature}</li>`).join("")}
    </ul>
  `;
};

document.addEventListener("DOMContentLoaded", async () => {
  const plan = getParams();
  renderPlanDetails(plan);
  const checkoutBtn = document.getElementById("checkout-btn");

  checkoutBtn.addEventListener("click", async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert("Please login to continue");
      window.location.href = "../../auth/login.html";
      return;
    }
    // razorpayCheckout({ planId: PLAN_DETAILS[plan].planId });
    await initCashfree(PLAN_DETAILS[plan].planId);
    window.location.href = "../../index.html";
  });
});
