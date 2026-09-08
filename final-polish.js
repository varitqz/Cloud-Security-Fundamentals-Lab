(() => {
  /* =========================================================
     CSFL // FINAL VISUAL POLISH ENGINE
     ========================================================= */

  const finalReduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  const finalFinePointer =
    window.matchMedia(
      "(pointer: fine)"
    ).matches;


  /* =========================================================
     BACKGROUND DATA RAILS
     ========================================================= */

  function createDataRails() {
    if (
      document.querySelector(
        ".data-rail"
      )
    ) {
      return;
    }

    const rail1 =
      document.createElement(
        "span"
      );

    rail1.className =
      "data-rail data-rail-1";

    const rail2 =
      document.createElement(
        "span"
      );

    rail2.className =
      "data-rail data-rail-2";

    document.body.append(
      rail1,
      rail2
    );
  }


  /* =========================================================
     HERO CLOUD FABRIC
     ========================================================= */

  function createHeroFabric() {
    const frame =
      document.querySelector(
        ".system-frame"
      );

    if (
      !frame ||
      frame.querySelector(
        ".cloud-fabric"
      )
    ) {
      return;
    }

    const fabric =
      document.createElement(
        "div"
      );

    fabric.className =
      "cloud-fabric";

    fabric.innerHTML = `
      <span class="fabric-label">
        CLOUD_SECURITY_FABRIC
      </span>

      <span
        class="fabric-link fabric-link-identity"
        data-fabric-group="identity"
      ></span>

      <span
        class="fabric-link fabric-link-device"
        data-fabric-group="device"
      ></span>

      <span
        class="fabric-link fabric-link-policy"
        data-fabric-group="policy"
      ></span>

      <span
        class="fabric-link fabric-link-vnet"
        data-fabric-group="vnet"
      ></span>

      <span
        class="fabric-link fabric-link-workload"
        data-fabric-group="workload"
      ></span>

      <span
        class="fabric-link fabric-link-sentinel"
        data-fabric-group="sentinel"
      ></span>


      <div
        class="fabric-node fabric-identity"
        data-fabric-group="identity"
      >
        IDENTITY
        <small>ENTRA</small>
      </div>

      <div
        class="fabric-node fabric-device"
        data-fabric-group="device"
      >
        DEVICE
        <small>TRUST</small>
      </div>

      <div
        class="fabric-node fabric-policy"
        data-fabric-group="policy"
      >
        POLICY
        <small>CA / MFA</small>
      </div>

      <div
        class="fabric-node fabric-vnet"
        data-fabric-group="vnet"
      >
        VNET
        <small>SEGMENT</small>
      </div>

      <div
        class="fabric-node fabric-workload"
        data-fabric-group="workload"
      >
        WORKLOAD
        <small>COMPUTE</small>
      </div>

      <div
        class="fabric-node fabric-sentinel"
        data-fabric-group="sentinel"
      >
        SENTINEL
        <small>SIEM</small>
      </div>
    `;

    frame.appendChild(
      fabric
    );

    fabric
      .querySelectorAll(
        ".fabric-node"
      )
      .forEach(
        (node) => {
          node.addEventListener(
            "pointerenter",
            () => {
              const group =
                node.dataset.fabricGroup;

              highlightFabricGroup(
                group,
                true
              );
            }
          );

          node.addEventListener(
            "pointerleave",
            () => {
              const group =
                node.dataset.fabricGroup;

              highlightFabricGroup(
                group,
                false
              );
            }
          );
        }
      );
  }

  function highlightFabricGroup(
    group,
    active
  ) {
    document
      .querySelectorAll(
        `[data-fabric-group="${group}"]`
      )
      .forEach(
        (element) => {
          element.classList.toggle(
            "is-active",
            active
          );
        }
      );
  }


  /* =========================================================
     RICH IDLE WORKSPACE
     ========================================================= */

  function enhanceIdleWorkspace() {
    const empty =
      document.querySelector(
        ".workspace-empty"
      );

    if (
      !empty ||
      empty.dataset.finalEnhanced ===
        "true"
    ) {
      return;
    }

    empty.dataset.finalEnhanced =
      "true";

    empty.innerHTML = `
      <div class="idle-security-topology">

        <span class="idle-topology-label">
          LOCAL_CLOUD_SECURITY_TOPOLOGY //
          STANDBY
        </span>


        <svg
          class="idle-topology-svg"
          viewBox="0 0 1000 360"
          preserveAspectRatio="none"
        >
          <path
            d="M500 54 L500 128"
          />

          <path
            d="M500 128 L260 198"
          />

          <path
            d="M500 128 L740 198"
          />

          <path
            d="M260 198 L500 238"
          />

          <path
            d="M740 198 L500 238"
          />

          <path
            d="M500 238 L320 300"
          />

          <path
            d="M500 238 L680 300"
          />
        </svg>


        <div
          class="idle-topology-node idle-node-internet"
        >
          <span>01</span>
          <strong>INTERNET</strong>
          <small>EXTERNAL EDGE</small>
        </div>


        <div
          class="idle-topology-node idle-node-identity"
        >
          <span>02</span>
          <strong>IDENTITY</strong>
          <small>MICROSOFT ENTRA</small>
        </div>


        <div
          class="idle-topology-node idle-node-device"
        >
          <span>03</span>
          <strong>DEVICE</strong>
          <small>TRUST SIGNAL</small>
        </div>


        <div
          class="idle-topology-node idle-node-mfa"
        >
          <span>04</span>
          <strong>MFA / CA</strong>
          <small>ACCESS POLICY</small>
        </div>


        <div class="idle-topology-core">
          CSFL
        </div>


        <div
          class="idle-topology-node idle-node-vnet"
        >
          <span>05</span>
          <strong>VNET</strong>
          <small>SEGMENTED NETWORK</small>
        </div>


        <div
          class="idle-topology-node idle-node-workload"
        >
          <span>06</span>
          <strong>WORKLOAD</strong>
          <small>CLOUD COMPUTE</small>
        </div>


        <div
          class="idle-topology-node idle-node-sentinel"
        >
          <span>07</span>
          <strong>SENTINEL</strong>
          <small>SIEM / RESPONSE</small>
        </div>


        <div class="idle-telemetry">

          <div>
            <span>REGION</span>
            <strong>WESTEUROPE</strong>
          </div>

          <div>
            <span>IDENTITY</span>
            <strong>VERIFIED</strong>
          </div>

          <div>
            <span>PACKETS</span>
            <strong>182 / SEC</strong>
          </div>

          <div>
            <span>SIGNALS</span>
            <strong>017</strong>
          </div>

          <div>
            <span>SIEM STATE</span>
            <strong class="danger">
              ARMED
            </strong>
          </div>

        </div>

      </div>
    `;
  }


  /* =========================================================
     TARGETING CROSSHAIR
     ========================================================= */

  function createCrosshair() {
    if (
      !finalFinePointer ||
      finalReduceMotion ||
      document.querySelector(
        ".final-crosshair"
      )
    ) {
      return;
    }

    const crosshair =
      document.createElement(
        "div"
      );

    crosshair.className =
      "final-crosshair";

    crosshair.innerHTML = `
      <span class="final-crosshair-dot">
      </span>
    `;

    document.body.appendChild(
      crosshair
    );

    const targets = [
      ".lab-card",
      ".event-console",
      ".case-panel",
      ".pipeline-node",
      ".attack-node",
      ".status-card",
      ".fabric-node"
    ].join(",");

    document.addEventListener(
      "pointermove",
      (event) => {
        const interactive =
          event.target.closest(
            targets
          );

        if (!interactive) {
          crosshair.classList.remove(
            "visible"
          );

          return;
        }

        crosshair.style.left =
          `${event.clientX}px`;

        crosshair.style.top =
          `${event.clientY}px`;

        crosshair.classList.add(
          "visible"
        );
      },
      {
        passive: true
      }
    );

    document.addEventListener(
      "pointerleave",
      () => {
        crosshair.classList.remove(
          "visible"
        );
      }
    );
  }


  /* =========================================================
     DYNAMIC WORKSPACE WATCH
     ========================================================= */

  function watchWorkspace() {
    const workspace =
      document.getElementById(
        "workspaceContent"
      );

    if (!workspace) {
      return;
    }

    const observer =
      new MutationObserver(
        () => {
          window.setTimeout(
            enhanceIdleWorkspace,
            20
          );
        }
      );

    observer.observe(
      workspace,
      {
        childList: true,
        subtree: true
      }
    );
  }


  /* =========================================================
     INITIALIZE
     ========================================================= */

  function initializeFinalPolish() {
    createDataRails();

    createHeroFabric();

    enhanceIdleWorkspace();

    createCrosshair();

    watchWorkspace();
  }

  initializeFinalPolish();
})();