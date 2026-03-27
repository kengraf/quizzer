// Questions
const quiz = [
  { question: "What is the capital of France?", answer: "paris" },
  { question: "What is 2 plus 2?", answer: "4" },
  { question: "What color is the sky?", answer: "blue" }
];

let current = 0;

// UI elements
const questionEl = document.getElementById("question");
const statusEl = document.getElementById("status");
const transcriptEl = document.getElementById("transcript");
const resultEl = document.getElementById("result");
const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");

// Speech recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  alert("Speech recognition not supported in this browser.");
}

const recognition = new SpeechRecognition();
recognition.lang = "de";
recognition.interimResults = false;

// Show question
function loadQuestion() {
  const q = quiz[current];
  questionEl.textContent = q.question;
  transcriptEl.textContent = "";
  resultEl.textContent = "";
  nextBtn.style.display = "none";
}

loadQuestion();

// Start listening
startBtn.onclick = () => {
  statusEl.textContent = "🎤 Listening...";
  recognition.start();
};

// When speech is captured
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript.toLowerCase();
  transcriptEl.textContent = "You said: " + transcript;

  checkAnswer(transcript);
};

// When done
recognition.onend = () => {
  statusEl.textContent = "Stopped listening";
};

// Basic fuzzy match
function similarity(a, b) {
  let longer = a.length > b.length ? a : b;
  let shorter = a.length > b.length ? b : a;

  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) matches++;
  }

  return matches / longer.length;
}

// Check answer
function checkAnswer(userAnswer) {
  const correct = quiz[current].answer;

  const score = similarity(userAnswer, correct);

  if (score > 0.7) {
    resultEl.textContent = "✅ Correct!";
  } else {
    resultEl.textContent = "❌ Incorrect (Expected: " + correct + ")";
  }

  nextBtn.style.display = "inline-block";
}

// Next question
nextBtn.onclick = () => {
  current++;
  if (current >= quiz.length) {
    questionEl.textContent = "🎉 Quiz complete!";
    startBtn.style.display = "none";
    nextBtn.style.display = "none";
    return;
  }
  loadQuestion();
};
