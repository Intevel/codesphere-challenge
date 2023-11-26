// Init global variables
const countDownDate = new Date("Dec 24, 2023 12:00:00");
let ntpServerTime;
let interval;

// Fetch the time using Network Time Protocol
async function fetchNTPServerTime() {
  const ntpServerUrl = "/getDateTime";

  const response = await fetch(ntpServerUrl);
  const ntpResponse = await response.json();

  if (ntpResponse.dateTime) {
    ntpServerTime = new Date(ntpResponse.dateTime);
  }
}

// init the countdown
document.addEventListener("DOMContentLoaded", async function () {
  // fetch the time once
  await fetchNTPServerTime();

  // add mousemove handler for my fancy glow effect :D
  window.addEventListener("mousemove", handleMouseMove);

  // function to calculate the time remaining and update the DOM
  function updateCountdown() {
    let now = ntpServerTime ? ntpServerTime.getTime() : Date.now();
    let distance = countDownDate.getTime() - now;

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = formatTime(days);
    document.getElementById("hours").innerText = formatTime(hours);
    document.getElementById("minutes").innerText = formatTime(minutes);
    document.getElementById("seconds").innerText = formatTime(seconds);

    // increment the ntp time by 1 second
    ntpServerTime.setSeconds(ntpServerTime.getSeconds() + 1);

    // If the count down is finished, clear the interval to stop the countdown
    if (distance < 0) {
      clearInterval(interval);
    }
  }

  // call the updateCountdown function every 1 second
  updateCountdown();
  interval = setInterval(updateCountdown, 1000);
});

// glow effect
function handleMouseMove(event) {
  const radialGradient = document.getElementById("radialGradient");
  const textContainer = document.getElementById("textContainer");

  // radius in px near the submitted note
  const radius = 400;

  const mouseX = event.clientX;
  const mouseY = event.clientY;

  radialGradient.style.background = `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(90, 36, 196, 0.4) 0%, rgba(90, 36, 196, 0) 20%)`;

  // calculate the opacity of the text
  const textRect = textContainer.getBoundingClientRect();
  const textCenterX = textRect.left + textRect.width / 2;
  const textCenterY = textRect.top + textRect.height / 2;
  const distance = Math.sqrt(
    (mouseX - textCenterX) ** 2 + (mouseY - textCenterY) ** 2
  );

  const minOpacity = 0.1;
  const opacity = 1 - (Math.min(distance, radius) / radius) * (1 - minOpacity);

  textContainer.style.opacity = opacity;
}

// format the time to have a leading zero if the time is less than 10
function formatTime(time) {
  return time < 10 ? "0" + time : time;
}

// add to calendar button functionality
function addToCalendar() {
  // construct event
  const event = {
    title: "CodeSphere Countdown Challenge 🎃",
    date: countDownDate,
    location: "Online",
  };

  // generate ics file and download it
  const icsContent = generateICS(event);

  const dataUri =
    "data:text/calendar;charset=utf-8," + encodeURIComponent(icsContent);

  const link = document.createElement("a");
  link.href = dataUri;
  link.download = "event.ics";

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
}

// helper function to format the date for the ics file
function formatDateForICS(date) {
  function pad(number) {
    if (number < 10) {
      return "0" + number;
    }
    return number;
  }

  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

// helper function to generate the ics file
function generateICS(event) {
  return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DTSTART:${formatDateForICS(event.date)}
LOCATION:${event.location}
DESCRIPTION:${event.title}
END:VEVENT
END:VCALENDAR`;
}
