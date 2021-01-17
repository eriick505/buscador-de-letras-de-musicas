const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainerUL = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container')

const api = 'https://api.lyrics.ovh'
const corsAnyWhere = 'https://cors-anywhere.herokuapp.com'

const fetchData = async url => {
  const response = await fetch(url)
  return await response.json()
}

const fetchSongs = async term => {
  const data = await fetchData(`${api}/suggest/${term}`)

  insertSongsIntoPage(data);
}

const addPrevAndNextButton = (prev, next) => {
  if(next || prev) {
    prevAndNextContainer.innerHTML = `
      ${prev ? `<button class="btn" onclick="getMoreSongs('${prev}')">Anterior</button>` : ''}
      ${next ? `<button class="btn" onclick="getMoreSongs('${next}')">Próximo</button>` : ''}
    `
    return
  }

  prevAndNextContainer.innerHTML = '';
}

const insertSongsIntoPage = ({data, next, prev}) => {
  songsContainerUL.innerHTML = data.map(({artist, title}) => `
      <li class="song">
        <span class="song-artist"><strong>${artist.name}</strong> - ${title}</span>
        <button class="btn" data-artist="${artist.name}" data-song-title="${title}">Ver letra</button>
      </li>
    `).join('')

    addPrevAndNextButton(prev, next);
}

songsContainerUL.addEventListener('click', event => {
  const targetElement = event.target

  if(targetElement.tagName === 'BUTTON'){
    const artist = targetElement.getAttribute('data-artist');
    const song = targetElement.getAttribute('data-song-title');

    prevAndNextContainer.innerHTML = ''

    fetchLyrics(artist, song);
  }
})

const fetchLyrics = async (artist, song) => {
  const data = await fetchData(`${api}/v1/${artist}/${song}`)
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')

  songsContainerUL.innerHTML = `
    <li class="lyrics-container">
      <h2><span>${song}</span> - ${artist}</h2>
      <p class="lyrics">${lyrics}</p>
    </li>
  `
}

const getMoreSongs = async url => {
  const data = await fetchData(`${corsAnyWhere}/${url}`)

  insertSongsIntoPage(data);
}

form.addEventListener('submit', event => {
  event.preventDefault();

  const searchTerm = searchInput.value.trim();

  if(!searchTerm){
    songsContainerUL.innerHTML = `<li class="warning-message">Por favor, digite um termo válido</li>`;
    return
  }

  fetchSongs(searchTerm)
})

