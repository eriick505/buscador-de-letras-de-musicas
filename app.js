const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainerUL = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container')

const api = 'https://api.lyrics.ovh'
const corsAnyWhere = 'https://cors-anywhere.herokuapp.com'

const fetchSongs = async term => {
  const response = await fetch(`${api}/suggest/${term}`)
  const data = await response.json()

  insertSongsIntoPage(data);
}

const insertSongsIntoPage = songsInfo => {
  songsContainerUL.innerHTML = songsInfo.data.map(song => `
      <li class="song">
        <span class="song-artist"><strong>${song.artist.name}</strong> - ${song.title}</span>
        <button class="btn" data-artist="${song.artist.name}" data-song-title="${song.title}">Ver letra</button>
      </li>
    `).join('')

  if(songsInfo.next || songsInfo.prev) {
    prevAndNextContainer.innerHTML = `
      ${songsInfo.prev ? `<button class="btn" onclick="getMoreSongs('${songsInfo.prev}')">Anterior</button>` : ''}
      ${songsInfo.next ? `<button class="btn" onclick="getMoreSongs('${songsInfo.next}')">Próximo</button>` : ''}
    `
    return
  }

  prevAndNextContainer.innerHTML = '';
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
  const response = await fetch(`${api}/v1/${artist}/${song}`)
  const data = await response.json()
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')

  songsContainerUL.innerHTML = `
    <li class="lyrics-container">
      <h2><span>${song}</span> - ${artist}</h2>
      <p class="lyrics">${lyrics}</p>
    </li>
  `
}

const getMoreSongs = async url => {
  const response = await fetch(`${corsAnyWhere}/${url}`);
  const data = await response.json();

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

