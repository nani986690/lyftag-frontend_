import { getDetails } from "./profile.api.js";
import { auth, waitForAuth } from "../../../assets/script/firebase.auth.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  const profileName = document.getElementById("profileName");
  const fullName = document.getElementById("fullName");
  const phoneNum = document.getElementById("phoneNum");
  const bloodGroup = document.getElementById("bloodGroup");
  const vehicleNumber = document.getElementById("vehicleNumber");
  const logoutBtn = document.getElementById("logoutBtn");

  const user = await waitForAuth();

  if (!user) {
    return (window.location.href = "../../index.html");
  }

  const generateQRCode = (qrId) => {
    const qrContainer = document.getElementById("qrcode");
    if (qrContainer && qrId) {
      qrContainer.innerHTML = ""; // Clear existing
      new QRCode(qrContainer, {
        text: `${window.location.origin}/pages/qr/qr.html?qrId=${qrId}`,
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    }
  };

  const populateData = async () => {
    try {
      const data = await getDetails();

      if (data) {
        profileName.textContent = data.ownerName || "";
        fullName.textContent = data.ownerName || "";
        phoneNum.textContent = data.ownerPhoneNumber || "";
        bloodGroup.textContent = data.bloodGroup || "";
        vehicleNumber.textContent = data.vehicleRegistrationNumber || "";

        if (data.qrId) {
          generateQRCode(data.qrId);
        }
      }
    } catch (error) {
      console.error("Could not fetch existing details:", error);
    }
  };

  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "../../index.html";
  });

  populateData();
});
