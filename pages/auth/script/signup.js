// ENTRY POINT FOR SIGNUP.HTML

import { auth } from "../../../assets/script/firebase.auth.js";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { validateSignupForm } from "./validation.js";
import { syncUserWithBackend } from "./auth.api.js";

const getFormData = () => {
  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    confirmPassword: document.getElementById("confirmPassword").value,
    referralCode: document.getElementById("referralInput").value,
    termsAndConditions: document.getElementById("terms").checked,
  };

  return formData;
};

const handleEmailSignup = async () => {
  try {
    const formData = getFormData();
    validateSignupForm(formData);
    await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password,
    );

    await updateProfile(auth.currentUser, {
      displayName: formData.name,
    });

    const IdToken = await auth.currentUser.getIdToken(true);
    console.log("token", IdToken)
    const referralCode = formData.referralCode;

    await syncUserWithBackend(IdToken, referralCode);

    alert("Signup successful");
    window.location.href = "/";
  } catch (error) {
    alert(error.message);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const signupBtn = document.getElementById("signupBtn");
  signupBtn.addEventListener("click", async () => {
    signupBtn.disabled = true;
    signupBtn.textContent = "Signing up...";
    await handleEmailSignup();
    signupBtn.disabled = false;
    signupBtn.textContent = "Sign up";
  });
});
