# 📋 SaaS Contract Dashboard

A modern, AI-powered contract management dashboard built with React and TypeScript. This application provides comprehensive contract analysis, risk assessment, and intelligent insights for enterprise contract management.

![Contract Dashboard Preview](https://via.placeholder.com/800x400/06070d/ffffff?text=SaaS+Contract+Dashboard)

## ✨ Features

- **📊 Dashboard Overview**: Real-time contract statistics with dynamic progress indicators
- **🔍 Smart Search & Filtering**: Advanced filtering by status, risk level, and full-text search
- **📄 Contract Details**: Comprehensive contract analysis with AI-powered insights
- **➕ Create New Contracts**: Modal-based contract creation with form validation
- **🤖 AI Insights**: Intelligent risk assessment and clause analysis
- **📑 Evidence Panel**: Supporting documentation with relevance scoring
- **🎨 Modern UI**: Dark theme with Apexify-inspired design system
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **⚡ Performance Optimized**: Smart caching and efficient data management

## 🚀 Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AWESOMEACOUSTIC/Contract-Dashboard.git
   cd Contract-Dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## 🛠️ Tech Stack Choices

### Core Framework & Language
- **React 18** - Latest version with concurrent features and improved performance
- **TypeScript** - Type safety, better developer experience, and enhanced code maintainability
- **Vite** - Fast build tool with instant HMR and optimized bundling

### Routing & Navigation
- **React Router v7** - Latest version with improved nested routing and data loading patterns
- **Client-side routing** - Single Page Application (SPA) architecture for smooth navigation

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Custom Design System** - Apexify-inspired dark theme with consistent color palette
- **Responsive Design** - Mobile-first approach with breakpoint-based layouts

### State Management & Data Fetching
- **React Hooks** - Built-in state management with useState, useEffect, and custom hooks
- **Custom Caching System** - Module-level caching for improved performance
- **Context API** - For sharing authentication state and search queries

### Development Tools
- **ESLint** - Code linting and quality enforcement
- **TypeScript Compiler** - Static type checking and IntelliSense support
- **Hot Module Replacement** - Instant feedback during development

### Why These Choices?

1. **React + TypeScript**: Provides excellent developer experience with type safety and component reusability
2. **Vite**: Significantly faster than traditional bundlers, improving development productivity
3. **Tailwind CSS**: Enables rapid prototyping and consistent design system implementation
4. **React Router v7**: Modern routing solution with excellent nested route support
5. **Custom Hooks**: Promotes code reusability and separation of concerns

## 🧭 Assumptions Made

### Data Structure
- **Contract data** is served from a static JSON file (`/public/contracts.json`)
- **AI confidence scores** are provided as decimal values (0.0 to 1.0)
- **Risk levels** are categorized as "High", "Medium", or "Low"
- **Contract statuses** include "Active", "Renewal Due", "Expired", and "Draft"

### User Experience
- **Authentication** is simulated with a simple form (no real backend integration)
- **Users prefer dark themes** for professional dashboard applications
- **Mobile responsiveness** is important for on-the-go contract management
- **Loading states** should be minimal but informative

### Business Logic
- **Cache duration** of 5 minutes for contract lists and 3 minutes for individual contracts
- **Pagination** shows 10 contracts per page for optimal performance
- **Search functionality** covers contract names and parties
- **Risk scoring** is AI-generated and displayed with color coding

### Performance
- **Client-side caching** is acceptable for this scale of data
- **Network requests** should be minimized through intelligent caching
- **Component re-renders** should be optimized through memoization
- **Bundle size** should be kept reasonable through code splitting

## 🚨 Problems Faced & Solutions

### 1. **Pagination Reset Bug**
**Problem**: When users were on page 2+ and applied filters, they would see empty results because the current page wasn't reset.

**Solution**: Implemented `useEffect` hook to reset `currentPage` to 1 whenever filters (`statusFilter`, `riskFilter`, `searchQuery`) change.

```typescript
useEffect(() => {
  setCurrentPage(1)
}, [statusFilter, riskFilter, searchQuery])
```

### 2. **Excessive API Calls**
**Problem**: Contract dashboard was refetching data every time users navigated back from other pages, causing poor user experience.

**Solution**: Implemented module-level caching system with subscriber pattern:
- 5-minute cache for contract lists
- 3-minute cache for individual contracts
- Automatic cache invalidation and real-time updates

### 3. **Dynamic Progress Bars**
**Problem**: Initial implementation had hardcoded progress bar values that didn't reflect actual contract data.

**Solution**: Created dynamic calculations based on real contract statistics:
```typescript
const activePercentage = total > 0 ? Math.round((active / total) * 100) : 0
// Progress bar segments: Math.round((percentage / 100) * 20)
```

### 4. **Routing Architecture**
**Problem**: Needed to implement proper client-side routing while maintaining protected routes and nested layouts.

**Solution**: Implemented React Router v7 with nested route configuration:
- Protected route wrapper for authentication
- Dashboard layout with outlet for page content
- Dynamic routing for contract details (`/contracts/:id`)

### 5. **State Management Complexity**
**Problem**: Managing search state across multiple components and maintaining it during navigation.

**Solution**: Used React Router's outlet context to share search state:
```typescript
const { searchQuery = '' } = useOutletContext<OutletContext>()
```

### 6. **TypeScript Integration**
**Problem**: Ensuring type safety across the entire application while maintaining development speed.

**Solution**: 
- Created comprehensive type definitions in service layer
- Used strict TypeScript configuration
- Implemented proper interface definitions for all data structures

### 7. **Mobile Responsiveness**
**Problem**: Complex dashboard layouts needed to work across all device sizes.

**Solution**: 
- Implemented mobile-first responsive design
- Used Tailwind's responsive utilities (`sm:`, `md:`, `lg:`)
- Created adaptive layouts that stack on mobile and expand on desktop

### 8. **Performance Optimization**
**Problem**: Large contract lists and complex calculations could cause performance issues.

**Solution**:
- Implemented `useMemo` for expensive calculations (statistics)
- Added pagination to limit rendered items
- Used efficient filtering and sorting algorithms
- Implemented proper key props for list rendering

### 9. **New Contract Creation Not Persisting**
**Problem**: After adding a new contract through the modal, it wasn't showing up in the contract list because the data wasn't being added to the local cache.

**Solution**: 
- Updated `ContractService` to include in-memory caching with `addContract` method
- Modified `useContracts` hook to include `addContract` function that updates the cache
- Ensured new contracts are added to the beginning of the list with proper ID generation
- Implemented real-time cache updates so all components reflect the new data immediately

```typescript
// Service method to add contracts to cache
async addContract(contractData: Omit<ContractListItem, 'id'>): Promise<ContractListItem> {
  const newContract = { id: `c${Date.now()}`, ...contractData }
  this.contractsCache.unshift(newContract)
  return newContract
}
```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── layout/          # Layout components (Sidebar, Topbar)
│   ├── pages/           # Page components
│   └── ui/              # Generic UI components
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
├── services/            # API and business logic
└── routes.tsx          # Application routing configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

