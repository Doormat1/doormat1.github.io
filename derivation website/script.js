// Quiz State
let currentVideoIndex = 0;
let currentQuestionIndex = 0;
let userAnswers = [];
let quizSubmitted = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Videos loaded:', videos.length);
    if (videos.length > 0) {
        console.log('First video:', videos[0].title, 'ID:', videos[0].youtubeId);
    }
    loadVideosList();
});

// Load and display the list of videos
function loadVideosList() {
    const videosList = document.getElementById('videosList');
    videosList.innerHTML = '';

    if (!videos || videos.length === 0) {
        console.error('No videos found in data.js!');
        videosList.innerHTML = '<p style="color: red; padding: 10px;">No videos loaded. Check data.js</p>';
        return;
    }

    videos.forEach((video, index) => {
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';
        videoItem.innerHTML = `<span class="video-item-number">${index + 1}</span>${video.title}`;
        videoItem.onclick = () => selectVideo(index);
        videosList.appendChild(videoItem);
    });

    // Select the first video by default
    if (videos.length > 0) {
        selectVideo(0);
    }
}

// Select a video and load its content
function selectVideo(index) {
    if (index < 0 || index >= videos.length) return;

    currentVideoIndex = index;
    currentQuestionIndex = 0;
    userAnswers = [];
    quizSubmitted = false;

    // Update active state in sidebar
    document.querySelectorAll('.video-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    const video = videos[index];

    // Update video player with robust error handling
    const videoFrame = document.getElementById('videoFrame');
    
    if (!video.youtubeId) {
        console.error('No YouTube ID provided for video:', video.title);
        videoFrame.src = '';
        document.getElementById('videoTitle').textContent = 'Error: No video ID';
        document.getElementById('videoDescription').textContent = 'This video is missing a YouTube ID.';
        return;
    }

    // Clean video ID - remove any whitespace
    const cleanId = video.youtubeId.trim();
    
    // Validate it's 11 characters (YouTube video IDs are always 11 chars)
    if (cleanId.length !== 11) {
        console.error('Invalid YouTube video ID:', video.youtubeId, '- Length:', cleanId.length, '(expected 11)');
        videoFrame.src = '';
        document.getElementById('videoTitle').textContent = 'Error: Invalid Video ID';
        document.getElementById('videoDescription').textContent = `Video ID "${video.youtubeId}" has ${cleanId.length} characters. YouTube IDs must be exactly 11 characters.`;
        return;
    }

    // Check for invalid characters
    if (!/^[a-zA-Z0-9_-]{11}$/.test(cleanId)) {
        console.error('Invalid characters in YouTube video ID:', video.youtubeId);
        videoFrame.src = '';
        document.getElementById('videoTitle').textContent = 'Error: Invalid Characters';
        document.getElementById('videoDescription').textContent = `Video ID contains invalid characters. YouTube IDs can only contain letters, numbers, underscores, and hyphens.`;
        return;
    }

    // Build YouTube embed URL - now that embedding is enabled
    const embedUrl = `https://www.youtube.com/embed/${cleanId}`;
    console.log('Loading video:', video.title);
    console.log('Video ID:', cleanId);
    console.log('Embed URL:', embedUrl);
    
    videoFrame.src = embedUrl;

    // Update video info
    document.getElementById('videoTitle').textContent = video.title;
    document.getElementById('videoDescription').textContent = video.description;

    // Show quiz
    document.getElementById('noVideoMessage').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';

    // Reset quiz display
    document.getElementById('resultsContainer').style.display = 'none';
    document.getElementById('questionContainer').style.display = 'block';
    document.getElementById('optionsContainer').style.display = 'block';
    document.getElementById('feedbackContainer').style.display = 'none';

    // Initialize answers array for this video
    userAnswers = new Array(video.quiz.questions.length).fill(null);

    // Load first question
    loadQuestion(0);
}

// Load and display a question
function loadQuestion(index) {
    const video = videos[currentVideoIndex];
    const questions = video.quiz.questions;

    if (index < 0 || index >= questions.length) return;

    currentQuestionIndex = index;
    const question = questions[index];

    // Update question number
    document.getElementById('questionNumber').textContent = `Question ${index + 1}`;

    // Display question
    document.getElementById('questionContainer').innerHTML = question.question;

    // Display options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, optionIndex) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';

        const isSelected = userAnswers[index] === optionIndex;
        if (isSelected) optionDiv.classList.add('selected');

        if (quizSubmitted) {
            optionDiv.classList.add('disabled');
            if (option.isCorrect) {
                optionDiv.classList.add('correct');
            } else if (isSelected && !option.isCorrect) {
                optionDiv.classList.add('incorrect');
            }
        }

        const radioId = `option_${index}_${optionIndex}`;
        optionDiv.innerHTML = `
            <input type="radio" id="${radioId}" name="answer" value="${optionIndex}"
                ${isSelected ? 'checked' : ''}
                ${quizSubmitted ? 'disabled' : ''}>
            <label for="${radioId}" class="option-label">${option.text}</label>
        `;

        if (!quizSubmitted) {
            optionDiv.onclick = () => selectOption(index, optionIndex);
        }

        optionsContainer.appendChild(optionDiv);
    });

    // Show/hide feedback if quiz is submitted
    const feedbackContainer = document.getElementById('feedbackContainer');
    if (quizSubmitted) {
        const isCorrect = userAnswers[index] !== null && questions[index].options[userAnswers[index]].isCorrect;
        feedbackContainer.className = `feedback-container ${isCorrect ? 'correct' : 'incorrect'}`;
        feedbackContainer.innerHTML = isCorrect
            ? '✓ Correct! Well done!'
            : '✗ Incorrect. Try the quiz again to get it right.';
        feedbackContainer.style.display = 'block';
    } else {
        feedbackContainer.style.display = 'none';
    }

    // Update button visibility
    updateButtonStates();
}

