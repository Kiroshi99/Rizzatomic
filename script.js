const YOUR_BOOKING_EMAIL = "banbangaming01@gmail.com";

const introScreen = document.getElementById("intro-screen");
const questionScreen = document.getElementById("question-screen");
const loadingScreen = document.getElementById("loading-screen");
const resultScreen = document.getElementById("result-screen");

const nameInput = document.getElementById("name-input");
const nameError = document.getElementById("name-error");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

const questionCount = document.getElementById("question-count");
const scorePreview = document.getElementById("score-preview");
const progressFill = document.getElementById("progress-fill");
const questionEmoji = document.getElementById("question-emoji");
const questionText = document.getElementById("question-text");
const answerButtons = document.querySelectorAll(".answer-btn");

const loadingMessage = document.getElementById("loading-message");
const loadingFill = document.getElementById("loading-fill");

const finalScore = document.getElementById("final-score");
const resultName = document.getElementById("result-name");
const resultMessage = document.getElementById("result-message");
const extraMessage = document.getElementById("extra-message");
const fateLink = document.getElementById("fate-link");
const redirectMessage = document.getElementById("redirect-message");

const dateModal = document.getElementById("date-modal");
const bookingForm = document.getElementById("booking-form");
const dateInput = document.getElementById("date-input");
const timeInput = document.getElementById("time-input");
const noteInput = document.getElementById("note-input");
const bookingError = document.getElementById("booking-error");
const closeBookingBtn = document.getElementById("close-booking-btn");
const skipBookingBtn = document.getElementById("skip-booking-btn");

let currentQuestion = 0;
let score = 0;
let playerName = "";

let answerLocked = false;
let quizFinished = false;
let dateAnswerYes = false;
let bookingConfirmed = false;

let redirectTimeout;
let loadingInterval;

// SCORE RANGE: -5 to 12
// Result bands:
// 10–12 = Dream girl
// 7–9 = Broke the scale
// 4–6 = Certified lover
// 1–3 = Potential
// 0 or below = Rizz training needed
const questions = [
  {
    emoji: "💘",
    text: "Are you in a relationship?",
    yes: -3,
    no: 2
  },
  {
    emoji: "🙏",
    text: "Do you pray before you eat?",
    yes: 1,
    no: 0
  },
  {
    emoji: "🎸",
    text: "Do you like boys who play guitar?",
    yes: 1,
    no: 0
  },
  {
    emoji: "💻",
    text: "Do you like tech boys?",
    yes: 1,
    no: 0
  },
  {
    emoji: "📏",
    text: "Do you like 5'10+ men?",
    yes: 1,
    no: 0
  },
  {
    emoji: "🍳",
    text: "Do you like men who can cook?",
    yes: 2,
    no: 0
  },
  {
    emoji: "💋",
    text: "Do you like forehead kisses?",
    yes: 1,
    no: 0
  },
  {
    emoji: "😏",
    text: "Would you like to go out with me?",
    yes: 3,
    no: -2
  }
];

function showScreen(screenToShow) {
  const screens = [
    introScreen,
    questionScreen,
    loadingScreen,
    resultScreen
  ];

  screens.forEach((screen) => {
    screen.classList.remove("active");
  });

  screenToShow.classList.add("active");
}

function displayQuestion() {
  const question = questions[currentQuestion];

  questionCount.textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;

  scorePreview.textContent = `Rizz points: ${score}`;
  questionEmoji.textContent = question.emoji;
  questionText.textContent = question.text;

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  progressFill.style.width = `${progress}%`;
}

function startQuiz() {
  const typedName = nameInput.value.trim();

  if (!typedName) {
    nameError.textContent = "Oi, enter your name first 😭";
    nameInput.focus();
    return;
  }

  clearTimeout(redirectTimeout);
  clearInterval(loadingInterval);

  playerName = typedName;
  score = 0;
  currentQuestion = 0;

  answerLocked = false;
  quizFinished = false;
  dateAnswerYes = false;
  bookingConfirmed = false;

  nameError.textContent = "";
  loadingFill.style.width = "0%";

  showScreen(questionScreen);
  displayQuestion();
}

function answerQuestion(answer) {
  if (answerLocked || quizFinished) {
    return;
  }

  answerLocked = true;

  const question = questions[currentQuestion];
  score += question[answer];

  const isLastQuestion = currentQuestion === questions.length - 1;

  if (isLastQuestion && answer === "yes") {
    dateAnswerYes = true;

    setTimeout(() => {
      answerLocked = false;
      openBookingModal();
    }, 180);

    return;
  }

  if (isLastQuestion) {
    setTimeout(() => {
      answerLocked = false;
      finishQuiz();
    }, 180);

    return;
  }

  setTimeout(() => {
    currentQuestion++;
    answerLocked = false;
    displayQuestion();
  }, 180);
}

