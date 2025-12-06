import { useState } from 'react';

const ProposalManagement = () => {
  const [proposals, setProposals] = useState([
    {
      id: 1,
      vendor: "Tech Solutions Inc.",
      rfp_title: "Office Equipment Procurement",
      total_price: 48500,
      status: "Parsed",
      received_date: "2025-12-01T10:30:00",
      items: [
        {
          name: "Laptop",
          quantity: 20,
          price_per_unit: 1800,
          total_price: 36000,
          delivery_time: 25,
          warranty_period: 24
        },
        {
          name: "Monitor",
          quantity: 15,
          price_per_unit: 800,
          total_price: 12000,
          delivery_time: 25,
          warranty_period: 24
        }
      ]
    },
    {
      id: 2,
      vendor: "Global Electronics Ltd.",
      rfp_title: "Office Equipment Procurement",
      total_price: 49200,
      status: "Parsed",
      received_date: "2025-12-02T14:15:00",
      items: [
        {
          name: "Laptop",
          quantity: 20,
          price_per_unit: 1900,
          total_price: 38000,
          delivery_time: 30,
          warranty_period: 12
        },
        {
          name: "Monitor",
          quantity: 15,
          price_per_unit: 720,
          total_price: 10800,
          delivery_time: 30,
          warranty_period: 12
        }
      ]
    }
  ]);
  
  const [selectedProposal, setSelectedProposal] = useState(null);

  const handleViewProposal = (proposal) => {
    setSelectedProposal(proposal);
  };

  const handleCloseModal = () => {
    setSelectedProposal(null);
  };

  const handleDeleteProposal = (proposalId) => {
    if (window.confirm('Are you sure you want to delete this proposal?')) {
      setProposals(proposals.filter(proposal => proposal.id !== proposalId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-2xl font-semibold text-gray-800">Vendor Proposals</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">View and manage vendor proposals</p>
        </div>
        <div className="border-t border-gray-200">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RFP Title</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {proposals.map((proposal) => (
                    <tr key={proposal.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{proposal.vendor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proposal.rfp_title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${proposal.total_price.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(proposal.received_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          proposal.status === 'Parsed' ? 'bg-green-100 text-green-800' : 
                          proposal.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {proposal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleViewProposal(proposal)}
                          className="text-indigo-600 hover:text-indigo-900 mr-2"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteProposal(proposal.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Proposal Detail Modal */}
      {selectedProposal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Proposal from {selectedProposal.vendor}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
              
              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">RFP Title</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProposal.rfp_title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Price</label>
                    <p className="mt-1 text-sm text-gray-900">${selectedProposal.total_price.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Received Date</label>
                    <p className="mt-1 text-sm text-gray-900">{new Date(selectedProposal.received_date).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="mt-1 text-sm text-gray-900">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedProposal.status === 'Parsed' ? 'bg-green-100 text-green-800' : 
                        selectedProposal.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedProposal.status}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Proposal Items</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Unit</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery (days)</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warranty (months)</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedProposal.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.price_per_unit.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.total_price.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.delivery_time}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.warranty_period}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={handleCloseModal}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalManagement;