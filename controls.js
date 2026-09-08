/* =========================================================
   CSFL // GLOBAL CONTROL POSITIONING
   ========================================================= */

function positionResetControl() {
  const topbarSystem =
    document.querySelector(
      ".topbar-system"
    );

  const resetButton =
    document.getElementById(
      "resetProgressBtn"
    );

  if (
    !topbarSystem ||
    !resetButton
  ) {
    return;
  }

  resetButton.textContent =
    "RESET PROGRESS";

  topbarSystem.appendChild(
    resetButton
  );
}


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeGlobalControls() {
  positionResetControl();

  /*
    app.js creates the reset control dynamically.

    This short retry makes sure we also catch it
    if script execution order changes later.
  */

  window.setTimeout(
    positionResetControl,
    100
  );

  window.setTimeout(
    positionResetControl,
    500
  );
}

initializeGlobalControls();