const labButtons = document.querySelectorAll(".lab-button");
const workspaceTitle = document.getElementById("workspaceTitle");
const workspaceStatus = document.getElementById("workspaceStatus");
const workspaceContent = document.getElementById("workspaceContent");

let signInEvents = [];

labButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedLab = button.dataset.lab;

    if (selectedLab === "cloud-basics") {
      renderCloudBasicsLab();
    }

    if (selectedLab === "identity-access") {
      renderIdentityLab();
    }

    if (selectedLab === "zero-trust") {
      renderZeroTrustLab();
    }

    workspaceContent.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});

function renderCloudBasicsLab() {
  workspaceTitle.textContent = "LAB 01 // Cloud Basics";
  workspaceStatus.textContent = "FOUNDATION MODULE";

  workspaceContent.innerHTML = `
    <div class="lab-terminal">
      <p class="terminal-line">
        <span class="terminal-prompt">root@csfl:~$</span>
        load lab-01
      </p>

      <div class="mission-box">
        <span class="mission-label">MISSION</span>
        <h3>Understand the cloud security responsibility model.</h3>

        <p>
          This module covers IaaS, PaaS, SaaS, shared responsibility
          and the Azure resource hierarchy.
        </p>
      </div>

      <div class="task-list">
        <div class="task-item">
          <span>01</span>
          <p>Explain the difference between IaaS, PaaS and SaaS.</p>
        </div>

        <div class="task-item">
          <span>02</span>
          <p>Identify which security responsibilities remain with the customer.</p>
        </div>

        <div class="task-item">
          <span>03</span>
          <p>Explain Management Group → Subscription → Resource Group → Resource.</p>
        </div>
      </div>
    </div>
  `;
}

function renderIdentityLab() {
  workspaceTitle.textContent = "LAB 02 // Identity & Access";
  workspaceStatus.textContent = "IDENTITY MODULE";

  workspaceContent.innerHTML = `
    <div class="lab-terminal">
      <p class="terminal-line">
        <span class="terminal-prompt">root@csfl:~$</span>
        load lab-02
      </p>

      <div class="mission-box">
        <span class="mission-label">MISSION</span>
        <h3>Review an identity and access model.</h3>

        <p>
          Determine whether users have appropriate privileges and apply
          least-privilege thinking.
        </p>
      </div>

      <div class="identity-grid">
        <div class="identity-card">
          <span>USER</span>
          <strong>Sarah Frey</strong>
          <p>Security Reader</p>
          <small>Subscription scope</small>
        </div>

        <div class="identity-card">
          <span>USER</span>
          <strong>Max Keller</strong>
          <p>Contributor</p>
          <small>rg-security-lab</small>
        </div>

        <div class="identity-card warning">
          <span>PRIVILEGED USER</span>
          <strong>Jannik Richter</strong>
          <p>Owner</p>
          <small>rg-security-lab</small>
        </div>
      </div>

      <div class="task-list">
        <div class="task-item">
          <span>01</span>
          <p>Which account has the highest privilege?</p>
        </div>

        <div class="task-item">
          <span>02</span>
          <p>Why is Max scoped only to the resource group?</p>
        </div>

        <div class="task-item">
          <span>03</span>
          <p>Which role assignments should be monitored most closely?</p>
        </div>
      </div>
    </div>
  `;
}

async function renderZeroTrustLab() {
  workspaceTitle.textContent = "LAB 03 // Zero Trust Investigation";
  workspaceStatus.textContent = "CASE ACTIVE";

  workspaceContent.innerHTML = `
    <div class="loading-state">
      <span class="terminal-prompt">root@csfl:~$</span>
      loading signin-events.csv...
    </div>
  `;

  try {
    const response = await fetch(
      "labs/03-zero-trust/data/signin-events.csv"
    );

    if (!response.ok) {
      throw new Error("Dataset could not be loaded.");
    }

    const csvText = await response.text();
    signInEvents = parseCsv(csvText);

    renderInvestigationWorkspace(signInEvents);
  } catch (error) {
    workspaceContent.innerHTML = `
      <div class="error-box">
        <strong>DATASET LOAD FAILED</strong>
        <p>${escapeHtml(error.message)}</p>
        <p>Make sure the project is running through Live Server.</p>
      </div>
    `;
  }
}

function parseCsv(csvText) {
  const lines = csvText.trim().split(/\r?\n/);

  const headers = lines[0].split(",");

  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const event = {};

    headers.forEach((header, index) => {
      event[header.trim()] = values[index]?.trim() ?? "";
    });

    return event;
  });
}

