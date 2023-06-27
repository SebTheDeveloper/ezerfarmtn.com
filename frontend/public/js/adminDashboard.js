const reservationsInfo = document.getElementById('reservations-info');
const availableDaysInfo = document.getElementById('available-days-info');
const loadingCircle = document.querySelector('.loading-circle');
const addPlayDayModal = document.getElementById('add-play-day-modal')
const newPlayDayForm = document.getElementById('new-play-day-form')

let currentSelectedDate = '';
let initialLoad = true;

async function getAndDisplayData() {
  const playDays = await getAvailablePlayDays();

  if (initialLoad) {
    currentSelectedDate = playDays[0].date;
    initialLoad = false;
  }

  const playDayDivs = playDays.map(playDay => `<div class="available-day" data-date="${playDay.date}"><div style="margin-right: 0.5em;">${playDay.label}</div><div id="deleteReservation">Delete</div></div>`).join('');
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

  document.getElementById('x').addEventListener('click', () => {
    addPlayDayModal.style.display = 'none';
  });
  
  const addPlayDay = document.querySelector('.addPlayDay');
  addPlayDay.addEventListener('click', () => {
    addPlayDayModal.style.display = 'flex';
  });

  newPlayDayForm.querySelector('button').addEventListener('click', () => {
    const newMonth = newPlayDayForm.querySelector('#month');
    const monthLabel = newMonth.options[newMonth.selectedIndex];
    const newDay = newPlayDayForm.querySelector('#day');
    const nthDay = newDay.options[newDay.selectedIndex];
    const newYear = newPlayDayForm.querySelector('#year');
    const newDate = `${newMonth.value}-${newDay.value}-${newYear.value}`;

    const selectedDate = new Date(newYear.value, newMonth.value - 1, newDay.value);
    const dayOfWeek = selectedDate.getDay();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const newLabel = `${days[dayOfWeek]}, ${monthLabel.dataset.label} ${nthDay.dataset.nth}`;
    
    const isConfirmed = confirm(`Are you sure you want to add a new play day for ${newDate}? (${newLabel}, ${newYear.value})`);

    if (isConfirmed) {
      loadingCircle.style.display = 'flex';
      fetch('/sensory/admin/add-available-play-day', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date: newDate, label: newLabel })
      })
        .then(response => response.json())
        .then(confirmation => {
          if (confirmation.isAdded) {
            console.log(confirmation);
            loadingCircle.style.display = 'none';
          }
        })
        .catch(err => {
          console.log(`ERROR ADDING AVAILABLE PLAY DAY: ${err}`);
          alert('Something went wrong. Unable to add play day. Please try again.');
        })
        .finally(resolve => {
          window.location.href = '/sensory/admin';
        })
    }

  });

  const availableDays = document.querySelectorAll('.available-day');

  availableDays.forEach(day => {
    day.querySelector('#deleteReservation').addEventListener('click', () => {
      const areYouSure = confirm(`Are you sure you want to remove ${day.dataset.date} from the list of available play days?`);
      if (areYouSure) {
        loadingCircle.style.display = 'flex';
        fetch('/sensory/admin/delete-available-play-day', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ date: day.dataset.date })
        })
          .then(response => response.json())
          .then(confirmation => {
            if (confirmation.isDeleted) {
              console.log(confirmation);
              day.style.display = 'none';
              loadingCircle.style.display = 'none';
            }
          })
          .catch(err => {
            console.log(`ERROR DELETING AVAILABLE PLAY DAY: ${err}`);
            alert('Something went wrong. Unable to cancel play day. Please try again.');
            window.location.href = '/sensory/admin';
          });
      }
    });
  });
  
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

      const playDayAttendance = data.map(reservation => `<div class="attendeeInfo">
      <div><strong>Name:</strong>&nbsp ${reservation.name}</div>
      <div><strong>Email:</strong>&nbsp <a style="color:rgb(var(--blue))" href="mailto:${reservation.email}">${reservation.email}</a></div>
      <div><strong>Date:</strong>&nbsp ${reservation.date}</div>
      <div><strong>Phone Number:</strong>&nbsp <a style="color:rgb(var(--blue))" href="tel:${reservation.phoneNumber}">${reservation.phoneNumber}</a></div>
      <div><strong>Number of Kids:</strong>&nbsp ${reservation.numberOfKids}</div>
      <div><strong>Kids Attending:</strong>&nbsp ${reservation.kidsAttending.map(kid => {
        const childInfo = `${kid.name} <i>(age ${kid.age})</i>`;
        return childInfo;
      }).join(', ')}</div>
      <a href="/sensory/manage-reservation?id=${reservation._id}&date=${reservation.date}&admin=true"><button>Manage Reservation</button></a>
      </div>`).join('');

      return playDayAttendance;

  } catch (error) {
      console.error(`Error Fetching Attendance: ${error}`);
  }
}
