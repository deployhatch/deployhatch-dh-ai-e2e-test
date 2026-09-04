const storageKey = 'reel-shelf-movies';
const form = document.querySelector('#movie-form');
const titleInput = document.querySelector('#title');
const ratingInput = document.querySelector('#rating');
const ratingValue = document.querySelector('#rating-value');
const notesInput = document.querySelector('#notes');
const movieList = document.querySelector('#movie-list');
const emptyState = document.querySelector('#empty-state');
const movieCount = document.querySelector('#movie-count');
const clearButton = document.querySelector('#clear-all');
const formMessage = document.querySelector('#form-message');

let movies = readMovies();

function readMovies() {
  try {
    const savedMovies = JSON.parse(localStorage.getItem(storageKey));
    return Array.isArray(savedMovies) ? savedMovies : [];
  } catch {
    return [];
  }
}

function saveMovies() {
  localStorage.setItem(storageKey, JSON.stringify(movies));
}

function renderMovies() {
  movieList.replaceChildren();
  emptyState.hidden = movies.length > 0;
  clearButton.hidden = movies.length === 0;
  movieCount.textContent = movies.length;

  movies.forEach((movie, index) => {
    const card = document.createElement('article');
    card.className = 'movie-card';
    card.innerHTML = `
      <div class="movie-index">${String(index + 1).padStart(2, '0')}</div>
      <div>
        <h3 class="movie-title"></h3>
        <p class="movie-notes"></p>
      </div>
      <div>
        <div class="movie-rating">${movie.rating}<small>/10</small></div>
        <button class="delete-button" type="button" aria-label="Remove ${escapeHtml(movie.title)}" data-id="${movie.id}">&#215;</button>
      </div>
    `;
    card.querySelector('.movie-title').textContent = movie.title;
    card.querySelector('.movie-notes').textContent = movie.notes || 'No notes added.';
    movieList.append(card);
  });
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

ratingInput.addEventListener('input', () => { ratingValue.textContent = ratingInput.value; });

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  if (!title) return;

  movies.unshift({ id: crypto.randomUUID(), title, rating: Number(ratingInput.value), notes: notesInput.value.trim() });
  saveMovies();
  renderMovies();
  form.reset();
  ratingInput.value = 8;
  ratingValue.textContent = '8';
  formMessage.textContent = 'Added to your shelf.';
  titleInput.focus();
  window.setTimeout(() => { formMessage.textContent = ''; }, 2500);
});

movieList.addEventListener('click', (event) => {
  const button = event.target.closest('.delete-button');
  if (!button) return;
  movies = movies.filter((movie) => movie.id !== button.dataset.id);
  saveMovies();
  renderMovies();
});

clearButton.addEventListener('click', () => {
  if (!window.confirm('Remove every movie from your shelf?')) return;
  movies = [];
  saveMovies();
  renderMovies();
});

ratingValue.textContent = ratingInput.value;
renderMovies();
