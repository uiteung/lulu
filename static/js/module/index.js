import { CihuyDataAPI } from "https://c-craftjs.github.io/lulu/api.js";
import {
  CihuyDomReady,
  CihuyQuerySelector,
} from "https://c-craftjs.github.io/table/table.js";
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
                                      <button type="button" class="btn btn-info" data-transkrip="${mahasiswa.MhswId}">Cetak Transkrip Nilai</button>
                                      <button type="button" class="btn btn-success" data-ijazah="${mahasiswa.MhswId}">Cetak Ijazah</button>
                                  </td>
                              `;
                tableBody.appendChild(row);
                filteredData.push(row.outerHTML); // Store the row HTML for search
              });

              // Untuk Memunculkan Pagination Halamannya
              searchMahasiswa(filteredData);

              displayData(halamannow);
              updatePagination();
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
        addCetakIjazahButtonListeners();
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
      addCetakIjazahButtonListeners();
    }

    // Fungsi Untuk Update Pagination
    function updatePagination() {
      const totalPages = Math.ceil(filteredData.length / itemperpage);
      halamansaatini.textContent = `Halaman ${halamannow} dari ${totalPages}`;
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

  function addCetakIjazahButtonListeners() {
    // Menambahkan event listener untuk button "Cetak Ijazah"
    const cetakIjazahButtons = document.querySelectorAll(".btn-success");
    cetakIjazahButtons.forEach((button) => {
      button.addEventListener("click", handleCetakIjazahButtonClick);
    });
  }

  function addCetakTranskripButtonListeners() {
    const cetakTranskripButtons = document.querySelectorAll(".btn-info");
    cetakTranskripButtons.forEach((button) => {
      button.addEventListener("click", handleCetakTranskripButtonClick);
    });
  }

  function handleCetakTranskripButtonClick(event) {
    const MhsId = event.target.getAttribute("data-transkrip");
    const cetakTranskripUrl = `https://lulusan.ulbi.ac.id/lulusan/transkrip/create/${MhsId}`;

    // Menampilkan Alert Konfirmasi
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
          title: "Sedang mencetak Ijazah",
          html: "Proses cetak ijazah sedang berlangsung. Mohon tunggu.",
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
              // Menampilkan Alert Success
              Swal.fire({
                title: "Berhasil",
                text: "Transkrip nilai berhasil dicetak!",
                icon: "success",
              });
            } else {
              console.error("Data tidak ditemukan dalam respons.");
              // Tampilkan pesan kesalahan jika data tidak ditemukan dalam respons
            }
          })
          .catch((error) => {
            console.error("Terjadi kesalahan:", error);
            // Tampilkan pesan kesalahan kepada pengguna jika diperlukan
          });
      }
    });
  }

  function handleCetakIjazahButtonClick(event) {
    const MhsId = event.target.getAttribute("data-ijazah");
    const cetakIjazahUrl = `https://lulusan.ulbi.ac.id/lulusan/ijazah/${MhsId}`;

    // Menampilkan Alert Konfirmasi
    Swal.fire({
      title: "Konfirmasi Cetak Ijazah",
      text: "Apakah Anda yakin ingin mencetak ijazah?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        // Menampilkan SweetAlert "Tunggu" saat proses cetak dimulai
        Swal.fire({
          icon: "info",
          title: "Sedang mencetak Ijazah",
          html: "Proses cetak ijazah sedang berlangsung. Mohon tunggu.",
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
            Swal.getPopup().querySelector("b");
          },
        });
        // Fetch cetakIjazahUrl
        fetch(cetakIjazahUrl, {
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
            if (data && data.data) {
              const googleDocsUrl = `https://docs.google.com/document/u/0/d/${data.data}`;
              // Membuka halaman Google Docs di jendela baru
              window.open(googleDocsUrl, "_blank");
              // Menampilkan Alert Success
              Swal.fire({
                title: "Berhasil",
                text: "Ijazah berhasil dicetak!",
                icon: "success",
              });
            } else {
              console.error("Data tidak ditemukan dalam respons.");
              // Tampilkan pesan kesalahan jika data tidak ditemukan dalam respons
            }
          })
          .catch((error) => {
            console.error("Terjadi kesalahan:", error);
            // Tampilkan pesan kesalahan kepada pengguna jika diperlukan
          });
      }
    });
  }
});
