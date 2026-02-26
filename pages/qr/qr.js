import apiClient from "../../assets/script/apiClient.js";

const getVehicleInfo = async (qrId) => {
  try {
    const response = await apiClient(`/qr/${qrId}`, {
      method: "GET",
    });

    if (response && response.success) {
      renderInfo(response.data);
    } else {
      showError(
        "Information not found",
        "Could not retrieve details for this QR.",
      );
    }
  } catch (error) {
    console.error(error);
    showError(
      "Connection Error",
      "Could not connect to the server. Please try again later.",
    );
  }
};

const renderInfo = (data) => {
  document.getElementById("loader").classList.add("hidden");
  document.getElementById("error-container").classList.add("hidden");

  const infoCard = document.getElementById("info-card");
  infoCard.classList.remove("hidden");

  // Populate data
  document.getElementById("owner-name").textContent =
    data.ownerName || "Unknown Owner";
  document.getElementById("vehicle-reg").textContent =
    data.vehicleRegistrationNumber || "N/A";
  document.getElementById("blood-group").textContent = data.bloodGroup || "N/A";

  const phoneSpan = document.getElementById("owner-phone");
  const callBtn = document.getElementById("call-btn");

  if (data.ownerPhoneNumber) {
    phoneSpan.textContent = data.ownerPhoneNumber;
    callBtn.href = `tel:${data.ownerPhoneNumber}`;
  } else {
    phoneSpan.textContent = "Not Available";
    callBtn.href = "#";
    callBtn.style.opacity = "0.5";
    callBtn.style.pointerEvents = "none";
  }
};

const showError = (title, message) => {
  document.getElementById("loader").classList.add("hidden");
  document.getElementById("info-card").classList.add("hidden");

  const errorContainer = document.getElementById("error-container");
  errorContainer.classList.remove("hidden");

  if (title) document.getElementById("error-title").textContent = title;
  if (message) document.getElementById("error-message").textContent = message;
};

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const qrId = params.get("qrId");

  if (!qrId) {
    showError("Invalid link", "No QR ID provided in the URL.");
    return;
  }

  getVehicleInfo(qrId);
});
