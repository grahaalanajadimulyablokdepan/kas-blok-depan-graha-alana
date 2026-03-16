const db = firebase.firestore()

/* ======================
   DATA BLOK
====================== */

const blokData = {

A1:18,
A2:24,
A3:10,
B1:20,
B2:20,
B3:20

}

/* ======================
   LOAD PAGE
====================== */

document.addEventListener("DOMContentLoaded",()=>{

const blok=document.getElementById("blok")

if(blok){

blok.addEventListener("change",generateRumah)

}

})

/* ======================
   GENERATE RUMAH
====================== */

function generateRumah(){

const blok=document.getElementById("blok").value
const rumah=document.getElementById("rumah")

if(!rumah) return

rumah.innerHTML='<option value="">Nomor Rumah</option>'

if(!blok) return

let jumlah=blokData[blok]

for(let i=1;i<=jumlah;i++){

let opt=document.createElement("option")

opt.value=i
opt.text="Rumah "+i

rumah.appendChild(opt)

}

}

/* ======================
   LOGIN WARGA
====================== */

function loginWarga(){

const blok=document.getElementById("blok").value
const rumah=document.getElementById("rumah").value
const pass=document.getElementById("password").value

if(!blok){

alert("Pilih blok dulu")
return

}

if(!rumah){

alert("Pilih nomor rumah")
return

}

if(pass>=1 && pass<=8){

localStorage.setItem("role","warga")
localStorage.setItem("blok",blok)
localStorage.setItem("rumah",rumah)

location.href="dashboard.html"

}else{

alert("Password warga hanya 1 sampai 8")

}

}

/* ======================
   ADMIN LOGIN
====================== */

function openAdmin(){

const popup=document.getElementById("adminPopup")

if(popup){
popup.style.display="flex"
}

}

function closePopup(){

document.querySelectorAll(".popup").forEach(p=>{

p.style.display="none"

})

}

function loginAdmin(){

const user=document.getElementById("adminUser").value
const pass=document.getElementById("adminPass").value

if(user==="admin" && pass==="12345"){

localStorage.setItem("role","admin")

location.href="dashboard.html"

}else{

alert("Username atau password admin salah")

}

}

/* ======================
   DASHBOARD INIT
====================== */

function initDashboard(){

cekRole()
loadKas()
loadTabel()

}

/* ======================
   CEK ROLE
====================== */

function cekRole(){

const role=localStorage.getItem("role")

const btn=document.getElementById("btnIuran")

if(role!=="admin" && btn){

btn.style.display="none"

}

}

/* ======================
   SIDEBAR
====================== */

function toggleMenu(){

const sidebar=document.getElementById("sidebar")

if(sidebar){

sidebar.classList.toggle("active")

}

}

/* ======================
   TOTAL KAS
====================== */

function loadKas(){

let totalIuran=0
let totalKeluar=0

db.collection("iuran").get().then(snap=>{

snap.forEach(doc=>{

totalIuran+=doc.data().jumlah

})

const el=document.getElementById("totalIuran")

if(el) el.innerText="Rp "+totalIuran.toLocaleString()

})

db.collection("pengeluaran").get().then(snap=>{

snap.forEach(doc=>{

totalKeluar+=doc.data().jumlah

})

const keluar=document.getElementById("totalKeluar")
const kas=document.getElementById("totalKas")

if(keluar){

keluar.innerText="Rp "+totalKeluar.toLocaleString()

}

if(kas){

kas.innerText="Rp "+(totalIuran-totalKeluar).toLocaleString()

}

})

}

/* ======================
   LOAD TABEL
====================== */

function loadTabel(){

const tabel=document.getElementById("tabelIuran")

if(!tabel) return

db.collection("iuran").onSnapshot(snap=>{

let html=""

snap.forEach(doc=>{

const d=doc.data()

html+=`

<tr>

<td>${d.blok}</td>
<td>${d.rumah}</td>
<td>Rp ${d.jumlah}</td>

<td>

<button onclick="hapusIuran('${doc.id}')">Hapus</button>

</td>

</tr>

`

})

tabel.innerHTML=html

})

}

/* ======================
   SIMPAN IURAN
====================== */

function simpanIuran(){

const blok=document.getElementById("iuranBlok").value
const rumah=document.getElementById("iuranRumah").value
const jumlah=Number(document.getElementById("jumlahIuran").value)

db.collection("iuran").add({

blok,
rumah,
jumlah,
tanggal:new Date()

})

closePopup()

}

/* ======================
   HAPUS
====================== */

function hapusIuran(id){

db.collection("iuran").doc(id).delete()

}

/* ======================
   EXPORT CSV
====================== */

function exportExcel(){

db.collection("iuran").get().then(snapshot=>{

let csv="Blok,Rumah,Jumlah\n"

snapshot.forEach(doc=>{

const d=doc.data()

csv+=`${d.blok},${d.rumah},${d.jumlah}\n`

})

let blob=new Blob([csv])

let a=document.createElement("a")

a.href=URL.createObjectURL(blob)
a.download="data_kas.csv"

a.click()

})

}

/* ======================
   LOGOUT
====================== */

function logout(){

localStorage.clear()

location.href="index.html"

}
