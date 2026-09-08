# SC-900 and AZ-900 Concepts

This note collects important concepts from Azure Fundamentals and Microsoft Security, Compliance, and Identity Fundamentals.

## Cloud Service Models

```text
IaaS = Infrastructure as a Service
PaaS = Platform as a Service
SaaS = Software as a Service
```

## IaaS

IaaS gives me virtual infrastructure.

Examples:

- virtual machines
- virtual networks
- disks
- load balancers

Security focus:

- operating system hardening
- patching
- firewall rules
- network security groups
- identity and access
- monitoring

## PaaS

PaaS gives me a managed platform for applications or data.

Examples:

- Azure App Service
- Azure SQL Database
- Azure Functions

Security focus:

- secure configuration
- identity and access
- secrets management
- network exposure
- logging and monitoring

## SaaS

SaaS gives me a complete application.

Examples:

- Microsoft 365
- Teams
- SharePoint Online
- Outlook Online

Security focus:

- user accounts
- MFA
- Conditional Access
- permissions
- data sharing
- compliance settings

## Shared Responsibility Model

The cloud provider is responsible for security of the cloud.

The customer is responsible for security in the cloud.

Simple rule:

```text
More control = more responsibility
Less control = more provider-managed
```

## Azure Resource Hierarchy

```text
Management Group
└── Subscription
    └── Resource Group
        └── Resource
```

## Identity and Access

Identity and access management controls who can access which resources and what they are allowed to do.

Important terms:

- user
- group
- role
- permission
- authentication
- authorization
- least privilege
- RBAC

## Authentication vs Authorization

Authentication answers:

```text
Who are you?
```

Authorization answers:

```text
What are you allowed to do?
```

Example:

A user signs in successfully with MFA.

That proves the user is authenticated.

It does not automatically mean the user is allowed to manage Azure resources.

## RBAC

RBAC means Role-Based Access Control.

It assigns permissions through roles.

Example roles:

- Reader
- Contributor
- Owner
- User Access Administrator

Security note:

Users should only receive the permissions they actually need.

## Least Privilege

Least privilege means giving a user, group or service only the minimum permissions required for the task.

Security value:

- reduces damage from compromised accounts
- limits accidental changes
- improves auditability
- makes privilege escalation easier to detect

## Zero Trust

Zero Trust is a security model based on three main principles:

```text
Verify explicitly
Use least privilege access
Assume breach
```

## MFA

MFA means Multi-Factor Authentication.

It requires more than just a password.

Example factors:

- password
- authenticator app
- hardware security key
- biometric factor

Security note:

MFA helps protect against stolen passwords.

## Conditional Access

Conditional Access makes access decisions based on signals.

Example signals:

- user
- device
- location
- application
- risk
- sign-in behavior

Example decision:

```text
Allow access only if MFA is completed and the device is compliant.
```

## Defender for Cloud

Microsoft Defender for Cloud helps improve cloud security posture.

It can show:

- recommendations
- secure score
- misconfigurations
- workload protection signals

## Microsoft Sentinel

Microsoft Sentinel is a cloud-native SIEM and SOAR platform.

It is used for:

- collecting security logs
- writing KQL detections
- creating alerts
- investigating incidents
- automating response actions

## Log Analytics Workspace

A Log Analytics Workspace stores logs.

Sentinel uses it as the place where security data is queried with KQL.

Simple flow:

```text
Data Source
→ Data Connector
→ Log Analytics Workspace
→ KQL Query
→ Analytics Rule
→ Alert
→ Incident
```

## KQL

KQL means Kusto Query Language.

It is used to query log data.

Example:

```kql
SigninLogs
| where TimeGenerated > ago(1h)
| where ResultType != 0
| summarize FailedAttempts = count() by IPAddress
| where FailedAttempts > 20
| order by FailedAttempts desc
```

## Important Tables

### SigninLogs

Used for sign-in events.

Security use:

- failed logins
- successful logins
- suspicious IP addresses
- risky admin sign-ins
- location and device checks

### AuditLogs

Used for directory and identity changes.

Security use:

- role assignments
- group changes
- user changes
- administrative activity

### AzureActivity

Used for Azure resource management activity.

Security use:

- resource creation
- role assignment writes
- configuration changes
- administrative actions in Azure

## Personal Summary

AZ-900 gives me the cloud and Azure foundation.

SC-900 gives me the Microsoft security, identity and compliance foundation.

For my Cloud Security path, I need both:

```text
AZ-900 → understand Azure and cloud structure
SC-900 → understand identity, security and Microsoft security tools
KQL    → investigate and detect suspicious activity
```