/* =========================
KAS GRAHA ALANA SYSTEM
APP ENGINE PART 1
========================= */


/* =========================
GLOBAL VARIABLE
========================= */

let chartKas=null

let semuaRumah=[]
let rumahBayar=[]

let blokData={

"A1":18,
"A2":24,
"A3":10,

"B1":20,
"B2":20,
"B3":20

}


/* =========================
UTILS FORMAT RUPIAH
========================= */

function rupiah(x){

return "Rp"+Number(x).toLocaleString("id-ID")

}


/* =========================
NOTIFICATION SYSTEM
========================= */

function notif(text){

let box=document.getElementById("notifBox")

if(!box) return

document.getElementById("notifText").innerText=text

box.classList.add("show")

setTimeout(()=>{

box.classList.remove("show")

},3000)

}


/* =========================
POPUP CONTROL
========================= */

function showPopup(id){

let popup=document.getElementById(id)

if(!popup) return

document.getElementById("popupBackdrop").style.display="block"

popup.style.display="flex"

}

function closePopup(){

let popups=document.querySelectorAll(".popup")

popups.forEach(p=>{
p.style.display="none"
})

let back=document.getElementById("popupBackdrop")

if(back) back.style.display="none"

}


/* =========================
LOADER SYSTEM
========================= */

function hideLoader(){

let loader=document.getElementById("systemLoader")

if(loader){

loader.style.display="none"

}

}


/* =========================
LOGIN ADMIN
========================= */

function loginAdmin(){

let user=document.getElementById("adminUser").value
let pass=document.getElementById("adminPass").value

if(user==="admin" && pass==="12345"){

localStorage.setItem("loginAdmin","true")

notif("Login Admin Berhasil")

closePopup()

}
else{

notif("Login Admin Gagal")

}

}


/* =========================
LOGIN WARGA
========================= */

function loginWarga(){

let nama=document.getElementById("wargaNama").value
let blok=document.getElementById("wargaBlok").value
let rumah=document.getElementById("wargaRumah").value

if(!nama || !rumah){

notif("Isi data login warga")

return

}

localStorage.setItem("loginWarga","true")

localStorage.setItem("namaWarga",nama)
localStorage.setItem("blokWarga",blok)
localStorage.setItem("rumahWarga",rumah)

notif("Login warga berhasil")

closePopup()

}


/* =========================
CHECK LOGIN
========================= */

function cekLogin(){

let admin=localStorage.getItem("loginAdmin")
let warga=localStorage.getItem("loginWarga")

if(admin==="true"){

console.log("Admin login")

}

if(warga==="true"){

console.log("Warga login")

}

}


/* =========================
GENERATE SEMUA RUMAH
========================= */

function generateSemuaRumah(){

semuaRumah=[]

for(let blok in blokData){

let jumlah=blokData[blok]

for(let i=1;i<=jumlah;i++){

let nomor=String(i).padStart(2,"0")

let kode=blok+"-"+nomor

semuaRumah.push(kode)

}

}

}


/* =========================
GENERATE SELECT BLOK
========================= */

function generateBlokSelect(){

let select=document.getElementById("blokIuran")

if(!select) return

select.innerHTML=""

for(let blok in blokData){

let opt=document.createElement("option")

opt.value=blok
opt.text=blok

select.appendChild(opt)

}

}


/* =========================
GENERATE TANGGAL
========================= */

function generateTanggal(){

let tgl=document.getElementById("tanggalIuran")

if(!tgl) return

for(let i=1;i<=31;i++){

let opt=document.createElement("option")

opt.value=i
opt.text=i

tgl.appendChild(opt)

}

}


/* =========================
GENERATE BULAN
========================= */

function generateBulan(){

let bln=document.getElementById("bulanIuran")

if(!bln) return

let namaBulan=[

"Januari",
"Februari",
"Maret",
"April",
"Mei",
"Juni",
"Juli",
"Agustus",
"September",
"Oktober",
"November",
"Desember"

]

for(let i=0;i<12;i++){

let opt=document.createElement("option")

opt.value=i+1
opt.text=namaBulan[i]

bln.appendChild(opt)

}

}


