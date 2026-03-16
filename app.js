const blokData={
A1:18,
A2:24,
A3:10,
B1:20,
B2:20,
B3:20
}


/* LOGIN WARGA */

function loginWarga(){

let blok=document.getElementById("blok").value
let rumah=document.getElementById("rumah").value
let pass=document.getElementById("password").value

if(pass>=1 && pass<=8){

localStorage.setItem("role","warga")
localStorage.setItem("blok",blok)
localStorage.setItem("rumah",rumah)

location.href="dashboard.html"

}

}


/* ADMIN */

function openAdmin(){
document.getElementById("adminPopup").style.display="flex"
}

function closePopup(){
document.querySelectorAll(".popup").forEach(p=>p.style.display="none")
}

function loginAdmin(){

let u=document.getElementById("adminUser").value
let p=document.getElementById("adminPass").value

if(u==="admin" && p==="12345"){

localStorage.setItem("role","admin")
location.href="dashboard.html"

}

}


/* DASHBOARD */

function initDashboard(){

cekRole()

loadKas()

loadTabel()

}


function cekRole(){

let role=localStorage.getItem("role")

if(role!=="admin"){

document.getElementById("btnIuran").style.display="none"

}

}


/* SIDEBAR */

function toggleMenu(){
document.getElementById("sidebar").classList.toggle("active")
}


/* KAS */

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

document.getElementById("totalKas").innerText="Rp "+(totalIuran-totalKeluar).toLocaleString()

})

}


/* TABEL */

function loadTabel(){

db.collection("iuran").onSnapshot(snap=>{

let html=""

snap.forEach(doc=>{

let d=doc.data()

html+=`

<tr>
<td>${d.blok}</td>
<td>${d.rumah}</td>
<td>${d.jumlah}</td>

<td>

<button onclick="hapusIuran('${doc.id}')">Hapus</button>

</td>

</tr>

`

})

document.getElementById("tabelIuran").innerHTML=html

})

}


/* HAPUS */

function hapusIuran(id){

db.collection("iuran").doc(id).delete()

}


/* INPUT */

function simpanIuran(){

let blok=document.getElementById("iuranBlok").value
let rumah=document.getElementById("iuranRumah").value
let jumlah=Number(document.getElementById("jumlahIuran").value)

db.collection("iuran").add({blok,rumah,jumlah})

}


/* EXPORT */

function exportExcel(){

db.collection("iuran").get().then(snapshot=>{

let csv="blok,rumah,jumlah\n"

snapshot.forEach(doc=>{

let d=doc.data()

csv+=`${d.blok},${d.rumah},${d.jumlah}\n`

})

let blob=new Blob([csv])

let a=document.createElement("a")

a.href=URL.createObjectURL(blob)

a.download="kas.csv"

a.click()

})

}


function logout(){

localStorage.clear()

location.href="index.html"

}
