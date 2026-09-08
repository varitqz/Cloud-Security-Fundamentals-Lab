const labButtons = document.querySelectorAll(".lab-button");

const workspaceTitle =
  document.getElementById("workspaceTitle");

const workspaceStatus =
  document.getElementById("workspaceStatus");

const workspaceContent =
  document.getElementById("workspaceContent");

let signInEvents = [];
let roleAssignments = [];

let az900QuestionBank = [];
let activeQuestions = [];

/* =========================================================
   STORAGE KEYS
   ========================================================= */

const AZ900_ANSWERS_KEY =
  "csfl-cloud-answers";

const AZ900_WEAK_AREAS_KEY =
  "csfl-az900-weak-areas";

const AZ900_LAST_MODE_KEY =
  "csfl-az900-last-mode";

/* =========================================================
   PROGRESS SYSTEM
   ========================================================= */

const labProgressConfig = {
  lab01: {
    startedKey: "csfl-lab01-started",
    completedKey: "csfl-lab01-completed",
    statusElementId: "lab01Status"
  },

  lab02: {
    startedKey: "csfl-lab02-started",
    completedKey: "csfl-lab02-completed",
    statusElementId: "lab02Status"
  },

  lab03: {
    startedKey: "csfl-lab03-started",
    completedKey: "csfl-lab03-completed",
    statusElementId: "lab03Status"
  }
};

const progressStorageKeys = [
  "csfl-lab01-started",
  "csfl-lab01-completed",

  "csfl-lab02-started",
  "csfl-lab02-completed",

  "csfl-lab03-started",
  "csfl-lab03-completed",

  AZ900_ANSWERS_KEY,
  AZ900_WEAK_AREAS_KEY,
  AZ900_LAST_MODE_KEY,

  "csfl-identity-decision",
  "csfl-zero-trust-decision"
];

function markLabStarted(labId) {
  const config =
    labProgressConfig[labId];

  if (!config) {
    return;
  }

  localStorage.setItem(
    config.startedKey,
    "true"
  );

  updateProgressUI();
}

function markLabCompleted(labId) {
  const config =
    labProgressConfig[labId];

  if (!config) {
    return;
  }

  const alreadyCompleted =
    localStorage.getItem(
      config.completedKey
    ) === "true";

  localStorage.setItem(
    config.startedKey,
    "true"
  );

  localStorage.setItem(
    config.completedKey,
    "true"
  );

  updateProgressUI();

  if (!alreadyCompleted) {
    showSystemToast(
      `${labId.toUpperCase()} // COMPLETED`,
      "success"
    );
  }
}

function getLabProgressState(labId) {
  const config =
    labProgressConfig[labId];

  if (!config) {
    return "NOT STARTED";
  }

  const completed =
    localStorage.getItem(
      config.completedKey
    ) === "true";

  const started =
    localStorage.getItem(
      config.startedKey
    ) === "true";

  if (completed) {
    return "COMPLETED";
  }

  if (started) {
    return "IN PROGRESS";
  }

  return "NOT STARTED";
}

function updateProgressUI() {
  let completedLabs = 0;

  Object.entries(
    labProgressConfig
  ).forEach(([labId, config]) => {
    const state =
      getLabProgressState(labId);

    const statusElement =
      document.getElementById(
        config.statusElementId
      );

    if (statusElement) {
      applyProgressStatusStyle(
        statusElement,
        state
      );
    }

    if (state === "COMPLETED") {
      completedLabs++;
    }
  });

  const totalLabs =
    Object.keys(
      labProgressConfig
    ).length;

  const percentage =
    Math.round(
      (completedLabs / totalLabs) * 100
    );

  const completedElement =
    document.getElementById(
      "completedLabsCount"
    );

  const progressElement =
    document.getElementById(
      "overallProgress"
    );

  if (completedElement) {
    completedElement.textContent =
      `${completedLabs} / ${totalLabs}`;
  }

  if (progressElement) {
    progressElement.textContent =
      `${percentage}%`;

    if (percentage === 100) {
      progressElement.style.color =
        "var(--green)";
    } else if (percentage > 0) {
      progressElement.style.color =
        "var(--amber)";
    } else {
      progressElement.style.color = "";
    }
  }

  updateEnvironmentStatus(
    completedLabs,
    totalLabs
  );
}

function applyProgressStatusStyle(
  element,
  state
) {
  element.textContent =
    state;

  element.style.transition =
    "all 160ms ease";

  if (state === "COMPLETED") {
    element.style.color =
      "var(--green)";

    element.style.borderColor =
      "rgba(125, 255, 158, 0.32)";

    element.style.background =
      "rgba(125, 255, 158, 0.08)";

    return;
  }

  if (state === "IN PROGRESS") {
    element.style.color =
      "var(--amber)";

    element.style.borderColor =
      "rgba(255, 191, 95, 0.3)";

    element.style.background =
      "rgba(255, 191, 95, 0.06)";

    return;
  }

  element.style.color =
    "#647168";

  element.style.borderColor =
    "rgba(125, 255, 158, 0.1)";

  element.style.background =
    "rgba(125, 255, 158, 0.02)";
}

function updateEnvironmentStatus(
  completedLabs,
  totalLabs
) {
  const statusCard =
    document.querySelector(
      ".status-card"
    );

  if (!statusCard) {
    return;
  }

  const statusTitle =
    statusCard.querySelector(
      "strong"
    );

  const statusText =
    statusCard.querySelector(
      "p"
    );

  if (
    completedLabs === totalLabs
  ) {
    if (statusTitle) {
      statusTitle.textContent =
        "Training Complete";
    }

    if (statusText) {
      statusText.textContent =
        "All local labs completed";
    }
  } else {
    if (statusTitle) {
      statusTitle.textContent =
        "Local Lab Environment";
    }

    if (statusText) {
      statusText.textContent =
        "Progress stored locally";
    }
  }
}

/* =========================================================
   RESET PROGRESS
   ========================================================= */

