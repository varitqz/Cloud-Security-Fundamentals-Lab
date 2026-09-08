# Lab 02 - Identity and Access

## Goal

The goal of this lab is to understand the basic identity and access concepts that are important for Microsoft security fundamentals and cloud security.

This lab focuses on:

- users
- groups
- roles
- permissions
- authentication
- authorization
- RBAC
- least privilege
- privileged access
- identity-based security risks

## 1. Why Identity Matters

In cloud environments, identity is one of the most important security boundaries.

In traditional environments, the network was often the main boundary.

In cloud environments, users can access services from many places:

- office networks
- home networks
- mobile devices
- unmanaged devices
- foreign locations
- public internet

Because of this, cloud security depends heavily on strong identity protection.

Security takeaway:

```text
If an attacker controls an identity, they may be able to access cloud resources without touching the internal network.
```

## 2. Core Terms

## User

A user represents a person or account that can sign in.

Example:

```text
jannik@example.com
```

Security relevance:

- users need authentication
- users need permissions
- users should not have more access than required
- privileged users need stronger protection

## Group

A group is a collection of users.

Groups make access management easier.

Example:

```text
Security Analysts
```

Instead of assigning permissions to every user individually, permissions can be assigned to a group.

Security relevance:

- easier permission management
- cleaner access reviews
- less manual work
- but wrong group membership can create risk

## Role

A role is a set of permissions.

Example roles:

```text
Reader
Contributor
Owner
Global Administrator
Security Reader
Security Administrator
```

Security relevance:

A role defines what actions a user or group can perform.

## Permission

A permission is a specific allowed action.

Example:

```text
Read a resource
Create a virtual machine
Assign a role
Delete a storage account
View security alerts
```

Security relevance:

Permissions should be limited to what is needed for the job.

## 3. Authentication vs Authorization

Authentication and authorization are related, but they are not the same.

## Authentication

Authentication answers:

```text
Who are you?
```

Example:

A user signs in with:

- username
- password
- MFA code

Security note:

Authentication proves the identity of the user.

## Authorization

Authorization answers:

```text
What are you allowed to do?
```

Example:

A user signs in successfully, but can only read resources.

Security note:

A successfully authenticated user should not automatically have administrative permissions.

## Simple Example

```text
Sarah signs in successfully.
That means Sarah is authenticated.

Sarah can only view resources.
That means Sarah is authorized as Reader.
```

Security takeaway:

```text
Authentication controls access to the account.
Authorization controls access to actions and resources.
```

## 4. RBAC

RBAC means Role-Based Access Control.

RBAC assigns permissions through roles.

Basic model:

```text
User or Group
→ Role
→ Scope
→ Permissions
```

## RBAC Scope

A role assignment is applied at a specific scope.

Example scopes:

```text
Management Group
Subscription
Resource Group
Resource
```

Example:

```text
User: Max
Role: Reader
Scope: Resource Group rg-security-lab
```

Meaning:

Max can read resources inside `rg-security-lab`, but he does not automatically control the whole subscription.

## Common Azure RBAC Roles

## Reader

Can view resources but cannot change them.

Security use:

- auditors
- junior analysts
- read-only investigations

## Contributor

Can create and manage resources, but cannot assign access to other users.

Security use:

- engineers who manage resources
- developers in controlled environments

Risk:

A Contributor can still make dangerous changes, such as opening network access or modifying workloads.

## Owner

Can manage resources and assign access to others.

Security use:

- very limited administrative use

Risk:

Owner is highly privileged and should not be assigned casually.

## User Access Administrator

Can manage user access to Azure resources.

Security use:

- access management

Risk:

This role can be dangerous because it can assign permissions to others.

## 5. Least Privilege

Least privilege means:

```text
Give only the minimum access required.
```

Bad example:

```text
Every IT user gets Owner permissions on the subscription.
```

Better example:

```text
Security analysts get Reader or Security Reader.
Engineers get Contributor only on the resource group they manage.
Only a few admins can assign roles.
```