function finishQuiz() {
  if (quizFinished) {
    return;
  }

  quizFinished = true;
  currentQuestion = questions.length;

  startCalculation();
}

function startCalculation() {
  showScreen(loadingScreen);

  const messages = [
    "Scanning social media charisma...",
    "Checking playlist taste...",
    "Analysing Rizztory™...",
    "Measuring forehead-kiss compatibility...",
    "Finalising verdict..."
  ];

  let step = 0;

  loadingFill.style.width = "0%";
  loadingMessage.textContent = messages[0];

  clearInterval(loadingInterval);

  loadingInterval = setInterval(() => {
    step++;

    const progress = Math.min(
      (step / messages.length) * 100,
      100
    );

    loadingFill.style.width = `${progress}%`;

    if (step < messages.length) {
      loadingMessage.textContent = messages[step];
    }

    if (step >= messages.length) {
      clearInterval(loadingInterval);

      setTimeout(() => {
        showResults();
      }, 550);
    }
  }, 700);
}

function showResults() {
  clearTimeout(redirectTimeout);

  finalScore.textContent = score;
  resultName.textContent = `${playerName}, your Rizz rating is:`;

  let message = "";
  let extra = "";
  let link = "";
  let linkText = "";

  if (score >= 10) {
    message = "👑 Dream Girl Status Unlocked.";
    extra = dateAnswerYes
      ? "💘 You said yes to the date too. That is actually crazy work."
      : "You scored dangerously high on the Waifu Scale™.";

    link = "https://www.tiktok.com/@0xuetnevstat/video/7250125473533922578";
    linkText = "Open your Dream Girl verdict 👑";

  } else if (score >= 7) {
    message = "🥵 High-Tier Result — You Broke the Scale.";
    extra = dateAnswerYes
      ? "💘 High score plus a date yes? Massive W."
      : "Your compatibility score is looking very serious.";

    link = "https://www.tiktok.com/@daisythegoldiee/video/6999629671713230086";
    linkText = "See your high-tier result 😮‍💨";

  } else if (score >= 4) {
    message = "😎 Certified Lover — You’ve Got the Juice.";
    extra = dateAnswerYes
      ? "💘 The score was solid, and you still said yes. Respect."
      : "Not perfect, but there is definitely potential here.";

    link = "https://www.tiktok.com/@life2inspire/video/7213691859976211717?q=fuck%20sshouting%20animal%20beaver&t=1782102159033";
    linkText = "Open your Certified Lover reward 💘";

  } else if (score >= 1) {
    message = "😅 Potential Detected... But We’re Still Building.";
    extra = dateAnswerYes
      ? "💘 The score is low, but you accepted the date anyway. Plot twist."
      : "There is still hope. The Rizz training arc starts here.";

    link = "https://www.tiktok.com/@lucky957888/video/7525413836233461006?q=elmo%20being%20a%20bitch&t=1782101493259";
    linkText = "See your potential result 👀";

  } else {
    message = "😭 Emergency Rizz Training Required.";
    extra = dateAnswerYes
      ? "💘 Somehow you still said yes to the date though. We take those."
      : "The scanner has detected a critical shortage of Rizz.";

    link = "https://www.tiktok.com/@tonononotononon1/video/7590307485039283474?q=rick%20roll&t=1781965515962";
    linkText = "Begin emergency Rizz training 🚨";
  }

  if (bookingConfirmed && dateAnswerYes) {
    extra += " Your Google Calendar invite was opened too.";
  }

  resultMessage.textContent = message;
  extraMessage.textContent = extra;

  fateLink.href = link;
  fateLink.textContent = linkText;

  redirectMessage.textContent =
    "Opening your result automatically in 5 seconds...";

  showScreen(resultScreen);

  redirectTimeout = setTimeout(() => {
    window.location.href = link;
  }, 5000);
}

function toInputDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function setBookingDefaults() {
  const now = new Date();
  const tomorrow = new Date(now);

  tomorrow.setDate(now.getDate() + 1);

  dateInput.min = toInputDate(now);

  if (!dateInput.value) {
    dateInput.value = toInputDate(tomorrow);
  }

  if (!timeInput.value) {
    timeInput.value = "18:00";
  }
}