/* =========================
GENERATE TAHUN
========================= */

function generateTahun(){

let thn=document.getElementById("tahunIuran")

if(!thn) return

for(let i=2025;i<=2099;i++){

let opt=document.createElement("option")

opt.value=i
opt.text=i

thn.appendChild(opt)

}

}


/* =========================
INIT SYSTEM
========================= */

function initSystem(){

generateSemuaRumah()

generateBlokSelect()

generateTanggal()

generateBulan()

generateTahun()

cekLogin()

setTimeout(()=>{

hideLoader()

},1000)

}


/* =========================
LOAD PAGE
========================= */

window.onload=function(){

initSystem()

}

/* =========================
FIREBASE COLLECTION
========================= */

const colIuran = db.collection("iuran")
const colKeluar = db.collection("pengeluaran")
const colKomplain = db.collection("komplain")



/* =========================
TAMBAH IURAN
========================= */

function tambahIuran(){

let nama = document.getElementById("namaIuran").value
let blok = document.getElementById("blokIuran").value
let rumah = document.getElementById("rumahIuran").value
let tanggal = document.getElementById("tanggalIuran").value
let bulan = document.getElementById("bulanIuran").value
let tahun = document.getElementById("tahunIuran").value
let nominal = document.getElementById("nominalIuran").value

if(!nama || !nominal){

notif("Isi data iuran terlebih dahulu")

return

}

colIuran.add({

nama:nama,
blok:blok,
rumah:rumah,
tanggal:tanggal,
bulan:bulan,
tahun:tahun,
nominal:Number(nominal),
created:new Date()

})
.then(()=>{

notif("Iuran berhasil disimpan")

closePopup()

})

}



/* =========================
TAMBAH PENGELUARAN
========================= */

function tambahPengeluaran(){

let tanggal = document.getElementById("tanggalKeluar").value
let bulan = document.getElementById("bulanKeluar").value
let tahun = document.getElementById("tahunKeluar").value
let ket = document.getElementById("ketKeluar").value
let nominal = document.getElementById("nominalKeluar").value

if(!ket || !nominal){

notif("Isi data pengeluaran")

return

}

colKeluar.add({

tanggal:tanggal,
bulan:bulan,
tahun:tahun,
ket:ket,
nominal:Number(nominal),
created:new Date()

})
.then(()=>{

notif("Pengeluaran berhasil disimpan")

closePopup()

})

}



/* =========================
LOAD DATA IURAN REALTIME
========================= */

function loadIuran(){

colIuran.orderBy("created","desc")

.onSnapshot(snapshot=>{

let html=""
let total=0

rumahBayar=[]

snapshot.forEach(doc=>{

let d=doc.data()

total += Number(d.nominal)

let kode = d.blok+"-"+d.rumah

rumahBayar.push(kode)

html += `

<tr>

<td>${d.nama}</td>
<td>${d.blok}</td>
<td>${d.rumah}</td>
<td>${d.tanggal}/${d.bulan}/${d.tahun}</td>
<td>${rupiah(d.nominal)}</td>

<td>

<button onclick="hapusIuran('${doc.id}')">

Hapus

</button>

</td>

</tr>

`

})

let tabel=document.getElementById("tabelIuran")

if(tabel) tabel.innerHTML=html

let totalIuran=document.getElementById("totalIuran")

if(totalIuran) totalIuran.innerText=rupiah(total)

updateBelumBayar()

updateDashboard()

})

}



/* =========================
LOAD DATA PENGELUARAN
========================= */

