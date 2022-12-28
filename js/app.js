/**
 * this script is responsible for anything you see on browser
 * except the styles which are coming from main.css
 *    Sina Shafiee DEC 2022
 *
 *
 * main functions :
 *
 *    1- renderBaseTags => append header main and footer elements on body and invoke function 4 and function 5
 *    2- fetchAllEpisodes => fetch data first time page loads and render main element and invoke function 3
 *    3- renderEpisodes => loop over all incoming episode objects and render cards and its related tags on dom
 *    4- renderHeader => render header content on dom
 *    5- renderFooter => render footer content on dom
 *    6- searchEpisodesByQuery => its invoked by typing on header's search input. filter the content based on
 *      search query and if any movie exist its gonna invoke function 3 to render that elements else its gonna
 *      invoke function 7
 *      and also invoke function 8 to render the count of found episodes
 *    7- renderNotFound => render not found section on dom
 *    8- renderCount => render search result count
 *    9- renderSelect => render select and its options on dom
 *    10- handleSelectChange => handle select option change and render element based
 *       on select element value
 *
 * double click on function name and pres ctrl + f to find the function declaration
 */

// page header element
const headerEl = document.createElement('header');
headerEl.classList.add('header');
// main page content
const mainEl = document.createElement('main');
mainEl.classList.add('main');
// page footer element
const footerEl = document.createElement('footer');
footerEl.classList.add('footer');

/**
 * responsible for appending above header, main and footer elements on body TAG
 */
function renderBaseTags() {
  // appending main and footer element to
  document.body.append(headerEl);
  document.body.append(mainEl);
  document.body.appendChild(footerEl);

  // rendering episode cards and footer
  renderHeader();
  renderFooter();
}

let episodesData = null;

/**
 * responsible for fetching data from api endpoint
 */
async function fetchAllEpisodes() {
  try {
    // fetching data
    const response = await fetch('https://api.tvmaze.com/shows/82/episodes');
    // converting response to a useable js data type
    episodesData = await response.json();

    // rendering episode cards on dom
    renderEpisodes(episodesData);
    renderSelect(episodesData);
  } catch (err) {
    alert('please turn on VPN');
  }
}

/**
 *
 * @param {array of episode objects} data
 * responsible for rendering all episode cards to the page
 */
function renderEpisodes(data) {
  const cardsContainer = document.createElement('section');
  cardsContainer.classList.add('cardsContainer');

  // looping over array of movies to create a card for each
  data.forEach(({ image, name, season, number, summary }, index) => {
    // creating container element
    const containerEl = document.createElement('article');
    containerEl.classList.add('episodeCard');

    // creating image element
    const imageEl = document.createElement('img');
    imageEl.setAttribute('src', image.medium);
    imageEl.setAttribute('alt', name);
    imageEl.classList.add('episodeCard__img');

    // episode card body element
    const episodeCardBodyEl = document.createElement('section');
    episodeCardBodyEl.classList.add('episodeCard__body');

    // episode card heading section
    const episodeCardBodyHeading = document.createElement('section');
    episodeCardBodyHeading.classList.add('episodeCard__body-heading');

    // creating h2 element for episodeCard name
    const nameEl = document.createElement('h2');
    nameEl.textContent = name.substring(0, 24);

    if (summary.length < 50) {
      nameEl.style.paddingBottom = '1.6rem';
    }

    // creating p tag for episode part
    const partNumberEl = document.createElement('p');
    partNumberEl.textContent = `S${season > 9 ? season : '0' + season}E${
      number > 9 ? number : '0' + number
    }`;

    // episode description element
    const descEl = document.createElement('p');
    descEl.classList.add('episodeCard__body-desc');
    descEl.innerHTML = summary.substring(0, 60).concat('..');

    // appending img to card
    containerEl.append(imageEl);
    // appending name and part number in body heading
    episodeCardBodyHeading.append(nameEl);
    episodeCardBodyHeading.append(partNumberEl);

    // appending card body heading and description to card body
    episodeCardBodyEl.append(episodeCardBodyHeading);
    episodeCardBodyEl.append(descEl);

    // appending card body to card container
    containerEl.append(episodeCardBodyEl);

    // appending the card to dom entry point root element
    cardsContainer.append(containerEl);
    mainEl.append(cardsContainer);
  });
}

/**
 * responsible for rendering header
 */
