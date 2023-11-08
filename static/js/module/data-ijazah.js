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
import {
    CihuyDataAPI,
    // CihuyPostApi,
    // CihuyUpdateApi,
    // CihuyDeleteAPI,
  } from "https://c-craftjs.github.io/lulu/api.js";
import { UrlGetLulusan } from "../template/template.js";
import { token } from "../template/template.js";

document.addEventListener("DOMContentLoaded", function () {
    const cariMahasiswaBtn = document.getElementById("cariMahasiswaBtn");
    const tahunidInput = document.getElementById("tahunid");
    const tableBody = document.getElementById("tablebody");
  
    cariMahasiswaBtn.addEventListener("click", function () {
      const tahunid = tahunidInput.value;
      if (tahunid) {
        const apiUrl = `https://lulusan.ulbi.ac.id/lulusan?tahunid=${tahunid}`;
  
        CihuyDataAPI(apiUrl , token, function (error, data) {
          if (error) {
            tableBody.innerHTML = `<tr><td colspan="5">Terjadi kesalahan: ${error.message}</td></tr>`;
          } else {
            // Hapus semua data dari tabel
            tableBody.innerHTML = "";
  
            if (data.success) {
              // Tambahkan data mahasiswa ke dalam tabel
              data.data.forEach((mahasiswa) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                  <td style="text-align: center; vertical-align: middle">${mahasiswa.MhswId}</td>
                  <td style="text-align: center; vertical-align: middle">${mahasiswa.nama}</td>
                  <td style="text-align: center; vertical-align: middle">${mahasiswa.nik}</td>
                  <td style="text-align: center; vertical-align: middle">${mahasiswa.prodi}</td>
                  <td style="text-align: center; vertical-align: middle">
                    <button type="button" class="btn btn-primary" data-ijazah="${mahasiswa.MhswId}">Detail</button>
                    <button type="button" class="btn btn-success" data-ijazah="${mahasiswa.MhswId}">Cetak Ijazah</button>
                  </td>
                `;
                tableBody.appendChild(row);
              });
            } else {
              // Tampilkan pesan kesalahan jika permintaan tidak berhasil
              tableBody.innerHTML = `<tr><td colspan="5">${data.status}</td></tr>`;
            }
          }
        });
      }
    });
  });
  