function initializeProgressControls() {
  const statusCard =
    document.querySelector(
      ".status-card"
    );

  if (!statusCard) {
    return;
  }

  if (
    document.getElementById(
      "resetProgressBtn"
    )
  ) {
    return;
  }

  const resetButton =
    document.createElement(
      "button"
    );

  resetButton.id =
    "resetProgressBtn";

  resetButton.type =
    "button";

  resetButton.textContent =
    "RESET";

  resetButton.style.marginLeft =
    "auto";

  resetButton.style.padding =
    "7px 10px";

  resetButton.style.border =
    "1px solid rgba(255,95,104,.2)";

  resetButton.style.background =
    "rgba(255,95,104,.04)";

  resetButton.style.color =
    "#a9787b";

  resetButton.style.fontFamily =
    "inherit";

  resetButton.style.fontSize =
    "8px";

  resetButton.style.fontWeight =
    "800";

  resetButton.style.cursor =
    "pointer";

  resetButton.addEventListener(
    "click",
    resetAllProgress
  );

  statusCard.appendChild(
    resetButton
  );
}

function resetAllProgress() {
  const confirmed =
    window.confirm(
      "Reset all Cloud Security Lab progress?\n\nSaved answers, weak areas and analyst decisions will be removed."
    );

  if (!confirmed) {
    return;
  }

  progressStorageKeys.forEach(
    (key) => {
      localStorage.removeItem(
        key
      );
    }
  );

  activeQuestions = [];

  workspaceTitle.textContent =
    "Select a Lab";

  workspaceStatus.textContent =
    "Waiting for selection";

  workspaceContent.innerHTML = `
    <p>
      Progress reset complete.
      Select a lab to begin again.
    </p>
  `;

  updateProgressUI();

  showSystemToast(
    "PROGRESS // RESET COMPLETE",
    "warning"
  );
}

/* =========================================================
   SYSTEM TOAST
   ========================================================= */

function showSystemToast(
  message,
  type = "success"
) {
  const oldToast =
    document.getElementById(
      "csflSystemToast"
    );

  if (oldToast) {
    oldToast.remove();
  }

  const toast =
    document.createElement(
      "div"
    );

  toast.id =
    "csflSystemToast";

  toast.textContent =
    message;

  toast.style.position =
    "fixed";

  toast.style.left =
    "50%";

  toast.style.bottom =
    "28px";

  toast.style.transform =
    "translateX(-50%)";

  toast.style.zIndex =
    "5000";

  toast.style.padding =
    "12px 18px";

  toast.style.background =
    "#030604";

  toast.style.border =
    type === "warning"
      ? "1px solid rgba(255,191,95,.35)"
      : "1px solid rgba(125,255,158,.35)";

  toast.style.color =
    type === "warning"
      ? "var(--amber)"
      : "var(--green)";

  toast.style.fontFamily =
    "inherit";

  toast.style.fontSize =
    "10px";

  toast.style.fontWeight =
    "800";

  document.body.appendChild(
    toast
  );

  setTimeout(
    () => {
      toast.remove();
    },
    2500
  );
}

/* =========================================================
   QUESTION BANK LOADER
   ========================================================= */

async function loadQuestionBank(
  certification
) {
  let path = "";

  if (
    certification === "AZ-900"
  ) {
    path =
      "data/questions/az900.json";
  }

  if (
    certification === "SC-900"
  ) {
    path =
      "data/questions/sc900.json";
  }

  if (!path) {
    throw new Error(
      "Unknown certification."
    );
  }

  const response =
    await fetch(path);

  if (!response.ok) {
    throw new Error(
      `${certification} question bank could not be loaded.`
    );
  }

  const questions =
    await response.json();

  if (
    !Array.isArray(questions)
  ) {
    throw new Error(
      `${certification} question bank has an invalid format.`
    );
  }

  return questions;
}

/* =========================================================
   LAB SELECTION
   ========================================================= */

