const mainTextEl = document.querySelector(".main-text");
const inputEl = document.getElementById("input-text");
const btnDifficulty = document.querySelectorAll("[data-difficulty]");
const paragraphEL = document.querySelector(".text");
const timeEl = document.querySelector(".time");
const spanAccurracy = document.querySelector(".acurracy");
const spanWpmEl = document.querySelector(".wmp");
const spanBestScoreEl = document.querySelector(".best-score");
const restartBnt = document.querySelector("#restart");
const highScoreCon = document.querySelector(".high-score-container");
const testCompletedCon = document.querySelector(".test-completed");
const mainConEl = document.querySelector(".main-container");
const testWmpBest = document.querySelector(".test-wmp");
const testAccuracy = document.querySelector(".test-accuracy");
const testTotalChar = document.querySelector(".test-character");
const mistakeEl = document.querySelector(".mistake");

//best score
const wpnBestEl = document.getElementById("bestWpm");
const bestAccuraccyEl = document.getElementById("bestAccuraccy");
const totalCharBestEl = document.getElementById("totalCharBest");
const totalMistakeBest = document.getElementById("totalMistakeBest");
const btnBeatHighScore = document.querySelector(".btn-beat-high-score");
const btnAgain = document.querySelector(".again");
const startBtn = document.getElementById("start");

let difficulty = "medium";
let charIndex = 0;
let totalChar = 0;
let totalMistake = 0;

//for timer variable
let timeleft = 60;
let interval = null;

// for info variable
let correctChar = 0;
let totalTypeChar = 0;
let currenctScore = 0;
let highScore = 0;

let elapsedSeconds = 0;
let grossWPM = 0;

let netWPM = 0;

displayText(difficulty);

btnDifficulty.forEach((btn) => {
  btn.addEventListener("click", () => {
    difficulty = btn.dataset.difficulty;
    handleReset();
    displayText(difficulty);
    inputEl.focus();
  });
});

function displayText(modedif) {
  const arryText = characterObject[modedif];
  const ramdonIndex = Math.floor(Math.random() * arryText.length);
  const seletedText = arryText[ramdonIndex].text;

  paragraphEL.innerHTML = "";
  totalChar = 0;

  seletedText.split("").forEach((char) => {
    const spanEl = document.createElement("span");
    spanEl.className = "spanText";
    spanEl.textContent = char;
    paragraphEL.appendChild(spanEl);
    totalChar++;
  });
}

mainTextEl.addEventListener("click", () => {
  inputEl.focus();
});

inputEl.addEventListener("input", () => {
  handCharText();
});

function handCharText() {
  const spanTextEl = document.querySelectorAll(".spanText");
  const inputValue = inputEl.value;
  const currentChar = inputValue[charIndex];

  if (spanTextEl.length <= charIndex) {
    // later code will add here

    setTimeout(() => {
      handleCompute();
      handleHighScore();
    }, 3000);

    clearInterval(interval);
    interval = null;
    return;
  }

  if (inputValue.length < charIndex && charIndex > 0) {
    charIndex--;
    totalTypeChar--;

    if (spanTextEl[charIndex].classList.contains("correct")) {
      correctChar--;
    } else if (spanTextEl[charIndex].classList.contains("incorrect")) {
      totalMistake--;
    }

    spanTextEl[charIndex].classList.remove("correct", "incorrect");
    mistakeEl.textContent = totalMistake;
    totalMistakeBest.textContent = totalMistake;

    return;
  }

  if (charIndex < 0) return;
  //check the if charIndex is 0 to prevent bug and negative value

  totalTypeChar++;

  if (currentChar === spanTextEl[charIndex].textContent) {
    spanTextEl[charIndex].classList.add("correct");
    correctChar++;
  } else {
    spanTextEl[charIndex].classList.add("incorrect");
    totalMistake++;
  }

  mistakeEl.textContent = totalMistake;
  totalMistakeBest.textContent = totalMistake;

  charIndex++;
  time();
  handleCompute();
}

