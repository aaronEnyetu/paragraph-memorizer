// script.js
let originalParagraph = '';
let hiddenParagraph = '';
let words = [];
let hiddenIndices = [];
let currentWordIndex = 0;
let mcQuestions = [];
let mcAnswers = [];

function startQuiz() {
    const paragraph = document.getElementById('paragraph').value;
    const hidePattern = document.getElementById('hidePattern').value;
    const hideAmount = parseInt(document.getElementById('hideAmount').value, 10);
    const quizParagraph = document.getElementById('quizParagraph');
    const progressBar = document.getElementById('progressBar');
    const progress = document.getElementById('progress');
    const quizSection = document.getElementById('quizSection');
    const multipleChoice = document.getElementById('multipleChoice');
    const questionText = document.getElementById('questionText');
    const choicesDiv = document.getElementById('choices');
    
    if (paragraph.trim() === '') {
        alert('Please enter a paragraph.');
        return;
    }

    originalParagraph = paragraph;
    words = originalParagraph.split(/(\s+|\.\s+|\n|\,)/); // Split while preserving whitespace and punctuation

    if (hideAmount > words.length) {
        alert('Hide Amount is greater than the number of words available.');
        return;
    }

    hiddenIndices = generateRandomIndices(words.length, hideAmount);
    hiddenParagraph = hideText(words, hiddenIndices);
    mcQuestions = generateMultipleChoiceQuestions(words, hiddenIndices);
    mcAnswers = mcQuestions.map(q => q.correct);

    currentWordIndex = 0;

    quizParagraph.textContent = hiddenParagraph;
    progressBar.classList.remove('hidden');
    progress.style.width = '0%';
    
    multipleChoice.classList.remove('hidden');
    questionText.textContent = mcQuestions[0].question;
    choicesDiv.innerHTML = mcQuestions[0].choices.map((choice, index) => 
        `<label><input type="radio" name="choice" value="${index}"> ${choice}</label>`
    ).join('<br>');

    quizSection.classList.remove('hidden');
}

function generateRandomIndices(totalWords, count) {
    const indices = [];
    while (indices.length < count) {
        const randomIndex = Math.floor(Math.random() * totalWords);
        if (!indices.includes(randomIndex)) {
            indices.push(randomIndex);
        }
    }
    return indices;
}

function hideText(wordsArray, indicesToHide) {
    return wordsArray.map((word, index) => {
        return indicesToHide.includes(index) ? '_'.repeat(word.length) : word;
    }).join('');
}

function generateMultipleChoiceQuestions(wordsArray, indicesToHide) {
    return indicesToHide.map(index => {
        const correctAnswer = wordsArray[index];
        const choices = generateChoices(correctAnswer, wordsArray);
        return {
            question: `What was the word at position ${index + 1}?`,
            choices: choices,
            correct: correctAnswer
        };
    });
}

function generateChoices(correctAnswer, wordsArray) {
    const choices = [correctAnswer];
    while (choices.length < 4) {
        const randomWord = wordsArray[Math.floor(Math.random() * wordsArray.length)];
        if (randomWord && !choices.includes(randomWord)) {
            choices.push(randomWord);
        }
    }
    return choices.sort(() => Math.random() - 0.5); // Shuffle choices
}

function checkAnswer() {
    const userInput = document.getElementById('userInput').value;
    const feedback = document.getElementById('feedback');

    if (userInput.trim() === originalParagraph.trim()) {
        feedback.textContent = 'Correct! Well done.';
        feedback.style.color = 'green';
    } else {
        feedback.textContent = 'Try again! Make sure to match the paragraph exactly.';
        feedback.style.color = 'red';
    }
}

function checkMultipleChoice() {
    const selectedChoice = document.querySelector('input[name="choice"]:checked');
    const mcFeedback = document.getElementById('mcFeedback');
    
    if (selectedChoice) {
        const choiceIndex = parseInt(selectedChoice.value, 10);
        if (mcAnswers[currentWordIndex] === mcQuestions[currentWordIndex].choices[choiceIndex]) {
            mcFeedback.textContent = 'Correct!';
            mcFeedback.style.color = 'green';
        } else {
            mcFeedback.textContent = 'Incorrect. Try again.';
            mcFeedback.style.color = 'red';
        }

        currentWordIndex++;
        if (currentWordIndex < mcQuestions.length) {
            updateMultipleChoiceQuestion();
        } else {
            mcFeedback.textContent += ' Quiz completed!';
            document.getElementById('multipleChoice').classList.add('hidden');
        }
    } else {
        mcFeedback.textContent = 'Please select an answer.';
        mcFeedback.style.color = 'red';
    }
}

function updateMultipleChoiceQuestion() {
    const questionText = document.getElementById('questionText');
    const choicesDiv = document.getElementById('choices');

    questionText.textContent = mcQuestions[currentWordIndex].question;
    choicesDiv.innerHTML = mcQuestions[currentWordIndex].choices.map((choice, index) => 
        `<label><input type="radio" name="choice" value="${index}"> ${choice}</label>`
    ).join('<br>');
}

function revealNext() {
    const quizParagraph = document.getElementById('quizParagraph');
    const progress = document.getElementById('progress');
    const totalWords = words.length;
    
    if (currentWordIndex >= totalWords) {
        return;
    }

    let revealedText = '';
    for (let i = 0; i < totalWords; i++) {
        if (i <= currentWordIndex) {
            revealedText += words[i];
        } else {
            revealedText += hiddenParagraph.split(/(\s+|\.\s+|\n|\,)/)[i];
        }
    }

    currentWordIndex++;
    const progressPercent = (currentWordIndex / totalWords) * 100;
    progress.style.width = `${progressPercent}%`;
    quizParagraph.textContent = revealedText;
}
