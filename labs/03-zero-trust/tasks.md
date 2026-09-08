# Lab 03 Tasks - Zero Trust Suspicious Sign-in

## Objective

Analyze the synthetic sign-in events and decide which activity should be treated as suspicious using Zero Trust thinking.

## Dataset

Use the local dataset:

```text
data/signin-events.csv
```

## Task 1 - Identify Failed Sign-ins

Find all events where the sign-in failed.

Hint:

```text
ResultType != 0
```

Questions:

1. Which users had failed sign-ins?
2. Which IP addresses were involved?
3. Which locations were involved?

## Task 2 - Identify Successful Sign-ins Without MFA

Find successful sign-ins where MFA was not completed.

Hint:

```text
ResultType == 0
MFAStatus == notCompleted
```

Questions:

1. Which users signed in successfully without MFA?
2. Which applications were accessed?
3. Were the devices known or unknown?

## Task 3 - Find Suspicious Patterns

Look for patterns that combine multiple suspicious indicators.

Suspicious indicators:

- unknown country
- unknown device
- new IP address
- failed attempts before success
- no MFA
- Azure Portal access
- admin-like username
- high risk level

Questions:

1. Which event is most suspicious?
2. Why is it suspicious?
3. Which Zero Trust principle applies?

## Task 4 - Write KQL-Like Logic

Write a KQL-style query that would find successful risky sign-ins.

Example direction:

```kql
SigninLogs
| where ResultType == 0
| where MFAStatus == "notCompleted"
| where DeviceTrustType == "Unknown"
| project TimeGenerated, UserPrincipalName, IPAddress, Location, AppDisplayName, RiskLevel
```

Questions:

1. Which fields are useful for investigation?
2. What would you sort by?
3. Would you filter only admin-like accounts or all users?

## Task 5 - Analyst Decision

Write a short analyst decision.

Use this format:

```text
Verdict:
Reason:
Recommended action:
Logs to check next:
```

## Expected Outcome

After this lab, I should be able to explain why a successful login can still be suspicious and how Zero Trust thinking helps with cloud identity investigations.