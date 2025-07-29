//You can edit ALL of the code here
let allEpisodes = [];
function setup() {
  allEpisodes = getAllEpisodes();
  if (!allEpisodes || allEpisodes.length === 0) {
    console.error("No episodes found!");
    return;
  }
  makePageForEpisodes(allEpisodes);
  setupSearch();
}

function makePageForEpisodes(episodeList) {
  const episodesContainer = document.getElementById("episodes-container");
  episodesContainer.innerHTML = "";
  const episodeCards = episodeList.map(createEpisodeCard);
  episodesContainer.append(...episodeCards);
}

function createEpisodeCard(episode){
  const {season, number, name, url, image, summary} = episode;
  const template = document.getElementById("episode-card");
  const card = template.content.cloneNode(true);
  const episodeFormatted = formatEpisodeNumber(season,number);

  const episodeLink = card.querySelector("h3 a");
  episodeLink.textContent = `${name} - ${episodeFormatted}`;
  episodeLink.href = url;

  const episodeImage = card.querySelector("img");
  episodeImage.src = image.medium;
  episodeImage.alt = image.name;

  card.querySelector("p").textContent = summary ? summary.replace(/^<p>|<\/p>$/g, '') : "No summary available.";
  return card;
}

function formatEpisodeNumber(season, number) {
  const pad = (num) => String(num).padStart(2, '0');
  return `S${pad(season)}E${pad(number)}`;
}

function setupSearch() {
  const searchInput = document.getElementById("search-input");
  const countElem = document.getElementById("search-count");

  searchInput.addEventListener("input", function () {
    const query = this.value.trim().toLowerCase();

    if (!query) {
      makePageForEpisodes(allEpisodes);
      countElem.style.display = "none";
      return;
    }

    const filteredEpisodes = allEpisodes.filter(episode => {
      const name = episode.name.toLowerCase();
      const summary = (episode.summary || "").toLowerCase();
      return name.includes(query) || summary.includes(query);
    });

    makePageForEpisodes(filteredEpisodes);

    countElem.innerHTML = `Episodes found: <span class="count-number">${filteredEpisodes.length}</span>`;
     countElem.style.display = "block";
  });
}

window.onload = setup;
