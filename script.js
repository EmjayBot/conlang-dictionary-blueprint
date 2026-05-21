let data = [];
let originalData = [];

Papa.parse("dictionary.csv", {
  download: true,
  header: true,
  complete: function(results) {
    data = results.data.filter(r => r.Word);
    originalData = [...data];
    buildAlphabet();
    render(data);
  }
});

const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const randomBtn = document.getElementById("random");

searchInput.addEventListener("input", applyFilters);
sortSelect.addEventListener("change", applyFilters);
randomBtn.addEventListener("click", showRandomWord);

function applyFilters() {
  let list = [...originalData];

  // Search
  const q = searchInput.value.toLowerCase();
  if (q) {
    list = list.filter(row =>
      Object.values(row).some(v => v && v.toLowerCase().includes(q))
    );
  }

  // Sorting
  const sort = sortSelect.value;
  if (sort === "az") list.sort((a, b) => a.Word.localeCompare(b.Word));
  if (sort === "za") list.sort((a, b) => b.Word.localeCompare(a.Word));
  if (sort === "newest") list.reverse();
  if (sort === "oldest") {} // default order

  render(list);
}

function render(list) {
  document.getElementById("count").textContent = `Total words: ${list.length}`;

  const container = document.getElementById("results");
  container.innerHTML = "";

  list.forEach((row, index) => {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
      <strong>${index + 1}. ${row.Word}</strong><br>
      <em>${row.PartOfSpeech || ""}</em><br>
      ${row.Definition || ""}
    `;
    container.appendChild(div);
  });
}

function buildAlphabet() {
  const alphabet = document.getElementById("alphabet");
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  letters.forEach(letter => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.onclick = () => {
      const filtered = originalData.filter(row =>
        row.Word && row.Word.toUpperCase().startsWith(letter)
      );
      render(filtered);
    };
    alphabet.appendChild(btn);
  });
}

function showRandomWord() {
  const random = originalData[Math.floor(Math.random() * originalData.length)];
  render([random]);
}

document.getElementById("toggle-dark").onclick = () => {
  document.body.classList.toggle("dark");
};