labButtons.forEach(
  (button) => {
    button.addEventListener(
      "click",
      () => {
        const selectedLab =
          button.dataset.lab;

        if (
          selectedLab ===
          "cloud-basics"
        ) {
          markLabStarted(
            "lab01"
          );

          renderCloudBasicsLab();
        }

        if (
          selectedLab ===
          "identity-access"
        ) {
          markLabStarted(
            "lab02"
          );

          renderIdentityLab();
        }

        if (
          selectedLab ===
          "zero-trust"
        ) {
          markLabStarted(
            "lab03"
          );

          renderZeroTrustLab();
        }

        workspaceContent.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    );
  }
);

/* =========================================================
   LAB 01 - AZ-900 HUB
   ========================================================= */

async function renderCloudBasicsLab() {
  workspaceTitle.textContent =
    "LAB 01 // AZ-900 Training";

  workspaceStatus.textContent =
    "QUESTION BANK LOADING";

  workspaceContent.innerHTML = `
    <div class="loading-state">

      <span class="terminal-prompt">
        root@csfl:~$
      </span>

      loading data/questions/az900.json...

    </div>
  `;

  try {
    az900QuestionBank =
      await loadQuestionBank(
        "AZ-900"
      );

    if (
      az900QuestionBank.length === 0
    ) {
      throw new Error(
        "AZ-900 question bank is empty."
      );
    }

    renderAz900TrainingHub();
  } catch (error) {
    workspaceStatus.textContent =
      "QUESTION BANK ERROR";

    workspaceContent.innerHTML = `
      <div class="error-box">

        <strong>
          AZ-900 QUESTION BANK LOAD FAILED
        </strong>

        <p>
          ${escapeHtml(
            error.message
          )}
        </p>

        <p>
          Check:
          data/questions/az900.json
        </p>

      </div>
    `;
  }
}

/* =========================================================
   AZ-900 TRAINING HUB
   ========================================================= */

function renderAz900TrainingHub() {
  workspaceTitle.textContent =
    "LAB 01 // AZ-900 Training";

  workspaceStatus.textContent =
    "SELECT TRAINING MODE";

  activeQuestions = [];

  const domains =
    getAz900Domains();

  const weakAreas =
    getWeakAreaIds();

  const lastMode =
    localStorage.getItem(
      AZ900_LAST_MODE_KEY
    ) || "NONE";

  workspaceContent.innerHTML = `
    <div class="investigation-layout">

      <section class="case-panel">

        <div class="case-header">

          <div>
            <span class="case-id">
              TRAINING ENGINE // AZ-900
            </span>

            <h3>
              Azure Fundamentals Practice
            </h3>
          </div>

          <span class="severity-badge">
            QUESTION BANK
          </span>

        </div>

        <p>
          Select a training mode.
          Questions are loaded dynamically from
          the local AZ-900 question bank.
        </p>

        <div class="case-indicators">

          ${domains
            .map(
              (domain) => `
                <span>
                  ${escapeHtml(domain)}
                </span>
              `
            )
            .join("")}

        </div>

      </section>

      <section class="investigation-stats">

        <div>
          <span>QUESTION BANK</span>

          <strong>
            ${az900QuestionBank.length}
          </strong>
        </div>

        <div>
          <span>DOMAINS</span>

          <strong>
            ${domains.length}
          </strong>
        </div>

        <div>
          <span>WEAK AREAS</span>

          <strong>
            ${weakAreas.length}
          </strong>
        </div>

        <div>
          <span>LAST MODE</span>

          <strong>
            ${escapeHtml(lastMode)}
          </strong>
        </div>

      </section>

      <section class="event-console">

        <div class="console-header">

          <div>
            <span class="terminal-prompt">
              root@csfl:~$
            </span>

            select training-mode
          </div>

        </div>

        <div class="workspace-content">

          <h3>
            Quick Practice
          </h3>

          <p>
            Up to 10 random questions
            from the full AZ-900 bank.
          </p>

          <div class="decision-actions">
            <button id="startQuickPracticeBtn">
              Start 10 Questions
            </button>
          </div>

        </div>

      </section>

      <section class="event-console">

        <div class="console-header">

          <div>
            <span class="terminal-prompt">
              root@csfl:~$
            </span>

            study-session
          </div>

        </div>

        <div class="workspace-content">

          <h3>
            Study Session
          </h3>

          <p>
            Up to 20 random questions
            for a longer learning block.
          </p>

          <div class="decision-actions">
            <button id="startStudySessionBtn">
              Start 20 Questions
            </button>
          </div>

        </div>

      </section>

      <section class="event-console">

        <div class="console-header">

          <div>
            <span class="terminal-prompt">
              root@csfl:~$
            </span>

            full-block
          </div>

        </div>

        <div class="workspace-content">

          <h3>
            Full Block
          </h3>

          <p>
            Up to 50 random questions.
            This will become the main exam-style
            training mode once the bank contains
            50+ questions.
          </p>

          <div class="decision-actions">
            <button id="startFullBlockBtn">
              Start 50 Questions
            </button>
          </div>

        </div>

      </section>

      <section class="event-console">

        <div class="console-header">

          <div>
            <span class="terminal-prompt">
              root@csfl:~$
            </span>

            domain-practice
          </div>

          <select id="domainPracticeSelect">

            ${domains
              .map(
                (domain) => `
                  <option value="${escapeHtml(domain)}">
                    ${escapeHtml(domain)}
                  </option>
                `
              )
              .join("")}

          </select>

        </div>

        <div class="workspace-content">

          <h3>
            Domain Practice
          </h3>

          <p>
            Practice only questions from
            one AZ-900 domain.
          </p>

          <div class="decision-actions">
            <button id="startDomainPracticeBtn">
              Start Domain
            </button>
          </div>

        </div>

      </section>

      <section class="event-console">

        <div class="console-header">

          <div>
            <span class="terminal-prompt">
              root@csfl:~$
            </span>

            weak-areas
          </div>

        </div>

        <div class="workspace-content">

          <h3>
            Weak Areas
          </h3>

          <p>
            Retry questions that you previously
            answered incorrectly.
          </p>

          <p>
            Current weak-area questions:
            <strong>
              ${weakAreas.length}
            </strong>
          </p>

          <div class="decision-actions">
            <button id="startWeakAreasBtn">
              Retry Weak Areas
            </button>

            <button id="clearWeakAreasBtn">
              Clear Weak Areas
            </button>
          </div>

        </div>

      </section>

    </div>
  `;

  document
    .getElementById(
      "startQuickPracticeBtn"
    )
    .addEventListener(
      "click",
      () => {
        startAz900Practice(
          "QUICK",
          10
        );
      }
    );

  document
    .getElementById(
      "startStudySessionBtn"
    )
    .addEventListener(
      "click",
      () => {
        startAz900Practice(
          "STUDY",
          20
        );
      }
    );

  document
    .getElementById(
      "startFullBlockBtn"
    )
    .addEventListener(
      "click",
      () => {
        startAz900Practice(
          "FULL",
          50
        );
      }
    );

  document
    .getElementById(
      "startDomainPracticeBtn"
    )
    .addEventListener(
      "click",
      startDomainPractice
    );

  document
    .getElementById(
      "startWeakAreasBtn"
    )
    .addEventListener(
      "click",
      startWeakAreaPractice
    );

  document
    .getElementById(
      "clearWeakAreasBtn"
    )
    .addEventListener(
      "click",
      clearWeakAreas
    );
}

/* =========================================================
   AZ-900 MODES
   ========================================================= */

function startAz900Practice(
  mode,
  requestedCount
) {
  localStorage.removeItem(
    AZ900_ANSWERS_KEY
  );

  localStorage.setItem(
    AZ900_LAST_MODE_KEY,
    mode
  );

  const shuffled =
    shuffleArray(
      az900QuestionBank
    );

  const actualCount =
    Math.min(
      requestedCount,
      shuffled.length
    );

  activeQuestions =
    shuffled.slice(
      0,
      actualCount
    );

  renderAz900PracticeSession(
    mode,
    requestedCount
  );
}

function startDomainPractice() {
  const select =
    document.getElementById(
      "domainPracticeSelect"
    );

  const selectedDomain =
    select.value;

  const domainQuestions =
    az900QuestionBank.filter(
      (question) =>
        question.domain ===
        selectedDomain
    );

  if (
    domainQuestions.length === 0
  ) {
    showSystemToast(
      "DOMAIN // NO QUESTIONS FOUND",
      "warning"
    );

    return;
  }

  localStorage.removeItem(
    AZ900_ANSWERS_KEY
  );

  localStorage.setItem(
    AZ900_LAST_MODE_KEY,
    "DOMAIN"
  );

  activeQuestions =
    shuffleArray(
      domainQuestions
    );

  renderAz900PracticeSession(
    `DOMAIN // ${selectedDomain}`,
    activeQuestions.length
  );
}

function startWeakAreaPractice() {
  const weakIds =
    getWeakAreaIds();

  if (
    weakIds.length === 0
  ) {
    showSystemToast(
      "WEAK AREAS // NONE RECORDED",
      "warning"
    );

    return;
  }

  const weakQuestions =
    az900QuestionBank.filter(
      (question) =>
        weakIds.includes(
          question.id
        )
    );

  if (
    weakQuestions.length === 0
  ) {
    showSystemToast(
      "WEAK AREAS // QUESTIONS NOT FOUND",
      "warning"
    );

    return;
  }

  localStorage.removeItem(
    AZ900_ANSWERS_KEY
  );

  localStorage.setItem(
    AZ900_LAST_MODE_KEY,
    "WEAK AREAS"
  );

  activeQuestions =
    shuffleArray(
      weakQuestions
    );

  renderAz900PracticeSession(
    "WEAK AREAS",
    activeQuestions.length
  );
}

function clearWeakAreas() {
  localStorage.removeItem(
    AZ900_WEAK_AREAS_KEY
  );

  showSystemToast(
    "WEAK AREAS // CLEARED",
    "warning"
  );

  renderAz900TrainingHub();
}

/* =========================================================
   AZ-900 PRACTICE SESSION
   ========================================================= */

function renderAz900PracticeSession(
  mode,
  requestedCount
) {
  workspaceTitle.textContent =
    `LAB 01 // ${mode}`;

  workspaceStatus.textContent =
    "TRAINING ACTIVE";

  const availableNotice =
    activeQuestions.length <
    requestedCount
      ? `${activeQuestions.length} available / ${requestedCount} requested`
      : `${activeQuestions.length} questions`;

  workspaceContent.innerHTML = `
    <div class="investigation-layout">

      <section class="case-panel">

        <div class="case-header">

          <div>

            <span class="case-id">
              AZ-900 // ${escapeHtml(mode)}
            </span>

            <h3>
              Azure Fundamentals Training Session
            </h3>

          </div>

          <span class="severity-badge">
            ${escapeHtml(
              availableNotice.toUpperCase()
            )}
          </span>

        </div>

        <p>
          Complete the session and submit
          your answers for scoring.
        </p>

        <p>
          Local training pass threshold:
          <strong>80%</strong>.
          This is a project training threshold,
          not Microsoft's exam scoring formula.
        </p>

      </section>

      <section class="investigation-stats">

        <div>
          <span>SESSION QUESTIONS</span>

          <strong>
            ${activeQuestions.length}
          </strong>
        </div>

        <div>
          <span>ANSWERED</span>

          <strong id="cloudAnsweredCount">
            0
          </strong>
        </div>

        <div>
          <span>CORRECT</span>

          <strong id="cloudCorrectCount">
            0
          </strong>
        </div>

        <div>
          <span>SCORE</span>

          <strong id="cloudScore">
            0%
          </strong>
        </div>

      </section>

      <div id="cloudQuestionContainer">
      </div>

      <section class="decision-panel">

        <span class="panel-label">
          SESSION CONTROL
        </span>

        <div class="decision-actions">

          <button id="checkCloudAnswersBtn">
            Check Answers
          </button>

          <button id="restartSessionBtn">
            Restart Session
          </button>

          <button id="backToModesBtn">
            Training Modes
          </button>

        </div>

        <div id="cloudChallengeStatus">
        </div>

      </section>

    </div>
  `;

  renderActiveQuestions();

  document
    .getElementById(
      "checkCloudAnswersBtn"
    )
    .addEventListener(
      "click",
      checkAz900Answers
    );

  document
    .getElementById(
      "restartSessionBtn"
    )
    .addEventListener(
      "click",
      restartCurrentAz900Session
    );

  document
    .getElementById(
      "backToModesBtn"
    )
    .addEventListener(
      "click",
      renderAz900TrainingHub
    );
}

function renderActiveQuestions() {
  const container =
    document.getElementById(
      "cloudQuestionContainer"
    );

  container.innerHTML =
    activeQuestions
      .map(
        (question, index) => {
          const options =
            question.options
              .map(
                (option) => `
                  <option
                    value="${escapeHtml(option)}"
                  >
                    ${escapeHtml(option)}
                  </option>
                `
              )
              .join("");

          return `
            <section class="event-console">

              <div class="console-header">

                <div>

                  <span class="terminal-prompt">
                    ${String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )} //
                  </span>

                  ${escapeHtml(
                    question.topic
                  )}

                  [
                  ${escapeHtml(
                    question.difficulty.toUpperCase()
                  )}
                  ]

                </div>

                <select
                  id="${escapeHtml(
                    question.id
                  )}"
                  class="cloud-answer"
                >

                  <option value="">
                    Select answer...
                  </option>

                  ${options}

                </select>

              </div>

              <div class="workspace-content">

                <p>
                  ${escapeHtml(
                    question.question
                  )}
                </p>

                <p class="eyebrow">
                  ${escapeHtml(
                    question.domain
                  )}
                </p>

              </div>

              <div
                id="${escapeHtml(
                  question.id
                )}-feedback"
                class="task-item hidden"
              >
              </div>

            </section>
          `;
        }
      )
      .join("");

  document
    .querySelectorAll(
      ".cloud-answer"
    )
    .forEach(
      (select) => {
        select.addEventListener(
          "change",
          handleAz900AnswerChange
        );
      }
    );
}

/* =========================================================
   AZ-900 ANSWERS
   ========================================================= */

function handleAz900AnswerChange() {
  updateAz900AnsweredCount();
  saveAz900SessionAnswers();
}

function updateAz900AnsweredCount() {
  const selects = [
    ...document.querySelectorAll(
      ".cloud-answer"
    )
  ];

  const answered =
    selects.filter(
      (select) =>
        select.value !== ""
    ).length;

  const element =
    document.getElementById(
      "cloudAnsweredCount"
    );

  if (element) {
    element.textContent =
      answered;
  }
}

function saveAz900SessionAnswers() {
  const answers = {};

  activeQuestions.forEach(
    (question) => {
      const select =
        document.getElementById(
          question.id
        );

      if (select) {
        answers[
          question.id
        ] = select.value;
      }
    }
  );

  localStorage.setItem(
    AZ900_ANSWERS_KEY,
    JSON.stringify(
      answers
    )
  );
}

function checkAz900Answers() {
  let correct = 0;
  let answered = 0;

  const weakAreas =
    new Set(
      getWeakAreaIds()
    );

  activeQuestions.forEach(
    (question) => {
      const select =
        document.getElementById(
          question.id
        );

      const feedback =
        document.getElementById(
          `${question.id}-feedback`
        );

      const selected =
        select.value;

      if (
        selected !== ""
      ) {
        answered++;
      }

      if (
        selected ===
        question.answer
      ) {
        correct++;

        weakAreas.delete(
          question.id
        );

        feedback.innerHTML = `
          <span class="event-success">
            CORRECT
          </span>

          <p>
            ${escapeHtml(
              question.explanation
            )}
          </p>
        `;
      } else if (
        selected === ""
      ) {
        feedback.innerHTML = `
          <span class="event-failed">
            UNANSWERED
          </span>

          <p>
            Select an answer before
            submitting the session.
          </p>
        `;
      } else {
        weakAreas.add(
          question.id
        );

        feedback.innerHTML = `
          <span class="event-failed">
            INCORRECT
          </span>

          <p>
            Correct answer:
            <strong>
              ${escapeHtml(
                question.answer
              )}
            </strong>
          </p>

          <p>
            ${escapeHtml(
              question.explanation
            )}
          </p>
        `;
      }

      feedback.classList.remove(
        "hidden"
      );
    }
  );

  saveAz900SessionAnswers();

  saveWeakAreaIds(
    [...weakAreas]
  );

  const score =
    Math.round(
      (
        correct /
        activeQuestions.length
      ) * 100
    );

  document.getElementById(
    "cloudAnsweredCount"
  ).textContent =
    answered;

  document.getElementById(
    "cloudCorrectCount"
  ).textContent =
    correct;

  document.getElementById(
    "cloudScore"
  ).textContent =
    `${score}%`;

  const status =
    document.getElementById(
      "cloudChallengeStatus"
    );

  if (
    answered <
    activeQuestions.length
  ) {
    status.textContent =
      `INCOMPLETE // ${answered}/${activeQuestions.length} questions answered.`;

    status.className =
      "decision-error";

    return;
  }

  if (
    score >= 80
  ) {
    status.textContent =
      `PASSED // ${correct}/${activeQuestions.length} correct (${score}%).`;

    status.className =
      "decision-success";

    markLabCompleted(
      "lab01"
    );

    return;
  }

  status.textContent =
    `REVIEW REQUIRED // ${correct}/${activeQuestions.length} correct (${score}%). Weak areas updated.`;

  status.className =
    "decision-error";
}

function restartCurrentAz900Session() {
  localStorage.removeItem(
    AZ900_ANSWERS_KEY
  );

  activeQuestions =
    shuffleArray(
      activeQuestions
    );

  renderAz900PracticeSession(
    localStorage.getItem(
      AZ900_LAST_MODE_KEY
    ) || "PRACTICE",
    activeQuestions.length
  );

  showSystemToast(
    "AZ-900 // SESSION RESTARTED",
    "warning"
  );
}

/* =========================================================
   WEAK AREAS
   ========================================================= */

function getWeakAreaIds() {
  const raw =
    localStorage.getItem(
      AZ900_WEAK_AREAS_KEY
    );

  if (!raw) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(raw);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    localStorage.removeItem(
      AZ900_WEAK_AREAS_KEY
    );

    return [];
  }
}

