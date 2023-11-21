import { CihuyDataAPI } from "https://c-craftjs.github.io/lulu/api.js";
import { UrlGetMhsTranskrip, token } from "../template/template.js";

// Untuk Get Data Transkrip Nilai Mahasiswa by Id
// Ambil MhsId dari URL
const urlParams = new URLSearchParams(window.location.search);
const MhsId = urlParams.get('MhsId');

let mahasiswaData;

CihuyDataAPI(UrlGetMhsTranskrip + `${MhsId}`, token, (error, result) => {
    if (!error && result.success) {
        mahasiswaData = result.data;

        // Tampilkan Data Profil Mahasiswa
        document.getElementById("nama_mahasiswa").value = mahasiswaData.nama_mhs;
        document.getElementById("npm").value = mahasiswaData.nomor_induk_mhs;
        document.getElementById("tmpt_tgl_lahir").value = mahasiswaData.ttl_mhs;
        document.getElementById("tahun_masuk").value = mahasiswaData.tahun_masuk_mhs;
        document.getElementById("fakultas").value = mahasiswaData.fakultas_mhs;
        document.getElementById("program_studi").value = mahasiswaData.prodi_mhs;

        // Tampilkan Data Nilai dan Tugas Akhir
        document.getElementById("sks").value = mahasiswaData.credits_total;
        document.getElementById("ipk").value = mahasiswaData.grade_total;
        document.getElementById("predikat").value = mahasiswaData.predikat_mhs;
        document.getElementById("lulus_tanggal").value = mahasiswaData.graduation_date;
        document.getElementById("judul_ta_in").value = mahasiswaData.judul_skripsi.judul_indonesia;
        document.getElementById("judul_ta_en").value = mahasiswaData.judul_skripsi.judul_inggris;
    } else {
        console.log(error)
    }
})