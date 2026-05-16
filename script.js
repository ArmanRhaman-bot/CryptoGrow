/* ===================================================
   CryptoGrow – script.js
   =================================================== */

const BOT_TOKEN = "8697935116:AAGkCTTPE0a509WNzkOTbcJEMJtDDyGOgm0";
const ADMIN_UID = "7124539200";
let BOT_USERNAME = "";

// ── TELEGRAM INIT ─────────────────────────────────
let tg = window.Telegram?.WebApp;
if (tg) tg.expand();

// ── STATE ─────────────────────────────────────────
let points = 0;
let streak = 0;
let lastCheckin = "";
let completedTasks = [];
let referrals = [];
let withdrawalHistory = [];
let userUID = "";

// Withdraw state
let selectedCoin = null;
let wdAddress = "";
let wdAmount = 0;
let currentStep = 0;

// ── LOAD DATA FROM localStorage ────────────────────
function loadData() {
  points = parseInt(localStorage.getItem("points") || "0");
  streak = parseInt(localStorage.getItem("streak") || "0");
  lastCheckin = localStorage.getItem("lastCheckin") || "";
  completedTasks = JSON.parse(localStorage.getItem("completedTasks") || "[]");
  referrals = JSON.parse(localStorage.getItem("referrals") || "[]");
  withdrawalHistory = JSON.parse(localStorage.getItem("withdrawalHistory") || "[]");
  
  // Check for referral in URL params
  checkReferralParam();
}

function saveData() {
  localStorage.setItem("points", points);
  localStorage.setItem("streak", streak);
  localStorage.setItem("lastCheckin", lastCheckin);
  localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  localStorage.setItem("referrals", JSON.stringify(referrals));
  localStorage.setItem("withdrawalHistory", JSON.stringify(withdrawalHistory));
}

// ── CHECK REFERRAL FROM URL ────────────────────────
function checkReferralParam() {
  const urlParams = new URLSearchParams(window.location.search);
  const startParam = urlParams.get('start');
  if (startParam && startParam.startsWith('ref-')) {
    const referrerUID = startParam.replace('ref-', '');
    if (referrerUID && referrerUID !== userUID && !referrals.includes(referrerUID)) {
      referrals.push(referrerUID);
      points += 200;
      saveData();
      updateUI();
      showToast(`You were referred! +200 points added!`, "success");
      
      // In real scenario, send to bot
      sendReferralToBot(referrerUID, userUID);
    }
  }
}

// ── SEND REFERRAL TO BOT ───────────────────────────
async function sendReferralToBot(referrerUID, newUserUID) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: referrerUID,
        text: `🎉 New Referral!\n\nUser ${newUserUID} joined using your link!\nYou earned $0.20 USD worth of points!`
      })
    });
    console.log("Referral notification sent:", response.ok);
  } catch (e) {
    console.log("Could not send referral notification:", e);
  }
}

// ── INIT USER ──────────────────────────────────────
function initUser() {
  const user = tg?.initDataUnsafe?.user;
  if (user) {
    document.getElementById("name").innerText = user.first_name + (user.last_name ? " " + user.last_name : "");
    document.getElementById("avatar").src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`;
    userUID = String(user.id);
  } else {
    if (!localStorage.getItem("uid")) {
      userUID = "UID-" + Math.random().toString(36).substr(2, 8).toUpperCase();
      localStorage.setItem("uid", userUID);
    } else {
      userUID = localStorage.getItem("uid");
    }
    document.getElementById("avatar").src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userUID}`;
  }
  document.getElementById("userId").innerText = userUID;
  setupRefLink();
}

// ── SETUP REFERRAL LINK ────────────────────────────
async function setupRefLink() {
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
    const data = await res.json();
    if (data.ok) {
      BOT_USERNAME = data.result.username;
      const link = `https://t.me/${BOT_USERNAME}?start=ref-${userUID}`;
      document.getElementById("refLinkFull").innerText = link;
      document.getElementById("refCodeDisplay").innerText = "REF" + userUID.toString().replace(/[^a-z0-9]/gi, '').substr(0, 8).toUpperCase();
    } else {
      fallbackRefLink();
    }
  } catch (e) {
    fallbackRefLink();
  }
}