function saveWeakAreaIds(ids) {
  const uniqueIds =
    [...new Set(ids)];

  localStorage.setItem(
    AZ900_WEAK_AREAS_KEY,
    JSON.stringify(
      uniqueIds
    )
  );
}

function getAz900Domains() {
  return [
    ...new Set(
      az900QuestionBank
        .map(
          (question) =>
            question.domain
        )
        .filter(Boolean)
    )
  ];
}

/* =========================================================
   LAB 02 - IDENTITY & ACCESS
   ========================================================= */

async function renderIdentityLab() {
  workspaceTitle.textContent =
    "LAB 02 // Identity & Access Review";

  workspaceStatus.textContent =
    "ACCESS REVIEW ACTIVE";

  workspaceContent.innerHTML = `
    <div class="loading-state">

      <span class="terminal-prompt">
        root@csfl:~$
      </span>

      loading role-assignments.csv...

    </div>
  `;

  try {
    const response =
      await fetch(
        "labs/02-identity-and-access/role-assignments.csv"
      );

    if (!response.ok) {
      throw new Error(
        "Identity dataset could not be loaded."
      );
    }

    roleAssignments =
      parseCsv(
        await response.text()
      );

    renderIdentityWorkspace(
      roleAssignments
    );
  } catch (error) {
    workspaceContent.innerHTML = `
      <div class="error-box">

        <strong>
          IDENTITY DATASET LOAD FAILED
        </strong>

        <p>
          ${escapeHtml(
            error.message
          )}
        </p>

      </div>
    `;
  }
}

