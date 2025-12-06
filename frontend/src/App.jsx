import { useState } from 'react'
import RFPCreation from './components/RFPCreation'
import VendorManagement from './components/VendorManagement'
import ProposalManagement from './components/ProposalManagement'
import ProposalComparison from './components/ProposalComparison'

function App() {
  const [activeTab, setActiveTab] = useState('create')

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">AI-Powered RFP Management System</h1>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <button
                onClick={() => setActiveTab('create')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'create' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Create RFP
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`ml-8 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'manage' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Manage Vendors
              </button>
              <button
                onClick={() => setActiveTab('proposals')}
                className={`ml-8 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'proposals' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Vendor Proposals
              </button>
              <button
                onClick={() => setActiveTab('compare')}
                className={`ml-8 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'compare' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Compare Proposals
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Create RFP Tab */}
          {activeTab === 'create' && (
            <div className="px-4 py-6 sm:px-0">
              <RFPCreation />
            </div>
          )}

          {/* Manage Vendors Tab */}
          {activeTab === 'manage' && (
            <div className="px-4 py-6 sm:px-0">
              <VendorManagement />
            </div>
          )}

          {/* Vendor Proposals Tab */}
          {activeTab === 'proposals' && (
            <div className="px-4 py-6 sm:px-0">
              <ProposalManagement />
            </div>
          )}

          {/* Compare Proposals Tab */}
          {activeTab === 'compare' && (
            <div className="px-4 py-6 sm:px-0">
              <ProposalComparison />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
