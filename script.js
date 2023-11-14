document.addEventListener("DOMContentLoaded", function () {
  const countDownDate = new Date("Nov 30, 2023 00:00:00").getTime();

  function updateCountdown() {
    const now = new Date().getTime();

    const distance = countDownDate - now;

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

  function formatTime(time) {
    return time < 10 ? "0" + time : time;
  }
});