function renderHeader() {
  // creating logo and select container
  const containerTopEl = document.createElement('div');
  containerTopEl.classList.add('header-top');
  // creating logo
  const logoEl = document.createElement('h1');
  logoEl.classList.add('logo');
  logoEl.textContent = 'TVMAZE';

  // creating search box and adding event listener to it
  const searchBoxEl = document.createElement('input');
  searchBoxEl.setAttribute('id', 'search-query');
  searchBoxEl.setAttribute('placeholder', 'search here');

  searchBoxEl.addEventListener('input', (e) => {
    searchEpisodesByQuery(e.target.value);
  });

  // appending them to the dom
  containerTopEl.append(logoEl);
  headerEl.append(containerTopEl);
  headerEl.append(searchBoxEl);
}

/**
 * responsible for rendering page footer element
 */
function renderFooter() {
  // creating tv maze reference
  const licenseEl = document.createElement('p');
  licenseEl.classList.add('license');

  licenseEl.innerHTML = `this webpage is powered with <a target="_blank" href='https://www.tvmaze.com'>Tvmaze</a> Api service`;

  // appending lic element to footer
  footerEl.append(licenseEl);
}

/**
 *
 * @param {search query coming from header input} query
 * invoke renderEpisodes function or renderNotFound based on search result
 */

async function searchEpisodesByQuery(query) {
  document.querySelector('select').value = 'all';
  // remove all previous data
  if (document.querySelector('.cardsContainer')) {
    document.querySelector('.cardsContainer').remove();
  }

  // remove prev count element
  if (document.querySelector('.count-element')) {
    document.querySelector('.count-element').remove();
  }

  // filter data based on given query
  const filteredData = episodesData.filter((episode) => {
    return (
      episode.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
      episode.summary.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  });

  // functionality to render what based on conditions
  if (filteredData.length > 0) {
    renderEpisodes(filteredData);
    renderCount(filteredData.length);
    if (document.querySelector('.error-element')) {
      document.querySelector('.error-element').remove();
    }

    if (filteredData.length === 73) {
      document.querySelector('.count-element').remove();
    }
  } else if (!document.querySelector('.error-element')) {
    renderNotFound();
  } else {
    document.querySelector('.count-element').remove();
  }
}

/**
 * responsible for rendering found episode count
 */
function renderNotFound() {
  // error element container
  const errorEl = document.createElement('div');
  errorEl.classList.add('error-element');

  const errorTextEl = document.createElement('p');
  errorTextEl.textContent = ' sorry no result found';

  // appending to the page
  errorEl.append(errorTextEl);
  mainEl.append(errorEl);
}

function renderCount(count) {
  // paragraph element for count
  const countEl = document.createElement('p');
  countEl.classList.add('count-element');
  countEl.textContent = `${count} Episodes found`;

  //appending to header
  headerEl.append(countEl);
}

/**
 *
 * @param {array of episode objects} episodes
 * render select element
 */
function renderSelect(episodes) {
  const selectEl = document.createElement('select');

  selectEl.addEventListener('change', handleSelectChange);

  const selectAllOptionEl = document.createElement('option');
  selectAllOptionEl.textContent = 'all episodes';
  selectAllOptionEl.value = 'all';

  selectEl.append(selectAllOptionEl);

  episodes.forEach(({ season, number, name }) => {
    const optionEl = document.createElement('option');
    optionEl.setAttribute('value', name);
    optionEl.textContent = `S${season > 9 ? season : '0' + season}E${
      number > 9 ? number : '0' + number
    } - ${name}`;

    selectEl.append(optionEl);
  });

  selectEl.value = 'all';
  document.querySelector('.header-top').append(selectEl);
}

/**
 *
 * @param {event object} e
 * handle select element change
 */
function handleSelectChange(e) {
  document.querySelector('#search-query').value = '';

  if (e.target.value === 'all') {
    document.querySelector('.cardsContainer').remove();
    renderEpisodes(episodesData);
  } else {
    const filteredData = episodesData.filter(
      (episode) => episode.name === e.target.value
    );
    document.querySelector('.cardsContainer').remove();
    renderEpisodes(filteredData);
  }
}

// on screen load fetching all the data and rendering the content
document.addEventListener('DOMContentLoaded', renderBaseTags);
document.addEventListener('DOMContentLoaded', fetchAllEpisodes);
