const WORDS = [
  "AGILE",
  "STACK",
  "QUERY",
  "DEBUG",
  "MOCHA",
  "PROXY",
  "ARRAY",
  "REACT",
  "CACHE",
  "BUILD",
];

const MAX_GUESSES = 5;
const WORD_LENGTH = 5;

const KEY_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"],
];

const boardEl = document.getElementById("wgBoard");
const messageEl = document.getElementById("wgMessage");
const keyboardEl = document.getElementById("wgKeyboard");

if (boardEl && messageEl && keyboardEl) {
  const targetWord = WORDS[Math.floor(Math.random() * WORDS.length)];
  let currentGuess = "";
  let guessCount = 0;
  let gameOver = false;

  function buildBoard() {
    for (let row = 0; row < MAX_GUESSES; row += 1) {
      const rowEl = document.createElement("div");
      rowEl.className = "word-game__row";
      rowEl.dataset.row = String(row);

      for (let col = 0; col < WORD_LENGTH; col += 1) {
        const cell = document.createElement("div");
        cell.className = "word-game__cell";
        cell.dataset.col = String(col);
        rowEl.appendChild(cell);
      }

      boardEl.appendChild(rowEl);
    }
  }

  function buildKeyboard() {
    KEY_ROWS.forEach((row) => {
      const rowEl = document.createElement("div");
      rowEl.className = "word-game__key-row";

      row.forEach((key) => {
        const keyEl = document.createElement("button");
        keyEl.type = "button";
        keyEl.textContent = key === "BACK" ? "\u232B" : key;
        keyEl.className = "word-game__key";
        if (key === "ENTER" || key === "BACK") {
          keyEl.classList.add("word-game__key--wide");
        }
        keyEl.dataset.key = key;
        keyEl.addEventListener("click", () => handleKey(key));
        rowEl.appendChild(keyEl);
      });

      keyboardEl.appendChild(rowEl);
    });
  }

  function currentRowEl() {
    return boardEl.querySelector(`[data-row="${guessCount}"]`);
  }

  function updateCurrentRow() {
    const rowEl = currentRowEl();
    if (!rowEl) return;
    const cells = rowEl.querySelectorAll(".word-game__cell");
    cells.forEach((cell, i) => {
      cell.textContent = currentGuess[i] || "";
    });
  }

  function scoreGuess(guess) {
    const result = new Array(WORD_LENGTH).fill("absent");
    const targetLetters = targetWord.split("");

    // First pass: exact matches
    guess.split("").forEach((letter, i) => {
      if (targetLetters[i] === letter) {
        result[i] = "correct";
        targetLetters[i] = null;
      }
    });

    // Second pass: letters present elsewhere
    guess.split("").forEach((letter, i) => {
      if (result[i] === "correct") return;
      const idx = targetLetters.indexOf(letter);
      if (idx !== -1) {
        result[i] = "present";
        targetLetters[idx] = null;
      }
    });

    return result;
  }

  function updateKeyboardStatus(guess, statuses) {
    guess.split("").forEach((letter, i) => {
      const keyEl = keyboardEl.querySelector(`[data-key="${letter}"]`);
      if (!keyEl) return;

      const rank = { absent: 0, present: 1, correct: 2 };
      const currentRank = keyEl.dataset.status
        ? rank[keyEl.dataset.status]
        : -1;

      if (rank[statuses[i]] > currentRank) {
        keyEl.dataset.status = statuses[i];
        keyEl.classList.remove("correct", "present", "absent");
        keyEl.classList.add(statuses[i]);
      }
    });
  }

  function submitGuess() {
    if (gameOver) return;

    if (currentGuess.length < WORD_LENGTH) {
      messageEl.textContent = "Not enough letters.";
      return;
    }

    const statuses = scoreGuess(currentGuess);
    const rowEl = currentRowEl();
    const cells = rowEl.querySelectorAll(".word-game__cell");

    cells.forEach((cell, i) => {
      cell.classList.add(statuses[i]);
    });

    updateKeyboardStatus(currentGuess, statuses);

    if (currentGuess === targetWord) {
      messageEl.textContent = "Nice — you got it!";
      gameOver = true;
      return;
    }

    guessCount += 1;

    if (guessCount >= MAX_GUESSES) {
      messageEl.textContent = `The word was ${targetWord}.`;
      gameOver = true;
      return;
    }

    currentGuess = "";
    messageEl.textContent = "\u00A0";
  }

  function handleKey(key) {
    if (gameOver) return;

    if (key === "ENTER") {
      submitGuess();
      return;
    }

    if (key === "BACK") {
      currentGuess = currentGuess.slice(0, -1);
      updateCurrentRow();
      return;
    }

    if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      currentGuess += key;
      updateCurrentRow();
    }
  }

  document.addEventListener("keydown", (event) => {
    const key = event.key.toUpperCase();
    if (key === "ENTER") {
      handleKey("ENTER");
    } else if (key === "BACKSPACE") {
      handleKey("BACK");
    } else if (/^[A-Z]$/.test(key)) {
      handleKey(key);
    }
  });

  buildBoard();
  buildKeyboard();
}
