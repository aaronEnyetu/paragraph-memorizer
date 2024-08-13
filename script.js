// script.js
function startQuiz() {
    const paragraph = document.getElementById('paragraph').value;
    const quizParagraph = document.getElementById('quizParagraph');
    const quizSection = document.getElementById('quizSection');
    
    if (paragraph.trim() === '') {
        alert('Please enter a paragraph.');
        return;
    }
    
    // Simple approach: hide a part of the paragraph
    const words = paragraph.split(' ');
    const hiddenWordIndex = Math.floor(Math.random() * words.length);
    words[hiddenWordIndex] = '____';
    quizParagraph.textContent = words.join(' ');

    quizSection.classList.remove('hidden');
}

function checkAnswer() {
    const paragraph = document.getElementById('paragraph').value;
    const userInput = document.getElementById('userInput').value;
    const feedback = document.getElementById('feedback');
    
    if (userInput.trim() === paragraph.trim()) {
        feedback.textContent = 'Correct! Well done.';
        feedback.style.color = 'green';
    } else {
        feedback.textContent = 'Try again! Make sure to match the paragraph exactly.';
        feedback.style.color = 'red';
    }
}
