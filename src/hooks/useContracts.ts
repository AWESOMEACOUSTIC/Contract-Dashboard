import { useState, useEffect } from 'react'
import { contractService } from '../services/contractService'
import type { Contract, ContractListItem } from '../services/contractService'

// Hook for fetching all contracts
export function useContracts() {
  const [contracts, setContracts] = useState<ContractListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContracts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await contractService.getContracts()
      setContracts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contracts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContracts()
  }, [])

  return {
    contracts,
    loading,
    error,
    refetch: fetchContracts
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