targetScope = 'resourceGroup'

@description('Azure region for the local learning design. This file is not deployed by the lab.')
param location string = 'westeurope'

@description('Virtual network name.')
param vnetName string = 'security-lab-vnet'

module network './modules/network.bicep' = {
  name: 'networkDeployment'
  params: {
    location: location
    vnetName: vnetName
  }
}

output vnetId string = network.outputs.vnetId
