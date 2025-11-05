// Words Database
const words = {
  easy: [
    { word: "abandon", def: "to leave something behind" },
    { word: "accurate", def: "correct or exact" },
    { word: "adapt", def: "to change to fit a situation" },
    { word: "ancient", def: "very old or from long ago" },
    { word: "arrange", def: "to organize or put in order" },
    { word: "describe", def: "to explain with details" },
    { word: "discover", def: "to find something new" },
    { word: "escape", def: "to get away from danger" },
    { word: "observe", def: "to watch carefully" },
    { word: "protect", def: "to keep safe from harm" }
  ],
  medium: [
    { word: "abundant", def: "more than enough" },
    { word: "appreciate", def: "to be thankful for something" },
    { word: "confidence", def: "belief in yourself" },
    { word: "determine", def: "to decide firmly" },
    { word: "essential", def: "very important or necessary" },
    { word: "independent", def: "free, not controlled by others" },
    { word: "inspiration", def: "something that gives new ideas" },
    { word: "literature", def: "written works like stories and poems" },
    { word: "responsibility", def: "duty to do something" },
    { word: "tradition", def: "a custom passed down" }
  ],
  hard: [
    { word: "acknowledgment", def: "showing thanks or recognition" },
    { word: "amphibious", def: "able to live on land and in water" },
    { word: "archaeology", def: "study of ancient remains" },
    { word: "benevolent", def: "kind and helpful" },
    { word: "catastrophe", def: "a terrible disaster" },
    { word: "controversial", def: "causing public disagreement" },
    { word: "entrepreneur", def: "a person who starts a business" },
    { word: "fluorescent", def: "glowing brightly" },
    { word: "metamorphosis", def: "a big change in form or nature" },
    { word: "phenomenon", def: "something remarkable or unusual" }
  ]
};

// Screens
const screens = {
  menu: document.getElementById('menuScreen'),
  settings: document.getElementById('settingsScreen'),
  difficulty: document.getElementById('difficultyScreen'),
  game: document.getElementById('gameScreen')
};

const playBtn = document.getElementById('playBtn');
const settingsBtn = document.getElementById('settingsBtn');
const soundToggle = document.getElementById('soundToggle');
const backBtns = document.querySelectorAll('.backBtn');
const diffBtns = document.querySelectorAll('.difficultyBtn');

let currentLevel = "";
let currentWord = {};
let usedWords = [];
let soundEnabled = true;
let username = "";

// Switch Screens
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
  playSound('click');
}

// Simple Sounds
const sounds = {
  click: new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_96b2c6e612.mp3"),
  correct: new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_b70a9be3b2.mp3"),
  wrong: new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_b3dc2221f1.mp3")
};

function playSound(name) {
  if (soundEnabled) sounds[name].play();
}

// Menu Buttons
playBtn.onclick = () => {
  username = document.getElementById('username').value.trim() || "Player";
  localStorage.setItem('username', username);
  showScreen('difficulty');
};

settingsBtn.onclick = () => showScreen('settings');
backBtns.forEach(b => b.onclick = () => showScreen('menu'));

soundToggle.onchange = () => {
  soundEnabled = soundToggle.checked;
};

// Difficulty Selection
diffBtns.forEach(btn => {
  btn.onclick = () => {
    currentLevel = btn.dataset.level;
    startGame();
  };
});

// Game Elements
const defText = document.getElementById('definition');
const answerInput = document.getElementById('answer');
const feedback = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const gameHeader = document.getElementById('gameHeader');

// Start Game
function startGame() {
  showScreen('game');
  usedWords = [];
  nextWord();
  feedback.textContent = "";
  nextBtn.style.display = "none";
  gameHeader.textContent = `${username} - ${currentLevel.toUpperCase()}`;
}

// Random Word
function nextWord() {
  const pool = words[currentLevel];
  if (usedWords.length === pool.length) {
    feedback.textContent = "🎉 You finished all words!";
    nextBtn.style.display = "none";
    return;
  }
  let rand;
  do {
    rand = pool[Math.floor(Math.random() * pool.length)];
  } while (usedWords.includes(rand.word));
  currentWord = rand;
  usedWords.push(rand.word);
  defText.textContent = rand.def;
  answerInput.value = "";
  feedback.textContent = "";
}

// Check Answer
document.getElementById('submitBtn').onclick = () => {
  const ans = answerInput.value.trim().toLowerCase();
  if (!ans) return;
  if (ans === currentWord.word.toLowerCase()) {
    feedback.textContent = "✅ Correct!";
    playSound('correct');
    nextBtn.style.display = "block";
  } else {
    feedback.textContent = "❌ Try again.";
    playSound('wrong');
  }
};

nextBtn.onclick = nextWord;

// Pronunciation + Phonics (using Web Speech API)
document.getElementById('playWordBtn').onclick = () => {
  const utter = new SpeechSynthesisUtterance(currentWord.word);
  utter.lang = 'en-US';
  speechSynthesis.speak(utter);
  playSound('click');
};

document.getElementById('playPhonicsBtn').onclick = () => {
  const letters = currentWord.word.split('');
  let delay = 0;
  letters.forEach(l => {
    setTimeout(() => {
      const u = new SpeechSynthesisUtterance(l);
      u.lang = 'en-US';
      speechSynthesis.speak(u);
    }, delay);
    delay += 500;
  });
  playSound('click');
};