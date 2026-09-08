const labButtons =
  document.querySelectorAll(".lab-button");

const workspaceTitle =
  document.getElementById("workspaceTitle");

const workspaceStatus =
  document.getElementById("workspaceStatus");

const workspaceContent =
  document.getElementById("workspaceContent");

let signInEvents = [];
let roleAssignments = [];

let certificationBanks = {
  AZ900: [],
  SC900: []
};

let activeCertification = null;
let activeQuestionBank = [];
let activeQuestions = [];

let currentSessionLabel = "";
let currentRequestedCount = 0;
let currentSessionType = "practice";
let currentSessionRecorded = false;

/* =========================================================
   CERTIFICATION CONFIG
   ========================================================= */

const certificationConfig = {
  AZ900: {
    code: "AZ-900",
    title: "Azure Fundamentals",
    path: "data/questions/az900.json",

    answersKey:
      "csfl-az900-answers",

    weakAreasKey:
      "csfl-az900-weak-areas",

    lastModeKey:
      "csfl-az900-last-mode",

    historyKey:
      "csfl-az900-history"
  },

  SC900: {
    code: "SC-900",

    title:
      "Security, Compliance & Identity Fundamentals",

    path:
      "data/questions/sc900.json",

    answersKey:
      "csfl-sc900-answers",

    weakAreasKey:
      "csfl-sc900-weak-areas",

    lastModeKey:
      "csfl-sc900-last-mode",

    historyKey:
      "csfl-sc900-history"
  }
};

/* =========================================================
   PROGRESS SYSTEM
   ========================================================= */

const labProgressConfig = {
  lab01: {
    startedKey:
      "csfl-lab01-started",

    completedKey:
      "csfl-lab01-completed",

    statusElementId:
      "lab01Status"
  },

  lab02: {
    startedKey:
      "csfl-lab02-started",

    completedKey:
      "csfl-lab02-completed",

    statusElementId:
      "lab02Status"
  },

  lab03: {
    startedKey:
      "csfl-lab03-started",

    completedKey:
      "csfl-lab03-completed",

    statusElementId:
      "lab03Status"
  }
};

