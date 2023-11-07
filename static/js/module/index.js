// Untuk Autentifikasi Login User Tertentu
// import { token } from "../controller/cookies.js";

// var header = new Headers();
// header.append("login", token);
// header.append("Content-Type", "application/json");

// const requestOptions = {
//   method: "GET",
//   headers: header
// };

// Untuk GET All Data Ijazah berdasarkan TahunId
function getData() {
  const tahunid = document.getElementById("tahunid").value;
  const url = `https://lulusan.ulbi.ac.id/lulusan?tahunid=${tahunid}`;

  $.ajax({
      url: url,
      method: 'GET',
      success: function (response) {
          const tablebody = document.getElementById("tablebody");
          // Mengosongkan tabel
          tablebody.innerHTML = "";

          if (response.success) {
              // Mengisi tabel dengan data yang diterima dari server
              response.data.forEach(function (item) {
                  const row = `
                  <tr>
                      <td style="text-align: center; vertical-align: middle">${item.MhswId}</td>
                      <td style="text-align: center; vertical-align: middle">${item.nama}</td>
                      <td style="text-align: center; vertical-align: middle">${item.nik}</td>
                      <td style="text-align: center; vertical-align: middle">${item.prodi}</td>
                      <td style="text-align: center; vertical-align: middle">
                          <button class="btn btn-success">Cetak Ijazah</button>
                          <button class="btn btn-primary">Detail</button>
                      </td>
                  </tr>`;
                  tablebody.innerHTML += row;
              });
          } else {
              alert('Gagal mengambil data. Status: ' + response.status);
          }
      },
      error: function () {
          alert('Gagal mengambil data.');
      }
  });
}