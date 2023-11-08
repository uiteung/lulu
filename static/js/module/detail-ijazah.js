import { CihuyDataAPI } from "https://c-craftjs.github.io/lulu/api.js";
import { UrlGetMhsLulusan, UrlGetIjazahMhs, token } from "../template/template.js";

// Untuk Get Data Ijazah Mahasiswa By Id
// Ambil MhsId dari URL
const urlParams = new URLSearchParams(window.location.search);
const MhsId = urlParams.get('MhsId');

let mahasiswaData;

CihuyDataAPI(UrlGetMhsLulusan + `${MhsId}`, token, (error, result) => {
    if (!error && result.success) {
        mahasiswaData = result.data;

        // Tampilkan Data Profil Mahasiswa
        document.getElementById("npm").value = mahasiswaData.MhswId;
        document.getElementById("nama_mahasiswa").value = mahasiswaData.nama;
        document.getElementById("nik").value = mahasiswaData.nik;
        document.getElementById("no_hp").value = mahasiswaData.handphone;
        document.getElementById("tempat_lahir").value = mahasiswaData.tempatLahir;
        document.getElementById("tgl_lahir").value = mahasiswaData.tanggalLahir;
        document.getElementById("email").value = mahasiswaData.email;

        // Tampilkan Data Ijazah Mahasiswa
        document.getElementById("prodi").value = mahasiswaData.prodi;
        document.getElementById("gelar").value = mahasiswaData.gelar;
        document.getElementById("no_ijazah").value = mahasiswaData.noIjazah;
        document.getElementById("no_sk").value = mahasiswaData.noSkIjazah;
        document.getElementById("tgl_lulus").value = mahasiswaData.tanggalLulus;
        document.getElementById("tgl_sk").value = mahasiswaData.tglSKLulus;
        document.getElementById("judul_ta").value = mahasiswaData.judul_ta;
        document.getElementById("tahun_id").value = mahasiswaData.tahunId;
    } else {
        console.log('Data Ijazah Mahasiswa tidak ditemukan atau terjadi kesalahan.');
    }
});

// Untuk Cetak Ijazah Mahasiswa by Id
// Mendefinisikan button untuk cetak terlebih dahulu
const cetakIjazahButton = document.getElementById("submitCetakIjazah");
const apiCetakIjazah = UrlGetIjazahMhs + MhsId
// Untuk Cetak ijazahnya
cetakIjazahButton.addEventListener("click", () => {
    // Tampil SweetAlert Konfirmasi
    Swal.fire({
      title: "Cetak Ijazah",
      text: "Apakah Anda yakin ingin mencetak ijazah?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        // The user confirmed, proceed with printing
        fetch(apiCetakIjazah, {
          headers: {
            'LOGIN': token,
          }
        })
          .then((response) => response.json())
          .then((data) => {
            if (data && data.data) {
              const googleDocsUrl = `https://docs.google.com/document/u/0/d/${data.data}`;
              window.open(googleDocsUrl, '_blank');
              
              // Show a success message using SweetAlert
              Swal.fire({
                title: "Berhasil",
                text: "Ijazah berhasil dicetak!",
                icon: "success",
              });
            } else {
              console.error("Gagal mengambil data ijazah.");
            }
          })
          .catch((error) => {
            console.error("Terjadi kesalahan saat mengambil data ijazah:", error);
          });
      }
    });
  });