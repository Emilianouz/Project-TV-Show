//You can edit ALL of the code here
let allEpisodes = [];
function setup() {
  allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const episodesContainer = document.getElementById("episodes-container");
  const episodeCard = episodeList.map(createEpisodeCard);
  episodesContainer.append(...episodeCard);
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

window.onload = setup;
