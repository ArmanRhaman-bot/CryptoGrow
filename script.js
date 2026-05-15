// USER ID
function generateUID(){
  return "UID-" + Math.random().toString(36).substring(2,9).toUpperCase();
}

if(!localStorage.uid){
  localStorage.uid = generateUID();
}

document.getElementById("userId").innerText = localStorage.uid;

// AVATAR
document.getElementById("avatar").src =
`https://api.dicebear.com/7.x/avataaars/svg?seed=${localStorage.uid}`;


// REF CODE
if(!localStorage.ref){
  localStorage.ref = "REF" + Math.random().toString(36).substring(2,8).toUpperCase();
}
document.getElementById("refCode").innerText = localStorage.ref;


// DATA
let points = parseInt(localStorage.points || 0);
let streak = parseInt(localStorage.streak || 0);


// UI UPDATE
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
    updateUI();
  }
}


// CHECK-IN
function checkIn(){
  streak++;
  points += 20;

  localStorage.streak = streak;
  localStorage.points = points;

  alert("Check-in successful!");
  updateUI();
}


// COPY REF
function copyRef(){
  let link = "https://yourapp.com/ref/" + localStorage.ref;
  navigator.clipboard.writeText(link);
  alert("Copied!");
}


// WITHDRAW
function withdraw(){
  if(points >= 1000){
    document.getElementById("modal").classList.remove("hidden");
  }
}

function closeModal(){
  document.getElementById("modal").classList.add("hidden");
}