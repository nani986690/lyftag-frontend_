import { auth, waitForAuth } from "../../assets/script/firebase.auth.js";
import apiClient from "../../assets/script/apiClient.js";

// ── DOM Elements ──
const totalEarningsEl = document.getElementById("totalEarnings");
const totalReferralsEl = document.getElementById("totalReferrals");
const pendingReferralsEl = document.getElementById("pendingReferrals");
const referralListEl = document.getElementById("referralList");
const referralLinkEl = document.getElementById("referralLink");
const copyBtn = document.getElementById("copyBtn");
const withdrawBtn = document.getElementById("withdrawBtn");
const shareWhatsApp = document.getElementById("shareWhatsApp");
const shareTelegram = document.getElementById("shareTelegram");
const shareEmail = document.getElementById("shareEmail");
const shareTwitter = document.getElementById("shareTwitter");

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const toastIcon = document.getElementById("toastIcon");
  const toastMessage = document.getElementById("toastMessage");

  toast.className = `toast ${type}`;
  toastIcon.textContent = type === "success" ? "✓" : "✗";
  toastMessage.textContent = message;
  toast.style.display = "flex";

  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderReferralHistory(transactions) {
  if (!transactions || transactions.length === 0) {
    referralListEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🎯</div>
        <p>No referrals yet. Start sharing your link!</p>
      </div>
    `;
    return;
  }


  const sorted = [...transactions].sort((a, b) => b.createdAt - a.createdAt);

  referralListEl.innerHTML = sorted
    .map(
      (tx) => `
    <div class="referral-item">
      <div class="referral-info">
        <div class="referral-name">Order #${tx.orderId.slice(0, 8)}…</div>
        <div class="referral-date">${formatDate(tx.createdAt)} • ${formatTime(tx.createdAt)}</div>
        <div class="referral-uid">User: ${tx.uid.slice(0, 8)}…</div>
      </div>
      <div class="referral-earning">+₹${tx.rewardAmount}</div>
    </div>
  `,
    )
    .join("");
}

function updateStats(transactions) {
  if (!transactions || transactions.length === 0) {
    totalEarningsEl.textContent = "0";
    totalReferralsEl.textContent = "0";
    pendingReferralsEl.textContent = "0";
    return;
  }

  const totalEarnings = transactions.reduce(
    (sum, tx) => sum + (tx.rewardAmount || 0),
    0,
  );
  const totalReferrals = transactions.length;

  totalEarningsEl.textContent = totalEarnings.toLocaleString("en-IN");
  totalReferralsEl.textContent = totalReferrals;
  pendingReferralsEl.textContent = "0";
}

const getReferralInfo = async () => {
  const token = await auth.currentUser.getIdToken();
  const response = await apiClient("/referral", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(response);
  return response;
};

function setupCopyButton() {
  copyBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(referralLinkEl.value);
      showToast("Link copied to clipboard!");
    } catch {
      referralLinkEl.select();
      document.execCommand("copy");
      showToast("Link copied to clipboard!");
    }
  });
}

// ── Share buttons ──
function setupShareButtons(link) {
  const msg = `Join LYF TAG and get smart safety technology! Sign up with my referral link: ${link}`;

  shareWhatsApp?.addEventListener("click", () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  });

  shareTelegram?.addEventListener("click", () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent("Join LYF TAG — Smart Safety Technology!")}`,
      "_blank",
    );
  });

  shareEmail?.addEventListener("click", () => {
    window.open(
      `mailto:?subject=${encodeURIComponent("Join LYF TAG!")}&body=${encodeURIComponent(msg)}`,
      "_blank",
    );
  });

  shareTwitter?.addEventListener("click", () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  });
}

// ── Withdraw button ──
function setupWithdrawButton() {
  withdrawBtn?.addEventListener("click", () => {
    showToast("Withdrawal requests will be available soon!", "error");
  });
}

// ── Init ──
document.addEventListener("DOMContentLoaded", async () => {
  const user = await waitForAuth();

  if (!user) {
    return (window.location.href = "../../index.html");
  }

  const response = await getReferralInfo();

  if (response.success && response.data) {
    const data = response.data;

    // Set referral link
    const referralCode = data.referralCode || data.code || data.refCode || "";
    if (referralCode) {
      const link = `${window.location.origin}/pages/auth/signup.html?ref=${referralCode}`;
      referralLinkEl.value = link;
      setupShareButtons(link);
    }

    // Extract transactions — try common keys or find the array in data
    let transactions = [];
    if (Array.isArray(data.transactions)) {
      transactions = data.transactions;
    } else if (Array.isArray(data.referrals)) {
      transactions = data.referrals;
    } else if (Array.isArray(data)) {
      transactions = data;
    } else {
      // Find the first array in the response data
      for (const key in data) {
        if (Array.isArray(data[key])) {
          transactions = data[key];
          break;
        }
      }
    }

    renderReferralHistory(transactions);
    updateStats(transactions);
  }

  setupCopyButton();
  setupWithdrawButton();
});
