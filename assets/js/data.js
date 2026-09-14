(function(){
  const roleAssignments = [
    {User:'Sarah Frey',JobRole:'Junior Security Analyst',AssignedRole:'Security Reader',RoleSystem:'Microsoft Entra ID',Scope:'Tenant',AccessType:'Permanent',MFAEnabled:true,Privileged:false,ExpectedAccess:true,RiskLevel:'low'},
    {User:'Max Keller',JobRole:'Cloud Engineer',AssignedRole:'Contributor',RoleSystem:'Azure RBAC',Scope:'Resource Group rg-security-lab',AccessType:'Permanent',MFAEnabled:true,Privileged:false,ExpectedAccess:true,RiskLevel:'low'},
    {User:'Jannik Richter',JobRole:'Cloud Security Lab Owner',AssignedRole:'Owner',RoleSystem:'Azure RBAC',Scope:'Resource Group rg-security-lab',AccessType:'Permanent',MFAEnabled:true,Privileged:true,ExpectedAccess:true,RiskLevel:'medium'},
    {User:'Lena Hoffmann',JobRole:'Marketing Specialist',AssignedRole:'Reader',RoleSystem:'Azure RBAC',Scope:'Resource Group rg-marketing',AccessType:'Permanent',MFAEnabled:true,Privileged:false,ExpectedAccess:true,RiskLevel:'low'},
    {User:'Tom Weber',JobRole:'Helpdesk Technician',AssignedRole:'Global Administrator',RoleSystem:'Microsoft Entra ID',Scope:'Tenant',AccessType:'Permanent',MFAEnabled:false,Privileged:true,ExpectedAccess:false,RiskLevel:'critical'},
    {User:'service-backup',JobRole:'Backup Service Account',AssignedRole:'Owner',RoleSystem:'Azure RBAC',Scope:'Subscription',AccessType:'Permanent',MFAEnabled:false,Privileged:true,ExpectedAccess:false,RiskLevel:'high'},
    {User:'Sarah Frey',JobRole:'Junior Security Analyst',AssignedRole:'Owner',RoleSystem:'Azure RBAC',Scope:'Subscription',AccessType:'Permanent',MFAEnabled:true,Privileged:true,ExpectedAccess:false,RiskLevel:'critical'},
    {User:'Max Keller',JobRole:'Cloud Engineer',AssignedRole:'Reader',RoleSystem:'Azure RBAC',Scope:'Subscription',AccessType:'Permanent',MFAEnabled:true,Privileged:false,ExpectedAccess:false,RiskLevel:'medium'}
  ];

  const signins = [
    {TimeGenerated:'2026-09-09T16:41:02Z',UserPrincipalName:'admin@example.com',IPAddress:'185.220.101.44',Country:'Russia',City:'Moscow',Device:'Unknown Linux',AppDisplayName:'Azure Portal',ResultType:50126,Result:'Failure',MFAUsed:false,RiskLevel:'high',SessionId:'S-9001'},
    {TimeGenerated:'2026-09-09T16:41:28Z',UserPrincipalName:'admin@example.com',IPAddress:'185.220.101.44',Country:'Russia',City:'Moscow',Device:'Unknown Linux',AppDisplayName:'Azure Portal',ResultType:50126,Result:'Failure',MFAUsed:false,RiskLevel:'high',SessionId:'S-9002'},
    {TimeGenerated:'2026-09-09T16:42:03Z',UserPrincipalName:'admin@example.com',IPAddress:'185.220.101.44',Country:'Russia',City:'Moscow',Device:'Unknown Linux',AppDisplayName:'Azure Portal',ResultType:50126,Result:'Failure',MFAUsed:false,RiskLevel:'high',SessionId:'S-9003'},
    {TimeGenerated:'2026-09-09T16:42:27Z',UserPrincipalName:'admin@example.com',IPAddress:'185.220.101.44',Country:'Russia',City:'Moscow',Device:'Unknown Linux',AppDisplayName:'Azure Portal',ResultType:50126,Result:'Failure',MFAUsed:false,RiskLevel:'high',SessionId:'S-9004'},
    {TimeGenerated:'2026-09-09T16:43:12Z',UserPrincipalName:'admin@example.com',IPAddress:'185.220.101.44',Country:'Russia',City:'Moscow',Device:'Unknown Linux',AppDisplayName:'Azure Portal',ResultType:0,Result:'Success',MFAUsed:false,RiskLevel:'high',SessionId:'S-9005'},
    {TimeGenerated:'2026-09-09T15:21:15Z',UserPrincipalName:'sarah@contoso.com',IPAddress:'91.42.18.8',Country:'Germany',City:'Hamburg',Device:'WIN11-CORP-22',AppDisplayName:'Microsoft 365',ResultType:0,Result:'Success',MFAUsed:true,RiskLevel:'low',SessionId:'S-1001'},
    {TimeGenerated:'2026-09-09T14:52:44Z',UserPrincipalName:'max@contoso.com',IPAddress:'91.38.44.10',Country:'Germany',City:'Hamburg',Device:'WIN11-CORP-31',AppDisplayName:'Azure Portal',ResultType:0,Result:'Success',MFAUsed:true,RiskLevel:'low',SessionId:'S-1002'},
    {TimeGenerated:'2026-09-09T14:40:10Z',UserPrincipalName:'lena@contoso.com',IPAddress:'91.41.90.7',Country:'Germany',City:'Hamburg',Device:'MAC-CORP-08',AppDisplayName:'Microsoft 365',ResultType:50126,Result:'Failure',MFAUsed:false,RiskLevel:'low',SessionId:'S-1003'},
    {TimeGenerated:'2026-09-09T14:40:26Z',UserPrincipalName:'lena@contoso.com',IPAddress:'91.41.90.7',Country:'Germany',City:'Hamburg',Device:'MAC-CORP-08',AppDisplayName:'Microsoft 365',ResultType:0,Result:'Success',MFAUsed:true,RiskLevel:'low',SessionId:'S-1004'},
    {TimeGenerated:'2026-09-09T13:05:30Z',UserPrincipalName:'tom@contoso.com',IPAddress:'91.40.22.19',Country:'Germany',City:'Hamburg',Device:'WIN11-CORP-18',AppDisplayName:'Entra Admin Center',ResultType:0,Result:'Success',MFAUsed:false,RiskLevel:'medium',SessionId:'S-1005'},
    {TimeGenerated:'2026-09-09T12:19:04Z',UserPrincipalName:'sarah@contoso.com',IPAddress:'91.42.18.8',Country:'Germany',City:'Hamburg',Device:'WIN11-CORP-22',AppDisplayName:'Azure Portal',ResultType:50126,Result:'Failure',MFAUsed:false,RiskLevel:'low',SessionId:'S-1006'},
    {TimeGenerated:'2026-09-09T11:45:16Z',UserPrincipalName:'max@contoso.com',IPAddress:'18.206.55.32',Country:'United States',City:'Ashburn',Device:'Unknown Browser',AppDisplayName:'Azure Portal',ResultType:50126,Result:'Failure',MFAUsed:false,RiskLevel:'medium',SessionId:'S-1007'},
    {TimeGenerated:'2026-09-09T11:45:44Z',UserPrincipalName:'max@contoso.com',IPAddress:'18.206.55.32',Country:'United States',City:'Ashburn',Device:'Unknown Browser',AppDisplayName:'Azure Portal',ResultType:50126,Result:'Failure',MFAUsed:false,RiskLevel:'medium',SessionId:'S-1008'},
    {TimeGenerated:'2026-09-09T10:31:55Z',UserPrincipalName:'service-backup@contoso.com',IPAddress:'10.10.4.12',Country:'Germany',City:'Frankfurt',Device:'Azure Automation',AppDisplayName:'Azure Resource Manager',ResultType:0,Result:'Success',MFAUsed:false,RiskLevel:'low',SessionId:'S-1009'},
    {TimeGenerated:'2026-09-09T09:03:17Z',UserPrincipalName:'jannik@contoso.com',IPAddress:'91.43.16.90',Country:'Germany',City:'Hamburg',Device:'WIN11-LAB-01',AppDisplayName:'Azure Portal',ResultType:0,Result:'Success',MFAUsed:true,RiskLevel:'low',SessionId:'S-1010'}
  ];

  const auditLogs = [
    {TimeGenerated:'2026-09-09T16:45:08Z',Category:'RoleManagement',OperationName:'Add member to role',InitiatorUPN:'admin@example.com',TargetUPN:'admin@example.com',PropertyName:'Role.DisplayName',NewValue:'Global Administrator',Result:'success',Risk:'critical'},
    {TimeGenerated:'2026-09-09T15:40:23Z',Category:'RoleManagement',OperationName:'Add member to role',InitiatorUPN:'cloudadmin@contoso.com',TargetUPN:'sarah@contoso.com',PropertyName:'Role.DisplayName',NewValue:'Security Reader',Result:'success',Risk:'low'},
    {TimeGenerated:'2026-09-09T14:11:04Z',Category:'UserManagement',OperationName:'Update user',InitiatorUPN:'helpdesk@contoso.com',TargetUPN:'lena@contoso.com',PropertyName:'Department',NewValue:'Marketing',Result:'success',Risk:'low'},
    {TimeGenerated:'2026-09-09T12:02:48Z',Category:'RoleManagement',OperationName:'Add member to role',InitiatorUPN:'tom@contoso.com',TargetUPN:'tom@contoso.com',PropertyName:'Role.DisplayName',NewValue:'Global Administrator',Result:'success',Risk:'critical'},
    {TimeGenerated:'2026-09-09T10:44:31Z',Category:'GroupManagement',OperationName:'Add member to group',InitiatorUPN:'helpdesk@contoso.com',TargetUPN:'max@contoso.com',PropertyName:'Group.DisplayName',NewValue:'Cloud Engineers',Result:'success',Risk:'low'},
    {TimeGenerated:'2026-09-09T09:16:07Z',Category:'ApplicationManagement',OperationName:'Add service principal',InitiatorUPN:'cloudadmin@contoso.com',TargetUPN:'svc-backup',PropertyName:'App.DisplayName',NewValue:'Backup Automation',Result:'success',Risk:'medium'}
  ];

  const azureActivity = [
    {TimeGenerated:'2026-09-09T16:49:20Z',Caller:'admin@example.com',OperationName:'Microsoft.Network/networkSecurityGroups/securityRules/write',ResourceGroup:'rg-security-lab',Resource:'nsg-web',Status:'Succeeded',Risk:'high',Details:'Created inbound TCP/22 allow from Internet'},
    {TimeGenerated:'2026-09-09T15:02:12Z',Caller:'max@contoso.com',OperationName:'Microsoft.Compute/virtualMachines/start/action',ResourceGroup:'rg-security-lab',Resource:'vm-web-01',Status:'Succeeded',Risk:'low',Details:'Started VM'},
    {TimeGenerated:'2026-09-09T13:38:54Z',Caller:'jannik@contoso.com',OperationName:'Microsoft.Network/virtualNetworks/write',ResourceGroup:'rg-security-lab',Resource:'security-lab-vnet',Status:'Succeeded',Risk:'low',Details:'Updated VNet tags'},
    {TimeGenerated:'2026-09-09T11:15:45Z',Caller:'service-backup@contoso.com',OperationName:'Microsoft.Storage/storageAccounts/listKeys/action',ResourceGroup:'rg-backup',Resource:'stbackup01',Status:'Succeeded',Risk:'medium',Details:'Listed storage account keys'},
    {TimeGenerated:'2026-09-09T09:26:03Z',Caller:'cloudadmin@contoso.com',OperationName:'Microsoft.Authorization/roleAssignments/write',ResourceGroup:'rg-security-lab',Resource:'rg-security-lab',Status:'Succeeded',Risk:'medium',Details:'Assigned Contributor to Max Keller'}
  ];

  const detections = [
    {id:'failed-logins',name:'Failed Logins',source:'SigninLogs',severity:'medium',mitre:'T1110',technique:'Brute Force',query:`SigninLogs\n| where ResultType != 0\n| summarize FailedAttempts = count() by UserPrincipalName, IPAddress\n| where FailedAttempts > 2\n| order by FailedAttempts desc`,description:'Find repeated failed sign-ins grouped by user and IP.',useCase:'Brute force, credential stuffing or password spray triage.'},
    {id:'password-spray',name:'Password Spray',source:'SigninLogs',severity:'high',mitre:'T1110.003',technique:'Password Spraying',query:`SigninLogs\n| where ResultType != 0\n| summarize Attempts = count() by IPAddress\n| where Attempts > 3\n| order by Attempts desc`,description:'Find source IPs generating repeated failed sign-ins.',useCase:'Identify a single source testing credentials across identities.'},
    {id:'fail-then-success',name:'Multiple Failures Then Success',source:'SigninLogs',severity:'high',mitre:'T1078',technique:'Valid Accounts',query:`SigninLogs\n| where UserPrincipalName == "admin@example.com"\n| project TimeGenerated, UserPrincipalName, IPAddress, Country, Device, Result, MFAUsed\n| order by TimeGenerated asc`,description:'Review a suspicious sequence of failures followed by a success.',useCase:'Potential credential compromise after repeated authentication failures.'},
    {id:'risky-admin',name:'Risky Admin Sign-in',source:'SigninLogs',severity:'high',mitre:'T1078',technique:'Valid Accounts',query:`SigninLogs\n| where ResultType == 0\n| where UserPrincipalName has_any ("admin", "tom")\n| project TimeGenerated, UserPrincipalName, IPAddress, Country, Device, MFAUsed, RiskLevel\n| order by TimeGenerated desc`,description:'Review successful sign-ins from admin-like accounts.',useCase:'Privileged account compromise and suspicious admin access.'},
    {id:'role-assignment',name:'Suspicious Role Assignment',source:'AuditLogs',severity:'critical',mitre:'T1098',technique:'Account Manipulation',query:`AuditLogs\n| where Category == "RoleManagement"\n| where OperationName == "Add member to role"\n| project TimeGenerated, InitiatorUPN, TargetUPN, NewValue, Risk\n| order by TimeGenerated desc`,description:'Surface new Entra role assignments and their initiator.',useCase:'Privilege escalation and persistence through directory role assignment.'},
    {id:'impossible-travel',name:'Impossible Travel Review',source:'SigninLogs',severity:'medium',mitre:'T1078',technique:'Valid Accounts',query:`SigninLogs\n| project TimeGenerated, UserPrincipalName, Country, City, IPAddress, Result\n| order by UserPrincipalName asc`,description:'Review sign-in geography per user for impossible travel patterns.',useCase:'Potential stolen credentials used from distant geographies.'},
    {id:'public-exposure',name:'Public Management Port Exposure',source:'AzureActivity',severity:'high',mitre:'T1190',technique:'Exploit Public-Facing Application',query:`AzureActivity\n| where OperationName has "securityRules/write"\n| project TimeGenerated, Caller, ResourceGroup, Resource, Details, Risk\n| order by TimeGenerated desc`,description:'Find NSG rule changes that may expose management ports.',useCase:'Detect insecure control-plane network changes.'},
    {id:'priv-mfa-gap',name:'Privileged MFA Gap',source:'SigninLogs',severity:'critical',mitre:'T1078',technique:'Valid Accounts',query:`SigninLogs\n| where ResultType == 0\n| where MFAUsed == false\n| where UserPrincipalName has_any ("admin", "tom")\n| project TimeGenerated, UserPrincipalName, IPAddress, Country, AppDisplayName, RiskLevel\n| order by TimeGenerated desc`,description:'Find successful privileged-looking sign-ins without MFA.',useCase:'Prioritize risky privileged authentication paths.'}
  ];

  const postureResources = [
    {id:'vm-web-01',type:'Virtual Machine',group:'rg-security-lab',location:'West Europe',status:'Running'},
    {id:'nsg-web',type:'Network Security Group',group:'rg-security-lab',location:'West Europe',status:'Active'},
    {id:'security-lab-vnet',type:'Virtual Network',group:'rg-security-lab',location:'West Europe',status:'Active'},
    {id:'stpubliclab',type:'Storage Account',group:'rg-security-lab',location:'West Europe',status:'Active'},
    {id:'kv-security-lab',type:'Key Vault',group:'rg-security-lab',location:'West Europe',status:'Active'},
    {id:'law-security-lab',type:'Log Analytics Workspace',group:'rg-security-lab',location:'West Europe',status:'Active'}
  ];

  const postureFindings = [
    {id:'F-001',severity:'critical',resource:'nsg-web',title:'RDP open to the Internet',category:'Networking',points:18,remediated:false,recommendation:'Restrict TCP/3389 to approved admin sources or remove direct exposure.'},
    {id:'F-002',severity:'high',resource:'nsg-web',title:'SSH exposed from Internet',category:'Networking',points:14,remediated:false,recommendation:'Remove public TCP/22 or use a controlled administration path.'},
    {id:'F-003',severity:'high',resource:'stpubliclab',title:'Public blob access enabled',category:'Data Protection',points:12,remediated:false,recommendation:'Disable anonymous public blob access unless explicitly required.'},
    {id:'F-004',severity:'medium',resource:'kv-security-lab',title:'Purge protection disabled',category:'Key Management',points:8,remediated:false,recommendation:'Enable purge protection for stronger recovery against destructive changes.'},
    {id:'F-005',severity:'medium',resource:'vm-web-01',title:'Management path lacks Just-In-Time controls',category:'Compute',points:7,remediated:false,recommendation:'Use restricted administration and time-bound access controls.'}
  ];

  const incidents = [
    {id:'INC-2401',title:'Suspicious admin sign-in after repeated failures',severity:'critical',status:'Active',owner:'Unassigned',created:'2026-09-09T16:43:30Z',entity:'admin@example.com',summary:'Four failed sign-ins from Russia were followed by a successful Azure Portal sign-in without MFA.',evidence:['185.220.101.44 / Russia','Unknown Linux device','MFA not used','Successful session S-9005'],timeline:[
      {time:'16:41',title:'Authentication failures begin',detail:'Repeated ResultType 50126 from 185.220.101.44.'},
      {time:'16:43',title:'Successful sign-in',detail:'admin@example.com signs in to Azure Portal without MFA.'},
      {time:'16:45',title:'Role assignment observed',detail:'Global Administrator role assignment created by admin@example.com.'},
      {time:'16:49',title:'NSG rule changed',detail:'Inbound TCP/22 from Internet added to nsg-web.'}
    ],notes:[],actions:[]},
    {id:'INC-2402',title:'Unexpected Global Administrator assignment',severity:'critical',status:'New',owner:'Unassigned',created:'2026-09-09T12:03:10Z',entity:'tom@contoso.com',summary:'Helpdesk technician received a permanent Global Administrator role without expected access.',evidence:['Role: Global Administrator','MFA: disabled','Access: permanent','ExpectedAccess: false'],timeline:[{time:'12:02',title:'Role assignment',detail:'tom@contoso.com added to Global Administrator.'}],notes:[],actions:[]},
    {id:'INC-2403',title:'Storage key enumeration by service account',severity:'medium',status:'Investigating',owner:'Jannik',created:'2026-09-09T11:16:00Z',entity:'service-backup@contoso.com',summary:'Backup service account with subscription Owner listed storage keys.',evidence:['Owner at Subscription','Permanent access','Storage listKeys operation'],timeline:[{time:'11:15',title:'Storage keys listed',detail:'service-backup called listKeys on stbackup01.'}],notes:[],actions:[]}
  ];

  const modules = [
    {index:'01',title:'Certification Training',desc:'AZ-900 and SC-900 question banks, exam mode, weak areas and history.',view:'learn',tag:'100 questions'},
    {index:'02',title:'Identity & Access Review',desc:'Analyze Entra roles, Azure RBAC, scope, MFA and standing privilege.',view:'identity',tag:'8 assignments'},
    {index:'03',title:'Zero Trust Investigation',desc:'Investigate risky sign-ins using identity, device, location and MFA context.',view:'zero-trust',tag:'15 events'},
    {index:'04',title:'Detection Workbench',desc:'Run local KQL, explain queries and convert detection hits into alerts.',view:'detections',tag:'8 detections'},
    {index:'05',title:'Incident Response',desc:'Triage evidence, document actions, contain sessions and resolve incidents.',view:'incidents',tag:'SOC workflow'},
    {index:'06',title:'Cloud Posture',desc:'Review Defender-style findings and improve a synthetic Secure Score.',view:'posture',tag:'5 findings'},
    {index:'07',title:'Bicep Security Review',desc:'Inspect segmented networking and run a local static IaC security scan.',view:'iac',tag:'No deploy'},
    {index:'08',title:'Portfolio Casebook',desc:'Export completed investigations as concise portfolio-ready case studies.',view:'portfolio',tag:'Evidence'}
  ];

  const iac = {
    main:`targetScope = 'resourceGroup'\n\nparam location string = 'westeurope'\nparam vnetName string = 'security-lab-vnet'\n\nmodule network './modules/network.bicep' = {\n  name: 'networkDeployment'\n  params: {\n    location: location\n    vnetName: vnetName\n  }\n}\n\noutput vnetId string = network.outputs.vnetId`,
    network:`param location string\nparam vnetName string\n\nresource webNsg 'Microsoft.Network/networkSecurityGroups@2024-05-01' = {\n  name: 'nsg-web'\n  location: location\n  properties: {\n    securityRules: [\n      {\n        name: 'allow-https-inbound'\n        properties: {\n          priority: 100\n          direction: 'Inbound'\n          access: 'Allow'\n          protocol: 'Tcp'\n          sourcePortRange: '*'\n          destinationPortRange: '443'\n          sourceAddressPrefix: 'Internet'\n          destinationAddressPrefix: '*'\n        }\n      }\n    ]\n  }\n}\n\nresource dbNsg 'Microsoft.Network/networkSecurityGroups@2024-05-01' = {\n  name: 'nsg-db'\n  location: location\n  properties: {\n    securityRules: [\n      {\n        name: 'allow-web-to-db'\n        properties: {\n          priority: 100\n          direction: 'Inbound'\n          access: 'Allow'\n          protocol: 'Tcp'\n          sourcePortRange: '*'\n          destinationPortRange: '1433'\n          sourceAddressPrefix: '10.0.1.0/24'\n          destinationAddressPrefix: '*'\n        }\n      }\n    ]\n  }\n}\n\nresource vnet 'Microsoft.Network/virtualNetworks@2024-05-01' = {\n  name: vnetName\n  location: location\n  properties: {\n    addressSpace: { addressPrefixes: [ '10.0.0.0/16' ] }\n    subnets: [\n      { name: 'web-subnet'; properties: { addressPrefix: '10.0.1.0/24'; networkSecurityGroup: { id: webNsg.id } } }\n      { name: 'db-subnet'; properties: { addressPrefix: '10.0.2.0/24'; networkSecurityGroup: { id: dbNsg.id } } }\n    ]\n  }\n}\n\noutput vnetId string = vnet.id`
  };

  window.CSFLData = {roleAssignments,signins,auditLogs,azureActivity,detections,postureResources,postureFindings,incidents,modules,iac};
})();