function renderIdentityWorkspace(
  assignments
) {
  workspaceContent.innerHTML = `
    <div class="investigation-layout">

      <section class="case-panel">

        <div class="case-header">

          <div>
            <span class="case-id">
              CASE // IAM-002
            </span>

            <h3>
              Privileged Access Review
            </h3>
          </div>

          <span class="severity-badge">
            ACCESS REVIEW
          </span>

        </div>

        <p>
          Review synthetic Azure and Microsoft Entra
          role assignments and identify excessive
          privileges and least-privilege violations.
        </p>

        <div class="case-indicators">
          <span>Privileged Roles</span>
          <span>Least Privilege</span>
          <span>MFA</span>
          <span>Unexpected Access</span>
        </div>

      </section>

      <section class="investigation-stats">

        <div>
          <span>TOTAL ASSIGNMENTS</span>
          <strong id="totalAssignments">0</strong>
        </div>

        <div>
          <span>PRIVILEGED</span>
          <strong id="privilegedAssignments">0</strong>
        </div>

        <div>
          <span>UNEXPECTED</span>
          <strong id="unexpectedAssignments">0</strong>
        </div>

        <div>
          <span>HIGH / CRITICAL</span>
          <strong id="dangerousAssignments">0</strong>
        </div>

      </section>

      <section class="event-console">

        <div class="console-header">

          <div>
            <span class="terminal-prompt">
              root@csfl:~$
            </span>

            inspect role-assignments.csv
          </div>

          <select id="identityFilter">

            <option value="all">
              All Assignments
            </option>

            <option value="privileged">
              Privileged Access
            </option>

            <option value="unexpected">
              Unexpected Access
            </option>

            <option value="no-mfa">
              MFA Disabled
            </option>

            <option value="dangerous">
              High / Critical Risk
            </option>

          </select>

        </div>

        <div class="table-wrapper">

          <table class="event-table">

            <thead>
              <tr>
                <th>USER</th>
                <th>JOB ROLE</th>
                <th>ASSIGNED ROLE</th>
                <th>SCOPE</th>
                <th>MFA</th>
                <th>PRIVILEGED</th>
                <th>EXPECTED</th>
                <th>RISK</th>
              </tr>
            </thead>

            <tbody
              id="identityTableBody"
            ></tbody>

          </table>

        </div>

      </section>

      <section class="investigation-bottom">

        <div class="tasks-panel">

          <span class="panel-label">
            ACCESS REVIEW TASKS
          </span>

          <label>
            <input type="checkbox" />
            Identify privileged assignments.
          </label>

          <label>
            <input type="checkbox" />
            Find unexpected access.
          </label>

          <label>
            <input type="checkbox" />
            Identify privileged accounts without MFA.
          </label>

          <label>
            <input type="checkbox" />
            Determine the highest-risk assignment.
          </label>

        </div>

        <div class="decision-panel">

          <span class="panel-label">
            ANALYST ACCESS REVIEW
          </span>

          <textarea
            id="identityDecision"
            tabindex="0"
            placeholder="Highest-risk assignment:
Reason:
Recommended action:
Additional checks:"
          ></textarea>

          <div class="decision-actions">

            <button
              id="saveIdentityDecisionBtn"
            >
              Save Decision
            </button>

            <button
              id="revealIdentityFindingBtn"
            >
              Reveal Expected Finding
            </button>

          </div>

          <div
            id="identityDecisionStatus"
          ></div>

        </div>

      </section>

      <section
        id="identityExpectedFinding"
        class="expected-finding hidden"
      >

        <span class="panel-label">
          EXPECTED FINDING
        </span>

        <h3>
          Tom Weber has the highest-risk assignment.
        </h3>

        <p>
          Helpdesk Technician,
          Global Administrator,
          tenant scope and MFA disabled.
        </p>

      </section>

    </div>
  `;

  updateIdentityStats(
    assignments
  );

  renderIdentityTable(
    assignments
  );

  const textarea =
    document.getElementById(
      "identityDecision"
    );

  textarea.disabled =
    false;

  textarea.readOnly =
    false;

  textarea.style.pointerEvents =
    "auto";

  textarea.style.position =
    "relative";

  textarea.style.zIndex =
    "20";

  textarea.style.userSelect =
    "text";

  document
    .getElementById(
      "identityFilter"
    )
    .addEventListener(
      "change",
      handleIdentityFilter
    );

  document
    .getElementById(
      "saveIdentityDecisionBtn"
    )
    .addEventListener(
      "click",
      saveIdentityDecision
    );

  document
    .getElementById(
      "revealIdentityFindingBtn"
    )
    .addEventListener(
      "click",
      revealIdentityFinding
    );

  loadSavedIdentityDecision();
}

