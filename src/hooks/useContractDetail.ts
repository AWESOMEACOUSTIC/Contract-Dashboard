import { useState, useEffect } from 'react'
import { contractService, type Contract } from '../services/contractService'

interface ContractDetailCache {
  [id: string]: {
    data: Contract
    timestamp: number
  }
}

// Cache duration: 3 minutes for individual contracts
const CACHE_DURATION = 3 * 60 * 1000

// Module-level cache for contract details
let contractDetailCache: ContractDetailCache = {}

const isCacheValid = (id: string) => {
  const cached = contractDetailCache[id]
  return cached && (Date.now() - cached.timestamp) < CACHE_DURATION
}

interface UseContractDetailResult {
  contract: Contract | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useContractDetail(id: string | undefined): UseContractDetailResult {
  const [contract, setContract] = useState<Contract | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContract = async (force = false) => {
    if (!id) {
      setError('Contract ID is required')
      setLoading(false)
      return
    }

    // Check cache first
    if (isCacheValid(id) && !force) {
      setContract(contractDetailCache[id].data)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const contractData = await contractService.getContractById(id)
      
      // Update cache
      contractDetailCache[id] = {
        data: contractData,
        timestamp: Date.now()
      }
      
      setContract(contractData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch contract'
      setError(errorMessage)
      setContract(null)
      
      // Remove from cache on error
      delete contractDetailCache[id]
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContract()
  }, [id])

  const refetch = () => {
    fetchContract(true)
  }

  return {
    contract,
    loading,
    error,
    refetch
  }
}