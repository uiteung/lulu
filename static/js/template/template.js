// Endpoint GET
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
export const token = CihuyGetCookie("login");

export let UrlGetLulusan = "https://lulusan.ulbi.ac.id/lulusan"; // query parameter : tahunid
export let UrlGetMhsLulusan = "https://lulusan.ulbi.ac.id/lulusan/"; // path parameter : mhswid
export let UrlGetIjazahMhs = "https://lulusan.ulbi.ac.id/lulusan/ijazah/"; // path parameter : mhswid
export let UrlGetMhsTranskrip = "https://lulusan.ulbi.ac.id/lulusan/transkrip/"; // path parameter : mhswid
export let UrlGetTranskripNilai =
  "https://lulusan.ulbi.ac.id/lulusan/transkrip/create/"; // path parameter : mhswid

export let UrlGetAllMataKuliah =
  "https://lulusan.ulbi.ac.id/lulusan/all/matkul"; // path all mata kuliah
export let UrlUpdateGradeMhs =
  "https://lulusan.ulbi.ac.id/lulusan/transkrip/update/"; // path update grade mata kuliah

export let UrlGetAllMhsTranskrip =
  "https://lulusan.ulbi.ac.id/lulusan/transkrip/sevima/dev/mahasiswa"; // path all mhs
export let UrlGetIdMhsTranskrip =
  "https://lulusan.ulbi.ac.id/lulusan/transkrip/sevima/dev/"; // path id mhs
export let UrlGetCetakTranskrip =
  "https://lulusan.ulbi.ac.id/lulusan/transkrip/sevima/create/dev/"; // path cetak mhs
export let UrlSinkronData =
  "https://lulusan.ulbi.ac.id/lulusan/transkrip/sevima/sikron/dev/"; // path cetak mhs
