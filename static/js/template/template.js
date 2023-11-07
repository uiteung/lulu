// Endpoint GET
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
export const token = CihuyGetCookie("login");
export let UrlGetLulusan = "https://lulusan.ulbi.ac.id/lulusan"; // query parameter : tahunid
export let UrlGetMhsLulusan = "https://lulusan.ulbi.ac.id/lulusan/:mhsw"; // path parameter : mhswid
export let UrlGetIjazahMhs = "https://lulusan.ulbi.ac.id/lulusan/ijazah/:mhsw"; // path parameter : mhswid