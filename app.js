let chart

function rupiah(n){
return "Rp " + Number(n).toLocaleString("id-ID")
}

async function loadData(){

const iuranSnap = await db.collection("iuran").get()
const keluarSnap = await db.collection("pengeluaran").get()

let iuran=[]
let keluar=[]

iuranSnap.forEach(doc=>{
iuran.push(doc.data())
})

keluarSnap.forEach(doc=>{
keluar.push(doc.data())
})

render(iuran,keluar)

}

function render(iuran,keluar){

let totalIuran = iuran.reduce((a,b)=>a+Number(b.jumlah),0)
let totalKeluar = keluar.reduce((a,b)=>a+Number(b.jumlah),0)
let kas = totalIuran-totalKeluar

document.getElementById("totalKas").innerText = rupiah(kas)
document.getElementById("totalIuran").innerText = rupiah(totalIuran)
document.getElementById("totalKeluar").innerText = rupiah(totalKeluar)

let tb = document.getElementById("tabelIuran")
tb.innerHTML=""

iuran.forEach(d=>{

let tr=document.createElement("tr")

tr.innerHTML=`
<td>${d.nama}</td>
<td>${d.blok}</td>
<td>${d.rumah}</td>
<td>${d.bulan}</td>
<td>${d.tahun}</td>
<td>${rupiah(d.jumlah)}</td>
`

tb.appendChild(tr)

})

buatChart(totalIuran,totalKeluar,kas)

}

function buatChart(iuran,keluar,kas){

let ctx=document.getElementById("chart")

if(chart) chart.destroy()

chart = new Chart(ctx,{

type:"bar",

data:{
labels:["Iuran","Pengeluaran","Kas"],
datasets:[{
label:"Kas",
data:[iuran,keluar,kas],
backgroundColor:["green","red","blue"]
}]
}

})

}

async function tambahIuran(){

await db.collection("iuran").add({

nama:document.getElementById("nama").value,
blok:document.getElementById("blok").value,
rumah:document.getElementById("rumah").value,
bulan:document.getElementById("bulan").value,
tahun:document.getElementById("tahun").value,
jumlah:document.getElementById("jumlah").value

})

loadData()

}

async function tambahPengeluaran(){

await db.collection("pengeluaran").add({

ket:document.getElementById("ket").value,
jumlah:document.getElementById("jumlahKeluar").value

})

loadData()

}

async function cekRumah(){

let blok=document.getElementById("cekBlok").value
let rumah=document.getElementById("cekNomor").value

const snap = await db.collection("iuran")
.where("blok","==",blok)
.where("rumah","==",rumah)
.get()

let html=""

snap.forEach(doc=>{

let d=doc.data()

html += `
<div>
${d.bulan} ${d.tahun} : <b>${rupiah(d.jumlah)}</b>
</div>
`

})

document.getElementById("hasil").innerHTML = html || "Belum ada pembayaran"

}

loadData()