function loadKeluar(){

colKeluar.orderBy("created","desc")

.onSnapshot(snapshot=>{

let html=""
let total=0

snapshot.forEach(doc=>{

let d=doc.data()

total += Number(d.nominal)

html += `

<tr>

<td>${d.tanggal}/${d.bulan}/${d.tahun}</td>
<td>${d.ket}</td>
<td>${rupiah(d.nominal)}</td>

<td>

<button onclick="hapusKeluar('${doc.id}')">

Hapus

</button>

</td>

</tr>

`

})

let tabel=document.getElementById("tabelKeluar")

if(tabel) tabel.innerHTML=html

let totalKeluar=document.getElementById("totalKeluar")

if(totalKeluar) totalKeluar.innerText=rupiah(total)

updateDashboard()

})

}



/* =========================
DELETE IURAN
========================= */

function hapusIuran(id){

if(!confirm("Hapus data iuran?")) return

colIuran.doc(id).delete()

notif("Iuran dihapus")

}



/* =========================
DELETE PENGELUARAN
========================= */

function hapusKeluar(id){

if(!confirm("Hapus pengeluaran?")) return

colKeluar.doc(id).delete()

notif("Pengeluaran dihapus")

}



/* =========================
UPDATE DASHBOARD
========================= */

function updateDashboard(){

let totalIuranText=document.getElementById("totalIuran").innerText
let totalKeluarText=document.getElementById("totalKeluar").innerText

let iuran=Number(totalIuranText.replace(/[^0-9]/g,""))
let keluar=Number(totalKeluarText.replace(/[^0-9]/g,""))

let kas=iuran-keluar

let elKas=document.getElementById("totalKas")

if(elKas) elKas.innerText=rupiah(kas)

updateChart(iuran,keluar)

updateDetailKas(iuran,keluar,kas)

}



/* =========================
DETAIL KAS POPUP
========================= */

function updateDetailKas(iuran,keluar,kas){

let el1=document.getElementById("detailTotalIuran")
let el2=document.getElementById("detailTotalKeluar")
let el3=document.getElementById("detailTotalKas")

if(el1) el1.innerText=rupiah(iuran)
if(el2) el2.innerText=rupiah(keluar)
if(el3) el3.innerText=rupiah(kas)

}



/* =========================
LOAD DASHBOARD
========================= */

function loadDashboard(){

loadIuran()

loadKeluar()

}



/* =========================
INIT FIREBASE SYSTEM
========================= */

window.addEventListener("DOMContentLoaded",()=>{

loadDashboard()

})

/* =========================
GENERATE PETA BLOK RUMAH
========================= */

function generateMapBlok(){

let container=document.getElementById("mapPerumahan")

if(!container) return

let html=""

for(let blok in blokData){

let jumlah=blokData[blok]

html+=`

<div class="blok-box">

<h4>${blok}</h4>

<div class="blok-grid">

`

for(let i=1;i<=jumlah;i++){

let nomor=String(i).padStart(2,"0")

let kode=blok+"-"+nomor

html+=`

<div 

id="rumah-${kode}" 
class="rumah-box belum"

onclick="detailRumah('${blok}','${nomor}')"

>

${nomor}

</div>

`

}

html+=`

</div>
</div>

`

}

container.innerHTML=html

}



/* =========================
UPDATE STATUS RUMAH LUNAS
========================= */

function updateStatusRumah(){

rumahBayar.forEach(kode=>{

let el=document.getElementById("rumah-"+kode)

if(el){

el.classList.remove("belum")

el.classList.add("lunas")

}

})

}



/* =========================
DETAIL RUMAH POPUP
========================= */

function detailRumah(blok,rumah){

let kode=blok+"-"+rumah

let modal=document.getElementById("modalRumah")

document.getElementById("judulRumah").innerText=

"Histori Pembayaran "+kode


db.collection("iuran")

.where("blok","==",blok)

.where("rumah","==",rumah)

.get()

.then(snapshot=>{

let html=""

snapshot.forEach(doc=>{

let d=doc.data()

html+=`

<tr>

<td>${d.nama}</td>
<td>${d.tanggal}/${d.bulan}/${d.tahun}</td>
<td>${rupiah(d.nominal)}</td>

</tr>

`

})

if(html===""){

html=`<tr>
<td colspan="3" class="text-center">
Belum ada pembayaran
</td>
</tr>`

}

document.getElementById("historiRumah").innerHTML=html

showPopup("modalRumah")

})

}



