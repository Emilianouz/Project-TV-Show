//You can edit ALL of the code here
const state = {
  allEpisodes: [],
  filtered: [],
  selectedIndex: null,
  query: "",
}
const selectElem = document.getElementById("search-select");
const searchInput = document.getElementById("search-input");
const episodesContainer = document.getElementById("episodes-container");
const countElem = document.getElementById("search-count");
const template = document.getElementById("episode-card");

function setup() {
  state.allEpisodes = getAllEpisodes();
  state.filtered = state.allEpisodes;
  if (!state.allEpisodes || state.allEpisodes.length === 0) {
    console.error("No episodes found!");
    return;
  }
  makePageForEpisodes(state.allEpisodes);
  populateEpisodeSelect(state.allEpisodes);
  setupEpisodeSelect();
  setupSearch();
}

function makePageForEpisodes(episodeList) {
  episodesContainer.innerHTML = "";
  const episodeCards = episodeList.map(createEpisodeCard);
  episodesContainer.append(...episodeCards);
  countElem.innerHTML = `Displaying <span class="count-number">${state.filtered.length} / ${state.allEpisodes.length}</span> episodes`;
  countElem.style.display = "block";
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
 state.selectedIndex = selectElem.value; 
 state.query = searchInput.value.trim().toLowerCase(); 

  // Select filter
  if (state.selectedIndex !== "") {
    state.filtered = state.allEpisodes.filter((_, i) => i === Number(state.selectedIndex));
  } else {
    if (!state.query){
      state.filtered = state.allEpisodes;
    }
  }

  // Search filter
  if (state.query) {
    state.filtered = state.allEpisodes.filter((episode) => {
      const name = episode.name.toLowerCase();
      const summary = (episode.summary || "").toLowerCase();
      return name.includes(state.query) || summary.includes(state.query);
    });
  }

  makePageForEpisodes(state.filtered);
  countElem.innerHTML = `Displaying <span class="count-number">${state.filtered.length} / ${state.allEpisodes.length}</span> episodes`;
  countElem.style.display = "block";
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
