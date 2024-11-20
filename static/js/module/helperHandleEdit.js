import { UrlUpdateGradeMhs, token } from "./../template/template.js";
import { CihuyUpdateApi } from "https://c-craftjs.github.io/lulu/api.js";

// Fungsi untuk menangani edit transkrip
export const handleEditTranskrip = (event, MhsId) => {
  if (event.target && event.target.id === "edit-transkrip") {
    const row = event.target.closest("tr");
    let subjcode = row.cells[1].innerText;
    let subjname = row.cells[2].innerText;
    let credits = row.cells[3].innerText;
    let grade = row.cells[4].innerText;

    const showEditModal = () => {
      Swal.fire({
        title: "Edit Data Transkrip",
        html: `
          <form id="editForm" class="needs-validation" novalidate style="margin-top: 20px">
            <div class="form-group pb-3">
              <label class="fs-5 pb-2 w-100 text-start" for="editSubjcode">Subject Code</label>
              <input type="number" id="editSubjcode" class="form-control py-2 bg-body-secondary" value="${subjcode}" readonly>
            </div>
            <div class="form-group pb-3">
              <label class="fs-5 pb-2 w-100 text-start" for="editSubjname">Subject Name</label>
              <input type="text" id="editSubjname" class="form-control py-2 bg-body-secondary" value="${subjname}" readonly>
            </div>
            <div class="form-group pb-3">
              <label class="fs-5 pb-2 w-100 text-start" for="editCredits">Credits</label>
              <input type="number" id="editCredits" class="form-control py-2 bg-body-secondary" value="${credits}" min="1" max="10" readonly>
            </div>
            <div class="form-group pb-3">
              <label class="fs-5 pb-2 w-100 text-start" for="editGrade">Grade</label>
              <select id="editGrade" class="form-control py-2" required>
                <option value="" disabled>Choose Grade</option>
                <option value="A" ${grade === "A" ? "selected" : ""}>A</option>
                <option value="AB" ${
                  grade === "AB" ? "selected" : ""
                }>AB</option>
                <option value="B" ${grade === "B" ? "selected" : ""}>B</option>
                <option value="BC" ${
                  grade === "BC" ? "selected" : ""
                }>BC</option>
                <option value="C" ${grade === "C" ? "selected" : ""}>C</option>
                <option value="D" ${grade === "D" ? "selected" : ""}>D</option>
                <option value="E" ${grade === "E" ? "selected" : ""}>E</option>
              </select>
              <div class="invalid-feedback w-100 text-start" style="font-size: 12px">Grade is required.</div>
            </div>
          </form>
          `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Save Changes",
        cancelButtonText: "Go Back",
        preConfirm: () => {
          const form = document.getElementById("editForm");

          // Validasi Form
          if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return false;
          }

          subjcode = Number(document.getElementById("editSubjcode").value);
          grade = document.getElementById("editGrade").value;

          return { subjcode, grade };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const editedData = {
            mkid: result.value.subjcode,
            grade: result.value.grade,
          };

          Swal.fire({
            title: "Are you sure?",
            text: "Do you want to save these changes?",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Yes, save it!",
            cancelButtonText: "No, go back",
          }).then((confirmResult) => {
            if (confirmResult.isConfirmed) {
              // Panggilan API untuk update data
              CihuyUpdateApi(
                UrlUpdateGradeMhs + MhsId,
                token,
                editedData,
                (error, response) => {
                  if (response && response.status === "success") {
                    // Update data di tabel tanpa refresh
                    row.cells[4].innerText = editedData.grade;

                    // Tampilkan notifikasi sukses

                    Swal.fire({
                      title: "Success!",
                      text: response.message,
                      icon: "success",
                      timer: 2000,
                      showConfirmButton: false,
                    });
                  } else {
                    // Tampilkan pesan error jika update gagal
                    Swal.fire({
                      title: "Error!",
                      text: `Failed to save changes: ${
                        error ? error.message : response.message
                      }`,
                      icon: "error",
                      showConfirmButton: true,
                    });
                  }
                }
              );
            } else {
              showEditModal(); // Kembali ke modal jika klik "Go Back"
            }
          });
        }
      });
    };

    showEditModal();
  }
};

// Fungsi untuk menangani edit matakuliah
export const handleEditMataKuliah = (event) => {
  if (event.target && event.target.id === "edit-matakuliah") {
    const row = event.target.closest("tr");
    let MKKode = row.cells[0].innerText;
    let Nama = row.cells[1].innerText;
    let Nama_en = row.cells[2].innerText || "";
    let SKS = row.cells[3].innerText;

    const showEditModal = () => {
      Swal.fire({
        title: "Edit Data Mata Kuliah",
        html: `
            <form id="editForm" class="needs-validation" novalidate style="margin-top: 20px">
              <div class="form-group pb-3">
                <label class="fs-5 pb-2 w-100 text-start" for="editMKKode">Kode Mata Kuliah</label>
                <input type="text" id="editMKKode" class="form-control py-2" value="${MKKode}" required>
                <div class="invalid-feedback w-100 text-start" style="font-size: 12px">Kode Mata Kuliah is required.</div>
              </div>
              <div class="form-group pb-3">
                <label class="fs-5 pb-2 w-100 text-start" for="editNama">Nama Mata Kuliah</label>
                <input type="text" id="editNama" class="form-control py-2" value="${Nama}" required>
                <div class="invalid-feedback w-100 text-start" style="font-size: 12px">Nama Mata Kuliah is required.</div>
              </div>
              <div class="form-group pb-3">
                <label class="fs-5 pb-2 w-100 text-start" for="editNamaEn">English Course Name</label>
                <input type="text" id="editNamaEn" class="form-control py-2" value="${
                  Nama_en || ""
                }" required>
                <div class="invalid-feedback w-100 text-start" style="font-size: 12px">English Course Name is required.</div>
                </div>
              <div class="form-group pb-3">
                <label class="fs-5 pb-2 w-100 text-start" for="editSKS">SKS</label>
                <input type="text" id="editSKS" class="form-control py-2" value="${SKS}" required>
                <div class="invalid-feedback w-100 text-start" style="font-size: 12px">SKS is required.</div>
              </div>
            </form>
          `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Save Changes",
        cancelButtonText: "Go Back",
        preConfirm: () => {
          const form = document.getElementById("editForm");

          // Validasi Bootstrap
          if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return false;
          }

          MKKode = document.getElementById("editMKKode").value.trim();
          Nama = document.getElementById("editNama").value.trim();
          Nama_en = document.getElementById("editNamaEn").value.trim();
          SKS = document.getElementById("editSKS").value;

          return { MKKode, Nama, Nama_en, SKS };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const editedData = result.value;

          Swal.fire({
            title: "Are you sure?",
            text: "Do you want to save these changes?",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Yes, save it!",
            cancelButtonText: "No, go back",
          }).then((confirmResult) => {
            if (confirmResult.isConfirmed) {
              row.cells[0].innerText = editedData.MKKode;
              row.cells[1].innerText = editedData.Nama;
              row.cells[2].innerText = editedData.Nama_en;
              row.cells[3].innerText = editedData.SKS;

              Swal.fire({
                title: "Success!",
                text: "Changes have been saved.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
              });

              console.log("Edited Data:", editedData);
            } else {
              showEditModal(); // Kembali ke modal jika klik "Go Back"
            }
          });
        }
      });
    };

    showEditModal();
  }
};