function updateIdentityStats(
  assignments
) {
  const privileged =
    assignments.filter(
      (item) =>
        item.Privileged ===
        "true"
    );

  const unexpected =
    assignments.filter(
      (item) =>
        item.ExpectedAccess ===
        "false"
    );

  const dangerous =
    assignments.filter(
      (item) =>
        item.RiskLevel ===
          "high" ||
        item.RiskLevel ===
          "critical"
    );

  document.getElementById(
    "totalAssignments"
  ).textContent =
    assignments.length;

  document.getElementById(
    "privilegedAssignments"
  ).textContent =
    privileged.length;

  document.getElementById(
    "unexpectedAssignments"
  ).textContent =
    unexpected.length;

  document.getElementById(
    "dangerousAssignments"
  ).textContent =
    dangerous.length;
}

function handleIdentityFilter(
  event
) {
  let filtered =
    [...roleAssignments];

  const filter =
    event.target.value;

  if (
    filter === "privileged"
  ) {
    filtered =
      roleAssignments.filter(
        (item) =>
          item.Privileged ===
          "true"
      );
  }

  if (
    filter === "unexpected"
  ) {
    filtered =
      roleAssignments.filter(
        (item) =>
          item.ExpectedAccess ===
          "false"
      );
  }

  if (
    filter === "no-mfa"
  ) {
    filtered =
      roleAssignments.filter(
        (item) =>
          item.MFAEnabled ===
          "false"
      );
  }

  if (
    filter === "dangerous"
  ) {
    filtered =
      roleAssignments.filter(
        (item) =>
          item.RiskLevel ===
            "high" ||
          item.RiskLevel ===
            "critical"
      );
  }

  renderIdentityTable(
    filtered
  );
}

function renderIdentityTable(
  assignments
) {
  const tableBody =
    document.getElementById(
      "identityTableBody"
    );

  tableBody.innerHTML =
    assignments
      .map(
        (assignment) => {
          const mfa =
            assignment.MFAEnabled ===
            "true";

          const privileged =
            assignment.Privileged ===
            "true";

          const expected =
            assignment.ExpectedAccess ===
            "true";

          return `
            <tr>

              <td class="user-cell">
                ${escapeHtml(
                  assignment.User
                )}
              </td>

              <td>
                ${escapeHtml(
                  assignment.JobRole
                )}
              </td>

              <td>
                ${escapeHtml(
                  assignment.AzureRole
                )}
              </td>

              <td>
                ${escapeHtml(
                  assignment.Scope
                )}
              </td>

              <td>
                <span class="${
                  mfa
                    ? "event-success"
                    : "event-failed"
                }">
                  ${
                    mfa
                      ? "ENABLED"
                      : "DISABLED"
                  }
                </span>
              </td>

              <td>
                <span class="${
                  privileged
                    ? "event-failed"
                    : "event-success"
                }">
                  ${
                    privileged
                      ? "YES"
                      : "NO"
                  }
                </span>
              </td>

              <td>
                <span class="${
                  expected
                    ? "event-success"
                    : "event-failed"
                }">
                  ${
                    expected
                      ? "EXPECTED"
                      : "UNEXPECTED"
                  }
                </span>
              </td>

              <td>
                <span class="risk-badge ${getRiskClass(
                  assignment.RiskLevel
                )}">
                  ${escapeHtml(
                    assignment.RiskLevel.toUpperCase()
                  )}
                </span>
              </td>

            </tr>
          `;
        }
      )
      .join("");
}

