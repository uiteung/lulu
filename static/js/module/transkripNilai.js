import { CihuyDataAPI } from "https://c-craftjs.github.io/lulu/api.js";
import {
  UrlGetAllMhsTranskrip,
  UrlGetCetakTranskrip,
  token,
} from "../template/template.js";

// Untuk Get Data Transkrip Nilai Mahasiswa by Id
// Ambil MhsId dari URL
const tableBody = document.getElementById("tablebody");
const cariMahasiswaBtn = document.getElementById("cariMahasiswaBtn");

let filteredData = [];

let mahasiswaData;
let intervalMhs; // Variabel global untuk interval tombol Mahasiswa
let intervalCetak;

cariMahasiswaBtn.addEventListener("click", function () {
  const MhsId = document.getElementById("search-npm").value;

  // Cek apakah input kosong
  if (!MhsId) {
    Swal.fire({
      title: "Informasi",
      text: "Mohon input pencarian diisi dengan benar",
      icon: "info",
    });

    document.getElementById("main-content").style.display = "none";
    document.getElementById("main-cetak-btn").style.display = "none";
    return; // Hentikan eksekusi jika input kosong
  }

  // Nonaktifkan tombol dan mulai hitungan mundur
  let countdownMhs = 60; // Hitungan mundur dalam detik
  cariMahasiswaBtn.disabled = true; // Nonaktifkan tombol
  cariMahasiswaBtn.textContent = `Mohon tunggu ${countdownMhs} detik`;

  intervalMhs = setInterval(() => {
    countdownMhs--;
    if (countdownMhs > 0) {
      cariMahasiswaBtn.textContent = `Mohon tunggu ${countdownMhs} detik`;
    } else {
      clearInterval(intervalMhs);
      cariMahasiswaBtn.disabled = false; // Aktifkan tombol kembali
      cariMahasiswaBtn.textContent = "Cari Mahasiswa";
    }
  }, 1000);

  Swal.fire({
    title: "Sedang memuat data",
    html: "Mohon tunggu sebentar...",
    allowOutsideClick: false, // Agar modal tidak tertutup jika pengguna klik di luar
    didOpen: () => {
      Swal.showLoading(); // Tampilkan loading spinner
    },
  });

  CihuyDataAPI(UrlGetAllMhsTranskrip + MhsId, token, (error, result) => {
    Swal.close();

    if (!error && result.success) {
      document.getElementById("main-content").style.display = "block";
      document.getElementById("main-cetak-btn").style.display = "block";

      let no = 1;
      mahasiswaData = result.data[0];

      // Tampilkan Data Profil Mahasiswa
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
      } else {
        // Jika tidak ada mata kuliah
        tableBody.innerHTML = `<tr><td colspan="4">No subjects found</td></tr>`;
      }
    } else {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Terjadi kesalahan saat mengambil data.",
        icon: "error",
      });

      // Reset interval cetak jika data gagal
      if (intervalCetak) {
        clearInterval(intervalCetak);
        const cetakIjazahButton = document.getElementById(
          "submitCetakTranskripNilai"
        );
        cetakIjazahButton.disabled = false; // Aktifkan kembali tombol cetak
        cetakIjazahButton.textContent = "Cetak Transkrip Nilai";
      }
    }
  });

  // Untuk Cetak Transkrip Nilai by Id
  // Mendefinisikan button untuk cetak terlebih dahulu
  const cetakIjazahButton = document.getElementById(
    "submitCetakTranskripNilai"
  );

  let countdownCetak = 60; // Hitungan mundur dalam detik
  cetakIjazahButton.disabled = true; // Nonaktifkan tombol
  cetakIjazahButton.textContent = `Mohon tunggu ${countdownCetak} detik`;

  intervalCetak = setInterval(() => {
    countdownCetak--;
    if (countdownCetak > 0) {
      cetakIjazahButton.textContent = `Mohon tunggu ${countdownCetak} detik`;
    } else {
      clearInterval(intervalCetak);
      cetakIjazahButton.disabled = false; // Aktifkan tombol kembali
      cetakIjazahButton.textContent = "Cetak Transkrip Nilai";
    }
  }, 1000);

  const apiCetakTranskrip = UrlGetCetakTranskrip + MhsId;

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
});
