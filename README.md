# Cloud Security Fundamentals Lab

**Cloud Security Fundamentals Lab** is a local, no-cost learning and portfolio project for Azure security fundamentals, Microsoft security concepts, and basic detection engineering.

The goal of this project is to understand cloud security concepts in a practical way without deploying real Azure resources or creating cloud costs.

## Purpose

This lab helps me learn and document the foundations of cloud security, including:

- cloud service models
- shared responsibility
- Azure resource hierarchy
- identity and access concepts
- Zero Trust principles
- network security basics
- Microsoft Defender and Sentinel concepts
- KQL detection logic
- basic incident response thinking

## Why this project exists

While learning Azure and Microsoft security fundamentals, I wanted a practical lab environment that does not require a paid Azure subscription.

Instead of only reading theory, this project turns the concepts into local exercises, diagrams, KQL examples, Bicep templates and short investigation scenarios.

This allows me to practice cloud security thinking safely and document my learning progress in a structured way.

## Lab Structure

```text
Cloud-Security-Fundamentals-Lab/
├── labs/
│   ├── 01-cloud-basics/
│   ├── 02-identity-and-access/
│   ├── 03-zero-trust/
│   ├── 04-network-security/
│   ├── 05-defender-sentinel-flow/
│   └── 06-incident-response/
├── infra/
├── detections/
└── notes/
```

## Labs

### 01 - Cloud Basics

Focus:

- IaaS, PaaS and SaaS
- public, private and hybrid cloud
- shared responsibility model
- Azure resource hierarchy

Output:

- written concept explanation
- simple architecture examples
- security notes

### 02 - Identity and Access

Focus:

- users
- groups
- roles
- permissions
- authentication
- authorization
- RBAC
- least privilege

Output:

- identity model
- access scenarios
- role assignment examples

### 03 - Zero Trust

Focus:

- verify explicitly
- use least privilege access
- assume breach
- MFA
- Conditional Access concepts

Output:

- Zero Trust scenario
- risk analysis
- security decision notes

### 04 - Network Security

Focus:

- virtual networks
- subnets
- network security groups
- inbound and outbound rules
- web and database segmentation

Output:

- local Bicep template
- architecture explanation
- security rule documentation

### 05 - Defender and Sentinel Flow

Focus:

- Microsoft Defender for Cloud
- Microsoft Sentinel
- Log Analytics Workspace
- data connectors
- KQL queries
- analytics rules
- alerts
- incidents

Output:

- detection flow explanation
- KQL examples
- investigation workflow

### 06 - Incident Response

Focus:

- alert triage
- investigation questions
- containment
- remediation
- lessons learned

Output:

- mini incident report
- timeline
- analyst notes

## Detection Examples

This project includes local KQL detection examples:

- failed logins
- suspicious role assignments
- risky admin sign-ins

These queries are for learning purposes and are not connected to a real Microsoft Sentinel workspace.

## Infrastructure Examples

This project includes local Bicep templates to model Azure security architecture.

The templates are used for learning and documentation only.

They are not deployed automatically.

## No-Cost Design

This lab is designed to avoid cloud costs.

It does not require:

- Azure deployment
- paid subscription
- virtual machines
- Microsoft 365 tenant
- Microsoft Sentinel workspace

All exercises are local and documentation-based unless explicitly stated otherwise.

## Learning Goals

By working through this lab, I want to be able to explain:

- how cloud responsibility is shared between provider and customer
- how Azure resources are structured
- how identity and access control works
- why least privilege matters
- how network segmentation improves security
- how security logs become detections and incidents
- how analysts investigate suspicious activity

## Tech Used

- Markdown
- KQL
- Bicep
- Git
- VS Code

## Project Status

This project is in early development.

Current focus:

- building the lab structure
- documenting AZ-900 and SC-900 fundamentals
- creating local security scenarios
- adding KQL detection examples
- keeping everything no-cost and beginner-friendly

## Disclaimer

This is a personal learning and portfolio project.

It is not affiliated with Microsoft.

The content is for educational purposes only.