function renderInvestigationWorkspace(events) {
  workspaceContent.innerHTML = `
    <div class="investigation-layout">
      <section class="case-panel">
        <div class="case-header">
          <div>
            <span class="case-id">CASE // ZT-003</span>
            <h3>Suspicious Cloud Sign-in Activity</h3>
          </div>

          <span class="severity-badge">HIGH PRIORITY</span>
        </div>

        <p>
          Multiple authentication events have been collected.
          Identify activity that violates Zero Trust expectations.
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
            <span class="terminal-prompt">root@csfl:~$</span>
            inspect signin-events.csv
          </div>

          <select id="eventFilter">
            <option value="all">All Events</option>
            <option value="failed">Failed Sign-ins</option>
            <option value="no-mfa">Successful / No MFA</option>
            <option value="high-risk">High Risk</option>
            <option value="unknown-device">Unknown Device</option>
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

            <tbody id="eventTableBody"></tbody>
          </table>
        </div>
      </section>

      <section class="investigation-bottom">
        <div class="tasks-panel">
          <span class="panel-label">INVESTIGATION TASKS</span>

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
            Determine whether failed attempts were followed by success.
          </label>
        </div>

        <div class="decision-panel">
          <span class="panel-label">ANALYST DECISION</span>

          <textarea
            id="analystDecision"
            placeholder="Write your verdict, reasoning and recommended response..."
          ></textarea>

          <div class="decision-actions">
            <button id="saveDecisionBtn">Save Decision</button>
            <button id="revealFindingBtn">Reveal Expected Finding</button>
          </div>

          <div id="decisionStatus"></div>
        </div>
      </section>

      <section id="expectedFinding" class="expected-finding hidden">
        <span class="panel-label">EXPECTED FINDING</span>

        <h3>admin@example.com should receive immediate attention.</h3>

        <p>
          The account had multiple failed sign-ins from the same Russian IP
          before a successful Azure Portal sign-in.
        </p>

        <ul>
          <li>Admin-like account</li>
          <li>High risk level</li>
          <li>Unknown device</li>
          <li>No MFA completed</li>
          <li>Multiple failed attempts before success</li>
          <li>Azure Portal access</li>
        </ul>

        <p class="response-note">
          Suggested response: verify the activity, revoke sessions,
          review role assignments and inspect AuditLogs and AzureActivity.
        </p>
      </section>
    </div>
  `;

  updateInvestigationStats(events);
  renderEventTable(events);

  document
    .getElementById("eventFilter")
    .addEventListener("change", handleEventFilter);

  document
    .getElementById("saveDecisionBtn")
    .addEventListener("click", saveAnalystDecision);

  document
    .getElementById("revealFindingBtn")
    .addEventListener("click", revealExpectedFinding);
}

function updateInvestigationStats(events) {
  const failed = events.filter(
    (event) => event.ResultType !== "0"
  );

  const highRisk = events.filter(
    (event) => event.RiskLevel === "high"
  );

  const noMfaSuccess = events.filter(
    (event) =>
      event.ResultType === "0" &&
      event.MFAStatus === "notCompleted"
  );

  document.getElementById("totalEvents").textContent = events.length;
  document.getElementById("failedEvents").textContent = failed.length;
  document.getElementById("highRiskEvents").textContent = highRisk.length;
  document.getElementById("noMfaEvents").textContent =
    noMfaSuccess.length;
}

function handleEventFilter(event) {
  const selectedFilter = event.target.value;

  let filteredEvents = [...signInEvents];

  if (selectedFilter === "failed") {
    filteredEvents = signInEvents.filter(
      (item) => item.ResultType !== "0"
    );
  }

  if (selectedFilter === "no-mfa") {
    filteredEvents = signInEvents.filter(
      (item) =>
        item.ResultType === "0" &&
        item.MFAStatus === "notCompleted"
    );
  }

  if (selectedFilter === "high-risk") {
    filteredEvents = signInEvents.filter(
      (item) => item.RiskLevel === "high"
    );
  }

  if (selectedFilter === "unknown-device") {
    filteredEvents = signInEvents.filter(
      (item) => item.DeviceTrustType === "Unknown"
    );
  }

  renderEventTable(filteredEvents);
}

function renderEventTable(events) {
  const tableBody = document.getElementById("eventTableBody");

  tableBody.innerHTML = events
    .map((event) => {
      const resultClass =
        event.ResultType === "0" ? "event-success" : "event-failed";

      const resultText =
        event.ResultType === "0" ? "SUCCESS" : "FAILED";

      const riskClass = `risk-${event.RiskLevel}`;

      return `
        <tr>
          <td>${escapeHtml(formatTime(event.TimeGenerated))}</td>

          <td class="user-cell">
            ${escapeHtml(event.UserPrincipalName)}
          </td>

          <td>
            <span class="${resultClass}">
              ${resultText}
            </span>
          </td>

          <td>${escapeHtml(event.IPAddress)}</td>

          <td>${escapeHtml(event.Location)}</td>

          <td>${escapeHtml(event.DeviceName)}</td>

          <td>${escapeHtml(event.AppDisplayName)}</td>

          <td>${escapeHtml(event.MFAStatus)}</td>

          <td>
            <span class="risk-badge ${riskClass}">
              ${escapeHtml(event.RiskLevel.toUpperCase())}
            </span>
          </td>
        </tr>
      `;
    })
    .join("");
}

function formatTime(timestamp) {
  return timestamp
    .replace("2026-09-08T", "")
    .replace("Z", "");
}

function saveAnalystDecision() {
  const decision = document
    .getElementById("analystDecision")
    .value
    .trim();

  const status = document.getElementById("decisionStatus");

  if (!decision) {
    status.textContent =
      "ERROR // Analyst decision cannot be empty.";

    status.className = "decision-error";
    return;
  }

  localStorage.setItem(
    "csfl-zero-trust-decision",
    decision
  );

  status.textContent =
    "SAVED // Analyst decision stored locally.";

  status.className = "decision-success";
}

function revealExpectedFinding() {
  const finding = document.getElementById("expectedFinding");

  finding.classList.toggle("hidden");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}