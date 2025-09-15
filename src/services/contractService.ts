// Types for Contract data
export interface ContractClause {
  title: string
  summary: string
  confidence: number
}

export interface ContractInsight {
  risk: "High" | "Medium" | "Low"
  message: string
}

export interface ContractEvidence {
  source: string
  snippet: string
  relevance: number
}

export interface Contract {
  id: string
  name: string
  parties: string
  start?: string
  expiry: string
  status: "Active" | "Renewal Due" | "Expired" | "Draft"
  risk: "High" | "Medium" | "Low"
  clauses?: ContractClause[]
  insights?: ContractInsight[]
  evidence?: ContractEvidence[]
}

export interface ContractListItem {
  id: string
  name: string
  parties: string
  expiry: string
  status: "Active" | "Renewal Due" | "Expired" | "Draft"
  risk: "High" | "Medium" | "Low"
}

// Mock API service class
class ContractService {
  private baseUrl = '/contracts.json'

  // Simulate API delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Fetch all contracts (GET /contracts)
  async getContracts(): Promise<ContractListItem[]> {
    try {
      await this.delay(500) // Simulate network delay
      
      const response = await fetch(this.baseUrl)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const contracts: Contract[] = await response.json()
      
      // Return only list fields for the contracts list view
      return contracts.map(contract => ({
        id: contract.id,
        name: contract.name,
        parties: contract.parties,
        expiry: contract.expiry,
        status: contract.status,
        risk: contract.risk
      }))
    } catch (error) {
      console.error('Error fetching contracts:', error)
      throw new Error('Failed to fetch contracts')
    }
  }

  // Fetch single contract by ID (GET /contracts/:id)
  async getContractById(id: string): Promise<Contract> {
    try {
      await this.delay(300) // Simulate network delay
      
      const response = await fetch(this.baseUrl)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const contracts: Contract[] = await response.json()
      const contract = contracts.find(c => c.id === id)
      
      if (!contract) {
        throw new Error(`Contract with id ${id} not found`)
      }
      
      return contract
    } catch (error) {
      console.error(`Error fetching contract ${id}:`, error)
      throw new Error(`Failed to fetch contract ${id}`)
    }
  }

  // Search contracts by name or parties
  async searchContracts(query: string): Promise<ContractListItem[]> {
    try {
      const contracts = await this.getContracts()
      const lowercaseQuery = query.toLowerCase()
      
      return contracts.filter(contract => 
        contract.name.toLowerCase().includes(lowercaseQuery) ||
        contract.parties.toLowerCase().includes(lowercaseQuery)
      )
    } catch (error) {
      console.error('Error searching contracts:', error)
      throw new Error('Failed to search contracts')
    }
  }

  // Filter contracts by status
  async getContractsByStatus(status: ContractListItem['status']): Promise<ContractListItem[]> {
    try {
      const contracts = await this.getContracts()
      return contracts.filter(contract => contract.status === status)
    } catch (error) {
      console.error(`Error fetching contracts by status ${status}:`, error)
      throw new Error(`Failed to fetch contracts by status ${status}`)
    }
  }

  // Filter contracts by risk level
  async getContractsByRisk(risk: ContractListItem['risk']): Promise<ContractListItem[]> {
    try {
      const contracts = await this.getContracts()
      return contracts.filter(contract => contract.risk === risk)
    } catch (error) {
      console.error(`Error fetching contracts by risk ${risk}:`, error)
      throw new Error(`Failed to fetch contracts by risk ${risk}`)
    }
  }

  // Get contracts expiring soon (within specified days)
  async getExpiringContracts(withinDays: number = 30): Promise<ContractListItem[]> {
    try {
      const contracts = await this.getContracts()
      const today = new Date()
      const futureDate = new Date(today.getTime() + (withinDays * 24 * 60 * 60 * 1000))
      
      return contracts.filter(contract => {
        const expiryDate = new Date(contract.expiry)
        return expiryDate >= today && expiryDate <= futureDate
      })
    } catch (error) {
      console.error('Error fetching expiring contracts:', error)
      throw new Error('Failed to fetch expiring contracts')
    }
  }
}

// Create and export a singleton instance
export const contractService = new ContractService()

// Export the class as well for testing purposes
export default ContractService