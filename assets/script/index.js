import { auth, waitForAuth } from "./firebase.auth.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  const authButtons = document.getElementById("auth-buttons");
  const userProfile = document.getElementById("user-profile");
  const logoutBtn = document.getElementById("logout-btn");
  const referralLoggedOut = document.getElementById("referral-logged-out");
  const referralLoggedIn = document.getElementById("referral-logged-in");
  const sidebarAuth = document.querySelector(".sidebar-auth");
  const sidebarProfile = document.getElementById("sidebar-profile");

  const user = await waitForAuth();

  if (user) {
    // Logged in — hide auth buttons, show profile + logout
    authButtons.style.display = "none";
    userProfile.style.display = "flex";
    if (sidebarAuth) sidebarAuth.classList.remove("active");
    if (sidebarProfile) sidebarProfile.classList.add("active");

    // Show logged-in referral section
    if (referralLoggedOut) referralLoggedOut.style.display = "none";
    if (referralLoggedIn) {
      referralLoggedIn.style.display = "block";

      // Set referral link as currentURL/userUID
      const referralLink = `${window.location.origin}/${user.uid}`;
      const linkInput = document.getElementById("userReferralLink");
      if (linkInput) linkInput.value = referralLink;
    }
  } else {
    // Logged out — show auth buttons, hide profile
    authButtons.style.display = "flex";
    userProfile.style.display = "none";
    if (sidebarAuth) sidebarAuth.classList.add("active");
    if (sidebarProfile) sidebarProfile.classList.remove("active");

    // Show logged-out referral section
    if (referralLoggedOut) referralLoggedOut.style.display = "block";
    if (referralLoggedIn) referralLoggedIn.style.display = "none";
  }

  // Logout handler
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await signOut(auth);
      window.location.reload();
    });
  }
});
