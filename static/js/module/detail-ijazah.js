import { CihuyDataAPI } from "https://c-craftjs.github.io/lulu/api.js";
import { UrlGetMhsLulusan } from "../template/template.js";
import { token } from "../template/template.js";

// Ambil MhsId dari URL
const urlParams = new URLSearchParams(window.location.search);
const MhsId = urlParams.get('MhsId')

let mahasiswaData;

fetch(UrlGetMhsLulusan + `${MhsId}`, token)
    .then((result) => {
        return result.json();
    })
    .then((mahasiswa) => {
        if (mahasiswa) {
            mahasiswaData = mahasiswa;

            // Tampilkan Data Profil Mahasiswa
            document.getElementById("npm").value = mahasiswaData.MhsId;
            document.getElementById("nama_mahasiswa").value = mahasiswaData.nama;
            document.getElementById("nik").value = mahasiswaData.nik;
            document.getElementById("no_hp").value = mahasiswaData.handphone;
            document.getElementById("tempat_lahir").value = mahasiswaData.tempatLahir;
            document.getElementById("tgl_lahir").value = mahasiswaData.tanggalLahir;
            document.getElementById("email").value = mahasiswaData.email;

            // Tampilkan Data Ijazah Mahasiswa
            document.getElementById("prodi").value = mahasiswaData.prodi;
            document.getElementById("gelar").value = mahasiswaData.gelar;
            document.getElementById("npm").value = mahasiswaData.MhsId;
            document.getElementById("npm").value = mahasiswaData.MhsId;
            document.getElementById("npm").value = mahasiswaData.MhsId;
            document.getElementById("npm").value = mahasiswaData.MhsId;
            document.getElementById("npm").value = mahasiswaData.MhsId;
            document.getElementById("npm").value = mahasiswaData.MhsId;
        }
    })