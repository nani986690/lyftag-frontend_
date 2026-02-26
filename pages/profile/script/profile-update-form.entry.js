import { waitForAuth } from "../../../assets/script/firebase.auth.js";
import { postDetails, getDetails, updateDetails } from "./profile.api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("updateForm");
  const name = document.getElementById("name");
  const phone = document.getElementById("phone");
  const bloodGroup = document.getElementById("bloodGroup");
  const vehicleReg = document.getElementById("vehicleReg");
  const submitBtn = document.querySelector("button[type='submit']");
  let currentMethod = "POST";

  const user = await waitForAuth();
  if (!user) {
    return (window.location.href = "../../../index.html");
  }

  const populateData = async () => {
    submitBtn.disabled = true;

    try {
      const data = await getDetails();
      if (data) {
        currentMethod = "PATCH";
        name.value = data.ownerName || "";
        phone.value = data.ownerPhoneNumber || "";
        bloodGroup.value = data.bloodGroup || "";
        vehicleReg.value = data.vehicleRegistrationNumber || "";
      }
    } catch (error) {
      console.error("Could not fetch existing details:", error);
    }

    submitBtn.disabled = false;
  };

  populateData();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    const payload = {
      ownerName: name.value,
      ownerPhoneNumber: phone.value,
      bloodGroup: bloodGroup.value,
      vehicleRegistrationNumber: vehicleReg.value,
    };

    console.log(currentMethod, "is method");
    if (currentMethod === "POST") {
      await postDetails(payload);
    } else {
      await updateDetails(payload);
    }
    submitBtn.disabled = false;
    alert("Profile updated successfully");
    return (window.location.href = "./profile.html");
  });
});
