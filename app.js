let db = firebase.firestore()

function generateRumah(){

let blok=document.getElementById("blok").value

let rumah=document.getElementById("rumah")

rumah.innerHTML=""

let jumlah=0

if(blok=="A1") jumlah=18
if(blok=="A2") jumlah=24
if(blok=="A3") jumlah=10
if(blok=="B1") jumlah=20
if(blok=="B2") jumlah=20
if(blok=="B3") jumlah=20

for(let i=1;i<=jumlah;i++){

let opt=document.createElement("option")

opt.value=i

opt.text=i

rumah.appendChild(opt)

}

}

function login(){

let blok=document.getElementById("blok").value
let rumah=document.getElementById("rumah").value
let pass=document.getElementById("password").value

if(pass>="1" && pass<="8"){

localStorage.setItem("userBlok",blok)
localStorage.setItem("userRumah",rumah)
localStorage.setItem("role","warga")

location.href="dashboard.html"

}else{

alert("Password salah")

}

}

function loginAdmin(){

let pass=document.getElementById("password").value

if(pass=="12345"){

localStorage.setItem("role","admin")

location.href="dashboard.html"

}

}

function loadDashboard(){

let role=localStorage.getItem("role")

if(role!="admin"){

let adminMenu=document.getElementById("adminMenu")

if(adminMenu) adminMenu.style.display="none"

}

hitungKas()

}

function hitungKas(){

let totalIuran=0
let totalKeluar=0

db.collection("iuran").get().then(snap=>{

snap.forEach(doc=>{

totalIuran+=doc.data().jumlah

})

document.getElementById("totalIuran").innerText="Rp "+totalIuran.toLocaleString()

})

db.collection("pengeluaran").get().then(snap=>{

snap.forEach(doc=>{

totalKeluar+=doc.data().jumlah

})

document.getElementById("totalKeluar").innerText="Rp "+totalKeluar.toLocaleString()

let kas=totalIuran-totalKeluar

document.getElementById("totalKas").innerText="Rp "+kas.toLocaleString()

})

}

function logout(){

localStorage.clear()

location.href="index.html"

}

function toggleMenu(){

let menu=document.getElementById("sideMenu")

menu.classList.toggle("show")

}
