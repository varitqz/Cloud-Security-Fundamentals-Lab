(() => {
  /* =========================================================
     CSFL // CLOUD SECURITY AMBIENT VISUALIZATION
     ========================================================= */

  const ambientReduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  /* =========================================================
     ATTACK SURFACE
     ========================================================= */

  function createAttackSurface() {
    if (
      document.querySelector(
        ".cloud-attack-surface"
      )
    ) {
      return;
    }

    const statusGrid =
      document.querySelector(
        ".status-grid"
      );

    if (!statusGrid) {
      return;
    }

    const section =
      document.createElement(
        "section"
      );

    section.className =
      "cloud-attack-surface";

    section.innerHTML = `
      <div class="attack-header">

        <div class="attack-header-left">

          <span class="attack-header-index">
            00
          </span>

          <div>

            <span>
              CLOUD ATTACK SURFACE
            </span>

            <strong>
              Identity-to-Incident Security Path
            </strong>

          </div>

        </div>

        <span class="attack-status">
          TELEMETRY // LIVE
        </span>

      </div>


      <div class="attack-path">

        <div class="attack-link attack-link-main">
        </div>


        <div class="attack-node">

          <div class="attack-node-icon">
            NET
          </div>

          <span class="attack-node-number">
            01
          </span>

          <strong>
            INTERNET
          </strong>

          <small>
            External Surface
          </small>

        </div>


        <div class="attack-node attack-node-critical">

          <div class="attack-node-icon">
            ID
          </div>

          <span class="attack-node-number">
            02
          </span>

          <strong>
            IDENTITY
          </strong>

          <small>
            Entra ID
          </small>

        </div>


        <div class="attack-node">

          <div class="attack-node-icon">
            CA
          </div>

          <span class="attack-node-number">
            03
          </span>

          <strong>
            ACCESS CONTROL
          </strong>

          <small>
            MFA / CA
          </small>

        </div>


        <div class="attack-node">

          <div class="attack-node-icon">
            EDGE
          </div>

          <span class="attack-node-number">
            04
          </span>

          <strong>
            CLOUD EDGE
          </strong>

          <small>
            Public Entry
          </small>

        </div>


        <div class="attack-node">

          <div class="attack-node-icon">
            VN
          </div>

          <span class="attack-node-number">
            05
          </span>

          <strong>
            VNET
          </strong>

          <small>
            Segmentation
          </small>

        </div>


        <div class="attack-node attack-node-critical">

          <div class="attack-node-icon">
            VM
          </div>

          <span class="attack-node-number">
            06
          </span>

          <strong>
            WORKLOAD
          </strong>

          <small>
            Compute / App
          </small>

        </div>


        <div class="attack-node">

          <div class="attack-node-icon">
            LOG
          </div>

          <span class="attack-node-number">
            07
          </span>

          <strong>
            TELEMETRY
          </strong>

          <small>
            Log Analytics
          </small>

        </div>


        <div class="attack-node attack-node-critical">

          <div class="attack-node-icon">
            SIEM
          </div>

          <span class="attack-node-number">
            08
          </span>

          <strong>
            SENTINEL
          </strong>

          <small>
            Incident Response
          </small>

        </div>

      </div>


      <div class="telemetry-grid">

        <div class="telemetry-item">

          <span>
            AUTHENTICATION
          </span>

          <strong>
            VERIFIED
          </strong>

        </div>


        <div class="telemetry-item">

          <span>
            NETWORK POLICY
          </span>

          <strong>
            SEGMENTED
          </strong>

        </div>


        <div class="telemetry-item">

          <span>
            LOG INGESTION
          </span>

          <strong>
            STREAMING
          </strong>

        </div>


        <div class="telemetry-item">

          <span>
            DETECTION ENGINE
          </span>

          <strong class="red">
            ARMED
          </strong>

        </div>


        <div class="telemetry-item">

          <span>
            THREAT STATE
          </span>

          <strong class="red">
            ELEVATED
          </strong>

        </div>

      </div>


      <span
        class="cloud-coordinate cloud-coordinate-a"
      >
        REGION // WESTEUROPE
      </span>

      <span
        class="cloud-coordinate cloud-coordinate-b"
      >
        CSFL_NODE // 09-A7
      </span>
    `;

    statusGrid.before(section);
  }


  /* =========================================================
     BACKGROUND DATA PACKETS
     ========================================================= */

  function createPacketLayer() {
    if (
      ambientReduceMotion ||
      document.querySelector(
        ".cloud-packet-layer"
      )
    ) {
      return;
    }

    const layer =
      document.createElement(
        "div"
      );

    layer.className =
      "cloud-packet-layer";

    document.body.appendChild(
      layer
    );

    const packetCount = 12;

    for (
      let i = 0;
      i < packetCount;
      i++
    ) {
      const packet =
        document.createElement(
          "span"
        );

      packet.className =
        "cloud-packet";

      packet.style.top =
        `${
          8 +
          Math.random() * 84
        }%`;

      packet.style.left =
        `${
          -20 -
          Math.random() * 30
        }px`;

      packet.style.animationDuration =
        `${
          10 +
          Math.random() * 15
        }s`;

      packet.style.animationDelay =
        `-${
          Math.random() * 18
        }s`;

      layer.appendChild(
        packet
      );
    }
  }


  /* =========================================================
     TELEMETRY PULSE
     ========================================================= */

  function pulseTelemetry() {
    if (
      ambientReduceMotion
    ) {
      return;
    }

    const values = [
      ...document.querySelectorAll(
        ".telemetry-item strong"
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

    const oldShadow =
      target.style.textShadow;

    const oldColor =
      target.style.color;

    target.style.color =
      "#ff4054";

    target.style.textShadow =
      "0 0 10px rgba(255,38,61,.65)";

    window.setTimeout(
      () => {
        target.style.textShadow =
          oldShadow;

        target.style.color =
          oldColor;
      },
      260
    );
  }


  /* =========================================================
     INITIALIZE
     ========================================================= */

  function initializeAmbientLayer() {
    createAttackSurface();

    createPacketLayer();

    if (!ambientReduceMotion) {
      window.setInterval(
        pulseTelemetry,
        2400
      );
    }
  }

  initializeAmbientLayer();
})();