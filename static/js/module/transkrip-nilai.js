import { CihuyDataAPI } from "https://c-craftjs.github.io/lulu/api.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { UrlGetLulusan } from "../template/template.js";
import { token } from "../template/template.js";

CihuyDomReady(() => {
  const tablebody = CihuyId("tablebody");
  const buttonsebelumnya = CihuyId("prevPageBtn");
  const buttonselanjutnya = CihuyId("nextPageBtn");
  const halamansaatini = CihuyId("currentPage");
  const itemperpage = 10;
  let halamannow = 1;

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
                    <button type="button" class="btn btn-success" data-ijazah="${mahasiswa.MhswId}">Cetak Transkrip Nilai</button>
                  </td>
                `;
                tableBody.appendChild(row);
              });

            // Untuk Memunculkan Pagination Halamannya
            displayData(halamannow);
			      updatePagination();
            } else {
              // Tampilkan pesan kesalahan jika permintaan tidak berhasil
              tableBody.innerHTML = `<tr><td colspan="5">${data.status}</td></tr>`;
            }
          }
        });
        // Fungsi Untuk Menampilkan Data
        function displayData(page) {
          const baris = CihuyQuerySelector("#tablebody tr");
          const mulaiindex = (page - 1) * itemperpage;
          const akhirindex = mulaiindex + itemperpage;
          for (let i = 0; i < baris.length; i++) {
              if (i >= mulaiindex && i < akhirindex) {
                  baris[i].style.display = "table-row";
              } else {
                  baris[i].style.display = "none";
              }
          }
        }

        // Fungsi Untuk Update Pagination
        function updatePagination() {
          halamansaatini.textContent = `Halaman ${halamannow}`;
        }
        buttonsebelumnya.addEventListener("click", () => { // Button Pagination (Sebelumnya)
          if (halamannow > 1) {
              halamannow--;
              displayData(halamannow);
              updatePagination();
          }
        });
        buttonselanjutnya.addEventListener("click", () => {// Button Pagination (Selanjutnya)
          const totalPages = Math.ceil(
              tablebody.querySelectorAll("#tablebody tr").length / itemperpage
          );
          if (halamannow < totalPages) {
              halamannow++;
              displayData(halamannow);
              updatePagination();
          }
        });
      }
    });
  });
});