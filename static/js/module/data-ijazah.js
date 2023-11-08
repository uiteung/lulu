import { CihuyDataAPI } from "https://c-craftjs.github.io/lulu/api.js";
import { UrlGetLulusan } from "../template/template.js";
import { token } from "../template/template.js";

// Untuk GET All Data Ijazah berdasarkan TahunId
document.addEventListener("DOMContentLoaded", function () {
    const cariMahasiswaBtn = document.getElementById("cariMahasiswaBtn");
    const tahunidInput = document.getElementById("tahunid");
    const tableBody = document.getElementById("tablebody");
  
    cariMahasiswaBtn.addEventListener("click", function () {
      const tahunid = tahunidInput.value;
      if (tahunid) {
        const apiUrl = UrlGetLulusan + `?tahunid=${tahunid}`;
  
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
            // Menambahkan event listener untuk button "Detail"
            const detailButtons = document.querySelectorAll('.btn-primary');
            detailButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    const MhsId = event.target.getAttribute('data-ijazah');
                    // Mengarahkan ke halaman detail-ijazah.html dengan mengirimkan parameter MhsId
                    window.location.href = `detail-ijazah.html?MhsId=${MhsId}`;
                });
            });
            
            // // Menambahkan event listener untuk button "Cetak Ijazah"
            // const cetakIjazahButtons = document.querySelectorAll('.btn-success');
            // cetakIjazahButtons.forEach(button => {
            //     button.addEventListener('click', (event) => {
            //         const MhsId = event.target.getAttribute('data-ijazah');
            //         const cetakIjazahUrl = `https://lulusan.ulbi.ac.id/lulusan/ijazah/${MhsId}`;

            //         // Mengambil data dari endpoint GET dengan menyertakan header otentikasi
            //         fetch(cetakIjazahUrl, {
            //             headers: {
            //                 'LOGIN': token, // Gantilah 'LOGIN' dengan nama header yang sesuai
            //             }
            //         })
            //             .then(response => {
            //                 if (!response.ok) {
            //                     throw new Error('Gagal mengambil data');
            //                 }
            //                 return response.json(); // Mengambil respons dalam format JSON
            //             })
            //             .then(data => {
            //                 // Lakukan apa pun yang Anda inginkan dengan data yang diterima
            //                 console.log('Data yang diterima:', data);
            //                 // Misalnya, Anda dapat menampilkan data dalam modal atau tampilan khusus
            //             })
            //             .catch(error => {
            //                 console.error('Terjadi kesalahan:', error);
            //                 // Tampilkan pesan kesalahan kepada pengguna jika diperlukan
            //             });
            //     });
            // });
            } else {
              // Tampilkan pesan kesalahan jika permintaan tidak berhasil
              tableBody.innerHTML = `<tr><td colspan="5">${data.status}</td></tr>`;
            }
          }
        });
      }
    });
  });