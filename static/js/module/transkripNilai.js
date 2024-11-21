import { CihuyDataAPI } from "https://c-craftjs.github.io/lulu/api.js";
import {
  UrlGetAllMhsTranskrip,
  UrlGetTranskripNilai,
  token,
} from "../template/template.js";
import { handleEditTranskrip } from "./helperHandleEdit.js";

// Untuk Get Data Transkrip Nilai Mahasiswa by Id
// Ambil MhsId dari URL
const tableBody = document.getElementById("tablebody");
let filteredData = [];

let mahasiswaData;

const cariMahasiswaBtn = document.getElementById("cariMahasiswaBtn");

cariMahasiswaBtn.addEventListener("click", function () {
  const MhsId = document.getElementById("search-npm").value;

  if (MhsId !== null && MhsId !== "") {
    document.getElementById("main-content").style.display = "block";
    document.getElementById("main-cetak-btn").style.display = "block";
  } else {
    Swal.fire({
      title: "Informasi",
      text: "Mohon input pencarian diisi dengan benar",
      icon: "info",
    });

    document.getElementById("main-content").style.display = "none";
    document.getElementById("main-cetak-btn").style.display = "none";
  }

  CihuyDataAPI(UrlGetAllMhsTranskrip + MhsId, token, (error, result) => {
    if (!error && result.success) {
      let no = 1;
      mahasiswaData = result.data[0];

      console.log(mahasiswaData);

      //   // Tampilkan Data Profil Mahasiswa
      document.getElementById("nama_mahasiswa").value = mahasiswaData.nama_mhs;
      document.getElementById("npm").value = mahasiswaData.nomor_induk_mh;
      document.getElementById("tmpt_tgl_lahir").value = mahasiswaData.ttl_mhs;
      document.getElementById("tahun_masuk").value =
        mahasiswaData.tahun_masuk_mhs;
      document.getElementById("fakultas").value = mahasiswaData.fakultas_mhs;
      document.getElementById("program_studi").value = mahasiswaData.prodi_mhs;

      // Tampilkan Data Nilai dan Tugas Akhir
      document.getElementById("sks").value = mahasiswaData.credits_total;
      document.getElementById("ipk").value = mahasiswaData.grade_total;
      document.getElementById("predikat").value = mahasiswaData.predikat_mhs;
      document.getElementById("lulus_tanggal").value =
        mahasiswaData.graduation_date;
      document.getElementById("judul_ta_in").value =
        mahasiswaData.judul_indonesia;
      document.getElementById("judul_ta_en").value =
        mahasiswaData.judul_inggris;

      if (result.data && result.data.length > 0) {
        result.data[0].subjects.forEach((mahasiswa) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                        <td style="text-align: center; vertical-align: middle">${no++}</td>
                        <td style="text-align: center; vertical-align: middle">${
                          mahasiswa.attributes.kode_mata_kuliah
                        }</td>
                        <td style="vertical-align: middle">${
                          mahasiswa.attributes.nama_mata_kuliah
                        }</td>
                        <td style="vertical-align: middle">${
                          mahasiswa.attributes.nama_mata_kuliah_en
                        }</td>
                        <td style="text-align: center; vertical-align: middle">${
                          mahasiswa.attributes.sks_mata_kuliah
                        }</td>
                    `;
          tableBody.appendChild(row);
          filteredData.push(row.outerHTML);
        });

        // Untuk memunculkan Pagination halamannya
      } else {
        // Handle the case where there are no subjects
        tableBody.innerHTML = `<tr><td colspan="4">No subjects found</td></tr>`;
      }
    } else {
      console.log(error);
    }
  });

  // Untuk Cetak Transkrip Nilai by Id
  // Mendefinisikan button untuk cetak terlebih dahulu
  const cetakIjazahButton = document.getElementById(
    "submitCetakTranskripNilai"
  );
  const apiCetakIjazah = UrlGetTranskripNilai + MhsId;

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
        // The user confirmed, proceed with printing
        fetch(apiCetakIjazah, {
          headers: {
            LOGIN: token,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data && data.success && data.data && data.data.payload) {
              const payload = data.data.payload;
              const cetakTranskrip = `https://lulusan.ulbi.ac.id/static/${payload}`;
              window.open(cetakTranskrip);

              // Menutup SweetAlert "Tunggu" dan menampilkan SweetAlert "Berhasil"
              Swal.close(); // Menutup SweetAlert "Tunggu"
              Swal.fire({
                title: "Berhasil",
                text: "Transkrip Nilai berhasil dicetak!",
                icon: "success",
              });
            } else {
              console.error("Gagal mengambil data transkrip nilai.");
              // Tampilkan pesan kesalahan jika data ijazah tidak ditemukan
              Swal.close(); // Menutup SweetAlert "Tunggu"
            }
          })
          .catch((error) => {
            console.error(
              "Terjadi kesalahan saat mengambil data transkrip nilai:",
              error
            );
            // Tampilkan pesan kesalahan jika terjadi kesalahan
            Swal.close(); // Menutup SweetAlert "Tunggu"
          });
      }
    });
  });
});
