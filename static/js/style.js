// Spinner Loader
window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");

    loader.addEventListener("transitioned", () => {
        document.body.removeChild("loader");
    })
})

// Membuat fitur search
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const tableBody = document.getElementById("tablebody").getElementsByTagName("tr");

    searchInput.addEventListener("input", function () {
      const searchText = searchInput.value.toLowerCase();

      for (const row of tableBody) {
        const cells = row.getElementsByTagName("td");
        let rowMatchesSearch = false;

        for (const cell of cells) {
          if (cell.textContent.toLowerCase().includes(searchText)) {
            rowMatchesSearch = true;
            break;
          }
        }

        row.style.display = rowMatchesSearch ? "" : "none";
      }
    });
  });