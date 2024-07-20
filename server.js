const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const stringSimilarity = require('string-similarity');
const fs = require('fs');
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let qaStore = {};

// Function to load QA Store from a local JSON file
function loadQAStore() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'qastore.json'), 'utf8');
    qaStore = JSON.parse(data);
  } catch (error) {
    console.error('Error reading qaStore:', error);
  }
}

// Load QA Store initially
loadQAStore();

// Endpoint to refresh QA Store (optional, can be used for updating QA Store without restarting the server)
app.get('/qastore', (req, res) => {
  loadQAStore();
  res.json(qaStore);
});

function preprocessQuestion(question) {
  return question.toLowerCase().trim();
}

function findClosestMatch(processedQuestion) {
  const questions = Object.keys(qaStore);
  const matches = stringSimilarity.findBestMatch(processedQuestion, questions);
  return matches.bestMatch;
}

app.post('/ask', (req, res) => {
  const question = req.body.question;
  const processedQuestion = preprocessQuestion(question);

  if (qaStore[processedQuestion]) {
    res.json({ answer: qaStore[processedQuestion] });
  } else {
    const bestMatch = findClosestMatch(processedQuestion);
    if (bestMatch.rating > 0.5) {
      res.json({ answer: qaStore[bestMatch.target] });
    } else if (processedQuestion.includes("workshop date") || processedQuestion.includes("upcoming workshop date") || processedQuestion.includes("available workshop date")) {
      const datesInColumn = qaStore.workshop_dates.map(date => `<li>${date}</li>`).join('');
      res.json({ answer: `Available workshop dates are:- <ul>${datesInColumn}</ul><br>For booking workshop, please <a class="anchor" href="http://example.com/workshop-booking" target="_blank">click here</a> to visit our workshop booking page.` });
    } else {
      res.json({ answer: "I don't understand that question. Please try asking something else." });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
