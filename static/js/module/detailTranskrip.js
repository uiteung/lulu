import { CihuyDataAPI } from "https://c-craftjs.github.io/lulu/api.js";
import { UrlGetIdMhsTranskrip, token } from "../template/template.js";

// Untuk Get Data Transkrip Nilai Mahasiswa by Id
// Ambil MhsId dari URL
const urlParams = new URLSearchParams(window.location.search);
const MhsId = urlParams.get("MhsId");
const tableBody = document.getElementById("tablebody");

let filteredData = [];

let mahasiswaData;

CihuyDataAPI(UrlGetIdMhsTranskrip + MhsId, token, (error, result) => {
  console.log(result.data);

  let no = 1;
  mahasiswaData = result.data;

  // Tampilkan Data Profil Mahasiswa
  document.getElementById("nama_mahasiswa").value = mahasiswaData.nama;
  document.getElementById("npm").value = mahasiswaData.npm;
  document.getElementById("tmpt_tgl_lahir").value =
    mahasiswaData.tempat_tanggal_lahir;
  document.getElementById("tahun_masuk").value = mahasiswaData.tahun_masuk;
  document.getElementById("fakultas").value = mahasiswaData.fakultas;
  document.getElementById("program_studi").value = mahasiswaData.program_studi;

  // Tampilkan Data Nilai dan Tugas Akhir
  document.getElementById("sks").value = mahasiswaData.total_sks;
  document.getElementById("ipk").value = mahasiswaData.grade_total;
  document.getElementById("predikat").value = mahasiswaData.nama_predikat;
  document.getElementById("lulus_tanggal").value =
    mahasiswaData.graduation_date;
  document.getElementById("judul_ta_in").value = mahasiswaData.judul;
  document.getElementById("judul_ta_en").value = mahasiswaData.judul_en;

  if (result.data && result.data.length > 0) {
    result.data.forEach((mahasiswa) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                        <td style="text-align: center; vertical-align: middle">${no++}</td>
                        <td style="text-align: center; vertical-align: middle">${
                          mahasiswa.kode_mata_kuliah
                        }</td>
                        <td style="vertical-align: middle">${
                          mahasiswa.nama_mata_kuliah
                        }</td>
                        <td style="vertical-align: middle">${
                          mahasiswa.nama_mata_kuliah_en
                        }</td>
                        <td style="text-align: center; vertical-align: middle">${
                          mahasiswa.sks_mata_kuliah
                        }</td>
                    `;
      tableBody.appendChild(row);
      filteredData.push(row.outerHTML);
    });
  } else {
    // Jika tidak ada mata kuliah
    tableBody.innerHTML = `<tr><td colspan="4">No subjects found</td></tr>`;
    console.error(error);
  }
});

// Untuk Cetak Transkrip Nilai by Id
// Mendefinisikan button untuk cetak terlebih dahulu
const apiCetakTranskrip = UrlGetCetakTranskrip + MhsId;
const cetakIjazahButton = document.getElementById("submitCetakTranskripNilai");

cetakIjazahButton.addEventListener("click", () => {
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
});
