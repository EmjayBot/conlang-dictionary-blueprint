let data = [];

Papa.parse("dictionary.csv", {
  download: true,
  header: true,
  complete: function(results) {
    data = results.data.filter(r => r.Word);
    render(data);
    buildAlphabet();
  }
});

const searchInput = document.getElementById("search");
searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase();
  const filtered = data.filter(row =>
    Object.values(row).some(v => v && v.toLowerCase().includes(q))
  );
  render(filtered);
});

function render(list) {
  const container = document.getElementById("results");
  container.innerHTML = "";
  list.forEach(row => {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
      <strong>${row.Word}</strong><br>
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
      const filtered = data.filter(row =>
        row.Word && row.Word.toUpperCase().startsWith(letter)
      );
      render(filtered);
    };
    alphabet.appendChild(btn);
  });
}

document.getElementById("toggle-dark").onclick = () => {
  document.body.classList.toggle("dark");
};
