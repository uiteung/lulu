import { CihuyDataAPI } from "https://c-craftjs.github.io/lulu/api.js";
import { CihuyDomReady } from "https://c-craftjs.github.io/table/table.js";
import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { UrlGetAllMataKuliah } from "../template/template.js";
import { token } from "../template/template.js";
import { handleEditMataKuliah } from "./helperHandleEdit.js";

// Untuk Get All Data Transkrip Nilai
CihuyDomReady(() => {
  const buttonsebelumnya = CihuyId("prevPageBtn");
  const buttonselanjutnya = CihuyId("nextPageBtn");
  const halamansaatini = CihuyId("currentPage");
  const itemperpage = 10;
  let halamannow = 1;
  let filteredData = []; // To store the filtered data for search

  // Untuk GET All Data Ijazah berdasarkan TahunId
  document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("tablebody");

    const apiUrl = UrlGetAllMataKuliah;

    CihuyDataAPI(apiUrl, token, function (error, data) {
      if (error) {
        tableBody.innerHTML = `<tr><td colspan="5">Terjadi kesalahan: ${error.message}</td></tr>`;
      } else {
        // Hapus semua data dari tabel
        tableBody.innerHTML = "";
        filteredData = [];

        console.log(data.data);
        

        if (data.success) {
          // Tambahkan data matakuliah ke dalam tabel
          data.data.forEach((matakuliah) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                                  <td style="text-align: center; vertical-align: middle">${matakuliah.MKKode}</td>
                                  <td style="vertical-align: middle; text-transform: uppercase">${matakuliah.Nama}</td>
                                  <td style="vertical-align: middle">${matakuliah.Nama_en}</td>
                                  <td style="text-align: center; vertical-align: middle">${matakuliah.SKS}</td>
                                  <td style="text-align: center; vertical-align: middle">
                                      <button class="btn btn-warning btn-sm" id="edit-matakuliah">Edit</button>
                                  </td>
                              `;
            tableBody.appendChild(row);
            filteredData.push(row.outerHTML); // Store the row HTML for search
          });

          // Untuk fitur search
          searchMataKuliah(filteredData);

          // Untuk Memunculkan Pagination Halamannya
          displayData(halamannow);
          updatePagination();
        } else {
          // Tampilkan pesan kesalahan jika permintaan tidak berhasil
          tableBody.innerHTML = `<tr><td colspan="5">${data.status}</td></tr>`;
        }
      }
    });

    // Pemanggilan fungsi edit transkrip
    document
      .getElementById("tablebody")
      .addEventListener("click", handleEditMataKuliah);

    // Fitur untuk search matakuliah
    function searchMataKuliah(originalData) {
      const searchInput = document.getElementById("searchInput");

      searchInput.addEventListener("input", function () {
        const searchText = searchInput.value.toLowerCase();

        if (searchText === "") {
          // Jika input kosong, tampilkan data default
          filteredData = [...originalData]; // Salin originalData ke filteredData
          halamannow = 1; // Reset halaman ke awal
          displayData(halamannow);
          updatePagination();
        } else {
          // Filter data berdasarkan pencarian
          filteredData = originalData.filter((rowHtml) =>
            rowHtml.toLowerCase().includes(searchText)
          );

          halamannow = 1; // Reset halaman ke awal
          displayData(halamannow);
          updatePagination();
        }
      });
    }

    // Fungsi Untuk Menampilkan Data
    function displayData(page) {
      const mulaiindex = (page - 1) * itemperpage;
      const akhirindex = mulaiindex + itemperpage;
      const rowsToShow = filteredData.slice(mulaiindex, akhirindex); // Ambil subset data
      tableBody.innerHTML = rowsToShow.join(""); // Render data
    }

    // Fungsi Untuk Update Pagination
    function updatePagination() {
      const totalPages = Math.ceil(filteredData.length / itemperpage); // Hitung total halaman
      halamansaatini.textContent = `Halaman ${halamannow} dari ${totalPages}`;

      // Tampilkan atau sembunyikan tombol berdasarkan halaman saat ini
      buttonsebelumnya.disabled = halamannow === 1;
      buttonselanjutnya.disabled =
        halamannow === totalPages || totalPages === 0;
    }

    // Button Pagination (Sebelumnya)
    buttonsebelumnya.addEventListener("click", () => {
      if (halamannow > 1) {
        halamannow--;
        displayData(halamannow);
        updatePagination();
      }
    });

    // Button Pagination (Selanjutnya)
    buttonselanjutnya.addEventListener("click", () => {
      const totalPages = Math.ceil(filteredData.length / itemperpage);
      if (halamannow < totalPages) {
        halamannow++;
        displayData(halamannow);
        updatePagination();
      }
    });
  });
});
