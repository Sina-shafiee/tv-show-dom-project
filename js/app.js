// main page content
const mainEl = document.createElement('main');
mainEl.classList.add('main');
// page footer element
const footerEl = document.createElement('footer');

/**
 * responsible for fetching data from api endpoint
 */
const fetchAllEpisodes = async () => {
  // fetching data
  const response = await fetch('https://api.tvmaze.com/shows/82/episodes');

  // converting response to a useable js data type
  const data = await response.json();

  // appending main and footer element to body
  document.body.append(mainEl);
  document.body.appendChild(footerEl);

  // rendering episode cards and footer
  renderEpisodes(data);
  renderFooter();
};

/**
 *
 * @param {array of episode objects} data
 * responsible for rendering all episode cards to the page
 */
const renderEpisodes = (data) => {
  // looping over array of movies to create a post for each
  data.forEach(({ image, name, season, number, summary }) => {
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
    nameEl.textContent = name;

    // creating p tag for episode part
    const partNumberEl = document.createElement('p');
    partNumberEl.textContent = `S${season > 9 ? season : '0' + season}E${
      number > 9 ? number : '0' + number
    }`;

    // episode description element
    const descEl = document.createElement('p');
    descEl.classList.add('episodeCard__body-desc');
    descEl.innerHTML = summary.substring(0, 120);

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
    mainEl.append(containerEl);
  });
};

/**
 * responsible for rendering page footer element
 */

const renderFooter = () => {
  // creating tv maze reference
  const licenseEl = document.createElement('p');
  licenseEl.classList.add('license');

  licenseEl.innerHTML = `this webpage is powered with <a target="_blank" href='https://www.tvmaze.com/api'>Tvmaze</a> Api service`;

  // appending lic element to footer
  footerEl.append(licenseEl);
};

// on screen load fetching all the data and rendering the content
document.addEventListener('DOMContentLoaded', fetchAllEpisodes);
