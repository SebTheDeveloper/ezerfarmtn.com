// script.js
const calendar = document.querySelector("#calendar");
let availableDates = [];

// Fetch available dates from the API
async function fetchAvailableDates() {
  try {
    const response = await fetch("YOUR_API_URL");
    const data = await response.json();
    availableDates = data.availableDates;
    createCalendar(new Date());
  } catch (error) {
    console.error("Error fetching available dates:", error);
  }
}

function createCalendar(date) {
  // ... (same code as before) ...

  // Update the loop to check available dates
  for (let j = 0; j < 7; j++) {
    const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
    const formattedDate = currentDate.toISOString().split("T")[0];

    if (j === firstDay && !rowStarted) {
      rowStarted = true;
    }

    if (rowStarted && day <= monthDays) {
      const disabled = !availableDates.includes(formattedDate) ? "disabled" : "";
      html += `<td class="${disabled}">${day}</td>`;
      day++;
    } else {
      html += "<td></td>";
    }
  }

  // ... (same code as before) ...
}

fetchAvailableDates();
