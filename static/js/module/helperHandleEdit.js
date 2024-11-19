// Fungsi untuk menangani edit transkrip
export const handleEditTranskrip = (event) => {
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
                <input type="text" id="editSubjcode" class="form-control py-2" value="${subjcode}" readonly>
              </div>
              <div class="form-group pb-3">
                <label class="fs-5 pb-2 w-100 text-start" for="editSubjname">Subject Name</label>
                <input type="text" id="editSubjname" class="form-control py-2" value="${subjname}" required>
                <div class="invalid-feedback w-100 text-start" style="font-size: 12px">Subject Name is required.</div>
              </div>
              <div class="form-group pb-3">
                <label class="fs-5 pb-2 w-100 text-start" for="editCredits">Credits</label>
                <input type="number" id="editCredits" class="form-control py-2" value="${credits}" min="1" max="10" required>
                <div class="invalid-feedback w-100 text-start" style="font-size: 12px">Credits must be a number between 1 and 10.</div>
              </div>
              <div class="form-group pb-3">
                <label class="fs-5 pb-2 w-100 text-start" for="editGrade">Grade</label>
                <select id="editGrade" class="form-control py-2" required>
                  <option value="" disabled>Choose Grade</option>
                  <option value="A" ${
                    grade === "A" ? "selected" : ""
                  }>A</option>
                  <option value="AB" ${
                    grade === "AB" ? "selected" : ""
                  }>AB</option>
                  <option value="B" ${
                    grade === "B" ? "selected" : ""
                  }>B</option>
                  <option value="BC" ${
                    grade === "BC" ? "selected" : ""
                  }>BC</option>
                  <option value="C" ${
                    grade === "C" ? "selected" : ""
                  }>C</option>
                  <option value="D" ${
                    grade === "D" ? "selected" : ""
                  }>D</option>
                  <option value="E" ${
                    grade === "E" ? "selected" : ""
                  }>E</option>
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

          // Validasi Bootstrap
          if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return false;
          }

          subjname = document.getElementById("editSubjname").value.trim();
          credits = document.getElementById("editCredits").value.trim();
          grade = document.getElementById("editGrade").value;

          return { subjcode, subjname, credits, grade };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const editedData = result.value;

          Swal.fire({
            title: "Are you sure?",
            text: "Do you want to save these changes?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, save it!",
            cancelButtonText: "No, go back",
          }).then((confirmResult) => {
            if (confirmResult.isConfirmed) {
              row.cells[1].innerText = editedData.subjcode;
              row.cells[2].innerText = editedData.subjname;
              row.cells[3].innerText = editedData.credits;
              row.cells[4].innerText = editedData.grade;

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
