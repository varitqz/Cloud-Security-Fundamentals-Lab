# Lab 01 - Cloud Basics

## Goal

The goal of this lab is to understand the basic cloud concepts that are important for Azure security and Microsoft security fundamentals.

This lab focuses on:

- cloud service models
- cloud deployment models
- shared responsibility
- Azure resource hierarchy
- basic security implications

## 1. Cloud Service Models

Cloud services are often grouped into three main models:

```text
IaaS → Infrastructure as a Service
PaaS → Platform as a Service
SaaS → Software as a Service
```

## IaaS - Infrastructure as a Service

With IaaS, the cloud provider gives me virtual infrastructure.

Examples:

- virtual machines
- virtual networks
- disks
- firewalls
- load balancers

Security responsibility:

The cloud provider secures the physical datacenter, hardware and basic cloud platform.

I am responsible for things like:

- operating system configuration
- patching the VM
- network rules
- identity and access
- installed applications
- data protection

Example:

```text
Azure Virtual Machine
```

Security note:

IaaS gives a lot of control, but also a lot of responsibility.

## PaaS - Platform as a Service

With PaaS, the cloud provider manages more of the platform.

Examples:

- Azure App Service
- Azure SQL Database
- Azure Functions

Security responsibility:

The provider manages the underlying servers, runtime and platform.

I am still responsible for things like:

- identity and access
- application security
- data security
- configuration
- network exposure

Example:

```text
Azure App Service
```

Security note:

PaaS reduces operational work, but insecure configuration can still create risk.

## SaaS - Software as a Service

With SaaS, the provider delivers a complete application.

Examples:

- Microsoft 365
- Outlook Online
- Teams
- SharePoint Online

Security responsibility:

The provider operates the application and infrastructure.

I am mainly responsible for:

- user accounts
- access permissions
- MFA
- data sharing settings
- device and session policies
- compliance configuration

Example:

```text
Microsoft 365
```

Security note:

In SaaS, identity security becomes extremely important because users access the application directly.

## 2. Cloud Deployment Models

## Public Cloud

A public cloud is operated by a provider and shared across many customers.

Example:

```text
Microsoft Azure
```

Security note:

The provider secures the global cloud infrastructure, but every customer must secure their own identities, data, configurations and workloads.

## Private Cloud

A private cloud is dedicated to one organization.

Security note:

A private cloud gives more control, but the organization usually has more responsibility for operation, maintenance and security.

## Hybrid Cloud

A hybrid cloud connects on-premises infrastructure with cloud services.

Example:

```text
Company datacenter + Azure
```

Security note:

Hybrid environments often need strong identity management, secure network connections and clear access rules.

## 3. Shared Responsibility Model

The shared responsibility model explains which security tasks are handled by the cloud provider and which tasks are handled by the customer.

Basic idea:

```text
Cloud provider → security OF the cloud
Customer       → security IN the cloud
```

## Provider responsibilities

The cloud provider is responsible for:

- physical datacenters
- physical servers
- core networking
- cloud platform availability
- global infrastructure

## Customer responsibilities

The customer is responsible for:

- users and identities
- access permissions
- data classification
- application security
- workload configuration
- network access rules
- monitoring and response

## Security takeaway

The more control I have, the more responsibility I usually have.

```text
IaaS → more customer responsibility
PaaS → shared responsibility
SaaS → more provider-managed, but identity and data still matter
```

## 4. Azure Resource Hierarchy

Azure resources are organized in a hierarchy.

```text
Management Group
└── Subscription
    └── Resource Group
        └── Resource
```

## Management Group

Management groups are used to organize multiple subscriptions.

Security use:

- apply governance at scale
- organize large environments
- apply policies across subscriptions

## Subscription

A subscription is a billing and management boundary.

Security use:

- separate environments
- control access
- organize resources
- manage costs

Example:

```text
Production Subscription
Development Subscription
Security Lab Subscription
```

## Resource Group

A resource group contains related Azure resources.

Security use:

- group resources by workload
- apply RBAC permissions
- manage lifecycle together

Example:

```text
rg-security-lab
```

## Resource

A resource is an actual Azure service.

Examples:

- virtual machine
- virtual network
- storage account
- Log Analytics workspace
- key vault

Security use:

Each resource needs secure configuration, access control and monitoring.

## 5. Security Example

Scenario:

A company runs a web application in Azure.

Simple structure:

```text
Resource Group: rg-webapp-prod

Resources:
- Virtual Network
- Web Subnet
- Database Subnet
- App Service
- Azure SQL Database
- Key Vault
- Log Analytics Workspace
```

Security considerations:

- only required ports should be open
- database should not be directly reachable from the internet
- secrets should be stored in Key Vault
- users should only get the permissions they need
- logs should be collected centrally
- suspicious activity should create alerts

## 6. What I learned

In this lab, I learned that cloud security is not only about tools.

It is about understanding who is responsible for what, how resources are structured and where security controls must be applied.

Important points:

- IaaS gives more control but also more responsibility.
- PaaS reduces infrastructure work but still needs secure configuration.
- SaaS depends heavily on identity, access and data protection.
- Azure resources are organized through management groups, subscriptions, resource groups and resources.
- Cloud security always includes identity, network, data, configuration and monitoring.
- The shared responsibility model is the foundation for understanding cloud security.

## 7. Portfolio Summary

This lab documents the basic cloud concepts needed for Azure and Microsoft security fundamentals.

It connects AZ-900 topics with security thinking and prepares the foundation for later labs about identity, Zero Trust, network security, Defender, Sentinel and incident response.