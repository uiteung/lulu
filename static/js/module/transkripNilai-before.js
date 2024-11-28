import { CihuyDataAPI } from "https://c-craftjs.github.io/lulu/api.js";
import {
  UrlGetAllMhsTranskrip,
  UrlGetCetakTranskrip,
  UrlSinkronData,
  token,
} from "../template/template.js";
import { CihuyId } from "https://c-craftjs.github.io/element/element.js";

// Untuk Get Data Transkrip Nilai Mahasiswa by Id
// Ambil MhsId dari URL
const tableBody = document.getElementById("tablebody");
const buttonsebelumnya = CihuyId("prevPageBtn");
const buttonselanjutnya = CihuyId("nextPageBtn");
const halamansaatini = CihuyId("currentPage");
const itemperpage = 10;
let halamannow = 1;
let filteredData = [];

CihuyDataAPI(UrlGetAllMhsTranskrip, token, (error, result) => {
  // console.log(result.data);

  let no = 1;

  if (result.data && result.data.length > 0) {
    result.data.forEach((mahasiswa) => {
      const row = document.createElement("tr");
      const statusDownload = mahasiswa.status_download;
      row.innerHTML = `
                        <td style="text-align: center; vertical-align: middle">${no++}</td>
                        <td style="vertical-align: middle">${mahasiswa.npm}</td>
                        <td style="vertical-align: middle">${
                          mahasiswa.nama
                        }</td>
                        <td style="vertical-align: middle">${
                          mahasiswa.program_studi
                        }</td>
                        <td style="text-align: center; vertical-align: middle">
                          <button type="button" class="btn btn-info" data-transkrip="${
                            mahasiswa.npm
                          }">Detail</button>
                          <button type="button" class="btn ${
                            statusDownload ? "btn-success" : "btn-danger"
                          } cetak" data-transkrip="${
        mahasiswa.npm
      }">Cetak Transkrip Nilai</button>
                          <button type="button" class="btn btn-warning sinkron" data-sinkron="${
                            mahasiswa.npm
                          }">Sinkron</button>
                        </td>       
                      `;
      tableBody.appendChild(row);
      filteredData.push(row.outerHTML); // Store the row HTML for search
    });

    // Untuk fitur search
    searchMahasiswa(filteredData);

    // Menambahkan event listener untuk button "Detail"
    addDetailButtonListeners();

    // Menambahkan event listener untuk button "Cetak Transkrip"
    addCetakTranskripButtonListeners();

    // Menambahkan event listener untuk button "Sinkronisasi Data"
    addSinkronButtonListeners();

    // Untuk Memunculkan Pagination Halamannya
    displayData(halamannow);
    updatePagination();
  } else {
    // Jika tidak ada mata kuliah
    tableBody.innerHTML = `<tr><td colspan="4">No subjects found</td></tr>`;
    console.error(error);
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

    // Untuk Memunculkan Pagination Halamannya
    addDetailButtonListeners();
    addCetakTranskripButtonListeners();
    addSinkronButtonListeners();
    updatePagination();
  });
}

// Fungsi Untuk Menampilkan Data
function displayData(page) {
  const mulaiindex = (page - 1) * itemperpage;
  const akhirindex = mulaiindex + itemperpage;
  const rowsToShow = filteredData.slice(mulaiindex, akhirindex);
  tableBody.innerHTML = rowsToShow.join("");

  addDetailButtonListeners();
  addCetakTranskripButtonListeners();
  addSinkronButtonListeners();
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
  const cetakTranskripButtons = document.querySelectorAll(".cetak");
  cetakTranskripButtons.forEach((button) => {
    button.addEventListener("click", handleCetakTranskripButtonClick);
  });
}

function handleCetakTranskripButtonClick(event) {
  const MhsId = event.target.getAttribute("data-transkrip");

  const apiCetakTranskrip = UrlGetCetakTranskrip + MhsId;

  // Tampil SweetAlert Konfirmasi
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
      fetch(apiCetakTranskrip, {
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
          if (data && data.success && data.data && data.data.document_id) {
            const createTranskrip = `https://lulusan.ulbi.ac.id/static/${data.data.document_id}`;

            // Menutup SweetAlert "Tunggu" dan menampilkan SweetAlert "Berhasil"
            Swal.close(); // Menutup SweetAlert "Tunggu"
            Swal.fire({
              title: "Berhasil",
              text: "Transkrip nilai berhasil dicetak!",
              icon: "success",
            }).then(() => {
              // Setelah pengguna menutup pesan berhasil, coba buka PDF
              let newWindow;
              try {
                // Membuka halaman PDF di tab baru
                newWindow = window.open(createTranskrip, "_blank");

                if (
                  !newWindow ||
                  newWindow.closed ||
                  typeof newWindow.closed === "undefined"
                ) {
                  // Jika pop-up diblok, tampilkan pesan informasi
                  Swal.fire({
                    title: "Informasi",
                    text: "Pop-up browser Anda berkemungkinan diblokir. Mohon izinkan akses pop-up dan silahkan cetak kembali.",
                    icon: "info",
                    showConfirmButton: true,
                  });
                }
              } catch (error) {
                console.error("Error membuka dokumen:", error);
                Swal.fire({
                  title: "Error",
                  text: "Terjadi kesalahan saat membuka dokumen.",
                  icon: "error",
                });
              }
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

function addSinkronButtonListeners() {
  // Menambahkan event listener untuk semua tombol dengan class "sinkron"
  const sinkronButtons = document.querySelectorAll(".sinkron");

  sinkronButtons.forEach((button) => {
    button.addEventListener("click", (event) =>
      handleSinkronButtonClick(event, sinkronButtons)
    );
  });
}

function handleSinkronButtonClick(event, sinkronButtons) {
  const clickedButton = event.target; // Tombol yang diklik
  const MhsId = clickedButton.getAttribute("data-sinkron");
  const apiSinkron = UrlSinkronData + MhsId;

  // Menonaktifkan semua tombol dan memulai hitungan mundur
  let countdown = 60; // Hitungan mundur dalam detik
  sinkronButtons.forEach((button) => {
    button.disabled = true; // Nonaktifkan semua tombol
    button.textContent = `Tunggu ${countdown} detik`;
  });

  const interval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      sinkronButtons.forEach((button) => {
        button.textContent = `Tunggu ${countdown} detik`;
      });
    } else {
      clearInterval(interval);
      sinkronButtons.forEach((button) => {
        button.disabled = false; // Aktifkan semua tombol kembali
        button.textContent = "Sinkron";
      });
    }
  }, 1000);

  // Tampilkan SweetAlert saat sinkronisasi dimulai
  Swal.fire({
    icon: "info",
    title: "Sinkronisasi Data",
    html: "Proses sinkronisasi data sedang berlangsung. Mohon tunggu.",
    timerProgressBar: true,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  // Melakukan permintaan sinkronisasi ke API
  fetch(apiSinkron, {
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
      if (data.success === true) {
        // Menutup SweetAlert "Tunggu" dan menampilkan SweetAlert "Berhasil"
        Swal.close(); // Menutup SweetAlert "Tunggu"
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: data.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Sinkronisasi Data Gagal",
          text: "Data tidak ditemukan dalam respons!",
        });
      }
    })
    .catch((error) => {
      console.error("Terjadi kesalahan:", error);
      // Tampilkan pesan kesalahan kepada pengguna jika diperlukan
      Swal.close(); // Menutup SweetAlert "Tunggu"
    });
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
