# Lab Guide

## Recommended flow

1. **Learn** — establish core Azure / Microsoft Security concepts.
2. **Identity** — review role assignment risk and least privilege.
3. **Zero Trust** — investigate a suspicious sign-in chain.
4. **Detect** — run KQL over the synthetic telemetry.
5. **Respond** — investigate and resolve incidents.
6. **Posture** — remediate cloud configuration findings.
7. **IaC** — review the Bicep network design.
8. **Portfolio** — export concise case-study evidence.

## Golden attack chain

The main v5 scenario intentionally correlates three sources:

```text
SigninLogs
admin@example.com
multiple failures → successful sign-in without MFA
        ↓
AuditLogs
Global Administrator assignment
        ↓
AzureActivity
Internet-facing SSH rule added to nsg-web
```

This demonstrates the difference between an isolated signal and a multi-source investigation story.