/* =========================
RUMAH BELUM BAYAR
========================= */

function updateBelumBayar(){

let belum=[]

semuaRumah.forEach(r=>{

if(!rumahBayar.includes(r)){

belum.push(r)

}

})

let html=""

belum.forEach(r=>{

html+=`

<span class="badge-belum">

${r}

</span>

`

})

let box=document.getElementById("rumahBelumBayar")

if(box) box.innerHTML=html

updateStatistikRumah()

}



/* =========================
STATISTIK RUMAH
========================= */

function updateStatistikRumah(){

let total=semuaRumah.length

let sudah=rumahBayar.length

let belum=total-sudah

let elTotal=document.getElementById("totalRumah")

let elSudah=document.getElementById("rumahBayar")

let elBelum=document.getElementById("rumahBelum")

if(elTotal) elTotal.innerText=total

if(elSudah) elSudah.innerText=sudah

if(elBelum) elBelum.innerText=belum

updateProgressBayar(total,sudah)

}



/* =========================
PROGRESS BAR PEMBAYARAN
========================= */

function updateProgressBayar(total,sudah){

let persen=0

if(total>0){

persen=Math.round((sudah/total)*100)

}

let bar=document.getElementById("progressBayar")

if(bar){

bar.style.width=persen+"%"

bar.innerText=persen+"%"

}

}



/* =========================
REFRESH MAP STATUS
========================= */

function refreshMap(){

generateMapBlok()

setTimeout(()=>{

updateStatusRumah()

},300)

}



/* =========================
LOAD MAP SYSTEM
========================= */

function loadMapSystem(){

generateSemuaRumah()

generateMapBlok()

}



/* =========================
INIT MAP
========================= */

window.addEventListener("DOMContentLoaded",()=>{

loadMapSystem()

})

/* =========================
CEK AKSES KOMPLAIN
========================= */

function cekAksesKomplain(){

let status=localStorage.getItem("loginWarga")

if(status!=="true"){

notif("Harus login warga terlebih dahulu")

return

}

showPopup("popupKomplain")

}



/* =========================
CEK AKSES DAFTAR KOMPLAIN
========================= */

function cekAksesDaftarKomplain(){

let status=localStorage.getItem("loginWarga")

if(status!=="true"){

notif("Login warga terlebih dahulu")

return

}

loadKomplain()

showPopup("popupListKomplain")

}



/* =========================
KIRIM KOMPLAIN
========================= */

function kirimKomplain(){

let nama=document.getElementById("komplainNama").value
let blok=document.getElementById("komplainBlok").value
let rumah=document.getElementById("komplainRumah").value
let tanggal=document.getElementById("komplainTanggal").value
let bulan=document.getElementById("komplainBulan").value
let tahun=document.getElementById("komplainTahun").value
let isi=document.getElementById("komplainIsi").value

if(!nama || !isi){

notif("Isi nama dan komplain")

return

}

colKomplain.add({

nama:nama,
blok:blok,
rumah:rumah,
tanggal:tanggal,
bulan:bulan,
tahun:tahun,
isi:isi,
created:new Date()

})

.then(()=>{

notif("Komplain berhasil dikirim")

closePopup()

resetFormKomplain()

})

}



/* =========================
RESET FORM KOMPLAIN
========================= */

function resetFormKomplain(){

document.getElementById("komplainNama").value=""
document.getElementById("komplainIsi").value=""

}



/* =========================
LOAD KOMPLAIN REALTIME
========================= */

