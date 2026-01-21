// Konfigurasi Firebase Agung
const firebaseConfig = {
  apiKey: "AIzaSyC-Es6rDXxkcsg510c9RUO67t1U3durbNg",
  authDomain: "sistem-pasien-yarsi.firebaseapp.com",
  databaseURL: "https://sistem-pasien-yarsi-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "sistem-pasien-yarsi",
  storageBucket: "sistem-pasien-yarsi.firebasestorage.app",
  messagingSenderId: "624798663279",
  appId: "1:624798663279:web:47d0b7e5ece51180fb039a",
  measurementId: "G-K3WY03T1PT"
};

// Hubungkan ke Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Fungsi Daftar Pasien
document.getElementById("formPasien").addEventListener("submit", function(e) {
    e.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const umur = document.getElementById("umur").value;
    const jk = document.getElementById("jk").value;
    const poli = document.getElementById("poli").value;

    if (nama && umur && jk && poli) {
        // Simpan data ke Cloud
        db.ref('pasien').push({
            nama: nama,
            umur: umur,
            jk: jk,
            poli: poli,
            waktu: Date.now()
        }).then(() => {
            alert("Pendaftaran Berhasil Tersimpan di Cloud!");
            this.reset();
        });
    } else {
        alert("Semua data wajib diisi!");
    }
});

// Ambil data secara otomatis (Real-time)
db.ref('pasien').on('value', (snapshot) => {
    const tabel = document.getElementById("dataPasien");
    tabel.innerHTML = "";
    let nomor = 1;

    snapshot.forEach((childSnapshot) => {
        const p = childSnapshot.val();
        const key = childSnapshot.key;
        
        tabel.innerHTML += `
            <tr>
                <td>${nomor++}</td>
                <td class="fw-bold">${p.nama}</td>
                <td>${p.umur} Thn</td>
                <td>${p.jk}</td>
                <td><span class="badge bg-info text-dark">${p.poli}</span></td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="hapusPasien('${key}')">Hapus</button>
                </td>
            </tr>`;
    });
});

// Fungsi Hapus Data di Cloud
window.hapusPasien = function(key) {
    if (confirm("Hapus data pasien ini dari antrean?")) {
        db.ref('pasien/' + key).remove();
    }
};