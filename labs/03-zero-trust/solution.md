# Lab 03 Solution - Zero Trust Suspicious Sign-in

## Task 1 - Failed Sign-ins

Failed sign-ins are events where:

```text
ResultType != 0
```

Users with failed sign-ins:

```text
sarah@example.com
admin@example.com
```

Suspicious IP addresses:

```text
185.220.101.12
45.134.22.9
```

Locations involved:

```text
Netherlands
Russia
```

## Task 2 - Successful Sign-ins Without MFA

Successful sign-ins without MFA are events where:

```text
ResultType == 0
MFAStatus == notCompleted
```

Matching users:

```text
sarah@example.com
admin@example.com
```

Applications accessed:

```text
Azure Portal
```

Device context:

```text
DeviceName: UNKNOWN
DeviceTrustType: Unknown
```

## Task 3 - Suspicious Patterns

Most suspicious event:

```text
2026-09-08T11:10:00Z
admin@example.com
45.134.22.9
Russia
Azure Portal
MFA not completed
RiskLevel high
```

Why it is suspicious:

- admin-like username
- successful Azure Portal sign-in
- unknown country
- unknown device
- multiple failed attempts before success
- no MFA completed
- high risk level

Zero Trust principle:

```text
Verify explicitly
Use least privilege access
Assume breach
```

This activity should not be trusted just because the sign-in succeeded.

## Task 4 - KQL-Like Logic

Example query:

```kql
SigninLogs
| where TimeGenerated > ago(24h)
| where ResultType == 0
| where MFAStatus == "notCompleted"
| where DeviceTrustType == "Unknown"
| project
    TimeGenerated,
    UserPrincipalName,
    IPAddress,
    Location,
    DeviceName,
    DeviceTrustType,
    AppDisplayName,
    MFAStatus,
    RiskLevel
| order by TimeGenerated desc
```

More focused admin-like version:

```kql
SigninLogs
| where TimeGenerated > ago(24h)
| where ResultType == 0
| where UserPrincipalName has_any ("admin", "adm", "breakglass")
| where MFAStatus == "notCompleted"
| where DeviceTrustType == "Unknown"
| project
    TimeGenerated,
    UserPrincipalName,
    IPAddress,
    Location,
    DeviceName,
    DeviceTrustType,
    AppDisplayName,
    MFAStatus,
    RiskLevel
| order by TimeGenerated desc
```

Useful investigation fields:

- TimeGenerated
- UserPrincipalName
- IPAddress
- Location
- DeviceName
- DeviceTrustType
- AppDisplayName
- MFAStatus
- RiskLevel

## Task 5 - Analyst Decision

```text
Verdict:
Suspicious and should be investigated immediately.

Reason:
The admin@example.com account signed in successfully to Azure Portal from Russia using an unknown device, without MFA, after multiple failed attempts from the same IP address.

Recommended action:
Revoke active sessions, temporarily disable the account or require password reset, verify with the account owner, check role assignments and review related AzureActivity and AuditLogs events.

Logs to check next:
SigninLogs, AuditLogs, AzureActivity.
```

## Lesson

A successful sign-in does not automatically mean safe activity.

Zero Trust requires context-based verification, least privilege and breach assumption.