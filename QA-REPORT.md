# QA Report — Cloud Security Fundamentals Lab v5.0

## Release status

**PASS** — release candidate validated for the bundled local-first experience.

## Static checks

- [x] JavaScript syntax checked with Node for all runtime files.
- [x] HTML parsed for duplicate IDs: none found.
- [x] Nine application view panels present.
- [x] Required CSS and JavaScript assets resolve through relative paths.
- [x] Data assets and standalone `.kql` / `.bicep` examples included.

## Runtime smoke tests

Browser-level smoke testing covered:

- [x] Command dashboard renders.
- [x] All nine views navigate.
- [x] AZ-900 Quick Practice starts.
- [x] Question answering and next-question flow works.
- [x] Identity table renders all 8 seeded role assignments.
- [x] Identity selection and local MFA remediation action work.
- [x] Zero Trust investigation renders 15 seeded sign-in events.
- [x] Zero Trust containment action works.
- [x] Detection catalog renders all 8 detections.
- [x] Default KQL executes and returns a result.
- [x] Detection rule can be saved.
- [x] Query result can be converted into a synthetic alert.
- [x] Suspicious role-assignment query executes.
- [x] Seeded incident queue renders.
- [x] Incident assignment / investigation actions work.
- [x] Five cloud-posture remediation controls render.
- [x] Posture remediation updates local state and Secure Score.
- [x] Bicep security scan returns five checks.
- [x] Portfolio / casebook view renders.
- [x] `Ctrl + K` opens the command palette.
- [x] Reset modal opens.
- [x] Runtime produces no blocking JavaScript errors in the QA pass.

## Compatibility note

The app uses `localStorage` when the browser permits it. The state layer includes an in-memory fallback so the UI remains functional in restricted / opaque test contexts where storage access is blocked.

## Visual QA

Captured release screenshots:

- `assets/screenshots/01-dashboard-v5.png`
- `assets/screenshots/02-detection-workbench-v5.png`
- `assets/screenshots/03-posture-v5.png`
- `assets/screenshots/04-iac-v5.png`

## Known boundaries

- Local KQL support is intentionally a subset, not full Kusto semantics.
- Data, incidents, posture findings and responses are synthetic.
- Security remediations modify only local simulator state.
- Bicep is reviewed locally and never deployed by the application.
