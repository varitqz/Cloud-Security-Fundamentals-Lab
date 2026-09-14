# Architecture — Cloud Security Fundamentals Lab v5.0

The lab is intentionally **local-first**. The browser is the runtime and `localStorage` is the state layer. No Azure subscription, tenant, VM, Sentinel workspace, or paid resource is required.

```text
Browser UI
├── Training / Quiz Engine
├── Identity & Access Review
├── Zero Trust Investigation
├── Local KQL Runtime
├── Detection Rule Library
├── Incident Response Center
├── Cloud Posture Simulator
├── Bicep Security Review
└── Portfolio Casebook
        ↓
   localStorage state
        ↓
 synthetic source datasets
```

## Source datasets

- `SigninLogs` — synthetic sign-in telemetry.
- `AuditLogs` — flattened synthetic Microsoft Entra audit events.
- `AzureActivity` — synthetic Azure control-plane events.
- Role assignments — mixed Microsoft Entra roles and Azure RBAC assignments.

## Local KQL subset

The v5 runtime is educational. It supports a deliberately small subset used by this project:

- table selection
- `where`
- `project`
- `summarize Alias = count() by ...`
- `order by`
- `take`
- flattened/no-op `mv-expand`
- string `has` / `has_any`
- simple comparisons

It is **not** a replacement for Azure Data Explorer, Log Analytics, or Microsoft Sentinel.

## Security design

The product contains synthetic data only. Exported state can include user-written analyst notes, so users should still review exports before publishing them.
