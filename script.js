//You can edit ALL of the code here

const API_BASE = "https://api.tvmaze.com";

// All shows endpoint
const allShowsEndpoint = `${API_BASE}/shows`;

// Endpoint to get episodes for a specific show
const getEpisodesEndpoint = (showId) => `${API_BASE}/shows/${showId}/episodes`;


const state = {
  allShows: [],
  episodesCache: {},
  currentShowId: null,
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
const loadingElem = document.getElementById("loading");
const showSelectElem = document.getElementById("show-select");

async function fetchAllShows() {
  const res = await fetch(allShowsEndpoint);
  if (!res.ok) {
    throw new Error(`Failed to fetch shows: ${res.status}`);
  }
  return res.json();
}

async function fetchEpisodesForShow(showId) {
  const endpoint = getEpisodesEndpoint(showId);

  if (state.episodesCache[showId]) {
    return state.episodesCache[showId];
  }

  const res = await fetch(endpoint);
  if (!res.ok) {
    throw new Error(`Failed to fetch episodes for show ${showId}`);
  }
  const data = await res.json();
  state.episodesCache[showId] = data;
  return data;
}

async function loadEpisodesForShow(showId) {
  state.currentShowId = showId;
  state.query = "";
  state.selectedIndex = null;
  searchInput.value = "";

  setLoading(true, "Loading episodes...");

  fetchEpisodesForShow(showId)
    .then((episodes) => {
      setLoading(false);
      state.allEpisodes = episodes;
      state.filtered = episodes;

      makePageForEpisodes(state.filtered);
      populateEpisodeSelect(episodes);
    })
    .catch((error) => {
      alert(error.message);
      setLoading(false);
      handleError("Could not load episodes for selected show.");
    });
}

function populateShowSelect(shows) {
  // sort alphabetically (case-insensitive)
  shows.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

  showSelectElem.innerHTML = `<option value="">Select a show</option>`;
  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelectElem.appendChild(option);
  });
}

function setup() {
  showLoading("Loading episodes...");
  // Move this logic to keep all initialization steps in one place
  fetchEpisodes()
  .then((episodes) => {
    state.allEpisodes = episodes;
    state.filtered = episodes;

    if (!episodes || episodes.length === 0) {
      // Handle loading error here
      handleError("Failed to load episodes.")
      return;
    }

    hideLoading();

    makePageForEpisodes(state.filtered);
    populateEpisodeSelect(episodes);
    setupEpisodeSelect();
    setupSearch();
  })
  .catch(() => {
    hideLoading();
    // Handle fetch error here
    handleError("Could not load episodes. Please try again later.")
  });
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
  episodeImage.src = image?.medium || ""; // Avoid error if image is missing
  episodeImage.alt = name;  // Use `name` instead of `image.name`

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
    // Search filter
  } else if (state.query) {
    state.filtered = state.allEpisodes.filter((episode) => {
      const name = episode.name.toLowerCase();
      const summary = (episode.summary || "").toLowerCase();
      return name.includes(state.query) || summary.includes(state.query);
    });
  } else {
    state.filtered = state.allEpisodes;
  }

  makePageForEpisodes(state.filtered);
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
  selectElem.addEventListener("change", () => {
    // Reset an input when use the select
    searchInput.value = "";
    filterAndRender();
  });
}

function setupSearch() {
  searchInput.addEventListener("input", () => {
    // Reset select when typing in input
    selectElem.value = "";
    filterAndRender();
  });
}

function handleError(message) {
   if (loadingElem) {
    console.error(message);
    loadingElem.textContent = message;
    loadingElem.style.display = "block";
  } else {
    alert(message);
  }
}

function setLoading(visible, msg = "Loading...") {
  if (!loadingElem) return;
  loadingElem.textContent = msg;
  loadingElem.style.display = visible ? "block" : "none";
}

window.onload = setup;