function fallbackRefLink() {
  const link = `https://t.me/earncrpgtogrowbot?start=ref-${userUID}`;
  document.getElementById("refLinkFull").innerText = link;
  document.getElementById("refCodeDisplay").innerText = "REF" + userUID.toString().replace(/[^a-z0-9]/gi, '').substr(0, 8).toUpperCase();
}

// ── TASKS DEFINITION ───────────────────────────────
const SOCIAL_TASKS = [
  { id: "twitter", name: "Follow us on Twitter", desc: "Follow @arman_rhaman on Twitter", points: 1500, verifyUrl: "https://twitter.com/intent/follow?screen_name=arman_rhaman" },
  { id: "telegram", name: "Join Telegram group", desc: "Join our official Telegram community", points: 1000, verifyUrl: "https://t.me/seemybiodata" },
  { id: "share", name: "Share post", desc: "Share our announcement post", points: 800, verifyUrl: "https://t.me/seemybiodata" },
  // নতুন টাস্ক যোগ করুন এখানে
  { id: "youtube", name: "Subscribe on YouTube", desc: "Subscribe to our YouTube channel", points: 1200, verifyUrl: "https://youtube.com/@cryptogrow" },
  { id: "discord", name: "Join Discord", desc: "Join our Discord community", points: 1000, verifyUrl: "https://discord.gg/cryptogrow" },
  { id: "instagram", name: "Follow on Instagram", desc: "Follow @mr_arman_rhaman on Instagram", points: 6000, verifyUrl: "https://instagram.com/mr_arman_rhaman" }
];

function renderTasks() {
  const taskList = document.getElementById("taskList");
  if (!taskList) return;
  
  taskList.innerHTML = SOCIAL_TASKS.map(task => {
    const isCompleted = completedTasks.includes(task.id);
    
    // আইকন সিলেক্ট করার লজিক (আপনার দেওয়া অংশটি এখানে বসবে)
    let iconPath = '';
    if (task.id === "twitter") {
      iconPath = '<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>';
    } else if (task.id === "telegram") {
      iconPath = '<path d="M21.5 4.5L2 12l6 2.5 8-6-5 5.5 8 4L21.5 4.5z"/>';
    } else if (task.id === "share") {
      iconPath = '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>';
    } else if (task.id === "youtube") {
      iconPath = '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>';
    } else if (task.id === "discord") {
      iconPath = '<path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>';
    } else {
      iconPath = '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>';
    }
    
    return `
      <div class="task-row ${isCompleted ? 'completed' : ''}" id="task-${task.id}">
        <div class="task-icon-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${iconPath}
          </svg>
        </div>
        <div class="task-info">
          <div class="task-name">${task.name}</div>
          <div class="task-desc">${task.desc}</div>
        </div>
        <span class="task-pts">+${task.points} pts</span>
        ${!isCompleted ? 
          `<button class="task-verify-btn" onclick="verifyTask('${task.id}', ${task.points}, '${task.verifyUrl}')">Verify</button>` : 
          `<span class="task-status-badge completed">Completed ✓</span>`
        }
      </div>
    `;
  }).join('');
  
  updateTaskPoints();
}

async function verifyTask(taskId, pointsAmount, verifyUrl) {
  if (completedTasks.includes(taskId)) {
    showToast("Task already completed!", "error");
    return;
  }
  
  window.open(verifyUrl, '_blank');
  
  // Show loading on button
  const taskRow = document.getElementById(`task-${taskId}`);
  const verifyBtn = taskRow?.querySelector('.task-verify-btn');
  if (verifyBtn) {
    verifyBtn.disabled = true;
    verifyBtn.innerHTML = '<div class="spinner"></div> Verifying...';
  }
  
  // Simulate verification delay (in real app, you'd verify via bot)
  setTimeout(() => {
    if (!completedTasks.includes(taskId)) {
      completedTasks.push(taskId);
      points += pointsAmount;
      saveData();
      updateUI();
      renderTasks();
      showToast(`Task completed! +${pointsAmount} points earned!`, "success");
      burstParticles(verifyBtn);
    }
  }, 1500);
}

