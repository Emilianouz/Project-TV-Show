//You can edit ALL of the code here
let allEpisodes = [];

const selectElem = document.getElementById("search-select");
const searchInput = document.getElementById("search-input");
const episodesContainer = document.getElementById("episodes-container");
const countElem = document.getElementById("search-count");
const template = document.getElementById("episode-card");

function setup() {
  allEpisodes = getAllEpisodes();
  if (!allEpisodes || allEpisodes.length === 0) {
    console.error("No episodes found!");
    return;
  }
  makePageForEpisodes(allEpisodes);
  populateEpisodeSelect(allEpisodes);
  setupEpisodeSelect();
  setupSearch();
}

function makePageForEpisodes(episodeList) {
  episodesContainer.innerHTML = "";
  const episodeCards = episodeList.map(createEpisodeCard);
  episodesContainer.append(...episodeCards);
}

function createEpisodeCard(episode) {
  const { season, number, name, url, image, summary } = episode;
  const card = template.content.cloneNode(true);
  const episodeFormatted = formatEpisodeNumber(season,number);

  const episodeLink = card.querySelector("h3 a");
  episodeLink.textContent = `${name} - ${episodeFormatted}`;
  episodeLink.href = url;

  const episodeImage = card.querySelector("img");
  episodeImage.src = image.medium;
  episodeImage.alt = image.name;

  card.querySelector("p").textContent = summary
    ? summary.replace(/^<p>|<\/p>$/g, "")
    : "No summary available.";
  return card;
}

function formatEpisodeNumber(season, number) {
  const pad = (num) => String(num).padStart(2, '0');
  return `S${pad(season)}E${pad(number)}`;
}

function filterAndRender() {
  const selectedIndex = selectElem.value;
  const query = searchInput.value.trim().toLowerCase();

  let filtered = [...allEpisodes];

  // Select filter
  if (selectedIndex !== "") {
    filtered = filtered.filter((_, i) => i === Number(selectedIndex));
  }

  // Search filter
  if (query) {
    filtered = filtered.filter((episode) => {
      const name = episode.name.toLowerCase();
      const summary = (episode.summary || "").toLowerCase();
      return name.includes(query) || summary.includes(query);
    });
  }

  makePageForEpisodes(filtered);

  if (query || selectedIndex !== "") {
    countElem.innerHTML = `Episodes found: <span class="count-number">${filtered.length}</span>`;
    countElem.style.display = "block";
  } else {
    countElem.style.display = "none";
  }
}

function populateEpisodeSelect(episodeList) {
  selectElem.innerHTML = `<option value="">Select an episode</option>`;
  episodeList.forEach((ep, index) => {
    const code = formatEpisodeNumber(ep.season, ep.number);
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${code} - ${ep.name}`;
    selectElem.appendChild(option);
  });
}

function setupEpisodeSelect() {
  selectElem.addEventListener("change", filterAndRender);
}

function setupSearch() {
  searchInput.addEventListener("input", () => {
    // Reset select when typing in input
    selectElem.value = "";
    filterAndRender();
  });
}

window.onload = setup;