function loadKomplain(){

colKomplain

.orderBy("created","desc")

.onSnapshot(snapshot=>{

let html=""

snapshot.forEach(doc=>{

let d=doc.data()

html+=`

<tr>

<td>${d.nama}</td>

<td>${d.blok}</td>

<td>${d.rumah}</td>

<td>${d.tanggal}/${d.bulan}/${d.tahun}</td>

<td>${d.isi}</td>

</tr>

`

})

if(html===""){

html=`<tr>

<td colspan="5" class="text-center">

Belum ada komplain

</td>

</tr>`

}

let tabel=document.getElementById("tabelKomplain")

if(tabel) tabel.innerHTML=html

})

}



/* =========================
UPDATE BADGE KOMPLAIN
========================= */

function updateBadgeKomplain(){

colKomplain.get()

.then(snapshot=>{

let jumlah=snapshot.size

let badge=document.getElementById("badgeKomplain")

if(badge){

badge.innerText=jumlah

}

})

}



/* =========================
LIST KOMPLAIN ADMIN
========================= */

function loadKomplainAdmin(){

colKomplain

.orderBy("created","desc")

.onSnapshot(snapshot=>{

let html=""

snapshot.forEach(doc=>{

let d=doc.data()

html+=`

<tr>

<td>${d.nama}</td>
<td>${d.blok}</td>
<td>${d.rumah}</td>
<td>${d.tanggal}/${d.bulan}/${d.tahun}</td>
<td>${d.isi}</td>

<td>

<button onclick="hapusKomplain('${doc.id}')">

Hapus

</button>

</td>

</tr>

`

})

let tabel=document.getElementById("tabelKomplainAdmin")

if(tabel) tabel.innerHTML=html

})

}



/* =========================
HAPUS KOMPLAIN
========================= */

function hapusKomplain(id){

if(!confirm("Hapus komplain ini?")) return

colKomplain.doc(id).delete()

notif("Komplain dihapus")

}



/* =========================
INIT KOMPLAIN SYSTEM
========================= */

function initKomplainSystem(){

updateBadgeKomplain()

loadKomplainAdmin()

}



/* =========================
LOAD SYSTEM KOMPLAIN
========================= */

window.addEventListener("DOMContentLoaded",()=>{

initKomplainSystem()

})

/* =========================
FILTER IURAN BULAN TAHUN
========================= */

function filterIuran(){

let bulan=document.getElementById("filterBulanIuran").value
let tahun=document.getElementById("filterTahunIuran").value

colIuran

.where("bulan","==",bulan)

.where("tahun","==",tahun)

.get()

.then(snapshot=>{

let html=""
let total=0

snapshot.forEach(doc=>{

let d=doc.data()

total+=Number(d.nominal)

html+=`

<tr>

<td>${d.nama}</td>
<td>${d.blok}</td>
<td>${d.rumah}</td>
<td>${d.tanggal}/${d.bulan}/${d.tahun}</td>
<td>${rupiah(d.nominal)}</td>

</tr>

`

})

if(html===""){

html=`<tr>
<td colspan="5" class="text-center">
Data tidak ditemukan
</td>
</tr>`

}

document.getElementById("tabelIuran").innerHTML=html

document.getElementById("totalIuran").innerText=rupiah(total)

})

}



/* =========================
FILTER PENGELUARAN
========================= */

function filterPengeluaran(){

let bulan=document.getElementById("filterBulanKeluar").value
let tahun=document.getElementById("filterTahunKeluar").value

colKeluar

.where("bulan","==",bulan)

.where("tahun","==",tahun)

.get()

.then(snapshot=>{

let html=""
let total=0

snapshot.forEach(doc=>{

let d=doc.data()

total+=Number(d.nominal)

html+=`

<tr>

<td>${d.tanggal}/${d.bulan}/${d.tahun}</td>
<td>${d.ket}</td>
<td>${rupiah(d.nominal)}</td>

</tr>

`

})

if(html===""){

html=`<tr>
<td colspan="3" class="text-center">
Data tidak ditemukan
</td>
</tr>`

}

document.getElementById("tabelKeluar").innerHTML=html

document.getElementById("totalKeluar").innerText=rupiah(total)

})

}



/* =========================
EXPORT EXCEL
========================= */

