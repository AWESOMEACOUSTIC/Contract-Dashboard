# Contracts API System Documentation

## Overview
This system provides a complete mock API for managing contracts data, including JSON hosting, service layer, and React hooks for data fetching.

## 📁 File Structure

```
public/
└── contracts.json                 # Contract data (hosted locally)

src/
├── services/
│   ├── contractService.ts         # API service layer
│   └── index.ts                   # Service exports
├── hooks/
│   ├── useContracts.ts            # React hooks for data fetching
│   └── index.ts                   # Hook exports
└── components/pages/
    └── ContractsDashboard.tsx     # Full contracts dashboard
```

## 🔄 API Endpoints (Mock)

### GET /contracts
Returns a list of all contracts with basic information.

**Response:**
```json
[
  {
    "id": "c1",
    "name": "MSA 2025",
    "parties": "Microsoft & ABC Corp",
    "expiry": "2025-12-31",
    "status": "Active",
    "risk": "Medium"
  }
]
```

### GET /contracts/:id
Returns detailed information for a specific contract.

**Response:**
```json
{
  "id": "c1",
  "name": "MSA 2025",
  "parties": "Microsoft & ABC Corp",
  "start": "2023-01-01",
  "expiry": "2025-12-31",
  "status": "Active",
  "risk": "Medium",
  "clauses": [
    {
      "title": "Termination",
      "summary": "90 days notice period.",
      "confidence": 0.82
    }
  ],
  "insights": [
    {
      "risk": "High",
      "message": "Liability cap excludes data breach costs."
    }
  ],
  "evidence": [
    {
      "source": "Section 12.2",
      "snippet": "Total liability limited to 12 months' fees.",
      "relevance": 0.91
    }
  ]
}
```

## 🛠️ Service Layer

### ContractService
Main service class that handles all contract data operations.

**Methods:**
- `getContracts()` - Fetch all contracts
- `getContractById(id)` - Fetch specific contract
- `searchContracts(query)` - Search contracts by name/parties
- `getContractsByStatus(status)` - Filter by status
- `getContractsByRisk(risk)` - Filter by risk level
- `getExpiringContracts(withinDays)` - Get contracts expiring soon

**Usage:**
```typescript
import { contractService } from '@/services'

// Get all contracts
const contracts = await contractService.getContracts()

// Get specific contract
const contract = await contractService.getContractById('c1')

// Search contracts
const results = await contractService.searchContracts('Microsoft')
```

## 🎣 React Hooks

### useContracts()
Fetches all contracts with loading/error states.

```typescript
const { contracts, loading, error, refetch } = useContracts()
```

### useContract(id)
Fetches a specific contract by ID.

```typescript
const { contract, loading, error, refetch } = useContract('c1')
```

### useContractSearch()
Provides search functionality.

```typescript
const { results, loading, error, query, search, clearSearch } = useContractSearch()
```

### useExpiringContracts(withinDays)
Gets contracts expiring within specified days.

```typescript
const { contracts, loading, error } = useExpiringContracts(30)
```

## 📊 Data Types

### Contract
```typescript
interface Contract {
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
```

### ContractClause
```typescript
interface ContractClause {
  title: string
  summary: string
  confidence: number
}
```

### ContractInsight
```typescript
interface ContractInsight {
  risk: "High" | "Medium" | "Low"
  message: string
}
```

### ContractEvidence
```typescript
interface ContractEvidence {
  source: string
  snippet: string
  relevance: number
}
```

## 🎨 Dashboard Features

The ContractsDashboard component provides:

### ✅ Contract List View
- All contracts with status/risk indicators
- Click to select and view details
- Color-coded status and risk levels

### ✅ Contract Details Panel
- Full contract information
- Key clauses with confidence scores
- Risk insights with color-coded severity
- Evidence snippets with relevance scores

### ✅ Statistics Cards
- Total contracts count
- Active contracts
- Renewal due contracts
- Expiring soon contracts

### ✅ Interactive Features
- Real-time loading states
- Error handling
- Responsive design
- Hover effects and selection states

## 🚀 Getting Started

1. **View Contracts**: Login and navigate to the "Contracts" tab
2. **Browse List**: See all contracts in the left panel
3. **View Details**: Click any contract to see full details
4. **Monitor Status**: Check the stats cards for quick overview

## 🔄 Mock API Behavior

- **Simulated Delays**: 300-500ms to mimic real API calls
- **Error Handling**: Proper error states and messages
- **Loading States**: Visual feedback during data fetching
- **Data Persistence**: Uses localStorage for contract data (static JSON)

## 🎯 Sample Data Included

The system includes 4 sample contracts:
1. **MSA 2025** - Microsoft agreement (Active, Medium risk)
2. **Network Services** - TelNet agreement (Renewal Due, High risk)
3. **Software License** - TechSoft agreement (Active, Low risk)
4. **Cloud Infrastructure** - CloudTech agreement (Active, Medium risk)

## 🔮 Future Enhancements

- Real API integration
- Contract creation/editing
- Advanced filtering and sorting
- Export functionality
- Notification system for expiring contracts
- Document upload and parsing
- Advanced search with filters