// GANTI CONFIG DENGAN MILIKMU SENDIRI
const firebaseConfig = {
    apiKey: "AIzaSy...", 
    authDomain: "sistem-pasien-yarsi.firebaseapp.com",
    databaseURL: "https://sistem-pasien-yarsi-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "sistem-pasien-yarsi",
    storageBucket: "sistem-pasien-yarsi.appspot.com",
    messagingSenderId: "...",
    appId: "..."
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Fungsi Render Tabel Pasien
function updateTabel(dataArray) {
    const tbody = document.getElementById("dataPasien");
    if(!tbody) return;
    tbody.innerHTML = "";
    
    dataArray.forEach((p) => {
        const warnaPoli = p.poli === 'Umum' ? 'bg-primary' : p.poli === 'Gigi' ? 'bg-success' : p.poli === 'Anak' ? 'bg-warning text-dark' : 'bg-danger';
        const warnaStatus = p.status === 'Selesai' ? 'bg-secondary' : p.status === 'Dipanggil' ? 'bg-warning text-dark' : 'bg-info text-dark';
        
        tbody.innerHTML += `
            <tr>
                <td class="fw-bold fs-5">${p.noAntrean}</td>
                <td class="text-start ps-4 fw-bold text-uppercase">${p.nama}</td>
                <td><span class="badge ${warnaPoli}">${p.poli}</span></td>
                <td>${p.waktu}</td>
                <td><span class="badge ${warnaStatus}">${p.status}</span></td>
            </tr>`;
    });
}

// Pantau Perubahan Data (Statistik & Tabel)
db.ref('pasien').on('value', (snapshot) => {
    const listHariIni = [];
    const tgl = new Date().toLocaleDateString('en-CA');
    let t=0, u=0, g=0, a=0, s=0;

    snapshot.forEach((child) => {
        const d = child.val();
        if(d.tanggal === tgl) {
            listHariIni.push(d);
            t++;
            if(d.poli === 'Umum') u++;
            if(d.poli === 'Gigi') g++;
            if(d.poli === 'Anak') a++;
            if(d.poli === 'Syaraf') s++;
        }
    });

    // Update Counter di Kartu Atas
    if(document.getElementById("statTotal")) {
        document.getElementById("statTotal").innerText = t;
        document.getElementById("statUmum").innerText = u;
        document.getElementById("statGigi").innerText = g;
        document.getElementById("statAnak").innerText = a;
        document.getElementById("statSyaraf").innerText = s;
    }
    updateTabel(listHariIni);
});

// Proses Pendaftaran Form
const form = document.getElementById("formPasien");
if(form) {
    form.onsubmit = function(e) {
        e.preventDefault();
        const nama = document.getElementById("nama").value.trim();
        const poli = document.getElementById("poli").value;
        const umur = document.getElementById("umur").value;
        const jk = document.getElementById("jk").value;
        const tgl = new Date().toLocaleDateString('en-CA');

        db.ref('pasien').once('value', (snapshot) => {
            let hitungPoli = 0;
            snapshot.forEach((child) => {
                if(child.val().poli === poli && child.val().tanggal === tgl) hitungPoli++;
            });

            const noAntrean = `${poli.charAt(0).toUpperCase()}-${(hitungPoli + 1).toString().padStart(2, '0')}`;
            const jam = new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' }).replace(/\./g, ':');

            db.ref('pasien').push({
                nama, poli, umur, jk, noAntrean, 
                waktu: jam, tanggal: tgl, status: "Menunggu"
            }).then(() => {
                alert("PENDAFTARAN BERHASIL!\n\nNomor Antrean Anda: " + noAntrean);
                form.reset();
            });
        });
    };
}