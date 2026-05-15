// Telegram WebApp
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
let referralCount = parseInt(localStorage.getItem("referralCount") || "0");
let referralEarned = parseInt(localStorage.getItem("referralEarned") || "0");

// Task Completion
let tasksCompleted = {
  twitter: localStorage.getItem("task_twitter") === "true",
  telegram: localStorage.getItem("task_telegram") === "true",
  share: localStorage.getItem("task_share") === "true"
};

// Fetch Bot Username
async function fetchBotUsername() {
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
    const data = await res.json();
    if (data.ok && data.result.username) {
      BOT_USERNAME = data.result.username;
      updateRefLink();
    }
  } catch(e) { console.warn("Using default bot"); }
}

// Initialize User
function initUser() {
  if (tg.initDataUnsafe?.user) {
    let user = tg.initDataUnsafe.user;
    document.getElementById("userName").innerText = `${user.first_name || "Crypto"} ${user.last_name || ""}`.trim();
    userId = user.id.toString();
    localStorage.setItem("uid", userId);
  } else {
    userId = localStorage.getItem("uid") || ("UID-" + Math.random().toString(36).substring(2, 10).toUpperCase());
    localStorage.setItem("uid", userId);
    if (!localStorage.getItem("userName")) localStorage.setItem("userName", "Alex Johnson");
    document.getElementById("userName").innerText = localStorage.getItem("userName");
  }
  document.getElementById("userId").innerHTML = userId;
}

// Get Referral Link
function getRefLink() {
  return `https://t.me/${BOT_USERNAME}?start=ref-${userId}`;
}

function updateRefLink() {
  document.getElementById("refLinkText").innerText = getRefLink();
}

// Copy Referral Link
window.copyUserId = function() {
  navigator.clipboard.writeText(userId);
  showToast("User ID copied!");
};

document.getElementById("copyRefBtn")?.addEventListener("click", () => {
  navigator.clipboard.writeText(getRefLink());
  showToast("Referral link copied!");
});

// Update UI
function updateUI() {
  document.getElementById("pointsDisplay").innerText = points;
  document.getElementById("streakDisplay").innerText = streak;
  document.getElementById("balanceAmount").innerHTML = points;
  
  let percent = Math.min((points / 1000) * 100, 100);
  document.getElementById("withdrawProgress").style.width = percent + "%";
  document.getElementById("progressPercent").innerText = Math.floor(percent) + "%";
  
  document.getElementById("referralCount").innerText = referralCount;
  document.getElementById("referralEarned").innerText = referralEarned;
  
  localStorage.setItem("points", points);
  localStorage.setItem("streak", streak);
  localStorage.setItem("referralCount", referralCount);
  localStorage.setItem("referralEarned", referralEarned);
}

// Check-in
window.checkIn = function() {
  const today = new Date().toDateString();
  if (lastCheckinDate === today) {
    showToast("Already checked in today!");
    return;
  }
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (lastCheckinDate === yesterday.toDateString()) streak++;
  else streak = 1;
  
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
      showToast("Task already completed!");
      checkbox.checked = true;
      return;
    }
    points += value;
    tasksCompleted[taskKey] = true;
    localStorage.setItem(`task_${taskKey}`, "true");
    updateUI();
    showToast(`+${value} points earned!`, "success");
  } else {
    if (tasksCompleted[taskKey]) checkbox.checked = true;
  }
};

// Withdraw
document.getElementById("withdrawBtn")?.addEventListener("click", () => {
  let amount = parseInt(document.getElementById("withdrawAmount")?.value);
  let address = document.getElementById("withdrawAddress")?.value;
  
  if (!address) {
    showToast("Please enter wallet address!", "error");
    return;
  }
  if (!amount || amount < 1000) {
    showToast("Minimum withdrawal is 1000 points!", "error");
    return;
  }
  if (amount > points) {
    showToast("Insufficient balance!", "error");
    return;
  }
  
  points -= amount;
  updateUI();
  showToast(`Withdrawal request sent! ${amount} points will be processed.`, "success");
  document.getElementById("withdrawAmount").value = "";
  document.getElementById("withdrawAddress").value = "";
});

// Theme Toggle
document.getElementById("themeToggle")?.addEventListener("click", () => {
  document.body.classList.toggle("light");
  let icon = document.querySelector("#themeToggle i");
  if (document.body.classList.contains("light")) {
    icon.className = "fas fa-sun";
    document.body.style.background = "#F5F7FA";
  } else {
    icon.className = "fas fa-moon";
    document.body.style.background = "linear-gradient(180deg, #0A0C15 0%, #12141F 100%)";
  }
});

// Logout
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  if (confirm("Reset all progress?")) {
    localStorage.clear();
    location.reload();
  }
});

// Toast
function showToast(msg, type = "info") {
  let toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  initUser();
  updateUI();
  initCheckboxes();
  fetchBotUsername().then(() => updateRefLink());
  document.getElementById("checkinBtn")?.addEventListener("click", window.checkIn);
  
  // Withdraw method selector
  document.querySelectorAll(".withdraw-method").forEach(method => {
    method.addEventListener("click", function() {
      document.querySelectorAll(".withdraw-method").forEach(m => m.classList.remove("active"));
      this.classList.add("active");
    });
  });
});

function initCheckboxes() {
  document.getElementById("taskTwitter").checked = tasksCompleted.twitter;
  document.getElementById("taskTelegram").checked = tasksCompleted.telegram;
  document.getElementById("taskShare").checked = tasksCompleted.share;
}

// Bottom Nav
document.querySelectorAll(".nav-item").forEach((item, idx) => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
    item.classList.add("active");
    let msgs = ["Home", "Analytics Coming Soon", "Rewards Coming Soon", "Profile"];
    showToast(msgs[idx]);
  });
});