let blokData = {

A1:18,
A2:24,
A3:10,
B1:20,
B2:20,
B3:20

}

document.getElementById("blok").addEventListener("change",generateRumah)

function generateRumah(){

let blok=document.getElementById("blok").value
let rumahSelect=document.getElementById("rumah")

rumahSelect.innerHTML=""

for(let i=1;i<=blokData[blok];i++){

let opt=document.createElement("option")
opt.text=i
opt.value=i

rumahSelect.appendChild(opt)

}

}


function loginWarga(){

let blok=document.getElementById("blok").value
let rumah=document.getElementById("rumah").value
let pass=document.getElementById("password").value

if(blok==""||rumah==""){

alert("Lengkapi login")

return

}

if(pass>=1 && pass<=8){

localStorage.setItem("role","warga")
localStorage.setItem("blok",blok)
localStorage.setItem("rumah",rumah)

window.location="dashboard.html"

}

}


function loginAdmin(){

let pass=document.getElementById("password").value

if(pass=="12345"){

localStorage.setItem("role","admin")

window.location="dashboard.html"

}

}


function logout(){

localStorage.clear()

window.location="index.html"

}
