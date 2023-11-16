const countDownDate = new Date("Nov 30, 2023 12:00:00");
let ntpServerTime;

async function fetchNTPServerTime() {
  const ntpServerUrl = "http://localhost:8080/getDateTime";

  const response = await fetch(ntpServerUrl);
  const ntpResponse = await response.json();

  if (ntpResponse.dateTime) {
    ntpServerTime = new Date(ntpResponse.dateTime);
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  await fetchNTPServerTime();

  window.addEventListener("mousemove", handleMouseMove);

  function updateCountdown() {
    const now = ntpServerTime ? ntpServerTime.getTime() : Date.now();

    const distance = countDownDate.getTime() - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerHTML = formatTime(days);
    document.getElementById("hours").innerHTML = formatTime(hours);
    document.getElementById("minutes").innerHTML = formatTime(minutes);
    document.getElementById("seconds").innerHTML = formatTime(seconds);

    if (distance < 0) {
      clearInterval(x);
      document.getElementById("countdown").innerHTML = "EXPIRED";
    }
  }

  updateCountdown();

  const x = setInterval(updateCountdown, 1000);
});

function handleMouseMove(event) {
  const radialGradient = document.getElementById("radialGradient");
  const textContainer = document.getElementById("textContainer");
  const radius = 400;

  const mouseX = event.clientX;
  const mouseY = event.clientY;

  radialGradient.style.background = `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(90, 36, 196, 0.4) 0%, rgba(90, 36, 196, 0) 20%)`;

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

function formatTime(time) {
  return time < 10 ? "0" + time : time;
}

function addToCalendar() {
  const event = {
    title: "CodeSphere Countdown Challenge 🎃",
    date: countDownDate,
    location: "Online",
  };

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
