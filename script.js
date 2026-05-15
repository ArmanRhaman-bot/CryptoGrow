// Telegram WebApp Initialization
let tg = window.Telegram.WebApp;
tg.expand();

// Bot Configuration
const BOT_TOKEN = "8697935116:AAGkCTTPE0a509WNzkOTbcJEMJtDDyGOgm0";
let BOT_USERNAME = "CryptoGrowBot";

// User Data
let userId = "";
let points = parseInt(localStorage.getItem("points") || "0");
let streak = parseInt(localStorage.getItem("streak") || "0");
let lastCheckinDate = localStorage.getItem("lastCheckinDate") || "";

// Task Completion Flags
let tasksCompleted = {
  twitter: localStorage.getItem("task_twitter") === "true",
  telegram: localStorage.getItem("task_telegram") === "true",
  share: localStorage.getItem("task_share") === "true"
};

// Fetch Bot Username from Telegram API
async function fetchBotUsername() {
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
    const data = await response.json();
    if (data.ok && data.result.username) {
      BOT_USERNAME = data.result.username;
      updateReferralLink();
    }
  } catch (error) {
    console.warn("Using default bot username");
  }
}

// Initialize User from Telegram or Fallback
function initUser() {
  if (tg.initDataUnsafe?.user) {
    let user = tg.initDataUnsafe.user;
    document.getElementById("name").innerText = `${user.first_name || "Crypto"} ${user.last_name || ""}`.trim();
    userId = user.id.toString();
    localStorage.setItem("uid", userId);
    document.getElementById("avatar").src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}&backgroundColor=purple`;
    document.getElementById("userId").querySelector("span").innerText = userId;
  } else {
    if (!localStorage.getItem("uid")) {
      userId = "UID-" + Math.random().toString(36).substring(2, 10).toUpperCase();
      localStorage.setItem("uid", userId);
    } else {
      userId = localStorage.getItem("uid");
    }
    let storedName = localStorage.getItem("userName");
    if (storedName) {
      document.getElementById("name").innerText = storedName;
    } else {
      document.getElementById("name").innerText = "Alex Johnson";
      localStorage.setItem("userName", "Alex Johnson");
    }
    document.getElementById("avatar").src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;
    document.getElementById("userId").querySelector("span").innerText = userId;
  }
}

// Generate Referral Deep Link
function getReferralLink() {
  return `https://t.me/${BOT_USERNAME}?start=ref-${userId}`;
}

function updateReferralLink() {
  document.getElementById("refLinkText").innerText = getReferralLink();
}

// Copy Referral Link
async function copyRefLink() {
  const link = getReferralLink();
  try {
    await navigator.clipboard.writeText(link);
    showToast("Referral link copied! Share with friends.", "success");
  } catch (err) {
    showToast("Press Ctrl+C to copy", "info");
  }
}

// Update UI Elements
function updateUI() {
  document.getElementById("points").innerText = points;
  document.getElementById("balance").innerText = points;
  document.getElementById("streak").innerHTML = `<i class="fas fa-fire"></i> <span>${streak} day streak</span>`;
  
  const withdrawBtn = document.getElementById("withdrawBtn");
  if (points < 1000) {
    withdrawBtn.disabled = true;
  } else {
    withdrawBtn.disabled = false;
  }
  
  localStorage.setItem("points", points);
  localStorage.setItem("streak", streak);
}

// Check-in Function
window.checkIn = function() {
  const today = new Date().toDateString();
  if (lastCheckinDate === today) {
    showToast("You already checked in today!", "warning");
    return;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (lastCheckinDate === yesterday.toDateString()) {
    streak++;
  } else {
    streak = 1;
  }
  
  points += 20;
  lastCheckinDate = today;
  localStorage.setItem("lastCheckinDate", today);
  updateUI();
  showToast("Check-in successful! +20 points", "success");
};

// Complete Task
window.completeTask = function(value, checkbox, taskKey) {
  if (checkbox.checked) {
    if (tasksCompleted[taskKey]) {
      showToast("Task already completed!", "warning");
      checkbox.checked = true;
      return;
    }
    points += value;
    tasksCompleted[taskKey] = true;
    localStorage.setItem(`task_${taskKey}`, "true");
    updateUI();
    showToast(`+${value} points earned!`, "success");
  } else {
    if (tasksCompleted[taskKey]) {
      checkbox.checked = true;
      showToast("Cannot undo completed task", "info");
    }
  }
};

// Withdraw Function
window.withdraw = function() {
  if (points >= 1000) {
    showToast("Withdrawal request sent successfully!", "success");
  } else {
    showToast(`Need ${1000 - points} more points to withdraw`, "error");
    const btn = document.getElementById("withdrawBtn");
    btn.style.animation = "pulse 0.3s ease";
    setTimeout(() => btn.style.animation = "", 300);
  }
};

// Toast Notification
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.classList.remove("hidden");
  
  let borderColor = "#22c55e";
  if (type === "error") borderColor = "#ef4444";
  if (type === "warning") borderColor = "#f59e0b";
  toast.style.borderLeftColor = borderColor;
  
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2500);
}

// Theme Toggle
function toggleTheme() {
  document.body.classList.toggle("light");
  const icon = document.querySelector("#themeToggle i");
  if (document.body.classList.contains("light")) {
    icon.className = "fas fa-sun";
  } else {
    icon.className = "fas fa-moon";
  }
}

// Logout / Reset
function logout() {
  if (confirm("Are you sure? All progress will be reset.")) {
    localStorage.clear();
    location.reload();
  }
}

// Initialize Checkboxes State
function initCheckboxes() {
  document.getElementById("taskTwitter").checked = tasksCompleted.twitter;
  document.getElementById("taskTelegram").checked = tasksCompleted.telegram;
  document.getElementById("taskShare").checked = tasksCompleted.share;
}

// Bottom Navigation Active State
function initBottomNav() {
  const navBtns = document.querySelectorAll(".bottom-nav button");
  navBtns.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      navBtns.forEach(b => b.classList.remove("nav-active"));
      btn.classList.add("nav-active");
      const messages = ["Home Dashboard", "Statistics (Coming Soon)", "Invite Friends for 200 pts", "Withdrawal History"];
      showToast(messages[idx], "info");
    });
  });
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  initUser();
  initCheckboxes();
  updateUI();
  fetchBotUsername().then(() => updateReferralLink());
  
  document.getElementById("checkinBtn").addEventListener("click", window.checkIn);
  document.getElementById("copyRefBtn").addEventListener("click", copyRefLink);
  document.getElementById("withdrawBtn").addEventListener("click", window.withdraw);
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  document.getElementById("logoutBtn").addEventListener("click", logout);
  
  initBottomNav();
});