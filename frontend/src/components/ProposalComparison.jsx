import { useState } from 'react';

const ProposalComparison = () => {
  const [selectedRFP, setSelectedRFP] = useState("Office Equipment Procurement");
  const [comparisonResults, setComparisonResults] = useState([
    {
      vendor_id: 1,
      vendor_name: "Tech Solutions Inc.",
      total_score: 8.5,
      price_score: 9.0,
      terms_score: 8.0,
      completeness_score: 8.5,
      details: {
        strengths: "Competitive pricing, shorter delivery time, extended warranty",
        weaknesses: "Slightly higher per-unit cost for monitors",
        key_differences: "2-year warranty vs 1-year from competitors"
      },
      items: [
        {
          name: "Laptop",
          price_per_unit: 1800,
          delivery_time: 25,
          warranty_period: 24
        },
        {
          name: "Monitor",
          price_per_unit: 800,
          delivery_time: 25,
          warranty_period: 24
        }
      ],
      total_price: 48500
    },
    {
      vendor_id: 2,
      vendor_name: "Global Electronics Ltd.",
      total_score: 7.2,
      price_score: 8.0,
      terms_score: 6.5,
      completeness_score: 7.1,
      details: {
        strengths: "Lower per-unit cost for monitors",
        weaknesses: "Longer delivery time, shorter warranty period",
        key_differences: "1-year warranty, 30-day delivery"
      },
      items: [
        {
          name: "Laptop",
          price_per_unit: 1900,
          delivery_time: 30,
          warranty_period: 12
        },
        {
          name: "Monitor",
          price_per_unit: 720,
          delivery_time: 30,
          warranty_period: 12
        }
      ],
      total_price: 49200
    }
  ]);

  const handleCompareProposals = () => {
    // In a real implementation, this would call our backend API
    // For now, we'll just use the mock data
    alert('Proposals compared successfully!');
  };

  const handleExportReport = () => {
    // In a real implementation, this would export the comparison report
    alert('Comparison report exported successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-2xl font-semibold text-gray-800">Compare Vendor Proposals</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Compare proposals and get AI recommendations</p>
        </div>
        <div className="border-t border-gray-200">
          <div className="p-6">
            <div className="mb-6">
              <label htmlFor="rfp-select" className="block text-sm font-medium text-gray-700">Select RFP</label>
              <select 
                id="rfp-select" 
                value={selectedRFP}
                onChange={(e) => setSelectedRFP(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option>Office Equipment Procurement</option>
                <option>Software Licensing RFP</option>
              </select>
            </div>
            
            <div className="mb-6">
              <button
                onClick={handleCompareProposals}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Compare Proposals with AI
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warranty</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Score</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terms Score</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completeness Score</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Score</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {comparisonResults.map((result, index) => (
                    <tr key={result.vendor_id} className={index === 0 ? "bg-blue-50" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.vendor_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${result.total_price.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.min(...result.items.map(item => item.delivery_time))} days
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.max(...result.items.map(item => item.warranty_period))} months
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.price_score}/10</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.terms_score}/10</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.completeness_score}/10</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                        <span className={
                          result.total_score >= 8 ? "text-green-600" : 
                          result.total_score >= 7 ? "text-yellow-600" : "text-red-600"
                        }>
                          {result.total_score}/10
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">AI Recommendation</h3>
              <p className="text-gray-700">
                Based on the analysis, <strong>Tech Solutions Inc.</strong> offers the best value with competitive pricing, 
                shorter delivery time, and extended warranty. Their proposal scores highest in our evaluation matrix.
              </p>
              <div className="mt-4">
                <h4 className="font-medium text-gray-900">Detailed Analysis:</h4>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li><strong>Tech Solutions Inc.</strong>: {comparisonResults[0]?.details.strengths}</li>
                  <li><strong>Global Electronics Ltd.</strong>: {comparisonResults[1]?.details.strengths}</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={handleExportReport}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Export Comparison Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalComparison;