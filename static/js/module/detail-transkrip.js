import { CihuyDataAPI } from "https://c-craftjs.github.io/lulu/api.js";
import { UrlGetMhsTranskrip, UrlGetTranskripNilai, token } from "../template/template.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { CihuyId } from "https://c-craftjs.github.io/element/element.js";

// Untuk Get Data Transkrip Nilai Mahasiswa by Id
// Ambil MhsId dari URL
const urlParams = new URLSearchParams(window.location.search);
const MhsId = urlParams.get('MhsId');
const tableBody = document.getElementById("tablebody");
const buttonsebelumnya = CihuyId("prevPageBtn");
const buttonselanjutnya = CihuyId("nextPageBtn");
const halamansaatini = CihuyId("currentPage");
const itemperpage = 10;
let halamannow = 1;
let filteredData = [];

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
                filteredData.push(row.outerHTML);
            });

            // Untuk memunculkan Pagination halamannya
            displayData(halamannow);
            updatePagination();
        } else {
            // Handle the case where there are no subjects
            tableBody.innerHTML = `<tr><td colspan="4">No subjects found</td></tr>`;
        }
    } else {
        console.log(error);
    }
});

// Fungsi Untuk Menampilkan Data
function displayData(page) {
    const mulaiindex = (page - 1) * itemperpage;
    const akhirindex = mulaiindex + itemperpage;
    const rowsToShow = filteredData.slice(mulaiindex, akhirindex);
    tableBody.innerHTML = rowsToShow.join("");
}

// Fungsi Untuk Update Pagination
function updatePagination() {
    halamansaatini.textContent = `Halaman ${halamannow}`;
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

// Untuk Get Data Transkrip Nilai Mahasiswa By Id
// Ambil MhsId dari URL
const cetakTranskripButton = document.getElementById("submitCetakTranskripNilai");
const apiCetakTranskripNilai = UrlGetTranskripNilai + MhsId

cetakTranskripButton.addEventListener("click", () => {
    // Tampil SweetAlert Konfirmasi
    Swal.fire({
        title : "Konfirmasi Cetak Transkrip Nilai",
        text : "Apakah Anda yakin ingin mencetak Ijazah?",
        icon : "question",
        showCancelButton : true,
        confirmButtonText : "OK",
        cancelButtonText : "Batal",
    }).then((result) => {
        if (result.isConfirmed) {
            // Menampilkan SweetAlert "Tunggu" saat proses cetak transkrip dimulai
            Swal.fire({
                icon : "info",
                title : "Sedang mencetak Transkrip Nilai",
                html : "Proses cetak transkrip nilai sedang berlangsung. Mohon tunggu.",
                timerProgressBar : true,
                didOpen: () => {
                    Swal.showLoading();
                    Swal.getPopup().querySelector("b");
                }
            });
        }
    })
})
