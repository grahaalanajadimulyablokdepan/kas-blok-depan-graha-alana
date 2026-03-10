/* =========================
KAS GRAHA ALANA BLOK DEPAN
SUPER PRO VERSION
========================= */

/* =========================
GLOBAL VARIABLE
========================= */

let chartKas = null
let semuaRumah = []
let rumahBayar = []

let blokData = {

"A1":18,
"A2":24,
"A3":10,
"B1":20,
"B2":20,
"B3":20

}

/* =========================
UTILS
========================= */

function rupiah(x){

return "Rp"+Number(x).toLocaleString("id-ID")

}

function closeAllPopup(){

document.querySelectorAll(".popup")
.forEach(p=>p.style.display="none")

}

function showPopup(id){

closeAllPopup()

document.getElementById(id)
.style.display="block"

}

function toggleMenu(){

document.getElementById("sideMenu")
.classList.toggle("open")

}

/* =========================
GENERATE TANGGAL
========================= */

function generateTanggal(){

let tgl = document.getElementById("tglIuran")
let bln = document.getElementById("blnIuran")
let thn = document.getElementById("thnIuran")

for(let i=1;i<=31;i++){

tgl.innerHTML += `<option>${i}</option>`

}

for(let i=1;i<=12;i++){

bln.innerHTML += `<option>${i}</option>`

}

for(let i=2025;i<=2099;i++){

thn.innerHTML += `<option>${i}</option>`

}

}

/* =========================
GENERATE BLOK
========================= */

function generateBlok(){

let blok = document.getElementById("blokIuran")

Object.keys(blokData).forEach(b=>{

blok.innerHTML += `<option>${b}</option>`

})

blok.onchange = generateRumah

generateRumah()

}

function generateRumah(){

let blok = document.getElementById("blokIuran").value

let jumlah = blokData[blok]

let rumah = document.getElementById("rumahIuran")

rumah.innerHTML=""

for(let i=1;i<=jumlah;i++){

let nomor = String(i).padStart(2,"0")

rumah.innerHTML += `<option>${nomor}</option>`

}

}

/* =========================
LOAD DATA FIREBASE
========================= */

function loadData(){

let totalIuran=0
let totalKeluar=0

db.collection("iuran")
.onSnapshot(s=>{

rumahBayar=[]

totalIuran=0

s.forEach(doc=>{

let d=doc.data()

totalIuran += Number(d.nominal)

let kode = d.blok+"-"+d.rumah

rumahBayar.push(kode)

})

document.getElementById("totalIuran")
.innerText = rupiah(totalIuran)

updateBelumBayar()

})

db.collection("pengeluaran")
.onSnapshot(p=>{

totalKeluar=0

p.forEach(doc=>{

let d=doc.data()

totalKeluar += Number(d.nominal)

})

document.getElementById("totalKeluar")
.innerText = rupiah(totalKeluar)

let kas = totalIuran - totalKeluar

document.getElementById("totalKas")
.innerText = rupiah(kas)

updateChart(totalIuran,totalKeluar)

})

}

/* =========================
GRAFIK
========================= */

function updateChart(iuran,keluar){

let kas = iuran-keluar

let ctx = document
.getElementById("chartKas")
.getContext("2d")

if(chartKas) chartKas.destroy()

chartKas = new Chart(ctx,{

type:"bar",

data:{

labels:["Iuran","Pengeluaran","Kas"],

datasets:[{

label:"Keuangan",

data:[iuran,keluar,kas],

backgroundColor:[

"#28a745",
"#dc3545",
"#007bff"

]

}]

}

})

}

/* =========================
RUMAH BELUM BAYAR
========================= */

function generateSemuaRumah(){

semuaRumah=[]

for(let blok in blokData){

let jumlah = blokData[blok]

for(let i=1;i<=jumlah;i++){

let nomor = String(i).padStart(2,"0")

let kode = blok+"-"+nomor

semuaRumah.push(kode)

}

}

}

function updateBelumBayar(){

let belum = semuaRumah
.filter(r=>!rumahBayar.includes(r))

let html=""

belum.forEach(r=>{

html += `<span class="badge bg-danger">${r}</span>`

})

document.getElementById("rumahBelumBayar")
.innerHTML = html

}

/* =========================
PETA BLOK RUMAH
========================= */

function generateMap(){

let html=""

for(let blok in blokData){

html += `<h5>${blok}</h5>`
html += `<div class="blok">`

for(let i=1;i<=blokData[blok];i++){

let nomor = String(i).padStart(2,"0")

let kode = blok+"-"+nomor

html += `<div class="rumah" id="${kode}">
${nomor}
</div>`

}

html += `</div>`

}

document.getElementById("mapPerumahan")
.innerHTML = html

}

/* =========================
INPUT IURAN
========================= */

function tambahIuran(){

let nama = document.getElementById("namaIuran").value
let blok = document.getElementById("blokIuran").value
let rumah = document.getElementById("rumahIuran").value
let nominal = document.getElementById("nominalIuran").value

db.collection("iuran")
.add({

nama:nama,
blok:blok,
rumah:rumah,
nominal:Number(nominal),
tanggal:new Date()

})

closeAllPopup()

}

/* =========================
INPUT PENGELUARAN
========================= */

function tambahPengeluaran(){

let ket = document.getElementById("ketKeluar").value
let nominal = document.getElementById("nominalKeluar").value

db.collection("pengeluaran")
.add({

ket:ket,
nominal:Number(nominal),
tanggal:new Date()

})

closeAllPopup()

}

/* =========================
KOMPLAIN
========================= */

function kirimKomplain(){

let nama = document.getElementById("namaKomplain").value
let blok = document.getElementById("blokKomplain").value
let isi = document.getElementById("isiKomplain").value

db.collection("komplain")
.add({

nama:nama,
blok:blok,
isi:isi,
tanggal:new Date()

})

closeAllPopup()

}

/* =========================
DAFTAR KOMPLAIN
========================= */

function loadKomplain(){

db.collection("komplain")
.orderBy("tanggal","desc")
.onSnapshot(s=>{

let html=""

s.forEach(doc=>{

let d=doc.data()

html += `
<tr>
<td>${d.nama}</td>
<td>${d.blok}</td>
<td>${d.isi}</td>
</tr>
`

})

document.getElementById("tabelKomplain")
.innerHTML = html

})

}

/* =========================
EXPORT EXCEL
========================= */

function exportExcel(){

let table = document.querySelector("table")

let wb = XLSX.utils.table_to_book(table)

XLSX.writeFile(wb,"laporan-kas.xlsx")

}

/* =========================
LOGIN ADMIN
========================= */

function loginAdmin(){

let user = document.getElementById("adminUser").value
let pass = document.getElementById("adminPass").value

if(user==="admin" && pass==="12345"){

alert("Login berhasil")

closeAllPopup()

}else{

alert("Login gagal")

}

}

/* =========================
LOGIN WARGA
========================= */

function loginWarga(){

let nama = document.getElementById("wargaNama").value

if(nama.length>2){

alert("Login berhasil")

closeAllPopup()

}else{

alert("Isi data benar")

}

}

/* =========================
INIT
========================= */

generateSemuaRumah()
generateTanggal()
generateBlok()
generateMap()
loadData()
loadKomplain()
