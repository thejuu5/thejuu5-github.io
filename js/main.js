const rotatorEl = document.getElementById("heroRotator");

const greetings = [
  { text: "Hello, I'm" },
  { text: "console.log(\"Hey, I'm\");", isCode: true },
  { text: "Hola, soy", lang: "es" },
];

let currentIndex = 0;
const ROTATE_EVERY_MS = 2800;
const FADE_DURATION_MS = 300;

function applyGreeting(greeting) {
  rotatorEl.textContent = greeting.text;
  rotatorEl.classList.toggle("is-code", Boolean(greeting.isCode));

  if (greeting.lang) {
    rotatorEl.setAttribute("lang", greeting.lang);
  } else {
    rotatorEl.setAttribute("lang", "en");
  }
}

function rotateGreeting() {
  currentIndex = (currentIndex + 1) % greetings.length;

  rotatorEl.classList.add("is-fading");

  setTimeout(() => {
    applyGreeting(greetings[currentIndex]);
    rotatorEl.classList.remove("is-fading");
  }, FADE_DURATION_MS);
}

if (rotatorEl) {
  applyGreeting(greetings[currentIndex]);
  setInterval(rotateGreeting, ROTATE_EVERY_MS);
}