Security value:

- reduces damage from compromised accounts
- reduces accidental mistakes
- makes access easier to review
- limits privilege escalation paths

## 6. Privileged Access

Privileged access means access that can significantly change or control an environment.

Examples:

- Global Administrator
- Privileged Role Administrator
- Owner
- User Access Administrator
- Security Administrator
- Conditional Access Administrator

Security risks:

- attackers target privileged accounts
- privileged accounts can disable security controls
- privileged accounts can create persistence
- privileged accounts can assign more access

Security controls:

- MFA
- least privilege
- just-in-time access
- access reviews
- separate admin accounts
- monitoring role assignments
- monitoring suspicious admin sign-ins

## 7. Identity Scenario

Scenario:

A user named Sarah works as a junior security analyst.

She needs to investigate alerts and read logs, but she does not need to create resources or assign roles.

Bad access design:

```text
Sarah → Owner → Subscription
```

Problem:

Sarah has far more permissions than required.

Better access design:

```text
Sarah → Security Reader → Subscription
Sarah → Reader → Log Analytics Workspace
```

Result:

Sarah can investigate security data, but cannot make high-risk administrative changes.

## 8. Suspicious Role Assignment Scenario

Scenario:

An account assigns the `Global Administrator` role to another user late at night.

Security questions:

- Who initiated the role assignment?
- Which account received the role?
- Was this expected?
- Was there a change request?
- Did the initiator have suspicious sign-in activity?
- Did the target account sign in after receiving the role?
- Was MFA used?
- Was the device known?
- Was the location expected?

Possible response actions:

- verify with the user or admin team
- remove the role if unauthorized
- revoke active sessions
- reset credentials if compromise is suspected
- review audit logs
- check for additional role assignments
- document the incident

## 9. Detection Logic

Suspicious role assignments can be investigated with `AuditLogs`.

Example KQL:

```kql
AuditLogs
| where TimeGenerated > ago(24h)
| where Category == "RoleManagement"
| where OperationName == "Add member to role"
| mv-expand TargetResources
| mv-expand TargetResources.modifiedProperties
| project
    TimeGenerated,
    InitiatorUPN = tostring(InitiatedBy.user.userPrincipalName),
    TargetUPN = tostring(TargetResources.userPrincipalName),
    PropertyName = tostring(TargetResources.modifiedProperties.displayName),
    NewValue = tostring(TargetResources.modifiedProperties.newValue)
| where PropertyName == "Role.DisplayName"
| order by TimeGenerated desc
```

What this query does:

- looks at identity audit logs
- filters for role management events
- finds new role assignments
- expands nested target resource data
- extracts the initiator, target user and assigned role
- sorts the newest events first

Security takeaway:

```text
Role assignments are high-value events because they can change who controls the environment.
```

## 10. Mini Identity Model

Example access model:

```text
Users:
- Sarah Frey
- Max Keller
- Jannik Richter

Groups:
- Security Analysts
- Cloud Engineers
- Cloud Admins

Roles:
- Sarah → Security Reader
- Max → Reader
- Jannik → Owner only in lab scope

Rules:
- No daily user should have permanent high privilege.
- Admin access should be limited and monitored.
- Role assignments should create audit events.
- Suspicious role changes should be investigated.
```

## 11. What I Learned

In this lab, I learned that identity is a central security boundary in cloud environments.

Important points:

- Authentication means proving who a user is.
- Authorization means deciding what the user can do.
- RBAC assigns permissions through roles.
- Role assignments need a scope.
- Least privilege reduces risk.
- Privileged accounts need stronger protection.
- Suspicious role assignments are important audit events.
- Identity logs are critical for cloud security investigations.

## 12. Portfolio Summary

This lab documents the identity and access concepts needed for Microsoft security fundamentals.

It connects SC-900 identity topics with real cloud security thinking, including RBAC, least privilege, privileged access and suspicious role assignment detection.