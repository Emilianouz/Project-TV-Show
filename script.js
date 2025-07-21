//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}


window.onload = setup;
function createEpisodeCard(episode){
  const template = document.getElementById("episode-card");
  const card = template.content.cloneNode(true);
  const episodeFormatted = formatEpisodeNumber(episode.season,episode.number)
  card.querySelector("h3").textContent = episode.name + ' - ' + episodeFormatted;
 // card.querySelector("a").href = episode.url;
  card.querySelector("p").innerHTML = episode.summary;
  card.querySelector("img").src = episode.image.medium;
  card.querySelector("img").alt = episode.image.name;
  return card;
}

function formatEpisodeNumber(season, number) {
  const seasonFormatted = String(season).padStart(2, '0');
  const episodeFormatted = String(number).padStart(2, '0');
  return `S${seasonFormatted}E${episodeFormatted}`;
}

function formatTime(timeSecs) {
  let minutes = Math.floor(timeSecs / 60);
  let seconds = timeSecs % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

const episodeCard = getAllEpisodes().map(createEpisodeCard);
//document.getElementById("root").append(...episodeCard);
document.body.append(...episodeCard);

//getAllEpisodes()
//getOneEpisode()

