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
  idShow: 82,
};
let showSelectElem;
let selectElem;
let showSearchInput;
let searchInput;
let showsViewButton;
//const selectElem = document.getElementById("search-select");
//const searchInput = document.getElementById("search-input");
const searchContainer = document.getElementById("search-container");

const episodesContainer = document.getElementById("episodes-container");
const countElem = document.getElementById("search-count");
const template = document.getElementById("episode-card");
const loadingElem = document.getElementById("loading");
//const showSelectElem = document.getElementById("show-select");

const showsContainer = document.getElementById("shows-container");
const templateShows = document.getElementById("show-card");

//Creates bar search elements for episodes
function createSearchElementsEpisodes() {
  const searchCountElem = document.getElementById("search-count");

  showsViewButton = document.createElement("button")
  showsViewButton.name = "shows-view";
  showsViewButton.id = "shows-view";
  showsViewButton.textContent = "Show All Shows";
    showsViewButton.addEventListener("click", () => {
    setupShowsPage();
  });
  searchContainer.insertBefore(showsViewButton, searchCountElem);

  showSelectElem = document.createElement("select");
  showSelectElem.name = "show-select";
  showSelectElem.id = "show-select";
  searchContainer.insertBefore(showSelectElem, searchCountElem);

  selectElem = document.createElement("select");
  selectElem.name = "search-select";
  selectElem.id = "search-select";
  searchContainer.insertBefore(selectElem, searchCountElem);

  searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.id = "search-input";
  searchInput.placeholder = "Search episodes...";
  searchContainer.insertBefore(searchInput, searchCountElem);
}
function createSearchElementsShows() {
  const searchCountElem = document.getElementById("search-count");

  labelFilteringFor = document.createElement("label");
  labelFilteringFor.name = "filtering-for";
  labelFilteringFor.id = "filtering-for";
  labelFilteringFor.textContent = "Filtering for ";
  searchContainer.insertBefore(labelFilteringFor, searchCountElem);

  showSearchInput = document.createElement("input");
  showSearchInput.type = "text";
  showSearchInput.id = "show-search-input";
  showSearchInput.placeholder = "Search Shows...";
  searchContainer.insertBefore(showSearchInput, searchCountElem);

  showSelectElem = document.createElement("select");
  showSelectElem.name = "show-select";
  showSelectElem.id = "show-select";
  searchContainer.appendChild(showSelectElem);
}

async function fetchAllShows() {
  const res = await fetch(allShowsEndpoint);
  if (!res.ok) {
    throw new Error(`Failed to fetch shows: ${res.status}`);
  }
  return res.json();
}

async function fetchEpisodesForShow(showId) {
  // jala los episodios de un show
  const endpoint = getEpisodesEndpoint(showId); // url de los episodios

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
/** */ /** */ /** */ /** */ /** mainLoadShow */
async function loadEpisodesForShow(showId) {
  // carga los episodios en el estado
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
// llena el selector de shows /** */
function populateShowSelect(shows) {
  // sort alphabetically (case-insensitive)
  shows.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );

  showSelectElem.innerHTML = `<option value="">Select a show</option>`;
  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelectElem.appendChild(option);
  });
}
// evento al seleccionar un show, filtra los episodios /** */
function setupShowSelect() {
  showSelectElem.addEventListener("change", () => {
    const showId = showSelectElem.value;
    if (showId) {
      loadEpisodesForShow(showId);
    }
  });
}
// construye la pagina con episodios
function makePageForEpisodes(episodeList) {
  episodesContainer.innerHTML = "";
  const episodeCards = episodeList.map(createEpisodeCard);
  episodesContainer.append(...episodeCards);
  countElem.innerHTML = `Displaying <span class="count-number">${state.filtered.length} / ${state.allEpisodes.length}</span> episodes`;
  countElem.style.display = "block";
}
// crea una carta de episodio
function createEpisodeCard(episode) {
  const { season, number, name, url, image, summary } = episode;
  const card = template.content.cloneNode(true);
  const episodeFormatted = formatEpisodeNumber(season, number);
  const episodeLink = card.querySelector("h3 a");
  episodeLink.textContent = `${name} - ${episodeFormatted}`;
  episodeLink.href = url;
  const episodeImage = card.querySelector("img");
  episodeImage.src = image?.medium || ""; // Avoid error if image is missing
  episodeImage.alt = name; // Use `name` instead of `image.name`

  card.querySelector("p").textContent = summary
    ? summary.replace(/^<p>|<\/p>$/g, "")
    : "No summary available.";
  return card;
}
/** for main */
// construye la pagina con episodios
function makePageForShows(showList) {
  showList.forEach((show) => {
    const card = createShowCard(show);
    showsContainer.appendChild(card);
  });
  //episodesContainer.append(...episodeCards);
}
// crea una carta de episodio
function greet(idShow) {
  alert(`The show is! ${idShow}`);
}
function createShowCard(show) {
  // name, image, summary, genres, status, rating, and runtime
  const { id, name, image, summary, genres, status, rating, runtime } = show;
  const card = templateShows.content.cloneNode(true);
  const showLink = card.querySelector("h2 a");
  showLink.textContent = name;
  showLink.addEventListener("click", function (e) {
    e.preventDefault(); // Prevents opening the link
    state.idShow = id;
    setupEpisodesPage(state.idShow);
  });
  const showImage = card.querySelector("img");
  showImage.src = image?.medium || ""; // Avoid error if image is missing
  showImage.alt = name; // Use `name` instead of `image.name`

  card.querySelector("p").innerHTML = summary
    ? summary.replace(/^<p>|<\/p>$/g, "")
    : "No summary available.";

  const showGenre = card.querySelector(".show-genre");
  showGenre.textContent =
    genres && genres.length > 0 ? genres.join(" | ") : "No genres";
  const showStatus = card.querySelector(".show-status");
  showStatus.textContent = status;

  const showRated = card.querySelector(".show-rated");
  showRated.textContent = rating && rating.average ? rating.average : "N/A";
  const showRuntime = card.querySelector(".show-runtime");
  showRuntime.textContent = runtime;
  return card;
}

