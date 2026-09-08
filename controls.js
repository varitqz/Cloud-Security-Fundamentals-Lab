(() => {
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
      return false;
    }

    resetButton.textContent =
      "RESET PROGRESS";

    if (
      resetButton.parentElement !==
      topbarSystem
    ) {
      topbarSystem.appendChild(
        resetButton
      );
    }

    return true;
  }


  /* =========================================================
     WATCH FOR APP.JS CONTROL CREATION
     ========================================================= */

  function watchForResetControl() {
    if (
      positionResetControl()
    ) {
      return;
    }

    const observer =
      new MutationObserver(
        () => {
          if (
            positionResetControl()
          ) {
            observer.disconnect();
          }
        }
      );

    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true
      }
    );

    /*
      Safety stop:
      We do not need to observe the page forever.
    */

    window.setTimeout(
      () => {
        observer.disconnect();

        positionResetControl();
      },
      3000
    );
  }


  /* =========================================================
     INITIALIZE
     ========================================================= */

  function initializeGlobalControls() {
    watchForResetControl();
  }

  initializeGlobalControls();
})();