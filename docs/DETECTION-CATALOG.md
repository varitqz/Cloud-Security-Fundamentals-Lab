# Detection Catalog

v5.0 ships with eight original local detection templates:

1. Failed Logins — `SigninLogs` — MITRE T1110
2. Password Spray — `SigninLogs` — MITRE T1110.003
3. Multiple Failures Then Success — `SigninLogs` — MITRE T1078
4. Risky Admin Sign-in — `SigninLogs` — MITRE T1078
5. Suspicious Role Assignment — `AuditLogs` — MITRE T1098
6. Impossible Travel Review — `SigninLogs` — MITRE T1078
7. Public Management Port Exposure — `AzureActivity` — MITRE T1190
8. Privileged MFA Gap — `SigninLogs` — MITRE T1078

The mappings are learning-oriented context for the synthetic scenarios. They are not production analytics rules and should not be deployed unchanged.
