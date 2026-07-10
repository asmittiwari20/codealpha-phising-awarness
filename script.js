document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initQuiz();
});

function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  
  if (!navToggle || !mainNav) return;

  const toggleMenu = (shouldOpen) => {
    const isOpen = shouldOpen !== undefined ? shouldOpen : navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isOpen);
    mainNav.classList.toggle('open', !isOpen);
  };

  navToggle.addEventListener('click', () => toggleMenu());
  mainNav.querySelectorAll('.nav-link, .btn-cta').forEach(link => {
    link.addEventListener('click', () => toggleMenu(true));
  });
}
const QUIZ_DATA = [
  {
    question: "1. You receive an email from 'support@paypa1-secure.com' asking you to verify your account immediately. What should you do?",
    options: [
      "Click the link and enter your login details quickly",
      "Check the sender's domain carefully and avoid clicking the link",
      "Reply with your password to confirm your identity",
      "Forward it to friends to warn them"
    ],
    correct: 1,
    feedback: "The domain 'paypa1' uses a number '1' instead of the letter 'l' — a classic lookalike domain trick used in phishing."
  },
  {
    question: "2. Which of the following is the strongest sign of a phishing message?",
    options: [
      "A personalized greeting using your full name",
      "An email from a colleague you recognize",
      "Urgent language demanding immediate action within hours",
      "A message with no links or attachments"
    ],
    correct: 2,
    feedback: "Urgency is one of the most common social engineering tactics — it pressures you to act before you think."
  },
  {
    question: "3. A website has a padlock icon (HTTPS) in the address bar. What does this tell you?",
    options: [
      "The website is 100% safe and legitimate",
      "The connection is encrypted, but the site could still be fake",
      "The site is owned by a verified government body",
      "The site cannot contain malware"
    ],
    correct: 1,
    feedback: "HTTPS only encrypts the connection — scammers can get valid certificates too. Always check the actual domain name."
  },
  {
    question: "4. You get a call from someone claiming to be your bank, asking you to share the OTP you just received to 'cancel a fraudulent transaction'. What should you do?",
    options: [
      "Share the OTP immediately since it's your bank",
      "Hang up and call your bank directly using the number on your card",
      "Text the OTP instead of saying it out loud",
      "Ask them to call back in 10 minutes"
    ],
    correct: 1,
    feedback: "Banks never ask for your OTP over a call. Always verify by contacting your bank directly through official channels."
  },
  {
    question: "5. Which of these is the best way to strengthen your account security against phishing?",
    options: [
      "Use the same strong password across all accounts",
      "Disable email notifications",
      "Enable Two-Factor Authentication (2FA)",
      "Only use public Wi-Fi for banking"
    ],
    correct: 2,
    feedback: "2FA adds an extra layer of protection — even if a password is stolen, attackers still can't log in without the second factor."
  }
];

function initQuiz() {
  const container = document.getElementById('quizContainer');
  const resultPanel = document.getElementById('quizResult');
  const scoreText = document.getElementById('scoreText');
  const scoreMsg = document.getElementById('scoreMsg');
  const retryBtn = document.getElementById('retryBtn');

  if (!container || !resultPanel) return;

  let score = 0;
  let answeredCount = 0;

  function renderAssessment() {
    score = 0;
    answeredCount = 0;
    container.innerHTML = '';
    resultPanel.classList.add('hidden');

    const fragment = document.createDocumentFragment();

    QUIZ_DATA.forEach((data, qIndex) => {
      const qBlock = document.createElement('div');
      qBlock.className = 'quiz-question';
      
      const qTitle = document.createElement('h4');
      qTitle.textContent = data.question;
      qBlock.appendChild(qTitle);

      const optionsWrap = document.createElement('div');
      optionsWrap.className = 'quiz-options';

      const feedbackEl = document.createElement('div');
      feedbackEl.className = 'quiz-feedback';
      feedbackEl.setAttribute('aria-live', 'polite');
      feedbackEl.textContent = data.feedback;

      data.options.forEach((optionText, oIndex) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = optionText;
        btn.type = 'button';

        btn.addEventListener('click', () => {
          const allOptions = optionsWrap.querySelectorAll('.quiz-option');
          allOptions.forEach(opt => opt.disabled = true);

          if (oIndex === data.correct) {
            btn.classList.add('correct');
            score++;
          } else {
            btn.classList.add('incorrect');
            allOptions[data.correct].classList.add('correct');
          }

          feedbackEl.classList.add('show');
          answeredCount++;

          if (answeredCount === QUIZ_DATA.length) {
            evaluateFinalMetrics();
          }
        });

        optionsWrap.appendChild(btn);
      });

      qBlock.appendChild(optionsWrap);
      qBlock.appendChild(feedbackEl);
      fragment.appendChild(qBlock);
    });

    container.appendChild(fragment);
  }

  function evaluateFinalMetrics() {
    scoreText.textContent = `${score} / ${QUIZ_DATA.length}`;
    const targetPercentage = (score / QUIZ_DATA.length) * 100;
    let appraisal = '';

    if (targetPercentage === 100) {
      appraisal = "Perfect score! You've got a sharp eye for phishing red flags. 🛡️";
    } else if (targetPercentage >= 60) {
      appraisal = "Good job! Review the sections above to sharpen your detection skills further.";
    } else {
      appraisal = "Keep learning! Revisit the sections above — spotting phishing gets easier with practice.";
    }

    scoreMsg.textContent = appraisal;
    resultPanel.classList.remove('hidden');

    resultPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  retryBtn.addEventListener('click', renderAssessment);
  renderAssessment();
}