function updateTaskPoints() {
  const taskPoints = SOCIAL_TASKS.reduce((sum, task) => {
    if (completedTasks.includes(task.id)) return sum + task.points;
    return sum;
  }, 0);
  document.getElementById("taskPoints").innerText = taskPoints;
}

// ── CHECK-IN ──────────────────────────────────────
function checkIn() {
  const today = new Date().toDateString();
  if (lastCheckin === today) {
    showToast("Already checked in today!", "error");
    return;
  }

  const yesterday = new Date(Date.now() - 86400000).toDateString();
  streak = (lastCheckin === yesterday) ? streak + 1 : 1;
  points += 20;
  lastCheckin = today;

  saveData();
  updateUI();
  
  openModal("checkinModal");
  setTimeout(() => {
    const bonus = document.getElementById("dailyBonus");
    if (bonus) bonus.classList.remove("hidden");
  }, 600);
  
  // Update checkin task status on tasks page
  const checkinStatus = document.getElementById("checkinTaskStatus");
  if (checkinStatus) {
    checkinStatus.innerText = "Completed Today";
    checkinStatus.className = "task-status-badge completed";
  }
}
// ── UPDATE UI ─────────────────────────────────────
function updateUI() {
  const pointsEl = document.getElementById("points");
  if (pointsEl) animateNum(pointsEl, parseInt(pointsEl.innerText) || 0, points, 600);
  
  const streakEl = document.getElementById("streak");
  if (streakEl) streakEl.innerText = streak + " day streak";
  
  const homeBalance = document.getElementById("homeBalance");
  if (homeBalance) homeBalance.innerText = points + " pts";
  
  const wdBalance = document.getElementById("wdBalance");
  if (wdBalance) wdBalance.innerText = points;
  
  const wdBalanceUSD = document.getElementById("wdBalanceUSD");
  if (wdBalanceUSD) wdBalanceUSD.innerText = (points / 1000).toFixed(2);
  
  const maxPts = document.getElementById("maxPts");
  if (maxPts) maxPts.innerText = points;
  
  const refCount = document.getElementById("refCount");
  if (refCount) refCount.innerText = referrals.length;
  
  const refEarned = document.getElementById("refEarned");
  if (refEarned) refEarned.innerText = referrals.length * 200;
  
  const checkinBtn = document.getElementById("checkinBtn");
  if (checkinBtn) {
    const today = new Date().toDateString();
    checkinBtn.disabled = lastCheckin === today;
    checkinBtn.innerText = lastCheckin === today ? "Checked ✓" : "Check In";
  }
}

function animateNum(el, from, to, dur) {
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.innerText = Math.round(from + (to - from) * ease);
    if (p < 1) requestAnimationFrame(step);
    else el.innerText = to;
  }
  requestAnimationFrame(step);
}

// ── COPY FUNCTIONS ────────────────────────────────
function copyUID() {
  navigator.clipboard.writeText(userUID);
  showToast("User ID copied!", "success");
}

function copyRefCode() {
  const code = document.getElementById("refCodeDisplay").innerText;
  navigator.clipboard.writeText(code);
  showToast("Referral code copied!", "success");
}

function copyRef() {
  const link = document.getElementById("refLinkFull").innerText;
  navigator.clipboard.writeText(link);
  const badge = document.getElementById("copiedBadge");
  if (badge) {
    badge.classList.remove("hidden");
    setTimeout(() => badge.classList.add("hidden"), 2500);
  }
  showToast("Referral link copied!", "success");
}

function shareRef() {
  const link = document.getElementById("refLinkFull").innerText;
  if (tg && tg.shareToStory) {
    tg.shareToStory(link);
  } else {
    navigator.clipboard.writeText(link);
    showToast("Link copied to clipboard!", "success");
  }
}

