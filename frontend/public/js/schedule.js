const form = document.querySelector('form');
const datesAvailableDropdown = document.querySelector('#date');
const addKidInfo = document.querySelector('.addKidInfo');
const kidsAttending = document.querySelector('#kidsAttending');
const submitButton = document.querySelector('button[type="submit"]');
const loadingCircle = document.querySelector('.loading-circle');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  submitButton.disabled = true;
  loadingCircle.style.display = 'flex';

  let kidsData = [];

  let kidsNames = Array.from(document.getElementsByClassName('kidsName'));
  let kidsAges = Array.from(document.getElementsByClassName('kidsAge'));

  for(let i = 0; i < kidsNames.length; i++) {
    let kid = {};
    kid.name = kidsNames[i].value;
    kid.age = kidsAges[i].value;
    kidsData.push(kid);
  }

  const customerName = document.getElementById('name').value;
  const customerEmail = document.getElementById('email').value;
  const customerPhoneNumber = document.getElementById('phoneNumber').value;
  const selectedPlayDay = document.getElementById('date').value;

  let data = {
    numberOfKids: kidsData.length,
    kidsAttending: kidsData,
    name: customerName,
    email: customerEmail,
    phoneNumber: customerPhoneNumber,
    date: selectedPlayDay
  };

  fetch('/sensory/schedule', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(processedAppt => {
    if (processedAppt.id) {
      window.location.href = `/sensory/scheduled-successfully?id=${processedAppt.id}&date=${selectedPlayDay}`;
    } else {
      window.location.href = '/sensory/nothing-available';
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
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

addKidInfo.addEventListener('click', () => {
  const nthKidInfo = document.createElement('div');
  nthKidInfo.innerHTML = `
    <div class="kidInfo">
      <input required type="text" class="kidsName" style="border-radius: 1px" placeholder="Name" />
      <input required type="number" min="1" class="kidsAge" style="border-radius: 1px" placeholder="Age" />
      <span class="delete">Delete</span>
    </div>
  `;
  kidsAttending.insertBefore(nthKidInfo, addKidInfo);

  const deleteBtn = nthKidInfo.querySelector('.delete');
  deleteBtn.addEventListener('click', () => {
    nthKidInfo.style.animation = 'zoom-fade-in 0.2s ease-in-out reverse';
    nthKidInfo.addEventListener('animationend', () => {
      nthKidInfo.remove();
    });
  });
});