const progressStorageKeys = [
  "csfl-lab01-started",
  "csfl-lab01-completed",

  "csfl-lab02-started",
  "csfl-lab02-completed",

  "csfl-lab03-started",
  "csfl-lab03-completed",

  "csfl-cloud-answers",

  "csfl-identity-decision",
  "csfl-zero-trust-decision",

  "csfl-az900-answers",
  "csfl-az900-weak-areas",
  "csfl-az900-last-mode",
  "csfl-az900-history",

  "csfl-sc900-answers",
  "csfl-sc900-weak-areas",
  "csfl-sc900-last-mode",
  "csfl-sc900-history"
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
  ).forEach(
    ([labId, config]) => {
      const state =
        getLabProgressState(
          labId
        );

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

      if (
        state === "COMPLETED"
      ) {
        completedLabs++;
      }
    }
  );

  const totalLabs =
    Object.keys(
      labProgressConfig
    ).length;

  const percentage =
    Math.round(
      (
        completedLabs /
        totalLabs
      ) * 100
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

    progressElement.style.color =
      percentage === 100
        ? "var(--green)"
        : percentage > 0
          ? "var(--amber)"
          : "";
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

  if (
    state ===
    "COMPLETED"
  ) {
    element.style.color =
      "var(--green)";

    element.style.borderColor =
      "rgba(125, 255, 158, 0.32)";

    element.style.background =
      "rgba(125, 255, 158, 0.08)";

    return;
  }

  if (
    state ===
    "IN PROGRESS"
  ) {
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

  const title =
    statusCard.querySelector(
      "strong"
    );

  const text =
    statusCard.querySelector(
      "p"
    );

  if (
    completedLabs ===
    totalLabs
  ) {
    if (title) {
      title.textContent =
        "Training Complete";
    }

    if (text) {
      text.textContent =
        "All local labs completed";
    }
  } else {
    if (title) {
      title.textContent =
        "Local Lab Environment";
    }

    if (text) {
      text.textContent =
        "Progress stored locally";
    }
  }
}

/* =========================================================
   RESET
   ========================================================= */

function initializeProgressControls() {
  const statusCard =
    document.querySelector(
      ".status-card"
    );

  if (
    !statusCard ||
    document.getElementById(
      "resetProgressBtn"
    )
  ) {
    return;
  }

  const button =
    document.createElement(
      "button"
    );

  button.id =
    "resetProgressBtn";

  button.type =
    "button";

  button.textContent =
    "RESET";

  button.style.marginLeft =
    "auto";

  button.style.padding =
    "7px 10px";

  button.style.border =
    "1px solid rgba(255,95,104,.2)";

  button.style.background =
    "rgba(255,95,104,.04)";

  button.style.color =
    "#a9787b";

  button.style.fontFamily =
    "inherit";

  button.style.fontSize =
    "8px";

  button.style.fontWeight =
    "800";

  button.style.cursor =
    "pointer";

  button.addEventListener(
    "click",
    resetAllProgress
  );

  statusCard.appendChild(
    button
  );
}

function resetAllProgress() {
  const confirmed =
    window.confirm(
      "Reset all Cloud Security Lab progress?\n\nSaved answers, history, weak areas and analyst decisions will be removed."
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

  activeCertification =
    null;

  activeQuestionBank =
    [];

  activeQuestions =
    [];

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
   TOAST
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
  certKey
) {
  const config =
    certificationConfig[
      certKey
    ];

  if (!config) {
    throw new Error(
      "Unknown certification."
    );
  }

  const response =
    await fetch(
      config.path
    );

  if (!response.ok) {
    throw new Error(
      `${config.code} question bank could not be loaded.`
    );
  }

  const questions =
    await response.json();

  if (
    !Array.isArray(
      questions
    )
  ) {
    throw new Error(
      `${config.code} question bank has an invalid format.`
    );
  }

  return questions;
}

/* =========================================================
   LAB BUTTONS
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

          renderCertificationLab();
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

        workspaceContent
          .scrollIntoView({
            behavior:
              "smooth",

            block:
              "start"
          });
      }
    );
  }
);

/* =========================================================
   CERTIFICATION HUB
   ========================================================= */

async function renderCertificationLab() {
  workspaceTitle.textContent =
    "LAB 01 // Certification Training";

  workspaceStatus.textContent =
    "QUESTION BANKS LOADING";

  workspaceContent.innerHTML = `
    <div class="loading-state">
      <span class="terminal-prompt">
        root@csfl:~$
      </span>

      loading AZ-900 + SC-900 question banks...
    </div>
  `;

  try {
    const [
      az900,
      sc900
    ] =
      await Promise.all([
        loadQuestionBank(
          "AZ900"
        ),

        loadQuestionBank(
          "SC900"
        )
      ]);

    certificationBanks.AZ900 =
      az900;

    certificationBanks.SC900 =
      sc900;

    renderCertificationHub();
  } catch (error) {
    workspaceStatus.textContent =
      "QUESTION BANK ERROR";

    workspaceContent.innerHTML = `
      <div class="error-box">

        <strong>
          CERTIFICATION QUESTION BANK LOAD FAILED
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

function renderCertificationHub() {
  workspaceTitle.textContent =
    "LAB 01 // Certification Training";

  workspaceStatus.textContent =
    "SELECT CERTIFICATION";

  activeCertification =
    null;

  activeQuestionBank =
    [];

  activeQuestions =
    [];

  workspaceContent.innerHTML = `
    <div class="investigation-layout">

      <section class="case-panel">

        <div class="case-header">

          <div>
            <span class="case-id">
              CERTIFICATION HUB // CSFL
            </span>

            <h3>
              Choose Your Training Path
            </h3>
          </div>

          <span class="severity-badge">
            2 TRACKS
          </span>

        </div>

        <p>
          Adaptive certification training
          with isolated weak areas,
          session history and domain scores.
        </p>

        <div class="case-indicators">

          <span>AZ-900</span>
          <span>SC-900</span>
          <span>100 Questions</span>
          <span>Exam Mode</span>
          <span>Adaptive Training</span>

        </div>

      </section>


      <section class="investigation-stats">

        <div>
          <span>AZ-900 QUESTIONS</span>

          <strong>
            ${certificationBanks.AZ900.length}
          </strong>
        </div>

        <div>
          <span>SC-900 QUESTIONS</span>

          <strong>
            ${certificationBanks.SC900.length}
          </strong>
        </div>

        <div>
          <span>TOTAL QUESTIONS</span>

          <strong>
            ${
              certificationBanks.AZ900.length +
              certificationBanks.SC900.length
            }
          </strong>
        </div>

        <div>
          <span>ENGINE</span>

          <strong>ONLINE</strong>
        </div>

      </section>


      <section class="event-console">

        <div class="console-header">
          <div>
            <span class="terminal-prompt">
              root@csfl:~$
            </span>

            select AZ-900
          </div>
        </div>

        <div class="workspace-content">

          <h3>
            AZ-900 // Azure Fundamentals
          </h3>

          <p>
            Cloud concepts, Azure architecture,
            services, management and governance.
          </p>

          <div class="decision-actions">

            <button id="openAz900Btn">
              Open AZ-900 Training
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

            select SC-900
          </div>
        </div>

        <div class="workspace-content">

          <h3>
            SC-900 // Security,
            Compliance & Identity
          </h3>

          <p>
            Zero Trust, Entra, Defender,
            Sentinel, Purview and compliance.
          </p>

          <div class="decision-actions">

            <button id="openSc900Btn">
              Open SC-900 Training
            </button>

          </div>

        </div>

      </section>

    </div>
  `;

  document
    .getElementById(
      "openAz900Btn"
    )
    .addEventListener(
      "click",
      () => {
        openCertificationTraining(
          "AZ900"
        );
      }
    );

  document
    .getElementById(
      "openSc900Btn"
    )
    .addEventListener(
      "click",
      () => {
        openCertificationTraining(
          "SC900"
        );
      }
    );
}

/* =========================================================
   TRAINING HUB
   ========================================================= */

function openCertificationTraining(
  certKey
) {
  const config =
    certificationConfig[
      certKey
    ];

  const bank =
    certificationBanks[
      certKey
    ];

  if (
    !config ||
    !Array.isArray(bank) ||
    bank.length === 0
  ) {
    showSystemToast(
      "QUESTION BANK // NOT AVAILABLE",
      "warning"
    );

    return;
  }

  activeCertification =
    certKey;

  activeQuestionBank =
    bank;

  activeQuestions =
    [];

  renderTrainingModeHub();
}

function renderTrainingModeHub() {
  if (!activeCertification) {
    renderCertificationHub();

    return;
  }

  const config =
    certificationConfig[
      activeCertification
    ];

  const domains =
    getActiveDomains();

  const weakAreas =
    getWeakAreaIds();

  const history =
    getSessionHistory();

  const domainPerformance =
    calculateHistoricalDomainPerformance(
      history
    );

  const lastMode =
    localStorage.getItem(
      config.lastModeKey
    ) || "NONE";

  workspaceTitle.textContent =
    `LAB 01 // ${config.code} Training`;

  workspaceStatus.textContent =
    "SELECT TRAINING MODE";

  workspaceContent.innerHTML = `
    <div class="investigation-layout">

      <section class="case-panel">

        <div class="case-header">

          <div>
            <span class="case-id">
              TRAINING ENGINE //
              ${escapeHtml(config.code)}
            </span>

            <h3>
              ${escapeHtml(config.title)}
            </h3>
          </div>

          <span class="severity-badge">
            QUESTION BANK
          </span>

        </div>

        <p>
          Practice, review weak areas,
          run exam simulations and track
          performance over time.
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
          <strong>${activeQuestionBank.length}</strong>
        </div>

        <div>
          <span>WEAK AREAS</span>
          <strong>${weakAreas.length}</strong>
        </div>

        <div>
          <span>SESSIONS</span>
          <strong>${history.length}</strong>
        </div>

        <div>
          <span>LAST MODE</span>
          <strong>${escapeHtml(lastMode)}</strong>
        </div>

      </section>


      <section class="event-console">
        <div class="console-header">
          <div>
            <span class="terminal-prompt">
              root@csfl:~$
            </span>

            quick-practice
          </div>
        </div>

        <div class="workspace-content">
          <h3>Quick Practice</h3>

          <p>
            10 random questions.
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
          <h3>Study Session</h3>

          <p>
            20 random questions.
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
          <h3>Full Block</h3>

          <p>
            Complete 50-question
            training session.
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

            exam-mode
          </div>

        </div>

        <div class="workspace-content">

          <h3>
            Exam Mode
          </h3>

          <p>
            50 randomized questions.
            Answers and explanations remain
            hidden until the exam is submitted.
          </p>

          <div class="decision-actions">

            <button id="startExamModeBtn">
              Start Exam Simulation
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

          <select
            id="domainPracticeSelect"
          >

            ${domains
              .map(
                (domain) => `
                  <option
                    value="${escapeHtml(domain)}"
                  >
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
            Train one certification
            domain at a time.
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
            Retry previously incorrect questions.
          </p>

          <p>
            Current weak-area questions:
            <strong>${weakAreas.length}</strong>
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


      <section class="event-console">

        <div class="console-header">

          <div>
            <span class="terminal-prompt">
              root@csfl:~$
            </span>

            domain-performance
          </div>

        </div>

        <div class="table-wrapper">

          <table class="event-table">

            <thead>
              <tr>
                <th>DOMAIN</th>
                <th>CORRECT</th>
                <th>ANSWERED</th>
                <th>SCORE</th>
              </tr>
            </thead>

            <tbody>
              ${
                renderHistoricalDomainRows(
                  domainPerformance
                )
              }
            </tbody>

          </table>

        </div>

      </section>


      <section class="event-console">

        <div class="console-header">

          <div>
            <span class="terminal-prompt">
              root@csfl:~$
            </span>

            session-history
          </div>

        </div>

        <div class="table-wrapper">

          <table class="event-table">

            <thead>
              <tr>
                <th>DATE</th>
                <th>MODE</th>
                <th>RESULT</th>
                <th>SCORE</th>
                <th>CORRECT</th>
              </tr>
            </thead>

            <tbody>
              ${renderHistoryRows(
                history
              )}
            </tbody>

          </table>

        </div>

      </section>


      <section class="decision-panel">

        <span class="panel-label">
          NAVIGATION
        </span>

        <div class="decision-actions">

          <button
            id="backToCertificationHubBtn"
          >
            Certification Hub
          </button>

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
        startPractice(
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
        startPractice(
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
        startPractice(
          "FULL",
          50
        );
      }
    );

  document
    .getElementById(
      "startExamModeBtn"
    )
    .addEventListener(
      "click",
      startExamMode
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

  document
    .getElementById(
      "backToCertificationHubBtn"
    )
    .addEventListener(
      "click",
      renderCertificationHub
    );
}

/* =========================================================
   SESSION START
   ========================================================= */

function startPractice(
  mode,
  requestedCount
) {
  const config =
    getActiveConfig();

  localStorage.removeItem(
    config.answersKey
  );

  localStorage.setItem(
    config.lastModeKey,
    mode
  );

  activeQuestions =
    shuffleArray(
      activeQuestionBank
    ).slice(
      0,
      Math.min(
        requestedCount,
        activeQuestionBank.length
      )
    );

  currentSessionLabel =
    mode;

  currentRequestedCount =
    requestedCount;

  currentSessionType =
    "practice";

  currentSessionRecorded =
    false;

  renderPracticeSession();
}

function startExamMode() {
  const config =
    getActiveConfig();

  localStorage.removeItem(
    config.answersKey
  );

  localStorage.setItem(
    config.lastModeKey,
    "EXAM"
  );

  activeQuestions =
    shuffleArray(
      activeQuestionBank
    ).slice(
      0,
      Math.min(
        50,
        activeQuestionBank.length
      )
    );

  currentSessionLabel =
    "EXAM";

  currentRequestedCount =
    50;

  currentSessionType =
    "exam";

  currentSessionRecorded =
    false;

  renderPracticeSession();
}

function startDomainPractice() {
  const config =
    getActiveConfig();

  const domain =
    document.getElementById(
      "domainPracticeSelect"
    ).value;

  const questions =
    activeQuestionBank.filter(
      (question) =>
        question.domain ===
        domain
    );

  if (
    questions.length === 0
  ) {
    showSystemToast(
      "DOMAIN // NO QUESTIONS FOUND",
      "warning"
    );

    return;
  }

  localStorage.removeItem(
    config.answersKey
  );

  localStorage.setItem(
    config.lastModeKey,
    "DOMAIN"
  );

  activeQuestions =
    shuffleArray(
      questions
    );

  currentSessionLabel =
    `DOMAIN // ${domain}`;

  currentRequestedCount =
    activeQuestions.length;

  currentSessionType =
    "practice";

  currentSessionRecorded =
    false;

  renderPracticeSession();
}

function startWeakAreaPractice() {
  const config =
    getActiveConfig();

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

  activeQuestions =
    shuffleArray(
      activeQuestionBank.filter(
        (question) =>
          weakIds.includes(
            question.id
          )
      )
    );

  if (
    activeQuestions.length === 0
  ) {
    showSystemToast(
      "WEAK AREAS // QUESTIONS NOT FOUND",
      "warning"
    );

    return;
  }

  localStorage.removeItem(
    config.answersKey
  );

  localStorage.setItem(
    config.lastModeKey,
    "WEAK AREAS"
  );

  currentSessionLabel =
    "WEAK AREAS";

  currentRequestedCount =
    activeQuestions.length;

  currentSessionType =
    "practice";

  currentSessionRecorded =
    false;

  renderPracticeSession();
}

function clearWeakAreas() {
  const config =
    getActiveConfig();

  localStorage.removeItem(
    config.weakAreasKey
  );

  showSystemToast(
    `${config.code} // WEAK AREAS CLEARED`,
    "warning"
  );

  renderTrainingModeHub();
}

/* =========================================================
   PRACTICE / EXAM SESSION
   ========================================================= */

function renderPracticeSession() {
  const config =
    getActiveConfig();

  const isExam =
    currentSessionType ===
    "exam";

  const notice =
    activeQuestions.length <
    currentRequestedCount
      ? `${activeQuestions.length} available / ${currentRequestedCount} requested`
      : `${activeQuestions.length} questions`;

  workspaceTitle.textContent =
    `LAB 01 // ${config.code} // ${currentSessionLabel}`;

  workspaceStatus.textContent =
    isExam
      ? "EXAM ACTIVE"
      : "TRAINING ACTIVE";

  workspaceContent.innerHTML = `
    <div class="investigation-layout">

      <section class="case-panel">

        <div class="case-header">

          <div>

            <span class="case-id">
              ${escapeHtml(config.code)}
              //
              ${escapeHtml(currentSessionLabel)}
            </span>

            <h3>
              ${escapeHtml(config.title)}
            </h3>

          </div>

          <span class="severity-badge">
            ${escapeHtml(
              notice.toUpperCase()
            )}
          </span>

        </div>

        ${
          isExam
            ? `
              <p>
                Exam simulation active.
                Answers and explanations remain
                hidden until submission.
              </p>
            `
            : `
              <p>
                Complete the training session
                and submit your answers.
              </p>
            `
        }

        <p>
          Local project pass threshold:
          <strong>80%</strong>.
        </p>

      </section>


      <section class="investigation-stats">

        <div>
          <span>QUESTIONS</span>
          <strong>${activeQuestions.length}</strong>
        </div>

        <div>
          <span>ANSWERED</span>
          <strong id="cloudAnsweredCount">0</strong>
        </div>

        <div>
          <span>CORRECT</span>
          <strong id="cloudCorrectCount">—</strong>
        </div>

        <div>
          <span>SCORE</span>
          <strong id="cloudScore">—</strong>
        </div>

      </section>


      <div
        id="cloudQuestionContainer"
      ></div>


      <section class="decision-panel">

        <span class="panel-label">
          ${
            isExam
              ? "EXAM CONTROL"
              : "SESSION CONTROL"
          }
        </span>

        <div class="decision-actions">

          <button
            id="checkCloudAnswersBtn"
          >
            ${
              isExam
                ? "Submit Exam"
                : "Check Answers"
            }
          </button>

          <button
            id="restartSessionBtn"
          >
            Restart Session
          </button>

          <button
            id="backToModesBtn"
          >
            Training Modes
          </button>

        </div>

        <div
          id="cloudChallengeStatus"
        ></div>

      </section>

    </div>
  `;

  renderActiveQuestions();

  loadSessionAnswers();

  document
    .getElementById(
      "checkCloudAnswersBtn"
    )
    .addEventListener(
      "click",
      checkPracticeAnswers
    );

  document
    .getElementById(
      "restartSessionBtn"
    )
    .addEventListener(
      "click",
      restartCurrentSession
    );

  document
    .getElementById(
      "backToModesBtn"
    )
    .addEventListener(
      "click",
      renderTrainingModeHub
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
        (
          question,
          index
        ) => {
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
                    )}
                    //
                  </span>

                  ${escapeHtml(
                    question.topic
                  )}

                  [
                  ${escapeHtml(
                    (
                      question.difficulty ||
                      "medium"
                    ).toUpperCase()
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
              ></div>

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
          handleAnswerChange
        );
      }
    );
}

/* =========================================================
   ANSWERS
   ========================================================= */

function handleAnswerChange() {
  updateAnsweredCount();

  saveSessionAnswers();
}

function updateAnsweredCount() {
  const answered =
    [
      ...document.querySelectorAll(
        ".cloud-answer"
      )
    ].filter(
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

function saveSessionAnswers() {
  const config =
    getActiveConfig();

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
    config.answersKey,
    JSON.stringify(
      answers
    )
  );
}

function loadSessionAnswers() {
  const config =
    getActiveConfig();

  const raw =
    localStorage.getItem(
      config.answersKey
    );

  if (!raw) {
    return;
  }

  try {
    const answers =
      JSON.parse(raw);

    Object.entries(
      answers
    ).forEach(
      ([id, value]) => {
        const select =
          document.getElementById(
            id
          );

        if (select) {
          select.value =
            value;
        }
      }
    );

    updateAnsweredCount();
  } catch {
    localStorage.removeItem(
      config.answersKey
    );
  }
}

/* =========================================================
   SUBMISSION
   ========================================================= */

function checkPracticeAnswers() {
  const config =
    getActiveConfig();

  let correct = 0;
  let answered = 0;

  const weakAreas =
    new Set(
      getWeakAreaIds()
    );

  const domainResults = {};

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

      const isCorrect =
        selected ===
        question.answer;

      if (
        !domainResults[
          question.domain
        ]
      ) {
        domainResults[
          question.domain
        ] = {
          correct: 0,
          total: 0
        };
      }

      domainResults[
        question.domain
      ].total++;

      if (
        selected !== ""
      ) {
        answered++;
      }

      if (isCorrect) {
        correct++;

        domainResults[
          question.domain
        ].correct++;

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
            No answer selected.
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
    }
  );

  if (
    answered <
    activeQuestions.length
  ) {
    const status =
      document.getElementById(
        "cloudChallengeStatus"
      );

    status.textContent =
      `INCOMPLETE // ${answered}/${activeQuestions.length} questions answered.`;

    status.className =
      "decision-error";

    return;
  }

  activeQuestions.forEach(
    (question) => {
      const feedback =
        document.getElementById(
          `${question.id}-feedback`
        );

      feedback.classList.remove(
        "hidden"
      );
    }
  );

  saveWeakAreaIds(
    [...weakAreas]
  );

  saveSessionAnswers();

  const score =
    Math.round(
      (
        correct /
        activeQuestions.length
      ) * 100
    );

  document.getElementById(
    "cloudCorrectCount"
  ).textContent =
    correct;

  document.getElementById(
    "cloudScore"
  ).textContent =
    `${score}%`;

  const passed =
    score >= 80;

  if (
    !currentSessionRecorded
  ) {
    saveSessionHistoryEntry({
      date:
        new Date()
          .toISOString(),

      certification:
        config.code,

      mode:
        currentSessionLabel,

      score,

      correct,

      total:
        activeQuestions.length,

      passed,

      domains:
        domainResults
    });

    currentSessionRecorded =
      true;
  }

  if (passed) {
    markLabCompleted(
      "lab01"
    );
  }

  if (
    currentSessionType ===
    "exam"
  ) {
    renderExamResult(
      score,
      correct,
      passed,
      domainResults
    );

    return;
  }

  const status =
    document.getElementById(
      "cloudChallengeStatus"
    );

  if (passed) {
    status.textContent =
      `PASSED // ${correct}/${activeQuestions.length} correct (${score}%).`;

    status.className =
      "decision-success";
  } else {
    status.textContent =
      `REVIEW REQUIRED // ${correct}/${activeQuestions.length} correct (${score}%).`;

    status.className =
      "decision-error";
  }
}

/* =========================================================
   EXAM RESULT
   ========================================================= */

function renderExamResult(
  score,
  correct,
  passed,
  domainResults
) {
  const config =
    getActiveConfig();

  workspaceTitle.textContent =
    `${config.code} // Exam Result`;

  workspaceStatus.textContent =
    passed
      ? "EXAM PASSED"
      : "EXAM FAILED";

  workspaceContent.innerHTML = `
    <div class="investigation-layout">

      <section class="case-panel">

        <div class="case-header">

          <div>

            <span class="case-id">
              EXAM RESULT //
              ${escapeHtml(
                config.code
              )}
            </span>

            <h3>
              ${
                passed
                  ? "Simulation Passed"
                  : "Review Required"
              }
            </h3>

          </div>

          <span class="severity-badge">
            ${score}%
          </span>

        </div>

        <p>
          You answered
          <strong>
            ${correct}
          </strong>
          of
          <strong>
            ${activeQuestions.length}
          </strong>
          questions correctly.
        </p>

      </section>


      <section class="investigation-stats">

        <div>
          <span>SCORE</span>
          <strong>${score}%</strong>
        </div>

        <div>
          <span>CORRECT</span>
          <strong>${correct}</strong>
        </div>

        <div>
          <span>INCORRECT</span>
          <strong>
            ${
              activeQuestions.length -
              correct
            }
          </strong>
        </div>

        <div>
          <span>RESULT</span>
          <strong>
            ${
              passed
                ? "PASSED"
                : "FAILED"
            }
          </strong>
        </div>

      </section>


      <section class="event-console">

        <div class="console-header">

          <div>
            <span class="terminal-prompt">
              root@csfl:~$
            </span>

            domain-breakdown
          </div>

        </div>

        <div class="table-wrapper">

          <table class="event-table">

            <thead>
              <tr>
                <th>DOMAIN</th>
                <th>CORRECT</th>
                <th>TOTAL</th>
                <th>SCORE</th>
              </tr>
            </thead>

            <tbody>
              ${renderDomainResultRows(
                domainResults
              )}
            </tbody>

          </table>

        </div>

      </section>


      <section class="event-console">

        <div class="console-header">

          <div>
            <span class="terminal-prompt">
              root@csfl:~$
            </span>

            answer-review
          </div>

        </div>

        <div
          id="examReviewContainer"
        ></div>

      </section>


      <section class="decision-panel">

        <span class="panel-label">
          EXAM CONTROL
        </span>

        <div class="decision-actions">

          <button id="retryExamBtn">
            Retry Exam
          </button>

          <button id="examModesBtn">
            Training Modes
          </button>

          <button id="examCertificationHubBtn">
            Certification Hub
          </button>

        </div>

      </section>

    </div>
  `;

  renderExamReview();

  document
    .getElementById(
      "retryExamBtn"
    )
    .addEventListener(
      "click",
      startExamMode
    );

  document
    .getElementById(
      "examModesBtn"
    )
    .addEventListener(
      "click",
      renderTrainingModeHub
    );

  document
    .getElementById(
      "examCertificationHubBtn"
    )
    .addEventListener(
      "click",
      renderCertificationHub
    );
}

function renderExamReview() {
  const config =
    getActiveConfig();

  const raw =
    localStorage.getItem(
      config.answersKey
    );

  let answers = {};

  if (raw) {
    try {
      answers =
        JSON.parse(raw);
    } catch {
      answers = {};
    }
  }

  const container =
    document.getElementById(
      "examReviewContainer"
    );

  container.innerHTML =
    activeQuestions
      .map(
        (
          question,
          index
        ) => {
          const selected =
            answers[
              question.id
            ] || "";

          const correct =
            selected ===
            question.answer;

          return `
            <div class="task-item">

              <span>
                ${String(
                  index + 1
                ).padStart(
                  2,
                  "0"
                )}
              </span>

              <div>

                <p>
                  ${escapeHtml(
                    question.question
                  )}
                </p>

                <p>
                  Your answer:
                  <strong class="${
                    correct
                      ? "event-success"
                      : "event-failed"
                  }">
                    ${escapeHtml(
                      selected
                    )}
                  </strong>
                </p>

                ${
                  correct
                    ? ""
                    : `
                      <p>
                        Correct answer:
                        <strong>
                          ${escapeHtml(
                            question.answer
                          )}
                        </strong>
                      </p>
                    `
                }

                <p>
                  ${escapeHtml(
                    question.explanation
                  )}
                </p>

              </div>

            </div>
          `;
        }
      )
      .join("");
}

/* =========================================================
   HISTORY
   ========================================================= */

function getSessionHistory() {
  const config =
    getActiveConfig();

  if (!config) {
    return [];
  }

  const raw =
    localStorage.getItem(
      config.historyKey
    );

  if (!raw) {
    return [];
  }

  try {
    const history =
      JSON.parse(raw);

    return Array.isArray(
      history
    )
      ? history
      : [];
  } catch {
    localStorage.removeItem(
      config.historyKey
    );

    return [];
  }
}

function saveSessionHistoryEntry(
  entry
) {
  const config =
    getActiveConfig();

  const history =
    getSessionHistory();

  history.unshift(
    entry
  );

  const limitedHistory =
    history.slice(
      0,
      30
    );

  localStorage.setItem(
    config.historyKey,
    JSON.stringify(
      limitedHistory
    )
  );
}

function renderHistoryRows(
  history
) {
  if (
    history.length === 0
  ) {
    return `
      <tr>
        <td colspan="5">
          No completed sessions yet.
        </td>
      </tr>
    `;
  }

  return history
    .slice(
      0,
      10
    )
    .map(
      (entry) => `
        <tr>

          <td>
            ${escapeHtml(
              formatHistoryDate(
                entry.date
              )
            )}
          </td>

          <td>
            ${escapeHtml(
              entry.mode
            )}
          </td>

          <td>
            <span class="${
              entry.passed
                ? "event-success"
                : "event-failed"
            }">
              ${
                entry.passed
                  ? "PASSED"
                  : "FAILED"
              }
            </span>
          </td>

          <td>
            ${entry.score}%
          </td>

          <td>
            ${entry.correct}/${entry.total}
          </td>

        </tr>
      `
    )
    .join("");
}

/* =========================================================
   DOMAIN PERFORMANCE
   ========================================================= */

function calculateHistoricalDomainPerformance(
  history
) {
  const result = {};

  history.forEach(
    (session) => {
      if (
        !session.domains
      ) {
        return;
      }

      Object.entries(
        session.domains
      ).forEach(
        (
          [
            domain,
            values
          ]
        ) => {
          if (
            !result[
              domain
            ]
          ) {
            result[
              domain
            ] = {
              correct: 0,
              total: 0
            };
          }

          result[
            domain
          ].correct +=
            values.correct;

          result[
            domain
          ].total +=
            values.total;
        }
      );
    }
  );

  return result;
}

function renderHistoricalDomainRows(
  performance
) {
  const entries =
    Object.entries(
      performance
    );

  if (
    entries.length === 0
  ) {
    return `
      <tr>
        <td colspan="4">
          No performance data yet.
        </td>
      </tr>
    `;
  }

  return entries
    .map(
      (
        [
          domain,
          values
        ]
      ) => {
        const score =
          Math.round(
            (
              values.correct /
              values.total
            ) * 100
          );

        return `
          <tr>

            <td>
              ${escapeHtml(
                domain
              )}
            </td>

            <td>
              ${values.correct}
            </td>

            <td>
              ${values.total}
            </td>

            <td>
              <span class="${
                score >= 80
                  ? "event-success"
                  : "event-failed"
              }">
                ${score}%
              </span>
            </td>

          </tr>
        `;
      }
    )
    .join("");
}

function renderDomainResultRows(
  domainResults
) {
  return Object.entries(
    domainResults
  )
    .map(
      (
        [
          domain,
          values
        ]
      ) => {
        const score =
          Math.round(
            (
              values.correct /
              values.total
            ) * 100
          );

        return `
          <tr>

            <td>
              ${escapeHtml(
                domain
              )}
            </td>

            <td>
              ${values.correct}
            </td>

            <td>
              ${values.total}
            </td>

            <td>
              <span class="${
                score >= 80
                  ? "event-success"
                  : "event-failed"
              }">
                ${score}%
              </span>
            </td>

          </tr>
        `;
      }
    )
    .join("");
}

/* =========================================================
   RESTART
   ========================================================= */

function restartCurrentSession() {
  const config =
    getActiveConfig();

  localStorage.removeItem(
    config.answersKey
  );

  activeQuestions =
    shuffleArray(
      activeQuestions
    );

  currentSessionRecorded =
    false;

  renderPracticeSession();

  showSystemToast(
    `${config.code} // SESSION RESTARTED`,
    "warning"
  );
}

/* =========================================================
   WEAK AREAS
   ========================================================= */

function getWeakAreaIds() {
  const config =
    getActiveConfig();

  if (!config) {
    return [];
  }

  const raw =
    localStorage.getItem(
      config.weakAreasKey
    );

  if (!raw) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(raw);

    return Array.isArray(
      parsed
    )
      ? parsed
      : [];
  } catch {
    localStorage.removeItem(
      config.weakAreasKey
    );

    return [];
  }
}

function saveWeakAreaIds(
  ids
) {
  const config =
    getActiveConfig();

  const uniqueIds =
    [...new Set(ids)];

  localStorage.setItem(
    config.weakAreasKey,
    JSON.stringify(
      uniqueIds
    )
  );
}

function getActiveDomains() {
  return [
    ...new Set(
      activeQuestionBank
        .map(
          (question) =>
            question.domain
        )
        .filter(Boolean)
    )
  ];
}

/* =========================================================
   LAB 02
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
          Review synthetic role assignments
          and identify excessive privileges,
          missing MFA and least-privilege violations.
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
            Determine highest-risk assignment.
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
  document.getElementById(
    "totalAssignments"
  ).textContent =
    assignments.length;

  document.getElementById(
    "privilegedAssignments"
  ).textContent =
    assignments.filter(
      (item) =>
        item.Privileged ===
        "true"
    ).length;

  document.getElementById(
    "unexpectedAssignments"
  ).textContent =
    assignments.filter(
      (item) =>
        item.ExpectedAccess ===
        "false"
    ).length;

  document.getElementById(
    "dangerousAssignments"
  ).textContent =
    assignments.filter(
      (item) =>
        [
          "high",
          "critical"
        ].includes(
          item.RiskLevel
        )
    ).length;
}

function handleIdentityFilter(
  event
) {
  const filter =
    event.target.value;

  let filtered =
    [...roleAssignments];

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
          [
            "high",
            "critical"
          ].includes(
            item.RiskLevel
          )
      );
  }

  renderIdentityTable(
    filtered
  );
}

function renderIdentityTable(
  assignments
) {
  const body =
    document.getElementById(
      "identityTableBody"
    );

  body.innerHTML =
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
   LAB 03
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
            Identify highest-risk event.
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

            <button
              id="saveDecisionBtn"
            >
              Save Decision
            </button>

            <button
              id="revealFindingBtn"
            >
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
  const filter =
    event.target.value;

  let filtered =
    [...signInEvents];

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
          (
            header,
            index
          ) => {
            entry[header] =
              values[
                index
              ]?.trim() ??
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

function getActiveConfig() {
  if (
    !activeCertification
  ) {
    return null;
  }

  return certificationConfig[
    activeCertification
  ];
}

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

function formatTime(timestamp) {
  if (!timestamp) {
    return "";
  }

  if (
    timestamp.includes(
      "T"
    )
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

function formatHistoryDate(
  timestamp
) {
  if (!timestamp) {
    return "";
  }

  const date =
    new Date(timestamp);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return timestamp;
  }

  return date.toLocaleString();
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
   INIT
   ========================================================= */

initializeProgressControls();

updateProgressUI();