# Cloud Security Fundamentals Lab v5.0 — Release Notes

## BUILD. DETECT. DEFEND.

v5.0 is the first release where the lab behaves as a connected defensive-security product rather than a set of separate learning pages.

### The major change

The same synthetic environment now flows through the complete analyst story:

```text
signal → identity context → query → detection → alert → incident → response → posture → evidence
```

A learner can investigate a suspicious authentication chain, inspect a related Entra role assignment, correlate an Azure control-plane change, run KQL, generate an alert, work the incident, simulate containment and preserve the result as a portfolio case.

### New flagship modules

**Detection Workbench**  
Eight detection templates run against the local synthetic telemetry. Queries can be explained, executed, saved and promoted into alerts.

**Incident Response Center**  
Seeded incidents include evidence and timelines. The analyst can assign, investigate, contain, resolve and document the case.

**Cloud Posture**  
Five synthetic cloud findings affect a local Secure Score. Remediation changes the state instead of merely showing an answer.

**Bicep Security Review**  
A local IaC workspace teaches segmentation and NSG intent without deploying resources.

**Portfolio Casebook**  
Completed security work becomes concise, exportable evidence of the analysis and decision process.

### Training remains intact

The 100-question AZ-900 / SC-900 practice engine remains available, alongside Identity & Access and Zero Trust labs.

### Operating model

- Local browser runtime
- Synthetic data only
- Browser storage where available
- No paid cloud resources
- No Azure tenant required
- No backend required

### Scope

This is an educational simulator. It deliberately approximates selected Azure / Microsoft Security workflows and a small KQL subset. It is not Microsoft Sentinel, Defender for Cloud, Azure Data Explorer or a production SIEM.
