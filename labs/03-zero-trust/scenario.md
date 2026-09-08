# Zero Trust Scenario - Suspicious Sign-in

## Scenario Overview

This scenario documents a suspicious cloud sign-in event and applies Zero Trust thinking to the investigation.

## Event Summary

```text
User: Sarah Frey
Role: Junior Security Analyst
Application: Azure Portal
Sign-in result: Success
Time: 02:14 AM
Location: Unknown country
Device: Unknown device
IP address: New IP address
MFA: Not completed
```

## Why This Is Suspicious

The sign-in was successful, but the context is risky.

Suspicious indicators:

- successful Azure Portal access
- unusual time
- unknown country
- unknown device
- new IP address
- no MFA completion
- security-related user account

## Zero Trust Analysis

Zero Trust principle:

```text
Never trust automatically.
Verify explicitly.
Use least privilege.
Assume breach.
```

This login should not be treated as safe only because the password was correct.

## Investigation Questions

An analyst should ask:

- Is Sarah currently traveling?
- Has Sarah used this IP address before?
- Is the device registered or compliant?
- Was MFA required?
- Did Sarah recently have failed login attempts?
- Did Sarah access sensitive resources?
- Did Sarah receive new roles?
- Did Sarah modify security settings?
- Is there related activity in AuditLogs?
- Is there related activity in AzureActivity?

## Logs To Review

Relevant log sources:

```text
SigninLogs
AuditLogs
AzureActivity
```

## Possible KQL Query

```kql
SigninLogs
| where TimeGenerated > ago(24h)
| where UserPrincipalName == "sarah@example.com"
| project
    TimeGenerated,
    UserPrincipalName,
    ResultType,
    IPAddress,
    Location,
    DeviceDetail,
    AppDisplayName
| order by TimeGenerated desc
```

## Possible Response Actions

Depending on the investigation result:

- contact Sarah
- revoke active sessions
- require password reset
- require MFA registration
- temporarily disable the account
- review role assignments
- check for persistence
- document the incident

## Decision

Initial decision:

```text
Treat as suspicious until verified.
```

Reason:

```text
The sign-in contains multiple risk indicators and involves access to the Azure Portal.
```

## Lesson Learned

A successful sign-in does not automatically mean safe activity.

Cloud security decisions should consider:

- identity
- device
- location
- application
- risk
- behavior
- privileges