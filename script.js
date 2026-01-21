let nomor = 1;

document.getElementById("formPasien").addEventListener("submit", function(e) {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const umur = document.getElementById("umur").value;
  const jk = document.getElementById("jk").value;
  const poli = document.getElementById("poli").value;

  // Validasi tambahan
  if (!nama || !umur || !jk || !poli) {
    alert("Semua data wajib diisi dengan benar!");
    return;
  }

  if (umur <= 0) {
    alert("Umur tidak valid!");
    return;
  }

  const tabel = document.getElementById("dataPasien");
  const row = tabel.insertRow();

  row.innerHTML = `
    <td>${nomor++}</td>
    <td class="fw-bold">${nama}</td>
    <td>${umur} Thn</td>
    <td>${jk}</td>
    <td><span class="badge bg-info text-dark">${poli}</span></td>
    <td>
      <button class="btn btn-danger btn-sm" onclick="hapusBaris(this)">Hapus</button>
    </td>
  `;

  document.getElementById("formPasien").reset();
});

// Fungsi untuk menghapus data (Nilai Plus!)
function hapusBaris(btn) {
  if (confirm("Hapus data pasien ini?")) {
    const row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
  }
}