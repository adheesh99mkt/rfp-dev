import { useState } from 'react'
import 'rsuite/dist/rsuite.min.css'
import { Nav } from 'rsuite'
import { Edit, Peoples, Send, BarChart, DocPass } from '@rsuite/icons'
import RFPCreation from './components/RFPCreation'
import RFPManagement from './components/RFPManagement'
import VendorManagement from './components/VendorManagement'
import ProposalManagement from './components/ProposalManagement'
import ProposalComparison from './components/ProposalComparison'
function App() {
  const [activeTab, setActiveTab] = useState('create')
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg flex-shrink-0">
        <div className="w-full py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                AI-Powered RFP Management System
                <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full font-normal">✨ AI Enhanced</span>
              </h1>
              <p className="text-indigo-100 text-sm mt-1">Intelligent procurement powered by artificial intelligence</p>
            </div>
          </div>
        </div>
      </header>
      {}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-indigo-100 flex-shrink-0">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <Nav appearance="subtle" activeKey={activeTab} onSelect={setActiveTab} style={{ marginBottom: 0 }}>
            <Nav.Item eventKey="create" icon={<Edit />}>Create RFP</Nav.Item>
            <Nav.Item eventKey="viewrfp" icon={<DocPass />}>View RFPs</Nav.Item>
            <Nav.Item eventKey="manage" icon={<Peoples />}>Manage Vendors</Nav.Item>
            <Nav.Item eventKey="proposals" icon={<Send />}>Vendor Proposals</Nav.Item>
            <Nav.Item eventKey="compare" icon={<BarChart />}>AI Compare</Nav.Item>
          </Nav>
        </div>
      </nav>
      {}
      <main className="flex-1 overflow-y-auto w-full">
        {}
        {activeTab === 'create' && (
          <div className="py-6 px-4">
            <RFPCreation />
          </div>
        )}
        {}
        {activeTab === 'viewrfp' && (
          <div className="py-6 px-4">
            <RFPManagement />
          </div>
        )}
        {}
        {activeTab === 'manage' && (
          <div className="py-6 px-4">
            <VendorManagement />
          </div>
        )}
        {}
        {activeTab === 'proposals' && (
          <div className="py-6 px-4">
            <ProposalManagement />
          </div>
        )}
        {}
        {activeTab === 'compare' && (
          <div className="py-6 px-4">
            <ProposalComparison />
          </div>
        )}
      </main>
    </div>
  )
}
export default App