function time() {
  // this condition to prevent calling again the timer
  if (interval) return;

  interval = setInterval(() => {
    timeleft--;

    displayTime(timeleft);

    // check if current time still not on zero
    if (timeleft === 0) {
      clearInterval(interval);
      interval = null;
      inputEl.disabled = true;
      setTimeout(() => {
        handleCompute();
        handleHighScore();
      }, 3000);
    }
  }, 1000);
}

function handleReset() {
  inputEl.disabled = false;
  charIndex = 0;
  timeleft = 60;

  correctChar = 0;
  totalTypeChar = 0;
  currenctScore = 0;
  elapsedSeconds = 0;
  grossWPM = 0;
  netWPM = 0;
  totalChar = 0;
  totalMistake = 0;

  timeEl.textContent = `00:60`;
  spanWpmEl.textContent = "0";
  spanAccurracy.textContent = "0" + "%";
  displayTime(timeleft);
  clearInterval(interval);
  inputEl.value = "";
  interval = null;
}

function handleHighScore() {
  if (highScore === 0) {
    highScore = currenctScore;
    spanBestScoreEl.textContent = `${handleDecimalVal(highScore)} WMP`;
    highScoreCon.classList.remove("display-none");
    mainConEl.classList.add("display-none");
  } else if (currenctScore < highScore) {
    highScoreCon.classList.add("display-none");
    testCompletedCon.classList.remove("display-none");
    mainConEl.classList.add("display-none");
  } else {
    highScore = currenctScore;
    highScoreCon.classList.remove("display-none");
    mainConEl.classList.add("display-none");
    spanBestScoreEl.textContent = `${handleDecimalVal(highScore)} WMP`;
  }
}

function displayTime(timeleft) {
  const timeFormat = `${timeleft < 10 ? "0" + timeleft : timeleft}`;
  timeEl.style.color = `${timeleft < 10 ? "hsl(354, 63%, 57%)" : "hsl(0, 0%, 100%)"}`;

  timeEl.textContent = `00:${timeFormat}`;
}

function handleCompute() {
  const accuracy =
    totalTypeChar === 0 ? 100 : (correctChar / totalTypeChar) * 100;

  spanAccurracy.textContent = `${accuracy.toFixed(1)}%`;
  testAccuracy.textContent = `${accuracy.toFixed(1)}%`;
  bestAccuraccyEl.textContent = `${accuracy.toFixed(1)}%`;

  elapsedSeconds = 60 - timeleft;

  grossWPM =
    elapsedSeconds === 0 ? 0 : totalTypeChar / 5 / (elapsedSeconds / 60);

  netWPM = grossWPM * (accuracy / 100);
  currenctScore = netWPM;

  spanWpmEl.textContent = handleDecimalVal(netWPM);
  wpnBestEl.textContent = handleDecimalVal(netWPM);
  testWmpBest.textContent = handleDecimalVal(netWPM);
  testTotalChar.innerHTML = `${totalChar} / <span class="mistake">${totalMistake}</span>`;
  totalCharBestEl.innerHTML = `${totalChar} / <span class="mistake" id="totalMistakeBest">${totalMistake}</span>`;
}

restartBnt.addEventListener("click", () => {
  displayText(difficulty);
  handleReset();
  inputEl.focus();
});

btnBeatHighScore.addEventListener("click", () => {
  highScoreCon.classList.add("display-none");
  mainConEl.classList.remove("display-none");
  handleReset();
  displayText(difficulty);
  inputEl.focus();
});

btnAgain.addEventListener("click", () => {
  highScoreCon.classList.add("display-none");
  testCompletedCon.classList.add("display-none");
  mainConEl.classList.remove("display-none");
  handleReset();
  displayText(difficulty);
  inputEl.focus();
});

const starConEl = document.querySelector(".start-container");

starConEl.addEventListener("click", () => {
  starConEl.classList.add("display-none");
  handleReset();
  displayText(difficulty);
  inputEl.focus();
});

startBtn.addEventListener("click", () => {
  starConEl.classList.add("display-none");
  handleReset();
  displayText(difficulty);
  inputEl.focus();
});

function handleDecimalVal(val) {
  return Math.floor(val);
}
