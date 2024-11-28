import { CihuyDataAPI } from "https://c-craftjs.github.io/lulu/api.js";
import {
  UrlGetAllMhsTranskrip,
  UrlGetCetakTranskrip,
  UrlSinkronData,
  token,
} from "../template/template.js";
import { CihuyId } from "https://c-craftjs.github.io/element/element.js";

// Variabel global
const tableBody = document.getElementById("tablebody");
const buttonPrev = CihuyId("prevPageBtn");
const buttonNext = CihuyId("nextPageBtn");
const currentPageDisplay = CihuyId("currentPage");
const searchInput = CihuyId("searchInput");
const itemsPerPage = 10;

let originalData = []; // Menyimpan semua data asli
let filteredData = []; // Data yang sedang digunakan (filter/pagination)
let currentPage = 1; // Halaman saat ini

// Mendapatkan data dari API
CihuyDataAPI(UrlGetAllMhsTranskrip, token, (error, result) => {
  if (result.data && result.data.length > 0) {
    originalData = result.data; // Simpan data asli
    filteredData = [...originalData]; // Filter awal = semua data

    // Render tabel awal
    renderTable(currentPage);
    updatePagination();
  } else {
    tableBody.innerHTML = `<tr><td colspan="5">No data available</td></tr>`;
    console.error("Error fetching data:", error);
  }
});

// Fungsi untuk merender tabel
function renderTable(page) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const rowsToDisplay = filteredData.slice(startIndex, endIndex);

  tableBody.innerHTML = rowsToDisplay
    .map((mahasiswa, index) => {
      const statusDownload = mahasiswa.status_download;
      return `
        <tr>
          <td style="text-align: center; vertical-align: middle">${
            startIndex + index + 1
          }</td>
          <td style="vertical-align: middle">${mahasiswa.npm}</td>
          <td style="vertical-align: middle">${mahasiswa.nama}</td>
          <td style="vertical-align: middle">${mahasiswa.program_studi}</td>
          <td style="text-align: center; vertical-align: middle">
            <button type="button" class="btn btn-info detail" data-transkrip="${
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
        </tr>`;
    })
    .join("");

  // Tambahkan event listener setelah render
  addEventListeners();
}

// Fungsi untuk memperbarui pagination
function updatePagination() {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  currentPageDisplay.textContent = `Halaman ${currentPage} dari ${totalPages}`;

  buttonPrev.disabled = currentPage <= 1;
  buttonNext.disabled = currentPage >= totalPages;
}

// Event listener tombol pagination
buttonPrev.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable(currentPage);
    updatePagination();
  }
});

buttonNext.addEventListener("click", () => {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable(currentPage);
    updatePagination();
  }
});

// Event listener untuk pencarian
searchInput.addEventListener("input", () => {
  const searchText = searchInput.value.toLowerCase();

  // Filter data berdasarkan pencarian
  filteredData = originalData.filter((mahasiswa) =>
    `${mahasiswa.npm} ${mahasiswa.nama} ${mahasiswa.program_studi}`
      .toLowerCase()
      .includes(searchText)
  );

  // Reset ke halaman pertama
  currentPage = 1;

  renderTable(currentPage);
  updatePagination();
});

// Fungsi untuk menambahkan event listener pada tombol
function addEventListeners() {
  document
    .querySelectorAll(".detail")
    .forEach((btn) => btn.addEventListener("click", handleDetailButtonClick));

  document
    .querySelectorAll(".cetak")
    .forEach((btn) =>
      btn.addEventListener("click", handleCetakTranskripButtonClick)
    );

  document
    .querySelectorAll(".sinkron")
    .forEach((btn) =>
      btn.addEventListener("click", (event) =>
        handleSinkronButtonClick(event)
      )
    );
}

// Fungsi tombol detail
function handleDetailButtonClick(event) {
  const MhsId = event.target.getAttribute("data-transkrip");
  window.open(`detail-transkrip.html?MhsId=${MhsId}`, "_blank");
}

// Fungsi tombol cetak transkrip
function handleCetakTranskripButtonClick(event) {
  const MhsId = event.target.getAttribute("data-transkrip");
  const apiUrl = UrlGetCetakTranskrip + MhsId;

  Swal.fire({
    title: "Konfirmasi Cetak",
    text: "Apakah Anda yakin ingin mencetak transkrip nilai?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Cetak",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: "info",
        title: "Sedang mencetak Transkrip Nilai",
        html: "Proses cetak transkrip nilai sedang berlangsung. Mohon tunggu.",
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      fetch(apiUrl, {
        headers: { LOGIN: token },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Fetch failed");
          return response.json();
        })
        .then((data) => {
          Swal.close();
          if (data.success && data.data.document_id) {
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
                newWindow = window.open(
                  `https://lulusan.ulbi.ac.id/static/${data.data.document_id}`,
                  "_blank"
                );

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
            throw new Error("Document ID not found");
          }
        })
        .catch((err) => {
          Swal.fire("Error", "Gagal mencetak transkrip", "error");
          console.error(err);
        });
    }
  });
}

// Fungsi tombol sinkron
function handleSinkronButtonClick(event) {
  const sinkronButtons = document.querySelectorAll(".sinkron");

  const MhsId = event.target.getAttribute("data-sinkron");
  const apiUrl = UrlSinkronData + MhsId;

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

  Swal.fire({
    icon: "info",
    title: "Sinkronisasi",
    text: "Proses sinkronisasi sedang berlangsung.",
    timerProgressBar: true,
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

  fetch(apiUrl, { headers: { LOGIN: token } })
    .then((response) => {
      if (!response.ok) throw new Error("Fetch failed");
      return response.json();
    })
    .then((data) => {
      Swal.close();

      if (data.success === true) {
        Swal.fire("Berhasil", data.message, "success");
      }
    })
    .catch((err) => {
      Swal.fire("Error", "Sinkronisasi gagal", "error");
      console.error(err);
    });
}
