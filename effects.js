(() => {
  /* =========================================================
     CLOUD SECURITY FUNDAMENTALS LAB
     INTERACTION ENGINE
     ========================================================= */

  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  const finePointer =
    window.matchMedia(
      "(pointer: fine)"
    ).matches;


  /* =========================================================
     SPOTLIGHT SYSTEM
     ========================================================= */

  const reactiveSelectors = [
    ".lab-card",
    ".status-card",
    ".pipeline-node",
    ".event-console",
    ".case-panel",
    ".tasks-panel",
    ".decision-panel",
    ".expected-finding"
  ];

  function installReactiveEffects(root = document) {
    reactiveSelectors.forEach((selector) => {
      root
        .querySelectorAll(selector)
        .forEach((element) => {
          if (element.dataset.fxReactive === "true") {
            return;
          }

          element.dataset.fxReactive = "true";

          element.classList.add(
            "fx-reactive"
          );

          const spotlight =
            document.createElement("span");

          spotlight.className =
            "fx-spotlight";

          element.appendChild(
            spotlight
          );

          element.addEventListener(
            "pointermove",
            (event) => {
              if (!finePointer) {
                return;
              }

              const rect =
                element.getBoundingClientRect();

              const x =
                event.clientX -
                rect.left;

              const y =
                event.clientY -
                rect.top;

              element.style.setProperty(
                "--fx-x",
                `${x}px`
              );

              element.style.setProperty(
                "--fx-y",
                `${y}px`
              );
            }
          );
        });
    });
  }


  /* =========================================================
     MAGNETIC BUTTON SYSTEM
     ========================================================= */

  function installMagneticButtons(root = document) {
    root
      .querySelectorAll("button")
      .forEach((button) => {
        if (button.dataset.fxMagnetic === "true") {
          return;
        }

        button.dataset.fxMagnetic =
          "true";

        button.classList.add(
          "fx-magnetic"
        );

        button.addEventListener(
          "pointermove",
          (event) => {
            if (
              !finePointer ||
              reduceMotion
            ) {
              return;
            }

            const rect =
              button.getBoundingClientRect();

            const centerX =
              rect.left +
              rect.width / 2;

            const centerY =
              rect.top +
              rect.height / 2;

            const offsetX =
              (
                event.clientX -
                centerX
              ) * 0.055;

            const offsetY =
              (
                event.clientY -
                centerY
              ) * 0.09;

            const clampedX =
              Math.max(
                -4,
                Math.min(
                  4,
                  offsetX
                )
              );

            const clampedY =
              Math.max(
                -3,
                Math.min(
                  3,
                  offsetY
                )
              );

            button.style.setProperty(
              "--fx-btn-x",
              `${clampedX}px`
            );

            button.style.setProperty(
              "--fx-btn-y",
              `${clampedY}px`
            );
          }
        );

        button.addEventListener(
          "pointerleave",
          () => {
            button.style.setProperty(
              "--fx-btn-x",
              "0px"
            );

            button.style.setProperty(
              "--fx-btn-y",
              "0px"
            );
          }
        );
      });
  }


  /* =========================================================
     WORKSPACE ACTIVATION EFFECT
     ========================================================= */

  function activateWorkspaceEffect() {
    const workspace =
      document.querySelector(
        ".workspace"
      );

    if (!workspace) {
      return;
    }

    workspace.classList.remove(
      "fx-workspace-active"
    );

    void workspace.offsetWidth;

    workspace.classList.add(
      "fx-workspace-active"
    );

    window.setTimeout(() => {
      workspace.classList.remove(
        "fx-workspace-active"
      );
    }, 1000);
  }


  /* =========================================================
     LAB BUTTON OBSERVER
     ========================================================= */

  function installWorkspaceButtonEffects() {
    document
      .querySelectorAll(
        ".lab-button"
      )
      .forEach((button) => {
        if (
          button.dataset.fxWorkspace ===
          "true"
        ) {
          return;
        }

        button.dataset.fxWorkspace =
          "true";

        button.addEventListener(
          "click",
          () => {
            window.setTimeout(
              activateWorkspaceEffect,
              120
            );
          }
        );
      });
  }


  /* =========================================================
     CURSOR PARTICLES
     ========================================================= */

  let lastParticleTime = 0;

  function createCursorParticle(
    event
  ) {
    if (
      !finePointer ||
      reduceMotion
    ) {
      return;
    }

    const interactive =
      event.target.closest(
        [
          "button",
          ".lab-card",
          ".status-card",
          ".pipeline-node",
          ".event-console",
          ".case-panel",
          ".decision-panel"
        ].join(",")
      );

    if (!interactive) {
      return;
    }

    const now =
      performance.now();

    if (
      now -
        lastParticleTime <
      42
    ) {
      return;
    }

    lastParticleTime =
      now;

    const particle =
      document.createElement(
        "span"
      );

    particle.className =
      "fx-particle";

    particle.style.left =
      `${event.clientX}px`;

    particle.style.top =
      `${event.clientY}px`;

    document.body.appendChild(
      particle
    );

    window.setTimeout(
      () => {
        particle.remove();
      },
      550
    );
  }

  document.addEventListener(
    "pointermove",
    createCursorParticle,
    {
      passive: true
    }
  );


  /* =========================================================
     HERO PARALLAX
     ========================================================= */

  function installHeroParallax() {
    if (
      !finePointer ||
      reduceMotion
    ) {
      return;
    }

    const hero =
      document.querySelector(
        ".hero"
      );

    const heroSystem =
      document.querySelector(
        ".hero-system"
      );

    if (
      !hero ||
      !heroSystem
    ) {
      return;
    }

    hero.addEventListener(
      "pointermove",
      (event) => {
        const rect =
          hero.getBoundingClientRect();

        const percentX =
          (
            event.clientX -
            rect.left
          ) /
          rect.width -
          0.5;

        const percentY =
          (
            event.clientY -
            rect.top
          ) /
          rect.height -
          0.5;

        const moveX =
          percentX * 14;

        const moveY =
          percentY * 10;

        heroSystem.style.transform =
          `translate3d(${moveX}px, ${moveY}px, 0)`;
      }
    );

    hero.addEventListener(
      "pointerleave",
      () => {
        heroSystem.style.transform =
          "translate3d(0, 0, 0)";
      }
    );
  }


  /* =========================================================
     HERO GLITCH
     ========================================================= */

  function installHeroGlitch() {
    const target =
      document.querySelector(
        ".hero h1 span"
      );

    if (
      !target ||
      reduceMotion
    ) {
      return;
    }

    target.classList.add(
      "fx-glitch"
    );

    target.dataset.text =
      target.textContent.trim();

    const trigger =
      () => {
        target.classList.remove(
          "fx-glitch-active"
        );

        void target.offsetWidth;

        target.classList.add(
          "fx-glitch-active"
        );

        window.setTimeout(
          trigger,
          5000 +
            Math.random() *
              5000
        );
      };

    window.setTimeout(
      trigger,
      2600
    );
  }


  /* =========================================================
     HUD SIGNAL PULSES
     ========================================================= */

  function pulseRandomHudValue() {
    if (reduceMotion) {
      return;
    }

    const values = [
      ...document.querySelectorAll(
        ".hud-readout strong"
      )
    ];

    if (
      values.length === 0
    ) {
      return;
    }

    const target =
      values[
        Math.floor(
          Math.random() *
            values.length
        )
      ];

    target.classList.remove(
      "fx-data-pulse"
    );

    void target.offsetWidth;

    target.classList.add(
      "fx-data-pulse"
    );

    window.setTimeout(
      () => {
        target.classList.remove(
          "fx-data-pulse"
        );
      },
      350
    );
  }

  if (!reduceMotion) {
    window.setInterval(
      pulseRandomHudValue,
      2200
    );
  }


  /* =========================================================
     DYNAMIC CONTENT OBSERVER
     ========================================================= */

  const effectsWorkspaceObserver =
    new MutationObserver(
      (mutations) => {
        let contentChanged =
          false;

        mutations.forEach(
          (mutation) => {
            if (
              mutation.addedNodes.length >
              0
            ) {
              contentChanged =
                true;
            }
          }
        );

        if (!contentChanged) {
          return;
        }

        installReactiveEffects(
          document
        );

        installMagneticButtons(
          document
        );
      }
    );

  const effectsWorkspaceContent =
    document.getElementById(
      "workspaceContent"
    );

  if (effectsWorkspaceContent) {
    effectsWorkspaceObserver.observe(
      effectsWorkspaceContent,
      {
        childList: true,
        subtree: true
      }
    );
  }


  /* =========================================================
     INITIALIZATION
     ========================================================= */

  function initializeEffects() {
    installReactiveEffects(
      document
    );

    installMagneticButtons(
      document
    );

    installWorkspaceButtonEffects();

    installHeroParallax();

    installHeroGlitch();
  }

  initializeEffects();
})();