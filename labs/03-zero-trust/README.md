# Lab 03 - Zero Trust

## Goal

The goal of this lab is to understand the Zero Trust security model and how it applies to cloud security, identity protection and Microsoft security concepts.

This lab focuses on:

- Zero Trust principles
- identity-based access decisions
- MFA
- Conditional Access concepts
- device and location signals
- assume breach thinking
- suspicious sign-in investigation

## 1. What Zero Trust Means

Zero Trust is a security model that does not automatically trust any user, device or network location.

Basic idea:

```text
Never trust automatically.
Always verify.
Limit access.
Assume compromise is possible.
```

In older security models, being inside the company network was often treated as trusted.

In cloud environments, this is not enough because users access services from many locations, devices and networks.

## 2. The Three Zero Trust Principles

Zero Trust is commonly explained through three main principles:

```text
Verify explicitly
Use least privilege access
Assume breach
```

## Verify Explicitly

Access should be verified using multiple signals.

Example signals:

- user identity
- password
- MFA
- device compliance
- location
- IP address
- application
- sign-in risk
- user risk

Security meaning:

A login should not be trusted only because the password is correct.

## Use Least Privilege Access

Users should only receive the access they need.

Examples:

```text
Security Analyst → Security Reader
Cloud Engineer   → Contributor on one resource group
Admin User       → temporary privileged access only
```

Security meaning:

If an account is compromised, least privilege limits the damage.

## Assume Breach

Assume that attackers may already have access somewhere.

This means security teams should:

- collect logs
- monitor suspicious activity
- investigate unusual behavior
- prepare containment steps
- reduce standing privileges
- segment networks
- detect lateral movement

Security meaning:

The goal is not only to prevent attacks, but also to detect and limit them quickly.

## 3. MFA

MFA means Multi-Factor Authentication.

It requires more than one proof of identity.

Examples:

- password
- authenticator app
- security key
- biometric factor

Security value:

MFA helps protect accounts if a password is stolen.

Example:

```text
An attacker knows Sarah's password.
But Sarah has MFA enabled.
The attacker cannot sign in without the second factor.
```

## 4. Conditional Access

Conditional Access is a policy-based access control concept.

It uses signals to decide whether access should be allowed, blocked or require additional controls.

Example signals:

- user
- group
- application
- location
- device compliance
- risk level

Example decisions:

```text
Allow access
Require MFA
Require compliant device
Block access
Limit session
```

## 5. MFA vs Conditional Access

MFA and Conditional Access are related, but they are not the same.

```text
MFA
→ proves identity with an additional factor

Conditional Access
→ decides when MFA or other controls are required
```

Example:

```text
Normal sign-in from known device:
→ allow access

Sign-in from unknown country:
→ require MFA

Sign-in from risky location and unmanaged device:
→ block access
```

## 6. Zero Trust Scenario

Scenario:

Sarah is a junior security analyst.

A successful sign-in appears from her account.

Details:

```text
User: Sarah Frey
Result: Successful sign-in
Location: Unknown country
Device: Unknown device
IP address: New IP
MFA: Not completed
Application: Azure Portal
Time: 02:14 AM
```

Security concern:

Even though the login was successful, the context is suspicious.

A successful login does not automatically mean the activity is safe.

## 7. Investigation Questions

Questions an analyst should ask:

- Is the location expected for Sarah?
- Is the device known?
- Was MFA completed?
- Is the IP address new?
- Did Sarah recently have failed logins?
- Did Sarah access sensitive applications?
- Did Sarah receive new roles?
- Did Sarah modify resources?
- Is there related activity in AuditLogs?
- Is there related activity in AzureActivity?

## 8. Possible Response Actions

Possible response actions:

- contact the user
- require password reset
- revoke active sessions
- require MFA registration
- block the sign-in location
- disable the account temporarily
- review role assignments
- check for persistence
- document the incident

## 9. Detection Logic

A simple risky admin sign-in query can help review successful sign-ins from admin-like accounts.

Example KQL:

```kql
SigninLogs
| where TimeGenerated > ago(24h)
| where ResultType == 0
| where UserPrincipalName has_any ("admin", "adm", "breakglass")
| project
    TimeGenerated,
    UserPrincipalName,
    IPAddress,
    Location,
    DeviceDetail,
    AppDisplayName
| order by TimeGenerated desc
```

Security note:

This query is only a learning heuristic.

In a real environment, privileged users should be identified through role membership, privileged access groups or identity governance data.

## 10. Zero Trust Decision Example

Situation:

```text
Successful sign-in
Unknown country
Unknown device
No MFA
Azure Portal access
```

Decision:

```text
Do not treat this as safe only because the login succeeded.
Investigate the sign-in.
Check related logs.
Contain the account if compromise is suspected.
```

Reasoning:

```text
Zero Trust means verifying context, limiting access and assuming compromise is possible.
```

## 11. What I Learned

In this lab, I learned that Zero Trust is not a single tool.

It is a security model based on verification, least privilege and breach assumption.

Important points:

- A password alone is not enough trust.
- Successful sign-ins can still be suspicious.
- MFA improves identity protection.
- Conditional Access decides when controls are required.
- Device, location and risk signals matter.
- Least privilege limits damage.
- Logs and detections are required because compromise is always possible.

## 12. Portfolio Summary

This lab documents Zero Trust fundamentals and connects them to cloud identity security.

It explains how suspicious sign-ins can be investigated using identity signals, MFA, Conditional Access concepts and KQL detection logic.