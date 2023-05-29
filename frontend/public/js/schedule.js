const form = document.querySelector('form');
const submitButton = document.querySelector('button[type="submit"]');
const loadingCircle = document.querySelector('.loading-circle');

form.addEventListener('submit', () => {
  submitButton.disabled = 'true';
  loadingCircle.style.display = 'flex';
});