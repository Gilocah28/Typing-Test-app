const btnDifficulty = document.querySelectorAll("[data-difficulty]");
const paragraphEL = document.querySelector(".text");

console.log(characterObject);

let difficulty = "easy";

btnDifficulty.forEach((btn) => {
  btn.addEventListener("click", () => {
    difficulty = btn.dataset.difficulty;
    displayText(difficulty);
  });
});

function displayText(modedif) {
  const arryText = characterObject[modedif];
  const ramdonIndex = Math.floor(Math.random() * arryText.length);
  const seletedText = arryText[ramdonIndex].text;

  paragraphEL.innerHTML = "";

  seletedText.split("").forEach((char) => {
    const spanEl = document.createElement("span");
    spanEl.textContent = char;

    paragraphEL.appendChild(spanEl);
  });
}

displayText(difficulty);
