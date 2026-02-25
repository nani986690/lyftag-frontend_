// ENTRY POINT FOR LOGIN.HTML

import { auth } from "../../../assets/script/firebase.auth.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { validateLoginForm } from "./validation.js";

const getFormData = () => {
  const formData = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };
  return formData;
};

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  loginBtn.addEventListener("click", async () => {
    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";

    try {
      const formData = getFormData();
      validateLoginForm(formData);
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      alert("Login successful");
      window.location.href = "../../../index.html";
    } catch (error) {
      alert(error.message);
    }

    loginBtn.disabled = false;
    loginBtn.textContent = "Log in";
  });
});
