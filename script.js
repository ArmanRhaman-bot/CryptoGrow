/* ===================================================
   CryptoGrow – script.js
   =================================================== */

const BOT_TOKEN = "8697935116:AAGkCTTPE0a509WNzkOTbcJEMJtDDyGOgm0";
let BOT_USERNAME = "";

// ── TELEGRAM INIT ─────────────────────────────────
let tg = window.Telegram?.WebApp;
if (tg) tg.expand();

// ── STATE ─────────────────────────────────────────
let points = parseInt(localStorage.getItem("points") || "0");
let streak  = parseInt(localStorage.getItem("streak")  || "0");
let lastCheckin = localStorage.getItem("lastCheckin") || "";
let completedTasks = JSON.parse(localStorage.getItem("completedTasks") || "[]");
let isLight = localStorage.getItem("theme") === "light";

// ── UID ───────────────────────────────────────────
function initUser() {
  const user = tg?.initDataUnsafe?.user;
  if (user) {
    document.getElementById("name").innerText =
      user.first_name + (user.last_name ? " " + user.last_name : "");
    document.getElementById("avatar").src =
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`;
    if (!localStorage.getItem("uid")) {
      localStorage.setItem("uid", String(user.id));
    }
  } else {
    if (!localStorage.getItem("uid")) {
      localStorage.setItem("uid", "UID-" + Math.random().toString(36).substr(2,8).toUpperCase());
    }
    document.getElementById("avatar").src =
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${localStorage.getItem("uid")}`;
  }
  const uid = localStorage.getItem("uid");
  document.getElementById("userId").innerText = uid;
  setupRefCode(uid);
}

// ── BOT USERNAME + REF LINK ───────────────────────
async function fetchBotUsername() {
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
    const data = await res.json();
    if (data.ok) {
      BOT_USERNAME = data.result.username;
      const uid = localStorage.getItem("uid") || "unknown";
      setupRefCode(uid);
    }
  } catch (e) {
    console.warn("Could not fetch bot username:", e);
  }
}

function setupRefCode(uid) {
  const shortCode = "REF" + uid.toString().replace(/[^a-z0-9]/gi,'').substr(0,8).toUpperCase();
  document.getElementById("refCode").innerText = shortCode;

  const link = BOT_USERNAME
    ? `https://t.me/${BOT_USERNAME}?start=ref-${uid}`
    : `https://t.me/YourBot?start=ref-${uid}`;

  document.getElementById("refLink").innerText = link;
  document.getElementById("refLink").title = link;
}

// ── RESTORE TASKS ─────────────────────────────────
function restoreTasks() {
  completedTasks.forEach(taskId => {
    const row = document.getElementById(taskId);
    const chk = row?.querySelector("input[type=checkbox]");
    const done = document.getElementById("done-" + taskId);
    if (chk) { chk.checked = true; chk.disabled = true; }
    if (done) done.classList.remove("hidden");
    row?.classList.add("done");
  });
}

// ── UPDATE UI ─────────────────────────────────────
function updateUI() {
  // points with animation
  const el = document.getElementById("points");
  const old = parseInt(el.innerText || "0");
  if (old !== points) animateNum(el, old, points, 600);

  document.getElementById("balance").innerText = points;
  document.getElementById("streak").innerText   = streak + " day streak";

  const btn = document.getElementById("withdrawBtn");
  btn.disabled = points < 1000;
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

// ── TASK COMPLETE ─────────────────────────────────
function completeTask(val, el, taskId) {
  if (el.checked) {
    if (completedTasks.includes(taskId)) { el.checked = false; return; }

    points += val;
    completedTasks.push(taskId);
    localStorage.setItem("points", points);
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));

    el.disabled = true;
    document.getElementById("done-" + taskId)?.classList.remove("hidden");
    document.getElementById(taskId)?.classList.add("done");

    showToast("Task completed! +" + val + " pts", "success");
    burstParticles(el);
    updateUI();
  }
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

  localStorage.setItem("streak", streak);
  localStorage.setItem("points", points);
  localStorage.setItem("lastCheckin", lastCheckin);

  openModal("checkinModal");
  setTimeout(() => {
    document.getElementById("dailyBonus").classList.remove("hidden");
  }, 600);
  updateUI();
}

// ── COPY ──────────────────────────────────────────
function copyUID() {
  const uid = localStorage.getItem("uid") || "";
  navigator.clipboard.writeText(uid).catch(() => {});
  showToast("User ID copied!", "success");
}

function copyRefCode() {
  const code = document.getElementById("refCode").innerText;
  navigator.clipboard.writeText(code).catch(() => {});
  showToast("Referral code copied!", "success");
}

function copyRef() {
  const link = document.getElementById("refLink").innerText;
  navigator.clipboard.writeText(link).catch(() => {});

  const badge = document.getElementById("copiedBadge");
  badge.classList.remove("hidden");
  const btn = document.getElementById("copyLinkBtn");
  btn.style.opacity = "0.7";
  setTimeout(() => {
    badge.classList.add("hidden");
    btn.style.opacity = "";
  }, 2500);
  showToast("Referral link copied!", "success");
}

// ── WITHDRAW ─────────────────────────────────────
function withdraw() {
  if (points >= 1000) {
    openModal("withdrawModal");
  } else {
    showToast("Need at least 1000 pts to withdraw", "error");
  }
}

// ── THEME ─────────────────────────────────────────
function toggleTheme() {
  isLight = !isLight;
  document.body.classList.toggle("light", isLight);
  localStorage.setItem("theme", isLight ? "light" : "dark");

  const btn = document.getElementById("themeBtn");
  btn.innerHTML = isLight
    ? `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
    : `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
}

// ── NAV TABS ─────────────────────────────────────
function setTab(index, el) {
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  el.classList.add("active");
}

// ── MODAL ─────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
}
function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}
// Close modal on overlay click
document.querySelectorAll(".modal-overlay").forEach(overlay => {
  overlay.addEventListener("click", function(e) {
    if (e.target === this) this.classList.add("hidden");
  });
});

// ── TOAST ─────────────────────────────────────────
function showToast(msg, type = "success") {
  const container = document.getElementById("toastContainer");
  const t = document.createElement("div");
  t.className = "toast" + (type === "error" ? " toast-error" : "");

  const icon = type === "error"
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

  t.innerHTML = icon + `<span>${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => { t.style.opacity="0"; t.style.transform="translateY(-6px)"; t.style.transition="0.3s"; }, 2200);
  setTimeout(() => t.remove(), 2500);
}

// ── PARTICLE BURST ────────────────────────────────
function burstParticles(source) {
  const rect = source.getBoundingClientRect();
  const cx = rect.left + rect.width  / 2;
  const cy = rect.top  + rect.height / 2;
  const colors = ["#a855f7","#6366f1","#22c55e","#f59e0b","#f97316"];
  for (let i = 0; i < 10; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const angle = (Math.PI * 2 / 10) * i;
    const dist  = 40 + Math.random() * 40;
    p.style.cssText = `
      left:${cx}px; top:${cy}px;
      background:${colors[i % colors.length]};
      --tx:${Math.cos(angle)*dist}px;
      --ty:${Math.sin(angle)*dist}px;
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }
}

// ── LOGOUT ────────────────────────────────────────
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.clear();
    location.reload();
  }
}

// ── INIT ──────────────────────────────────────────
(function init() {
  if (isLight) document.body.classList.add("light");
  initUser();
  restoreTasks();
  updateUI();
  fetchBotUsername();
})();
