const form = document.querySelector('form');
const datesAvailableDropdown = document.querySelector('#date');
const submitButton = document.querySelector('button[type="submit"]');
const loadingCircle = document.querySelector('.loading-circle');

form.addEventListener('submit', () => {
  submitButton.disabled = 'true';
  loadingCircle.style.display = 'flex';
});

async function getAvailablePlayDays() {
  const response = await fetch('/sensory/get-available-play-days', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const availablePlayDays = await response.json();

  let selectInnerText = '';

  for (playDay of availablePlayDays) {
    selectInnerText += `
    <option value="${playDay.date}">${playDay.label}</option>
    `;
  }

  datesAvailableDropdown.innerHTML = selectInnerText;
  
}

getAvailablePlayDays();