// Select an answer option
function selectOption(questionIndex, optionIndex) {
    if (quizSubmitted) return;

    userAnswers[questionIndex] = optionIndex;
    loadQuestion(questionIndex); // Refresh to show selection
}

// Move to next question
function nextQuestion() {
    if (currentQuestionIndex < videos[currentVideoIndex].quiz.questions.length - 1) {
        loadQuestion(currentQuestionIndex + 1);
    }
}

// Move to previous question
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        loadQuestion(currentQuestionIndex - 1);
    }
}

// Submit the quiz
function submitQuiz() {
    quizSubmitted = true;
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('optionsContainer').style.display = 'none';
    document.getElementById('feedbackContainer').style.display = 'none';

    // Calculate score
    const video = videos[currentVideoIndex];
    const questions = video.quiz.questions;
    let correctAnswers = 0;

    questions.forEach((question, index) => {
        if (userAnswers[index] !== null && question.options[userAnswers[index]].isCorrect) {
            correctAnswers++;
        }
    });

    const percentage = Math.round((correctAnswers / questions.length) * 100);

    // Display results
    document.getElementById('scorePercentage').textContent = percentage + '%';

    let scoreMessage = '';
    if (percentage === 100) {
        scoreMessage = '🌟 Perfect Score! Outstanding work!';
    } else if (percentage >= 80) {
        scoreMessage = '👏 Great job! You really understood the material!';
    } else if (percentage >= 60) {
        scoreMessage = '📚 Good effort! Review the material and try again.';
    } else {
        scoreMessage = '💪 Keep practicing! Watch the video again and retry the quiz.';
    }

    document.getElementById('scoreMessage').textContent = scoreMessage + ` (${correctAnswers}/${questions.length} correct)`;

    // Build question breakdown
    const breakdown = document.getElementById('questionsBreakdown');
    breakdown.innerHTML = '<h4>Question Breakdown</h4>';
    questions.forEach((question, index) => {
        const answered = userAnswers[index] !== null;
        const isCorrect = answered && question.options[userAnswers[index]].isCorrect;
        const correctOption = question.options.find(o => o.isCorrect);
        const selectedOption = answered ? question.options[userAnswers[index]] : null;

        const item = document.createElement('div');
        item.className = `breakdown-item ${isCorrect ? 'breakdown-correct' : 'breakdown-incorrect'}`;
        item.innerHTML = `
            <div class="breakdown-question">
                <span class="breakdown-icon">${isCorrect ? '✓' : '✗'}</span>
                <strong>Q${index + 1}:</strong> ${question.question}
            </div>
            <div class="breakdown-answer">
                <span>Your answer: <em>${answered ? selectedOption.text : 'Not answered'}</em></span>
                ${!isCorrect ? `<span class="breakdown-correct-answer">Correct answer: <em>${correctOption.text}</em></span>` : ''}
            </div>
        `;
        breakdown.appendChild(item);
    });

    document.getElementById('resultsContainer').style.display = 'block';
}

// Retake the quiz
function retakeQuiz() {
    selectVideo(currentVideoIndex); // Reload the video and reset quiz
}

// Update button visibility
function updateButtonStates() {
    const video = videos[currentVideoIndex];
    const questionCount = video.quiz.questions.length;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    // Show/hide previous button
    prevBtn.style.display = currentQuestionIndex > 0 ? 'inline-block' : 'none';

    // Show/hide next button
    nextBtn.style.display = currentQuestionIndex < questionCount - 1 ? 'inline-block' : 'none';

    // Show/hide submit button
    submitBtn.style.display = currentQuestionIndex === questionCount - 1 && !quizSubmitted ? 'inline-block' : 'none';
}