// ── WITHDRAW FUNCTIONS ────────────────────────────
function selectCoin(coin) {
  selectedCoin = coin;
  document.querySelectorAll('.coin-btn').forEach(btn => btn.classList.remove('selected'));
  document.getElementById(`coin${coin}`).classList.add('selected');
  
  // Update address validation rules
  const addrLabel = document.getElementById("addrLabel");
  const addrHint = document.getElementById("addrHint");
  if (coin === 'TON') {
    addrLabel.innerText = "TON Wallet Address";
    addrHint.innerText = "Enter a valid TON wallet address (48 chars, starts with EQ or UQ)";
  } else {
    addrLabel.innerText = "USDT (BEP-20) Wallet Address";
    addrHint.innerText = "Enter a valid BEP-20 address (42 chars, starts with 0x)";
  }
  
  // Clear address field
  document.getElementById("wdAddress").value = "";
  document.getElementById("wdAddress").classList.remove("ok", "error");
  document.getElementById("addrOk").classList.add("hidden");
  document.getElementById("addrError").classList.add("hidden");
  
  validateStep1AndProceed();
}

function validateAddress() {
  const address = document.getElementById("wdAddress").value.trim();
  const isValid = selectedCoin === 'TON' ? validateTONAddress(address) : validateBEP20Address(address);
  
  if (isValid && address.length > 0) {
    document.getElementById("wdAddress").classList.add("ok");
    document.getElementById("wdAddress").classList.remove("error");
    document.getElementById("addrOk").classList.remove("hidden");
    document.getElementById("addrError").classList.add("hidden");
    wdAddress = address;
  } else if (address.length > 0) {
    document.getElementById("wdAddress").classList.add("error");
    document.getElementById("wdAddress").classList.remove("ok");
    document.getElementById("addrOk").classList.add("hidden");
    document.getElementById("addrError").classList.remove("hidden");
    wdAddress = "";
  } else {
    document.getElementById("wdAddress").classList.remove("ok", "error");
    document.getElementById("addrOk").classList.add("hidden");
    document.getElementById("addrError").classList.add("hidden");
    wdAddress = "";
  }
  
  validateStep2AndProceed();
}

function validateTONAddress(address) {
  return /^(EQ|UQ)[A-Za-z0-9_-]{46}$/.test(address);
}

function validateBEP20Address(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function validateAmount() {
  const amount = parseInt(document.getElementById("wdAmount").value);
  const minAmount = 1000;
  const maxAmount = points;
  
  if (!isNaN(amount) && amount >= minAmount && amount <= maxAmount) {
    document.getElementById("wdAmount").classList.add("ok");
    document.getElementById("wdAmount").classList.remove("error");
    document.getElementById("amountError").classList.add("hidden");
    wdAmount = amount;
    const usdValue = (amount / 1000).toFixed(2);
    document.getElementById("amountUSD").innerText = usdValue;
  } else if (!isNaN(amount)) {
    document.getElementById("wdAmount").classList.add("error");
    document.getElementById("wdAmount").classList.remove("ok");
    document.getElementById("amountError").classList.remove("hidden");
    if (amount < minAmount) {
      document.getElementById("amountError").innerText = `Minimum amount is ${minAmount} pts`;
    } else if (amount > maxAmount) {
      document.getElementById("amountError").innerText = `Maximum amount is ${maxAmount} pts`;
    }
    wdAmount = 0;
  } else {
    document.getElementById("wdAmount").classList.remove("ok", "error");
    document.getElementById("amountError").classList.add("hidden");
    wdAmount = 0;
  }
  
  validateStep3AndProceed();
}

function setMaxAmount() {
  document.getElementById("wdAmount").value = points;
  validateAmount();
}

function validateStep1AndProceed() {
  const nextBtn = document.getElementById("nextBtn");
  if (nextBtn && selectedCoin) nextBtn.disabled = false;
}

function validateStep2AndProceed() {
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  if (currentStep === 1) {
    if (nextBtn) nextBtn.disabled = !wdAddress;
  }
  if (currentStep === 0 && selectedCoin && prevBtn) {
    prevBtn.classList.remove("hidden");
  }
}

function validateStep3AndProceed() {
  const nextBtn = document.getElementById("nextBtn");
  if (currentStep === 2) {
    if (nextBtn) nextBtn.disabled = wdAmount === 0;
  }
}

function wdNextStep() {
  if (currentStep === 0 && selectedCoin) {
    currentStep = 1;
    showStep(currentStep);
  } else if (currentStep === 1 && wdAddress) {
    currentStep = 2;
    showStep(currentStep);
  } else if (currentStep === 2 && wdAmount > 0) {
    currentStep = 3;
    showStep(currentStep);
    updateSummary();
  }
}

function wdPrevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

function showStep(step) {
  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById(`step${i}`);
    if (el) el.classList.add("hidden");
  }
  document.getElementById(`step${step + 1}`).classList.remove("hidden");
  
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  
  if (step === 0) {
    if (prevBtn) prevBtn.classList.add("hidden");
    if (nextBtn) {
      nextBtn.disabled = !selectedCoin;
      nextBtn.innerText = "Next";
    }
  } else if (step === 1) {
    if (prevBtn) prevBtn.classList.remove("hidden");
    if (nextBtn) {
      nextBtn.disabled = !wdAddress;
      nextBtn.innerText = "Next";
    }
  } else if (step === 2) {
    if (prevBtn) prevBtn.classList.remove("hidden");
    if (nextBtn) {
      nextBtn.disabled = wdAmount === 0;
      nextBtn.innerText = "Review";
    }
  } else if (step === 3) {
    if (prevBtn) prevBtn.classList.remove("hidden");
    if (nextBtn) nextBtn.classList.add("hidden");
  }
}

