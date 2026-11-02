(() => {
  const search = document.getElementById("search");
  const ward = document.getElementById("ward");
  const count = document.getElementById("count");
  const rows = Array.from(document.querySelectorAll("#voters tbody tr"));

  // Cache row text once. Reading innerText on every keystroke forces costly layout work.
  const rowData = rows.map((row) => ({
    row,
    ward: row.dataset.ward || "",
    text: (row.textContent || "").normalize("NFC").toLocaleLowerCase("hi"),
  }));

  [...new Set(rowData.map((item) => item.ward).filter(Boolean))]
    .sort((a, b) => Number(a) - Number(b))
    .forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = "वार्ड " + value;
      ward.appendChild(option);
    });

  let timer = null;
  function filterRows() {
    const query = search.value.trim().normalize("NFC").toLocaleLowerCase("hi");
    const selectedWard = ward.value;
    let visible = 0;

    for (const item of rowData) {
      const show =
        (!selectedWard || item.ward === selectedWard) &&
        (!query || item.text.includes(query));
      item.row.hidden = !show;
      if (show) visible++;
    }
    count.textContent = "दिखाई गई पंक्तियाँ: " + visible + " / " + rows.length;
  }

  // Small debounce keeps typing responsive on mobile devices.
  search.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(filterRows, 120);
  });
  ward.addEventListener("change", filterRows);
  filterRows();
})();
