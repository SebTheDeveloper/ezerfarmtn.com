const reservationsInfo = document.getElementById('reservations-info');
const availableDaysInfo = document.getElementById('available-days-info');
let currentSelectedDate = '';
let initialLoad = true;

async function getAndDisplayData() {
  const playDays = await getAvailablePlayDays();

  if (initialLoad) {
    currentSelectedDate = playDays[0].date;
    initialLoad = false;
  }

  const playDayDivs = playDays.map(playDay => `<div class="available-day" data-date="${playDay.date}"><div>${playDay.label}</div><div id="deleteReservation">Delete</div></div>`).join('');
  const playDayOptions = playDays.map(playDay => `<option value="${playDay.date}">${playDay.label}</option>`).join('');
  
  availableDaysInfo.innerHTML = `
    <h4>Edit Available Play Days</h4>
    <i class="disclaimer">You don't need to delete days that are in the past, those are automatically filtered out when the customer picks a day.</i>
    <div class="addPlayDay">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,19V5H5V19H19M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5C3,3.89 3.9,3 5,3H19M11,7H13V11H17V13H13V17H11V13H7V11H11V7Z" /></svg>
      <p>add a play day</p>
    </div>
    <div id="available-days-list">${playDayDivs}</div>
  `;
  
  const playDayAttendance = await getAttendance(currentSelectedDate);
  
  reservationsInfo.innerHTML = `
    <p>Manage Reservations</p>
    <select id="selectedDate">${playDayOptions}</select>
    <div id="attendance">${playDayAttendance}</div>
  `;

  const selectedDate = document.getElementById('selectedDate');
  const attendance = document.getElementById('attendance');

  selectedDate.addEventListener('change', async () => {
    const newAttendance = await getAttendance(selectedDate.value);
    attendance.innerHTML = newAttendance;
  });
}

getAndDisplayData();

async function getAvailablePlayDays() {
  const response = await fetch('/sensory/get-available-play-days', { method: 'GET'});
  const playDays = await response.json();
  return playDays
}

async function getAttendance(playDate) {
  try {
      const response = await fetch('/sensory/admin/get-attendance', {
          method: 'POST',
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ date: playDate })
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data)

      const playDayAttendance = data.map(reservation => `<div class="attendeeInfo">
      <div><strong>Name:</strong>&nbsp ${reservation.name}</div>
      <div><strong>Email:</strong>&nbsp <a style="color:rgb(var(--blue))" href="mailto:${reservation.email}">${reservation.email}</a></div>
      <div><strong>Date:</strong>&nbsp ${reservation.date}</div>
      <div><strong>Phone Number:</strong>&nbsp <a style="color:rgb(var(--blue))" href="tel:${reservation.phoneNumber}">${reservation.phoneNumber}</a></div>
      <div><strong>Number of Kids:</strong>&nbsp ${reservation.numberOfKids}</div>
      <div><strong>Kids Attending:</strong>&nbsp ${reservation.kidsAttending.map(kid => kid.name).join(', ')}</div>
      </div>`).join('');

      return playDayAttendance;

  } catch (error) {
      console.error(`Error Fetching Attendance: ${error}`);
  }
}
