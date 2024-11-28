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
  let no = 1;


  
  console.log("Error:", error); // Log error jika ada
  console.log("Result:", result); // Log hasil respons
  
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
    mahasiswaData.graduation_date_eng;
  document.getElementById("judul_ta_in").value = mahasiswaData.judul;
  document.getElementById("judul_ta_en").value = mahasiswaData.judul_en;

  if (result.success === true) {
    result.data.transkripNilaiDetail.forEach((mahasiswa) => {
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
                          mahasiswa.sks
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