function saveIdentityDecision() {
  const textarea =
    document.getElementById(
      "identityDecision"
    );

  const decision =
    textarea.value.trim();

  const status =
    document.getElementById(
      "identityDecisionStatus"
    );

  if (!decision) {
    status.textContent =
      "ERROR // Access review cannot be empty.";

    status.className =
      "decision-error";

    textarea.focus();

    return;
  }

  localStorage.setItem(
    "csfl-identity-decision",
    decision
  );

  status.textContent =
    "SAVED // Access review stored locally.";

  status.className =
    "decision-success";

  markLabCompleted(
    "lab02"
  );
}

function loadSavedIdentityDecision() {
  const saved =
    localStorage.getItem(
      "csfl-identity-decision"
    );

  const textarea =
    document.getElementById(
      "identityDecision"
    );

  if (
    saved &&
    textarea
  ) {
    textarea.value =
      saved;
  }
}

function revealIdentityFinding() {
  document
    .getElementById(
      "identityExpectedFinding"
    )
    .classList
    .toggle(
      "hidden"
    );
}

/* =========================================================
   LAB 03 - ZERO TRUST
   ========================================================= */

async function renderZeroTrustLab() {
  workspaceTitle.textContent =
    "LAB 03 // Zero Trust Investigation";

  workspaceStatus.textContent =
    "CASE ACTIVE";

  workspaceContent.innerHTML = `
    <div class="loading-state">

      <span class="terminal-prompt">
        root@csfl:~$
      </span>

      loading signin-events.csv...

    </div>
  `;

  try {
    const response =
      await fetch(
        "labs/03-zero-trust/data/signin-events.csv"
      );

    if (!response.ok) {
      throw new Error(
        "Dataset could not be loaded."
      );
    }

    signInEvents =
      parseCsv(
        await response.text()
      );

    renderZeroTrustWorkspace(
      signInEvents
    );
  } catch (error) {
    workspaceContent.innerHTML = `
      <div class="error-box">

        <strong>
          DATASET LOAD FAILED
        </strong>

        <p>
          ${escapeHtml(
            error.message
          )}
        </p>

      </div>
    `;
  }
}

function renderZeroTrustWorkspace(
  events
) {
  workspaceContent.innerHTML = `
    <div class="investigation-layout">

      <section class="case-panel">

        <div class="case-header">

          <div>
            <span class="case-id">
              CASE // ZT-003
            </span>

            <h3>
              Suspicious Cloud Sign-in Activity
            </h3>
          </div>

          <span class="severity-badge">
            HIGH PRIORITY
          </span>

        </div>

        <p>
          Identify activity that violates
          Zero Trust expectations.
        </p>

        <div class="case-indicators">
          <span>Unknown devices</span>
          <span>No MFA</span>
          <span>Foreign locations</span>
          <span>Failed → Success</span>
        </div>

      </section>

      <section class="investigation-stats">

        <div>
          <span>TOTAL EVENTS</span>
          <strong id="totalEvents">0</strong>
        </div>

        <div>
          <span>FAILED</span>
          <strong id="failedEvents">0</strong>
        </div>

        <div>
          <span>HIGH RISK</span>
          <strong id="highRiskEvents">0</strong>
        </div>

        <div>
          <span>NO MFA SUCCESS</span>
          <strong id="noMfaEvents">0</strong>
        </div>

      </section>

      <section class="event-console">

        <div class="console-header">

          <div>
            <span class="terminal-prompt">
              root@csfl:~$
            </span>

            inspect signin-events.csv
          </div>

          <select id="eventFilter">

            <option value="all">
              All Events
            </option>

            <option value="failed">
              Failed Sign-ins
            </option>

            <option value="no-mfa">
              Successful / No MFA
            </option>

            <option value="high-risk">
              High Risk
            </option>

            <option value="unknown-device">
              Unknown Device
            </option>

          </select>

        </div>

        <div class="table-wrapper">

          <table class="event-table">

            <thead>
              <tr>
                <th>TIME</th>
                <th>USER</th>
                <th>RESULT</th>
                <th>IP ADDRESS</th>
                <th>LOCATION</th>
                <th>DEVICE</th>
                <th>APPLICATION</th>
                <th>MFA</th>
                <th>RISK</th>
              </tr>
            </thead>

            <tbody
              id="eventTableBody"
            ></tbody>

          </table>

        </div>

      </section>

      <section class="investigation-bottom">

        <div class="tasks-panel">

          <span class="panel-label">
            INVESTIGATION TASKS
          </span>

          <label>
            <input type="checkbox" />
            Identify users with failed sign-ins.
          </label>

          <label>
            <input type="checkbox" />
            Find successful sign-ins without MFA.
          </label>

          <label>
            <input type="checkbox" />
            Identify the highest-risk event.
          </label>

          <label>
            <input type="checkbox" />
            Determine whether failed attempts
            were followed by success.
          </label>

        </div>

        <div class="decision-panel">

          <span class="panel-label">
            ANALYST DECISION
          </span>

          <textarea
            id="analystDecision"
            tabindex="0"
            placeholder="Write your verdict, reasoning and recommended response..."
          ></textarea>

          <div class="decision-actions">

            <button id="saveDecisionBtn">
              Save Decision
            </button>

            <button id="revealFindingBtn">
              Reveal Expected Finding
            </button>

          </div>

          <div
            id="decisionStatus"
          ></div>

        </div>

      </section>

      <section
        id="expectedFinding"
        class="expected-finding hidden"
      >

        <span class="panel-label">
          EXPECTED FINDING
        </span>

        <h3>
          admin@example.com requires
          immediate attention.
        </h3>

        <p>
          Multiple failed attempts from a
          Russian IP were followed by a
          successful Azure Portal sign-in
          from an unknown device without MFA.
        </p>

      </section>

    </div>
  `;

  const textarea =
    document.getElementById(
      "analystDecision"
    );

  textarea.disabled =
    false;

  textarea.readOnly =
    false;

  textarea.style.pointerEvents =
    "auto";

  textarea.style.position =
    "relative";

  textarea.style.zIndex =
    "20";

  textarea.style.userSelect =
    "text";

  updateZeroTrustStats(
    events
  );

  renderEventTable(
    events
  );

  document
    .getElementById(
      "eventFilter"
    )
    .addEventListener(
      "change",
      handleEventFilter
    );

  document
    .getElementById(
      "saveDecisionBtn"
    )
    .addEventListener(
      "click",
      saveZeroTrustDecision
    );

  document
    .getElementById(
      "revealFindingBtn"
    )
    .addEventListener(
      "click",
      revealZeroTrustFinding
    );

  loadSavedZeroTrustDecision();
}

