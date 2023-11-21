import { CihuyDataAPI } from "https://c-craftjs.github.io/lulu/api.js";
import { UrlGetMhsTranskrip, token } from "../template/template.js";

// Untuk Get Data Transkrip Nilai Mahasiswa by Id
// Ambil MhsId dari URL
const urlParams = new URLSearchParams(window.location.search);
const MhsId = urlParams.get('MhsId');
const tableBody = document.getElementById("tablebody");

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
        document.getElementById("judul_ta_in").value = mahasiswaData.judul_skriptsi.judul_indonesia;
        document.getElementById("judul_ta_en").value = mahasiswaData.judul_skriptsi.judul_inggris;

        // Tampilkan Data Nilai 
        if (result.data.subjects && result.data.subjects.length > 0) {
            result.data.subjects.forEach((mahasiswa) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td style="text-align: center; vertical-align: middle">${mahasiswa.index}</td>
                    <td style="text-align: center; vertical-align: middle">${mahasiswa.subjname}</td>
                    <td style="text-align: center; vertical-align: middle">${mahasiswa.credits}</td>
                    <td style="text-align: center; vertical-align: middle">${mahasiswa.grade}</td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            // Handle the case where there are no subjects
            tableBody.innerHTML = `<tr><td colspan="4">No subjects found</td></tr>`;
        }
    } else {
        console.log(error);
    }
});