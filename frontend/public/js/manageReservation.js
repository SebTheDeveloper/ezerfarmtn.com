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
  `;
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
  const { name, email, phoneNumber, kidsAttending, numberOfKids, date } = await getPlayDayInfo();
  if (name) {
    let childrenAttending = '';
    for (kid of kidsAttending) {
      childrenAttending += `<span class="kidsAttending"><span style="font-weight:500;opacity: 0.95">Name:</span> ${kid.name} <span style="font-weight:500;opacity: 0.95">&nbsp Age:</span> ${kid.age}</span>`
    }

    reservationInfo.innerHTML = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone Number:</strong> ${phoneNumber}</p>
    <p><strong>Number of Kids Attending:</strong> ${numberOfKids}</p>
    <p><strong>Children Attending:</strong> ${childrenAttending}</p>
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
    const loadingCircle = document.querySelector('.loading-circle');
    const cancelButton = document.querySelector('#cancel-reservation a');

    cancelButton.addEventListener('click', async () => {
      const deletionConfirmed = confirm(`Cancel my Sensory Play Day reservation for ${date}`);

      if (deletionConfirmed) {
        loadingCircle.style.display = 'flex';
        const response = await fetch(`/sensory/cancel-reservation?id=${appointmentID}&date=${date}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ date, appointmentID })
        });
        
        loadingCircle.style.display = 'none';
  
        if (response.status == 200) {
          reservationInfo.innerHTML = `
          <p style="font-size:1.2rem;font-style:italic;margin-top:1rem;margin-bottom:2rem;animation: fade-in 0.5s ease-in-out">Your Reservation for <span style="font-weight:bold;">${date}</span> has been canceled.</p>
          <div style="margin-top:1rem;"><a href="/">Back to Home</a></div>
          `;
        } else {
          reservationInfo.innerHTML = `
          <p style="font-size:1.2rem;font-style:italic;margin-top:1rem;margin-bottom:2rem;animation: fade-in 0.5s ease-in-out">Error, could not cancel reservation for <span style="font-weight:bold;">${date}</span>. Please back out and try again.</p>
          <div style="margin-top:1rem;"><a href="/">Back to Home</a></div>
          `;
        }
      }
    });
  }
};

