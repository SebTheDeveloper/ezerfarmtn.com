const manageReservationBtn = document.querySelector('#manage-reservation button');

const params = new URLSearchParams(window.location.search);
const appointmentID = params.get('id');
const date = params.get('date');

if (date) {
  const selectedPlayDay = document.querySelector('#selected-play-day');
  selectedPlayDay.textContent = ` for ${date}`;
}

manageReservationBtn.addEventListener('click', () => {
  if (appointmentID && date) {
    window.location.href = `/sensory/manage-reservation?id=${appointmentID}&date=${date}`;
  } else {
    alert('Reservation not found. Please check your email if you have an existing reservation or schedule a new play day.')
  }
});