function updateSummary() {
  const usdValue = (wdAmount / 1000).toFixed(2);
  document.getElementById("sumCoin").innerText = selectedCoin;
  document.getElementById("sumAddr").innerText = wdAddress;
  document.getElementById("sumAmt").innerText = wdAmount + " pts";
  document.getElementById("sumUSD").innerText = "$" + usdValue;
}

async function submitWithdraw() {
  if (wdAmount > points) {
    showToast("Insufficient balance!", "error");
    return;
  }
  
  // Deduct points
  points -= wdAmount;
  saveData();
  updateUI();
  
  // Create withdrawal record
  const withdrawRecord = {
    id: Date.now(),
    coin: selectedCoin,
    address: wdAddress,
    amount: wdAmount,
    usd: (wdAmount / 1000).toFixed(2),
    date: new Date().toISOString(),
    status: "pending"
  };
  withdrawalHistory.unshift(withdrawRecord);
  saveData();
  updateWithdrawHistory();
  
  // Send request to admin via bot
  await sendWithdrawToAdmin(withdrawRecord);
  
  // Reset form
  selectedCoin = null;
  wdAddress = "";
  wdAmount = 0;
  currentStep = 0;
  showStep(0);
  document.querySelectorAll('.coin-btn').forEach(btn => btn.classList.remove('selected'));
  document.getElementById("wdAddress").value = "";
  document.getElementById("wdAmount").value = "";
  document.getElementById("addrOk").classList.add("hidden");
  document.getElementById("addrError").classList.add("hidden");
  document.getElementById("amountError").classList.add("hidden");
  
  openModal("withdrawModal");
}

async function sendWithdrawToAdmin(record) {
  try {
    const message = `💰 NEW WITHDRAWAL REQUEST 💰\n\n` +
      `👤 User ID: ${userUID}\n` +
      `🪙 Coin: ${record.coin}\n` +
      `📍 Address: ${record.address}\n` +
      `📊 Amount: ${record.amount} pts\n` +
      `💵 Value: $${record.usd}\n` +
      `🕐 Time: ${new Date(record.date).toLocaleString()}\n\n` +
      `⚠️ Please process this request.`;
    
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ADMIN_UID,
        text: message,
        parse_mode: "HTML"
      })
    });
    
    if (response.ok) {
      console.log("Withdrawal request sent to admin");
    }
  } catch (e) {
    console.log("Could not send withdrawal to admin:", e);
  }
}

