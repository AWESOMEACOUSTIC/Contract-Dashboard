import { useState, useEffect } from 'react'
import { contractService } from '../services/contractService'
import type { Contract, ContractListItem } from '../services/contractService'

// Simple in-memory cache for contracts
interface ContractsCache {
  data: ContractListItem[] | null
  timestamp: number
  loading: boolean
}

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000

// Module-level cache
let contractsCache: ContractsCache = {
  data: null,
  timestamp: 0,
  loading: false
}

// Cache subscribers for real-time updates
const cacheSubscribers = new Set<() => void>()

const notifySubscribers = () => {
  cacheSubscribers.forEach(callback => callback())
}

const isCacheValid = () => {
  return contractsCache.data !== null && 
         (Date.now() - contractsCache.timestamp) < CACHE_DURATION
}

// Hook for fetching all contracts with caching
export function useContracts() {
  const [contracts, setContracts] = useState<ContractListItem[]>(contractsCache.data || [])
  const [loading, setLoading] = useState(contractsCache.loading || !isCacheValid())
  const [error, setError] = useState<string | null>(null)

  const fetchContracts = async (force = false) => {
    // If cache is valid and not forced, use cached data
    if (isCacheValid() && !force) {
      setContracts(contractsCache.data!)
      setLoading(false)
      return
    }

    // Prevent multiple simultaneous fetches
    if (contractsCache.loading && !force) {
      setLoading(true)
      return
    }

    try {
      contractsCache.loading = true
      setLoading(true)
      setError(null)
      notifySubscribers() // Notify other components about loading state
      
      const data = await contractService.getContracts()
      
      // Update cache
      contractsCache.data = data
      contractsCache.timestamp = Date.now()
      contractsCache.loading = false
      
      setContracts(data)
      notifySubscribers() // Notify other components about new data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch contracts'
      setError(errorMessage)
      contractsCache.loading = false
      notifySubscribers()
    } finally {
      setLoading(false)
    }
  }

  const addContract = async (contractData: Omit<ContractListItem, 'id'>) => {
    try {
      const newContract = await contractService.addContract(contractData)
      
      // Update cache with new contract
      if (contractsCache.data) {
        contractsCache.data = [newContract, ...contractsCache.data]
        contractsCache.timestamp = Date.now()
        setContracts(contractsCache.data)
        notifySubscribers()
      } else {
        // If no cache, fetch all contracts
        await fetchContracts(true)
      }
      
      return newContract
    } catch (error) {
      console.error('Error adding contract:', error)
      throw error
    }
  }

  // Subscribe to cache updates
  useEffect(() => {
    const updateFromCache = () => {
      if (contractsCache.data) {
        setContracts(contractsCache.data)
      }
      setLoading(contractsCache.loading)
    }

    cacheSubscribers.add(updateFromCache)
    
    return () => {
      cacheSubscribers.delete(updateFromCache)
    }
  }, [])

  useEffect(() => {
    fetchContracts()
  }, [])

  return {
    contracts,
    loading,
    error,
    refetch: () => fetchContracts(true), // Force refresh when explicitly requested
    addContract // New method to add contracts
  }
}

// Hook for fetching a single contract by ID
export function useContract(id: string | null) {
  const [contract, setContract] = useState<Contract | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchContract = async (contractId: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await contractService.getContractById(contractId)
      setContract(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contract')
      setContract(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchContract(id)
    } else {
      setContract(null)
      setLoading(false)
      setError(null)
    }
  }, [id])

  return {
    contract,
    loading,
    error,
    refetch: id ? () => fetchContract(id) : undefined
  }
}

// Hook for searching contracts
export function useContractSearch() {
  const [results, setResults] = useState<ContractListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const search = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setQuery('')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setQuery(searchQuery)
      const data = await contractService.searchContracts(searchQuery)
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search contracts')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const clearSearch = () => {
    setResults([])
    setQuery('')
    setError(null)
  }

  return {
    results,
    loading,
    error,
    query,
    search,
    clearSearch
  }
}

// Hook for filtering contracts by status
export function useContractsByStatus(status: ContractListItem['status'] | null) {
  const [contracts, setContracts] = useState<ContractListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!status) {
      setContracts([])
      return
    }

    const fetchByStatus = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await contractService.getContractsByStatus(status)
        setContracts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch contracts by status')
        setContracts([])
      } finally {
        setLoading(false)
      }
    }

    fetchByStatus()
  }, [status])

  return {
    contracts,
    loading,
    error
  }
}

// Hook for getting expiring contracts
export function useExpiringContracts(withinDays: number = 30) {
  const [contracts, setContracts] = useState<ContractListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExpiring = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await contractService.getExpiringContracts(withinDays)
        setContracts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch expiring contracts')
        setContracts([])
      } finally {
        setLoading(false)
      }
    }

    fetchExpiring()
  }, [withinDays])

  return {
    contracts,
    loading,
    error
  }
}