function openBookingModal() {
  bookingError.textContent = "";
  setBookingDefaults();

  dateModal.classList.add("show");
  dateModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  setTimeout(() => {
    dateInput.focus();
  }, 150);
}

function hideBookingModal() {
  dateModal.classList.remove("show");
  dateModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function addMinutesToDateTime(dateValue, timeValue, minutesToAdd) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const [hour, minute] = timeValue.split(":").map(Number);

  const date = new Date(
    Date.UTC(year, month - 1, day, hour, minute)
  );

  date.setUTCMinutes(date.getUTCMinutes() + minutesToAdd);

  const newYear = date.getUTCFullYear();
  const newMonth = String(date.getUTCMonth() + 1).padStart(2, "0");
  const newDay = String(date.getUTCDate()).padStart(2, "0");
  const newHour = String(date.getUTCHours()).padStart(2, "0");
  const newMinute = String(date.getUTCMinutes()).padStart(2, "0");

  return {
    date: `${newYear}-${newMonth}-${newDay}`,
    time: `${newHour}:${newMinute}`
  };
}

function makeCalendarDate(dateValue, timeValue) {
  return `${dateValue.replaceAll("-", "")}T${timeValue.replace(":", "")}00`;
}

function buildGoogleCalendarUrl(dateValue, timeValue, note) {
  const durationMinutes = 60;

  const end = addMinutesToDateTime(
    dateValue,
    timeValue,
    durationMinutes
  );

  const startTime = makeCalendarDate(dateValue, timeValue);
  const endTime = makeCalendarDate(end.date, end.time);

  const calendarUrl = new URL(
    "https://calendar.google.com/calendar/render"
  );

  calendarUrl.searchParams.set("action", "TEMPLATE");

  calendarUrl.searchParams.set(
    "text",
    "Date with Clarence 💘"
  );

  calendarUrl.searchParams.set(
    "dates",
    `${startTime}/${endTime}`
  );

  calendarUrl.searchParams.set(
    "details",
    `${playerName} accepted the date request through the Rizz Scanner™.\n\nDate idea: ${note || "TBC — organise something cute."}`
  );

  calendarUrl.searchParams.set(
    "location",
    "TBC — organise with Clarence"
  );

  calendarUrl.searchParams.set(
    "ctz",
    "Australia/Melbourne"
  );

  calendarUrl.searchParams.set(
    "add",
    YOUR_BOOKING_EMAIL
  );

  return calendarUrl.toString();
}

function confirmBooking(event) {
  event.preventDefault();

  const selectedDate = dateInput.value;
  const selectedTime = timeInput.value;
  const note = noteInput.value.trim();

  if (!selectedDate || !selectedTime) {
    bookingError.textContent =
      "Pick both a date and time first 😭";
    return;
  }

  const chosenDate = new Date(`${selectedDate}T${selectedTime}`);

  if (chosenDate < new Date()) {
    bookingError.textContent =
      "That time has already passed. Pick a future one 😭";
    return;
  }

  const calendarUrl = buildGoogleCalendarUrl(
    selectedDate,
    selectedTime,
    note
  );

  bookingConfirmed = true;

  window.open(
    calendarUrl,
    "_blank",
    "noopener,noreferrer"
  );

  hideBookingModal();
  finishQuiz();
}

function skipBooking() {
  hideBookingModal();
  finishQuiz();
}

function restartQuiz() {
  clearTimeout(redirectTimeout);
  clearInterval(loadingInterval);

  score = 0;
  currentQuestion = 0;
  playerName = "";

  answerLocked = false;
  quizFinished = false;
  dateAnswerYes = false;
  bookingConfirmed = false;

  nameInput.value = "";
  nameError.textContent = "";

  dateInput.value = "";
  timeInput.value = "";
  noteInput.value = "";

  loadingFill.style.width = "0%";
  progressFill.style.width = "12.5%";

  hideBookingModal();
  showScreen(introScreen);

  nameInput.focus();
}

startBtn.addEventListener("click", startQuiz);

nameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    startQuiz();
  }
});

answerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    answerQuestion(button.dataset.answer);
  });
});

bookingForm.addEventListener("submit", confirmBooking);

closeBookingBtn.addEventListener("click", skipBooking);
skipBookingBtn.addEventListener("click", skipBooking);

restartBtn.addEventListener("click", restartQuiz);

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    dateModal.classList.contains("show")
  ) {
    skipBooking();
  }
});