function formatEpisodeNumber(season, number) {
  const pad = (num) => String(num).padStart(2, "0");
  return `S${pad(season)}E${pad(number)}`;
}
// arma despu[es de los fos filtros]
function filterAndRender() {
  state.selectedIndex = selectElem.value;
  state.query = searchInput.value.trim().toLowerCase();
  // Select filter
  if (state.selectedIndex !== "") {
    state.filtered = state.allEpisodes.filter(
      (_, i) => i === Number(state.selectedIndex)
    );
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
//llena el selector de episodios /** */
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
// evento al seleccionar episodio
function setupEpisodeSelect() {
  selectElem.addEventListener("change", () => {
    // Reset an input when use the select
    searchInput.value = "";
    filterAndRender();
  });
}
// evento al escribir en el buscador de episodios
function setupSearch() {
  searchInput.addEventListener("input", () => {
    // Reset select when typing in input
    selectElem.value = "";
    filterAndRender();
  });
}
// evento al escribir en el buscador de shows
function mainSetupSearch() {
  showSearchInput.addEventListener("input", () => {
    // Reset select when typing in input
    selectElem.value = ""; 
    console.log('aqui el evento de filtrar')
    //filter select
    // filter shows
    // render
    filterAndRender();
  });
}
// manejador de erores ( ni idea)
function handleError(message) {
  if (loadingElem) {
    console.error(message);
    loadingElem.textContent = message;
    loadingElem.style.display = "block";
  } else {
    alert(message);
  }
}
// aparentemente algo que dice que esta todo cargando
function setLoading(visible, msg = "Loading...") {
  if (!loadingElem) return;
  loadingElem.textContent = msg;
  loadingElem.style.display = visible ? "block" : "none";
}
// va dentro de render
// crea episodios
function setupEpisodesPage(idShow) {
  removeSearchElementsShows();
  removeShowCards();
  createSearchElementsEpisodes();
  populateShowSelect(state.allShows);
  setupShowSelect();
  setupSearch();
  setupEpisodeSelect();
  showSelectElem.value = idShow;
  loadEpisodesForShow(idShow);
}
// remueve elementos de busqueda de episodios
function removeSearchElementsEpisodes() {
  if (showsViewButton && showsViewButton.parentNode) showsViewButton.remove();
  if (showSelectElem && showSelectElem.parentNode) showSelectElem.remove();
  if (selectElem && selectElem.parentNode) selectElem.remove();
  if (searchInput && searchInput.parentNode) searchInput.remove();
}
//remueve elementos de busqueda de shows
function removeSearchElementsShows() {
  const labelFilteringFor = document.getElementById("filtering-for");
  if (labelFilteringFor) labelFilteringFor.remove();
  if (showSearchInput && showSearchInput.parentNode) showSearchInput.remove();
  if (showSelectElem && showSelectElem.parentNode) showSelectElem.remove();
}
function removeShowCards() {
  showsContainer.innerHTML = "";
}
function removeEpisodeCards() {
  episodesContainer.innerHTML = "";
}
function setupShowsPage(){
    removeSearchElementsEpisodes();
    removeEpisodeCards();
    createSearchElementsShows();
    populateShowSelect(state.allShows);
    mainSetupSearch();
    makePageForShows(state.allShows);
}

function setup() {
  setLoading(true, "Loading shows...");

  fetchAllShows()
    .then((shows) => {
      setLoading(false);
      state.allShows = shows;

      // createSearchElementsEpisodes();
      // populateShowSelect(state.allShows);
      // setupShowSelect();
      // setupSearch();
      // setupEpisodeSelect();

      /**
       * MainSetupShowSearch();
       * /// MainLoadShows;
       */
      createSearchElementsShows();
      populateShowSelect(state.allShows);
      mainSetupSearch();
      makePageForShows(state.allShows);

      //   // Automatically select and load show ID 82.
      //   // Could be replaced with any other show ID or removed.
      //   const defaultShowId = "82"; //era defaultShowId en lugar de state.ShowId
      //   showSelectElem.value = defaultShowId;
      //   loadEpisodesForShow(defaultShowId);
    })
    .catch((err) => {
      setLoading(false);
      handleError(`Could not load show list. ${err.message}`);
    });
}

window.onload = setup;
