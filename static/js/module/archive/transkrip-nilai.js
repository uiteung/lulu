import { CihuyDataAPI } from "https://c-craftjs.github.io/lulu/api.js";
import {
  CihuyDomReady,
  CihuyQuerySelector,
} from "https://c-craftjs.github.io/table/table.js";
import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { UrlGetLulusan } from "../../template/template.js";
import { token } from "../../template/template.js";

// Untuk Get All Data Transkrip Nilai
CihuyDomReady(() => {
  const tablebody = CihuyId("tablebody");
  const buttonsebelumnya = CihuyId("prevPageBtn");
  const buttonselanjutnya = CihuyId("nextPageBtn");
  const halamansaatini = CihuyId("currentPage");
  const itemperpage = 10;
  let halamannow = 1;
  let filteredData = []; // To store the filtered data for search

  // Untuk GET All Data Ijazah berdasarkan TahunId
  document.addEventListener("DOMContentLoaded", function () {
    const cariMahasiswaBtn = document.getElementById("cariMahasiswaBtn");
    const tahunidInput = document.getElementById("tahunid");
    const tableBody = document.getElementById("tablebody");

    cariMahasiswaBtn.addEventListener("click", function () {
      const tahunid = tahunidInput.value;
      if (tahunid) {
        const apiUrl = UrlGetLulusan + `?tahunid=${tahunid}`;

        CihuyDataAPI(apiUrl, token, function (error, data) {
          if (error) {
            tableBody.innerHTML = `<tr><td colspan="5">Terjadi kesalahan: ${error.message}</td></tr>`;
          } else {
            // Hapus semua data dari tabel
            tableBody.innerHTML = "";
            filteredData = [];

            console.log(data.data);
            

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
                                      <button type="button" class="btn btn-info" data-transkrip="${mahasiswa.MhswId}">Detail</button>
                                      <button type="button" class="btn btn-success" data-transkrip="${mahasiswa.MhswId}">Cetak Transkrip Nilai</button>
                                  </td>
                              `;
                tableBody.appendChild(row);
                filteredData.push(row.outerHTML); // Store the row HTML for search
              });

              // Untuk fitur search
              searchMahasiswa(filteredData);

              // Untuk Memunculkan Pagination Halamannya
              displayData(halamannow);
              updatePagination();

              // Menambahkan event listener untuk button "Detail"
              addDetailButtonListeners();

              // Menambahkan event listener untuk button "Cetak Transkrip Nilai"
              addCetakTranskripButtonListeners();
            } else {
              // Tampilkan pesan kesalahan jika permintaan tidak berhasil
              tableBody.innerHTML = `<tr><td colspan="5">${data.status}</td></tr>`;
            }
          }
        });
      }
    });

    // Fitur untuk search mahasiswa
    function searchMahasiswa(filteredData) {
      const searchInput = document.getElementById("searchInput");
      const tableBody = document.getElementById("tablebody");

      searchInput.addEventListener("input", function () {
        const searchText = searchInput.value.toLowerCase();

        // Mengosongkan tabel sebelum memulai pencarian
        tableBody.innerHTML = "";
        if (searchText === "") {
          displayData(halamannow);
          updatePagination();
          return;
        }
        if (filteredData.length === 0) {
          // Data belum dimuat, tidak ada yang bisa dicari
          return;
        }

        for (const rowHtml of filteredData) {
          // Mengecek apakah baris mengandung kata kunci pencarian
          if (rowHtml.toLowerCase().includes(searchText)) {
            const row = document.createElement("tr");
            row.innerHTML = rowHtml;
            tableBody.appendChild(row);
          }
        }
        addCetakTranskripButtonListeners();
        addDetailButtonListeners();
        updatePagination();
      });
    }

    // Fungsi Untuk Menampilkan Data
    function displayData(page) {
      const mulaiindex = (page - 1) * itemperpage;
      const akhirindex = mulaiindex + itemperpage;
      const rowsToShow = filteredData.slice(mulaiindex, akhirindex);
      tableBody.innerHTML = rowsToShow.join("");
      addCetakTranskripButtonListeners();
      addDetailButtonListeners();
    }

    // Fungsi Untuk Update Pagination
    function updatePagination() {
      const totalPages = Math.ceil(filteredData.length / itemperpage);
      halamansaatini.textContent = `Halaman ${halamannow} dari ${totalPages}`;
    }

    function addDetailButtonListeners() {
      // Menambahkan event listener untuk button "Detail"
      const detailButtons = document.querySelectorAll(".btn-info");
      detailButtons.forEach((button) => {
        button.addEventListener("click", handleDetailButtonClick);
      });
    }

    function handleDetailButtonClick(event) {
      const MhsId = event.target.getAttribute("data-transkrip");
      // Mengarahkan ke halaman detail-transkrip.html dengan mengirimkan parameter MhsId
      window.open(`detail-transkrip.html?MhsId=${MhsId}`, "_blank");
    }

    function addCetakTranskripButtonListeners() {
      // Menambahkan event listener untuk button "Cetak Transkrip Nilai"
      const cetakTranskripButtons = document.querySelectorAll(".btn-success");
      cetakTranskripButtons.forEach((button) => {
        button.addEventListener("click", handleCetakTranskripButtonClick);
      });
    }

    function handleCetakTranskripButtonClick(event) {
      const MhsId = event.target.getAttribute("data-transkrip");
      const cetakTranskripUrl = `https://lulusan.ulbi.ac.id/lulusan/transkrip/create/${MhsId}`;

      // Menampilkan SweetAlert konfirmasi sebelum proses cetak dimulai
      Swal.fire({
        title: "Konfirmasi Cetak Transkrip Nilai",
        text: "Apakah Anda yakin ingin mencetak transkrip nilai?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          // Menampilkan SweetAlert "Tunggu" saat proses cetak dimulai
          Swal.fire({
            icon: "info",
            title: "Sedang mencetak Transkrip Nilai",
            html: "Proses cetak transkrip nilai sedang berlangsung. Mohon tunggu.",
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              Swal.getPopup().querySelector("b");
            },
          });

          // Fetch cetakTranskripUrl
          fetch(cetakTranskripUrl, {
            headers: {
              LOGIN: token, // Gantilah 'LOGIN' dengan nama header yang sesuai
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Gagal mengambil data");
              }
              return response.json(); // Mengambil respons dalam format JSON
            })
            .then((data) => {
              // Pastikan respons memiliki atribut "data"
              if (data && data.success && data.data && data.data.payload) {
                const payload = data.data.payload;
                const createTranskrip = `https://lulusan.ulbi.ac.id/static/${payload}`;
                // Membuka halaman Google Docs di jendela baru
                window.open(createTranskrip);
                // Menutup SweetAlert "Tunggu" dan menampilkan SweetAlert "Berhasil"
                Swal.close(); // Menutup SweetAlert "Tunggu"
                Swal.fire({
                  title: "Berhasil",
                  text: "Transkrip nilai berhasil dicetak!",
                  icon: "success",
                });
              } else {
                console.error("Data tidak ditemukan dalam respons.");
                // Tampilkan pesan kesalahan jika data tidak ditemukan dalam respons
                Swal.close(); // Menutup SweetAlert "Tunggu"
              }
            })
            .catch((error) => {
              console.error("Terjadi kesalahan:", error);
              // Tampilkan pesan kesalahan kepada pengguna jika diperlukan
              Swal.close(); // Menutup SweetAlert "Tunggu"
            });
        }
      });
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
