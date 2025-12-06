import { useState } from 'react';

const RFPCreation = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedRFP, setGeneratedRFP] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateRFP = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call our backend API
      // const response = await fetch('/api/v1/ai/create-rfp', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ prompt }),
      // });
      // const data = await response.json();
      // setGeneratedRFP(data.rfp);
      
      // Mock response for demonstration
      setTimeout(() => {
        setGeneratedRFP({
          title: "Office Equipment Procurement",
          description: "Procurement of laptops and monitors for new office setup",
          budget: 50000,
          deadline: "2025-12-31T23:59:59",
          items: [
            {
              name: "Laptop",
              quantity: 20,
              description: "Business laptops for employees",
              specifications: "16GB RAM, 512GB SSD, Intel i7 processor"
            },
            {
              name: "Monitor",
              quantity: 15,
              description: "Desktop monitors for workstations",
              specifications: "27-inch, 4K resolution"
            }
          ],
          delivery_terms: "Delivery within 30 days of order confirmation",
          payment_terms: "Net 30 payment terms",
          warranty_requirements: "Minimum 1 year warranty on all equipment"
        });
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error generating RFP:', error);
      setIsLoading(false);
    }
  };

  const handleSaveRFP = () => {
    // In a real implementation, this would save the RFP to the database
    alert('RFP saved successfully!');
  };

  const handleSendRFP = () => {
    // In a real implementation, this would send the RFP to selected vendors
    alert('RFP sent to vendors successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-2xl font-semibold text-gray-800">Create New RFP</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Describe what you want to procure in natural language</p>
        </div>
        <div className="border-t border-gray-200">
          <div className="p-6">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-40 p-4 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="I need to procure laptops and monitors for our new office. Budget is $50,000 total. Need delivery within 30 days. We need 20 laptops with 16GB RAM and 15 monitors 27-inch. Payment terms should be net 30, and we need at least 1 year warranty."
            ></textarea>
            <div className="mt-4">
              <button
                onClick={handleGenerateRFP}
                disabled={isLoading || !prompt.trim()}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isLoading || !prompt.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isLoading ? 'Generating...' : 'Generate RFP with AI'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {generatedRFP && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-semibold text-gray-800">Generated RFP</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Review and edit the AI-generated RFP</p>
          </div>
          <div className="border-t border-gray-200">
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={generatedRFP.title}
                    onChange={(e) => setGeneratedRFP({...generatedRFP, title: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Budget ($)</label>
                  <input
                    type="number"
                    value={generatedRFP.budget}
                    onChange={(e) => setGeneratedRFP({...generatedRFP, budget: parseFloat(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Deadline</label>
                  <input
                    type="datetime-local"
                    value={generatedRFP.deadline.substring(0, 16)}
                    onChange={(e) => setGeneratedRFP({...generatedRFP, deadline: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delivery Terms</label>
                  <input
                    type="text"
                    value={generatedRFP.delivery_terms}
                    onChange={(e) => setGeneratedRFP({...generatedRFP, delivery_terms: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Terms</label>
                  <input
                    type="text"
                    value={generatedRFP.payment_terms}
                    onChange={(e) => setGeneratedRFP({...generatedRFP, payment_terms: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Warranty Requirements</label>
                  <input
                    type="text"
                    value={generatedRFP.warranty_requirements}
                    onChange={(e) => setGeneratedRFP({...generatedRFP, warranty_requirements: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={generatedRFP.description}
                  onChange={(e) => setGeneratedRFP({...generatedRFP, description: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Items</h3>
                <div className="mt-4 space-y-4">
                  {generatedRFP.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 gap-4 sm:grid-cols-2 p-4 border border-gray-200 rounded-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Item Name</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            const newItems = [...generatedRFP.items];
                            newItems[index].name = e.target.value;
                            setGeneratedRFP({...generatedRFP, items: newItems});
                          }}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Quantity</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const newItems = [...generatedRFP.items];
                            newItems[index].quantity = parseInt(e.target.value);
                            setGeneratedRFP({...generatedRFP, items: newItems});
                          }}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => {
                            const newItems = [...generatedRFP.items];
                            newItems[index].description = e.target.value;
                            setGeneratedRFP({...generatedRFP, items: newItems});
                          }}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          rows="2"
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Specifications</label>
                        <textarea
                          value={item.specifications}
                          onChange={(e) => {
                            const newItems = [...generatedRFP.items];
                            newItems[index].specifications = e.target.value;
                            setGeneratedRFP({...generatedRFP, items: newItems});
                          }}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          rows="2"
                        ></textarea>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={handleSaveRFP}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save RFP
                </button>
                <button
                  onClick={handleSendRFP}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Send RFP to Vendors
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RFPCreation;