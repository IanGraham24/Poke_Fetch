/* Used AI as a small help reference for fetch and JavaScript formatting. */


const input = document.getElementById("searchInput");
const findBtn = document.getElementById("findBtn");
const addBtn = document.getElementById("addBtn");

const img = document.getElementById("pokemonImg");
const audio = document.getElementById("pokemonAudio");
const selects = document.querySelectorAll(".move");
const team = document.getElementById("team");

let current = null;

findBtn.addEventListener("click", () => {
  const value = input.value.trim().toLowerCase();
  if (value === "") return;

  const key = "pokemon-" + value;
  const saved = localStorage.getItem(key);

  if (saved) {
    loadPokemon(JSON.parse(saved));
    return;
  }

  fetch("https://pokeapi.co/api/v2/pokemon/" + value)
    .then(response => {
      if (!response.ok) throw new Error();
      return response.json();
    })
    .then(data => {
      localStorage.setItem(key, JSON.stringify(data));
      loadPokemon(data);
    })
    .catch(() => {
      alert("Pokemon not found");
    });
});

function loadPokemon(data) {
  current = data;

  img.src = data.sprites.front_default;
  img.alt = data.name;

  const cry = (data.cries && (data.cries.latest || data.cries.legacy)) ? (data.cries.latest || data.cries.legacy) : "";
  audio.src = cry;
  audio.load();

  const moves = data.moves.map(m => m.move.name);

  selects.forEach(select => {
    select.innerHTML = "";
    moves.forEach(move => {
      const option = document.createElement("option");
      option.value = move;
      option.textContent = move;
      select.appendChild(option);
    });
  });
}

addBtn.addEventListener("click", () => {
  if (!current) return;

  const box = document.createElement("div");
  box.className = "team-member";

  const sprite = document.createElement("img");
  sprite.src = current.sprites.front_default;

  const list = document.createElement("ul");

  selects.forEach(select => {
    const li = document.createElement("li");
    li.textContent = select.value;
    list.appendChild(li);
  });

  box.appendChild(sprite);
  box.appendChild(list);
  team.appendChild(box);
});