function updateZeroTrustStats(
  events
) {
  document.getElementById(
    "totalEvents"
  ).textContent =
    events.length;

  document.getElementById(
    "failedEvents"
  ).textContent =
    events.filter(
      (event) =>
        event.ResultType !==
        "0"
    ).length;

  document.getElementById(
    "highRiskEvents"
  ).textContent =
    events.filter(
      (event) =>
        event.RiskLevel ===
        "high"
    ).length;

  document.getElementById(
    "noMfaEvents"
  ).textContent =
    events.filter(
      (event) =>
        event.ResultType ===
          "0" &&
        event.MFAStatus ===
          "notCompleted"
    ).length;
}

function handleEventFilter(
  event
) {
  let filtered =
    [...signInEvents];

  const filter =
    event.target.value;

  if (
    filter === "failed"
  ) {
    filtered =
      signInEvents.filter(
        (item) =>
          item.ResultType !==
          "0"
      );
  }

  if (
    filter === "no-mfa"
  ) {
    filtered =
      signInEvents.filter(
        (item) =>
          item.ResultType ===
            "0" &&
          item.MFAStatus ===
            "notCompleted"
      );
  }

  if (
    filter === "high-risk"
  ) {
    filtered =
      signInEvents.filter(
        (item) =>
          item.RiskLevel ===
          "high"
      );
  }

  if (
    filter ===
    "unknown-device"
  ) {
    filtered =
      signInEvents.filter(
        (item) =>
          item.DeviceTrustType ===
          "Unknown"
      );
  }

  renderEventTable(
    filtered
  );
}

function renderEventTable(
  events
) {
  const body =
    document.getElementById(
      "eventTableBody"
    );

  body.innerHTML =
    events
      .map(
        (event) => {
          const success =
            event.ResultType ===
            "0";

          return `
            <tr>

              <td>
                ${escapeHtml(
                  formatTime(
                    event.TimeGenerated
                  )
                )}
              </td>

              <td class="user-cell">
                ${escapeHtml(
                  event.UserPrincipalName
                )}
              </td>

              <td>
                <span class="${
                  success
                    ? "event-success"
                    : "event-failed"
                }">
                  ${
                    success
                      ? "SUCCESS"
                      : "FAILED"
                  }
                </span>
              </td>

              <td>
                ${escapeHtml(
                  event.IPAddress
                )}
              </td>

              <td>
                ${escapeHtml(
                  event.Location
                )}
              </td>

              <td>
                ${escapeHtml(
                  event.DeviceName
                )}
              </td>

              <td>
                ${escapeHtml(
                  event.AppDisplayName
                )}
              </td>

              <td>
                ${escapeHtml(
                  event.MFAStatus
                )}
              </td>

              <td>
                <span class="risk-badge ${getRiskClass(
                  event.RiskLevel
                )}">
                  ${escapeHtml(
                    event.RiskLevel.toUpperCase()
                  )}
                </span>
              </td>

            </tr>
          `;
        }
      )
      .join("");
}

function saveZeroTrustDecision() {
  const textarea =
    document.getElementById(
      "analystDecision"
    );

  const decision =
    textarea.value.trim();

  const status =
    document.getElementById(
      "decisionStatus"
    );

  if (!decision) {
    status.textContent =
      "ERROR // Analyst decision cannot be empty.";

    status.className =
      "decision-error";

    textarea.focus();

    return;
  }

  localStorage.setItem(
    "csfl-zero-trust-decision",
    decision
  );

  status.textContent =
    "SAVED // Decision stored locally.";

  status.className =
    "decision-success";

  markLabCompleted(
    "lab03"
  );
}

function loadSavedZeroTrustDecision() {
  const saved =
    localStorage.getItem(
      "csfl-zero-trust-decision"
    );

  const textarea =
    document.getElementById(
      "analystDecision"
    );

  if (
    saved &&
    textarea
  ) {
    textarea.value =
      saved;
  }
}

function revealZeroTrustFinding() {
  document
    .getElementById(
      "expectedFinding"
    )
    .classList
    .toggle(
      "hidden"
    );
}

/* =========================================================
   CSV
   ========================================================= */

function parseCsv(csvText) {
  const lines =
    csvText
      .trim()
      .split(/\r?\n/);

  if (
    lines.length < 2
  ) {
    return [];
  }

  const headers =
    lines[0]
      .split(",")
      .map(
        (header) =>
          header.trim()
      );

  return lines
    .slice(1)
    .filter(
      (line) =>
        line.trim() !== ""
    )
    .map(
      (line) => {
        const values =
          line.split(",");

        const entry = {};

        headers.forEach(
          (header, index) => {
            entry[header] =
              values[index]?.trim() ??
              "";
          }
        );

        return entry;
      }
    );
}

/* =========================================================
   HELPERS
   ========================================================= */

function shuffleArray(array) {
  const copy =
    [...array];

  for (
    let i =
      copy.length - 1;
    i > 0;
    i--
  ) {
    const j =
      Math.floor(
        Math.random() *
        (i + 1)
      );

    [
      copy[i],
      copy[j]
    ] = [
      copy[j],
      copy[i]
    ];
  }

  return copy;
}

function getRiskClass(level) {
  if (
    level === "high" ||
    level === "critical"
  ) {
    return "risk-high";
  }

  if (
    level === "medium"
  ) {
    return "risk-medium";
  }

  return "risk-low";
}

function formatTime(
  timestamp
) {
  if (!timestamp) {
    return "";
  }

  if (
    timestamp.includes("T")
  ) {
    return timestamp
      .split("T")[1]
      .replace(
        "Z",
        ""
      );
  }

  return timestamp;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );
}

/* =========================================================
   INITIALIZE
   ========================================================= */

initializeProgressControls();

updateProgressUI();