// Questions
const quiz = [
{ "question": "Hello", "answer": "Hallo (HAH-loh)" },
{ "question": "Good morning", "answer": "Guten Morgen (GOO-ten MOR-gen)" },
{ "question": "Good day", "answer": "Guten Tag (GOO-ten tahk)" },
{ "question": "Good evening", "answer": "Guten Abend (GOO-ten AH-bent)" },
{ "question": "Bye", "answer": "Tschüss (chooss)" },
{ "question": "Goodbye (formal)", "answer": "Auf Wiedersehen (owf VEE-der-zay-en)" },
{ "question": "How’s it going?", "answer": "Wie geht’s? (vee gayts)" },
{ "question": "I’m doing well", "answer": "Mir geht’s gut (meer gayts goot)" },
{ "question": "I’m not doing well", "answer": "Mir geht’s nicht gut (meer gayts nikht goot)" },
{ "question": "Nice to meet you", "answer": "Freut mich (froyt mikh)" },
{ "question": "Please / You’re welcome", "answer": "Bitte (BIT-uh)" },
{ "question": "Thank you", "answer": "Danke (DAHN-kuh)" },
{ "question": "Thanks a lot", "answer": "Vielen Dank (FEE-len dahnk)" },
{ "question": "No problem", "answer": "Kein Problem (kine proh-BLEM)" },
{ "question": "Excuse me / Sorry", "answer": "Entschuldigung (ent-SHOOL-dee-goong)" },
{ "question": "I’m sorry", "answer": "Tut mir leid (toot meer lite)" },
{ "question": "It’s all good", "answer": "Alles gut (AH-less goot)" },
{ "question": "You’re welcome  —Gern geschehen (gern guh-SHAY-en)" },
{ "question": "May I?", "answer": "Darf ich? (darf ikh)" },
{ "question": "No worries", "answer": "Kein Stress (kine stress)" },
{ "question": "I understand", "answer": "Ich verstehe (ikh fer-SHTAY-uh)" },
{ "question": "I don’t understand", "answer": "Ich verstehe nicht (ikh fer-SHTAY-uh nikht)" },
{ "question": "Can you repeat that?", "answer": "Kannst du das wiederholen?  (kahnst doo dahs VEE-der-hoh-len)" },
{ "question": "Do you speak English?", "answer": "Sprichst du Englisch? (shprikhst doo ENG-lish)" },
{ "question": "A little", "answer": "Ein bisschen (ine BISS-chen)" },
{ "question": "What do you mean?", "answer": "Was meinst du? (vahs mine-st doo)" },
{ "question": "I think so", "answer": "Ich glaube schon (ikh GLOW-buh shohn)" },
{ "question": "I don’t think so", "answer": "Ich glaube nicht (ikh GLOW-buh nikht)" },
{ "question": "Exactly", "answer": "Genau (geh-NOW)" },
{ "question": "That’s right", "answer": "Stimmt (shtimmt)" },
{ "question": "I need help", "answer": "Ich brauche Hilfe(ikh BROW-khuh HIL-fuh)" },
{ "question": "I am hungry", "answer": "Ich habe Hunger(ikh HAH-buh HOONG-er)" },
{ "question": "I am thirsty", "answer": "Ich habe Durst (ikh HAH-buh doorst)" },
{ "question": "I am tired", "answer": "Ich bin müde (ikh bin MYOO-duh)" },
{ "question": "I don’t have time", "answer": "Ich habe keine Zeit (ikh HAH-buh KINE-uh tsyt)" },
{ "question": "I’ll come later", "answer": "Ich komme später (ikh KOM-uh SHPAY-ter)" },
{ "question": "I’ll be right there", "answer": "Ich bin gleich da  (ikh bin glykh dah)" },
{ "question": "I’m leaving now", "answer": "Ich gehe jetzt  (ikh GAY-uh yetst)" },
{ "question": "Wait a moment", "answer": "Warte kurz (VAR-tuh koorts)" },
{ "question": "Come with me", "answer": "Komm mit (kom mit)" },
{ "question": "Where is that?", "answer": "Wo ist das? (voh ist dahs)" },
{ "question": "How much is that?", "answer": "Wie viel kostet das? (vee feel KOSS-tet dahs)" },
{ "question": "Can I have that?", "answer": "Kann ich das haben? (kahn ikh dahs HAH-ben)" },
{ "question": "What is that?", "answer": "Was ist das? (vahs ist dahs)" },
{ "question": "Why?", "answer": "Warum? (vah-ROOM)" },
{ "question": "When?", "answer": "Wann? (vahn)" },
{ "question": "How long?", "answer": "Wie lange? (vee LAHNG-uh)" },
{ "question": "Left", "answer": "Links (links)" },
{ "question": "Right", "answer": "Rechts (rekhts)" },
{ "question": "Straight ahead", "answer": "Geradeaus (geh-RAH-duh-ows)" }
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
