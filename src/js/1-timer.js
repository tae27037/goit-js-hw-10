import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  daysEl: document.querySelector('[data-days]'),
  hoursEl: document.querySelector('[data-hours]'),
  minutesEl: document.querySelector('[data-minutes]'),
  secondsEl: document.querySelector('[data-seconds]'),
};

let userSelectedDate = null;
let timerId = null;

refs.startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (!selectedDate) {
      refs.startBtn.disabled = true;
      userSelectedDate = null;
      return;
    }

    if (selectedDate <= new Date()) {
      refs.startBtn.disabled = true;
      userSelectedDate = null;

      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      return;
    }

    userSelectedDate = selectedDate;
    refs.startBtn.disabled = false;
  },
};

flatpickr('#datetime-picker', options);

refs.startBtn.addEventListener('click', onStartClick);

function onStartClick() {
  if (!userSelectedDate) return;

  refs.startBtn.disabled = true;
  refs.input.disabled = true;

  updateTimer();
  timerId = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const now = new Date();
  const ms = userSelectedDate - now;

  if (ms <= 0) {
    clearInterval(timerId);
    updateTimerDisplay({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

    refs.input.disabled = false;
    refs.startBtn.disabled = true;
    userSelectedDate = null;
    return;
  }

  const time = convertMs(ms);
  updateTimerDisplay(time);
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
  refs.daysEl.textContent = String(days).padStart(2, '0');
  refs.hoursEl.textContent = addLeadingZero(hours);
  refs.minutesEl.textContent = addLeadingZero(minutes);
  refs.secondsEl.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