function updateWithdrawHistory() {
  const container = document.getElementById("wdHistory");
  if (!container) return;
  
  if (withdrawalHistory.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div class="empty-text">No withdrawal history yet</div>
      </div>
    `;
    return;
  }
  
  container.innerHTML = withdrawalHistory.map(wd => `
    <div class="wd-history-item">
      <div class="wdh-icon ${wd.coin === 'TON' ? 'ton-icon' : 'usdt-icon'}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          ${wd.coin === 'TON' ? '<polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>' : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>'}
        </svg>
      </div>
      <div class="wdh-info">
        <div class="wdh-coin">${wd.coin} • ${wd.amount} pts</div>
        <div class="wdh-date">${new Date(wd.date).toLocaleDateString()}</div>
      </div>
      <div class="wdh-amt">
        <div class="wdh-pts">$${wd.usd}</div>
        <div class="wdh-status status-${wd.status}">${wd.status.charAt(0).toUpperCase() + wd.status.slice(1)}</div>
      </div>
    </div>
  `).join('');
}

// ── NAVIGATION ────────────────────────────────────
function navTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');
  
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`nav-${page}`).classList.add('active');
  
  if (page === 'tasks') renderTasks();
  if (page === 'withdraw') {
    updateWithdrawHistory();
    const maxPts = document.getElementById("maxPts");
    if (maxPts) maxPts.innerText = points;
  }
  if (page === 'refer') {
    const refCount = document.getElementById("refCount");
    if (refCount) refCount.innerText = referrals.length;
    const refEarned = document.getElementById("refEarned");
    if (refEarned) refEarned.innerText = referrals.length * 200;
  }
}
// ── THEME ─────────────────────────────────────────
let isLight = localStorage.getItem("theme") === "light";

function toggleTheme() {
  isLight = !isLight;
  document.body.classList.toggle("light", isLight);
  localStorage.setItem("theme", isLight ? "light" : "dark");
  
  const btn = document.getElementById("themeBtn");
  if (btn) {
    btn.innerHTML = isLight
      ? `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
      : `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }
}

// ── MODALS ────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

// ── TOAST ─────────────────────────────────────────
function showToast(msg, type = "success") {
  const container = document.getElementById("toastContainer");
  const t = document.createElement("div");
  t.className = "toast" + (type === "error" ? " toast-error" : "");
  
  const icon = type === "error"
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
  
  t.innerHTML = icon + `<span>${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => { t.style.opacity = "0"; t.style.transform = "translateY(-6px)"; t.style.transition = "0.3s"; }, 2200);
  setTimeout(() => t.remove(), 2500);
}

// ── PARTICLE BURST ────────────────────────────────
function burstParticles(source) {
  if (!source) return;
  const rect = source.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const colors = ["#a855f7", "#6366f1", "#22c55e", "#f59e0b", "#f97316"];
  for (let i = 0; i < 10; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const angle = (Math.PI * 2 / 10) * i;
    const dist = 40 + Math.random() * 40;
    p.style.cssText = `
      left:${cx}px; top:${cy}px;
      background:${colors[i % colors.length]};
      --tx:${Math.cos(angle) * dist}px;
      --ty:${Math.sin(angle) * dist}px;
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }
}

// ── INIT ──────────────────────────────────────────
(function init() {
  loadData();
  if (isLight) document.body.classList.add("light");
  initUser();
  updateUI();
  toggleTheme(); // Set correct theme icon
  
  // Modal close buttons
  document.getElementById("checkinModalOk")?.addEventListener("click", () => closeModal("checkinModal"));
  document.getElementById("withdrawModalOk")?.addEventListener("click", () => closeModal("withdrawModal"));
  
  // Bonus popup close
  document.getElementById("bonusCloseBtn")?.addEventListener("click", () => {
    document.getElementById("dailyBonus")?.classList.add("hidden");
  });
  
  // Close modals on overlay click
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", function(e) {
      if (e.target === this) this.classList.add("hidden");
    });
  });
  
  // Check checkin status for tasks page
  const today = new Date().toDateString();
  const checkinStatus = document.getElementById("checkinTaskStatus");
  if (checkinStatus && lastCheckin === today) {
    checkinStatus.innerText = "Completed Today";
    checkinStatus.className = "task-status-badge completed";
  }
})();