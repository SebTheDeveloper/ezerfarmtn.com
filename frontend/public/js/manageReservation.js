const reservationInfo = document.querySelector('#reservation-info');
const goBackButton = document.querySelector('#go-back');

const params = new URLSearchParams(window.location.search);
const appointmentID = params.get('id');
const date = params.get('date');

if (appointmentID && date) {
  goBackButton.href = `/sensory/scheduled-successfully?id=${appointmentID}&date=${date}`;
  initCancelButton();
} else {
  goBackButton.style.display = 'none';
  reservationInfo.innerHTML = `
  <p>nothing found..</p>
  <div style="margin-top:1rem;"><a href="/">Back to Home</a></div>
  `
}


async function getPlayDayInfo() {
  const response = await fetch('/sensory/get-play-day-info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ date, appointmentID })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

async function displayPlayDayInfo() {
  const { name, email, phoneNumber, numberOfKids, date } = await getPlayDayInfo();
  if (name) {
    reservationInfo.innerHTML = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone Number:</strong> ${phoneNumber}</p>
    <p><strong>Number of Kids Attending:</strong> ${numberOfKids}</p>
    <p><strong>Date:</strong> ${date}</p>
    <div id="cancel-reservation"><a>Cancel Reservation</a></div>`;
  } else {
    reservationInfo.innerHTML = `
    <p>Nothing found..</p>
    `;
    goBackButton.style.display = 'none';
    reservationInfo.innerHTML = `
    <p>nothing found..</p>
    <div style="margin-top:1rem;"><a href="/">Back to Home</a></div>
    `
  }
};

async function initCancelButton() {
  await displayPlayDayInfo();

  if (appointmentID && date) {
    const cancelButton = document.querySelector('#cancel-reservation a');
    cancelButton.addEventListener('click', () => {
      location.replace('/sensory');
    });
  }
};

