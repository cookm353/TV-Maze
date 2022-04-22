"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $episodesList = $("#episodesList");
const $searchForm = $("#searchForm");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  const url = `https://api.tvmaze.com/search/shows?q=${term}`;
  const resp = await axios.get(url);
  const shows = [];
  let img;

  for (let show of resp.data) {
    const showInfo = {
      id: show.show.id,
      name: show.show.name,
      summary: show.show.summary
    };
    
    if (show.show.image === null) {
      showInfo.image = "https://tinyurl.com/tv-missing";
    } else {
      showInfo.image = show.show.image.medium;
    }

    shows.push(showInfo);
  }

  return shows
}
 async function blarg() {
  const data = await getShowsByTerm("Doctor Who")
  console.log(data)
 }

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src = ${show.image}
              alt= ${show.name} 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchQuery").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const url = `http://api.tvmaze.com/shows/${id}/episodes`;
  const resp = await axios.get(url);
  const episodes = [];
  
  for (let episode of resp.data) {
    episodes.push({
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number
    });
  }
  // console.log(resp.data)

  return episodes;
}

/** Given list of episodes, create markup for each and append to DOM */

function populateEpisodes(episodes) {
  $episodesArea.show();
  
  for (let episode of episodes) {
    const $newLi = $(`<li>${episode.name} (season ${episode.season}, episode ${episode.number})</li>`);
    $episodesList.append($newLi);
  }
}


async function showEpisodes(id) {
  const episodes = await getEpisodesOfShow(id);
  console.log(episodes);
  populateEpisodes(episodes);
}

$showsList.on("click", $(".Show-getEpisodes"), function(evt) {
  evt.preventDefault();
  const id = $(evt.target).closest(".Show").data("show-id");
  $episodesList.html("");
  console.log(id);
  showEpisodes(id);
})