const db = firebase.firestore()

/* =========================
   GENERATE NOMOR RUMAH
========================= */

const blokData = {
A1:18,
A2:24,
A3:10,
B1:20,
B2:20,
B3:20
}

document.addEventListener("DOMContentLoaded",()=>{

let blok=document.getElementById("blok")

if(blok){
blok.addEventListener("change",generateRumah)
}

})

function generateRumah(){

let blok=document.getElementById("blok").value
let rumah=document.getElementById("rumah")

rumah.innerHTML=`<option value="">Nomor Rumah</option>`

if(!blok) return

let jumlah=blokData[blok]

for(let i=1;i<=jumlah;i++){

let opt=document.createElement("option")

opt.value=i
opt.text="Rumah "+i

rumah.appendChild(opt)

}

}


/* =========================
   LOGIN WARGA
========================= */

function loginWarga(){

let blok=document.getElementById("blok").value
let rumah=document.getElementById("rumah").value
let pass=document.getElementById("password").value

if(!blok || !rumah){
alert("Pilih blok dan nomor rumah")
return
}

if(pass>=1 && pass<=8){

localStorage.setItem("role","warga")
localStorage.setItem("blok",blok)
localStorage.setItem("rumah",rumah)

location.href="dashboard.html"

}else{

alert("Password salah (1-8)")

}

}


/* =========================
   LOGIN ADMIN
========================= */

function openAdmin(){
document.getElementById("adminPopup").style.display="flex"
}

function closePopup(){
document.querySelectorAll(".popup").forEach(p=>p.style.display="none")
}

function loginAdmin(){

let user=document.getElementById("adminUser").value
let pass=document.getElementById("adminPass").value

if(user==="admin" && pass==="12345"){

localStorage.setItem("role","admin")
location.href="dashboard.html"

}else{

alert("Login admin gagal")

}

}


/* =========================
   DASHBOARD
========================= */

function initDashboard(){

cekRole()
loadKas()
loadTabel()

}


/* =========================
   ROLE CHECK
========================= */

function cekRole(){

let role=localStorage.getItem("role")

if(role!=="admin"){

let btn=document.getElementById("btnIuran")

if(btn) btn.style.display="none"

}

}


/* =========================
   SIDEBAR
========================= */

function toggleMenu(){

let sidebar=document.getElementById("sidebar")

sidebar.classList.toggle("active")

}


/* =========================
   LOAD TOTAL KAS
========================= */

function loadKas(){

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


/* =========================
   LOAD TABEL IURAN
========================= */

function loadTabel(){

let tabel=document.getElementById("tabelIuran")

if(!tabel) return

db.collection("iuran").onSnapshot(snap=>{

let html=""

snap.forEach(doc=>{

let d=doc.data()

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


/* =========================
   SIMPAN IURAN
========================= */

function simpanIuran(){

let blok=document.getElementById("iuranBlok").value
let rumah=document.getElementById("iuranRumah").value
let jumlah=Number(document.getElementById("jumlahIuran").value)

db.collection("iuran").add({

blok,
rumah,
jumlah,
tanggal:new Date()

})

closePopup()

}


/* =========================
   HAPUS
========================= */

function hapusIuran(id){

db.collection("iuran").doc(id).delete()

}


/* =========================
   EXPORT CSV
========================= */

function exportExcel(){

db.collection("iuran").get().then(snapshot=>{

let csv="Blok,Rumah,Jumlah\n"

snapshot.forEach(doc=>{

let d=doc.data()

csv+=`${d.blok},${d.rumah},${d.jumlah}\n`

})

let blob=new Blob([csv])

let a=document.createElement("a")

a.href=URL.createObjectURL(blob)

a.download="data_kas.csv"

a.click()

})

}


/* =========================
   LOGOUT
========================= */

function logout(){

localStorage.clear()

location.href="index.html"

}