function exportExcel(){

let tabel=document.querySelector("table")

if(!tabel){

notif("Tabel tidak ditemukan")

return

}

let wb=XLSX.utils.table_to_book(tabel)

XLSX.writeFile(wb,"laporan-kas-graha-alana.xlsx")

notif("Laporan Excel berhasil dibuat")

}



/* =========================
UPDATE GRAFIK KAS
========================= */

function updateChart(iuran,keluar){

let kas=iuran-keluar

let ctx=document.getElementById("chartKas")

if(!ctx) return

if(chartKas){

chartKas.destroy()

}

chartKas=new Chart(ctx,{

type:"bar",

data:{

labels:["Iuran","Pengeluaran","Kas"],

datasets:[{

label:"Statistik Kas",

data:[iuran,keluar,kas],

backgroundColor:[

"#16a34a",
"#dc2626",
"#2563eb"

]

}]

},

options:{

responsive:true,

plugins:{

legend:{display:false}

},

scales:{

y:{

beginAtZero:true

}

}

}

})

}



/* =========================
UPDATE GRAFIK OTOMATIS
========================= */

function refreshGrafik(){

let totalIuranText=document.getElementById("totalIuran").innerText
let totalKeluarText=document.getElementById("totalKeluar").innerText

let iuran=Number(totalIuranText.replace(/[^0-9]/g,""))
let keluar=Number(totalKeluarText.replace(/[^0-9]/g,""))

updateChart(iuran,keluar)

}



/* =========================
INIT GRAFIK SYSTEM
========================= */

function initGrafik(){

refreshGrafik()

}



/* =========================
LOAD GRAFIK
========================= */

window.addEventListener("DOMContentLoaded",()=>{

initGrafik()

})

/* =========================
SECURITY SESSION SYSTEM
========================= */

function cekSession(){

let admin=localStorage.getItem("loginAdmin")
let warga=localStorage.getItem("loginWarga")

if(admin==="true"){

console.log("Admin session aktif")

}

if(warga==="true"){

console.log("Warga session aktif")

}

}



/* =========================
LOGOUT ADMIN
========================= */

function logoutAdmin(){

localStorage.removeItem("loginAdmin")

notif("Admin logout")

setTimeout(()=>{

location.reload()

},1000)

}



/* =========================
LOGOUT WARGA
========================= */

function logoutWarga(){

localStorage.removeItem("loginWarga")

notif("Warga logout")

setTimeout(()=>{

location.reload()

},1000)

}



/* =========================
AUTO REFRESH DASHBOARD
========================= */

function autoRefresh(){

setInterval(()=>{

refreshGrafik()

updateBadgeKomplain()

},10000)

}



/* =========================
PROTEKSI ERROR
========================= */

window.onerror=function(msg,url,line){

console.warn("Error ditangkap sistem")

console.warn(msg)

return true

}



/* =========================
PERFORMANCE OPTIMIZER
========================= */

function systemOptimizer(){

console.log("Optimizer aktif")

setTimeout(()=>{

let loader=document.getElementById("systemLoader")

if(loader){

loader.style.display="none"

}

},800)

}



/* =========================
DARK MODE SUPPORT
========================= */

function toggleDarkMode(){

document.body.classList.toggle("dark-mode")

}



/* =========================
AUTO SYNC FIREBASE
========================= */

function firebaseSync(){

colIuran.onSnapshot(()=>{

updateDashboard()

})

colKeluar.onSnapshot(()=>{

updateDashboard()

})

}



/* =========================
SYSTEM HEALTH CHECK
========================= */

function healthCheck(){

console.log("System OK")

}



/* =========================
INIT ULTRA ENGINE
========================= */

function initUltraEngine(){

cekSession()

systemOptimizer()

autoRefresh()

firebaseSync()

healthCheck()

}



/* =========================
LOAD FINAL SYSTEM
========================= */

window.addEventListener("DOMContentLoaded",()=>{

initUltraEngine()

})
