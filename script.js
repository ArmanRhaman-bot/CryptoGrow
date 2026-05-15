// TELEGRAM INIT
let tg = window.Telegram.WebApp;
tg.expand();

if(tg.initDataUnsafe?.user){
  let user = tg.initDataUnsafe.user;

  document.getElementById("name").innerText =
    user.first_name + " " + (user.last_name || "");

  document.getElementById("avatar").src =
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`;

  localStorage.uid = "" + user.id;
}else{
  if(!localStorage.uid){
    localStorage.uid = "UID-" + Math.random().toString(36).substr(2,6);
  }
}

document.getElementById("userId").innerText = localStorage.uid;


// DATA
let points = parseInt(localStorage.points || 0);
let streak = parseInt(localStorage.streak || 0);


// UPDATE UI
function updateUI(){
  document.getElementById("points").innerText = points;
  document.getElementById("balance").innerText = points;
  document.getElementById("streak").innerText = "🔥 " + streak + " day streak";

  document.getElementById("withdrawBtn").disabled = points < 1000;
}
updateUI();


// TASK
function completeTask(val, el){
  if(el.checked){
    points += val;
    localStorage.points = points;
    toast("Task completed!");
    updateUI();
  }
}


// CHECKIN
function checkIn(){
  streak++;
  points += 20;

  localStorage.streak = streak;
  localStorage.points = points;

  toast("Check-in successful!");
  updateUI();
}


// COPY REF
function copyRef(){
  let link = "https://yourapp.com/ref/" + localStorage.uid;
  navigator.clipboard.writeText(link);
  toast("Copied!");
}


// WITHDRAW
function withdraw(){
  if(points >= 1000){
    toast("Withdrawal request sent");
  }
}


// THEME
function toggleTheme(){
  document.body.classList.toggle("light");
}


// TOAST
function toast(msg){
  let t = document.getElementById("toast");
  t.innerText = msg;
  t.classList.remove("hidden");

  setTimeout(()=>{
    t.classList.add("hidden");
  },2000);
}


// LOGOUT
function logout(){
  localStorage.clear();
  location.reload();
}