import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, SelectPicker, Message, toaster, Tag } from 'rsuite';
import { PageEnd, InfoRound } from '@rsuite/icons';
import { proposalAPI, rfpAPI } from '../services/api';
const { Column, HeaderCell, Cell } = Table;
const ProposalComparison = () => {
  const [rfps, setRfps] = useState([]);
  const [selectedRFPId, setSelectedRFPId] = useState(null);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCached, setIsCached] = useState(false);
  const [analyzedAt, setAnalyzedAt] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  useEffect(() => {
    fetchRFPs();
  }, []);
  useEffect(() => {
    if (selectedRFPId) {
      handleCompareProposals(false);
    }
  }, [selectedRFPId]);
  const fetchRFPs = async () => {
    try {
      const data = await rfpAPI.getAll();
      setRfps(data);
      if (data.length > 0) setSelectedRFPId(data[0].id);
    } catch (err) {
      console.error('Failed to fetch RFPs:', err);
    }
  };
  const handleCompareProposals = useCallback(async (forceRefresh = false) => {
    if (!selectedRFPId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await proposalAPI.compare(selectedRFPId, forceRefresh);
      const comparison = data.comparison || data;
      setComparisonResults(comparison);
      setIsCached(data.cached || false);
      setAnalyzedAt(data.analyzed_at || null);
      setStatusMessage(data.message || null);
    } catch (err) {
      const errorMsg = 'Failed to compare. Check API configuration.';
      setError(errorMsg);
      toaster.push(<Message type="error">{errorMsg}</Message>, { placement: 'topEnd' });
    } finally {
      setLoading(false);
    }
  }, [selectedRFPId]);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div className="bg-white" style={{ width: '100%', minHeight: '100vh' }}>
        <div className="px-6 py-5 bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 border-b border-purple-100">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                AI Proposal Comparison
                <span className="text-xs bg-purple-100 px-2 py-1 rounded-full font-normal text-purple-700">Powered by AI</span>
              </h2>
              <p className="text-sm text-gray-600">Intelligent proposal analysis and recommendations</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <div className="p-6" style={{ width: '100%' }}>
          {error && (
            <Message type="error" showIcon className="mb-4">
              {error}
            </Message>
          )}
          {}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Select RFP</label>
              <SelectPicker
                data={rfps.map(rfp => ({ label: rfp.title, value: rfp.id }))}
                value={selectedRFPId}
                onChange={(value) => {
                  setSelectedRFPId(value);
                }}
                placeholder="Choose RFP..."
                block
                searchable={false}
                size="lg"
              />
            </div>
            <div>
              <Button
                onClick={() => handleCompareProposals(false)}
                disabled={loading || !selectedRFPId}
                loading={loading}
                appearance="primary"
                color="violet"
                size="lg"
              >
                {loading ? 'Analyzing...' : 'Analyze with AI'}
              </Button>
            </div>
          </div>
          {}
          {comparisonResults && comparisonResults.results ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              {}
              <div className="border border-gray-200 rounded-t-lg overflow-hidden">
                <Table
                  autoHeight={true} 
                  data={comparisonResults.results}
                  bordered
                  cellBordered
                  headerHeight={50}
                  rowHeight={60}
                >
                  <Column width={200} fixed>
                    <HeaderCell><strong>Vendor</strong></HeaderCell>
                    <Cell dataKey="vendor_name" className="font-medium text-gray-900" />
                  </Column>
                  <Column width={150}>
                    <HeaderCell>Total Price</HeaderCell>
                    <Cell>
                      {rowData => <span className="font-semibold text-gray-800">${rowData.total_price?.toLocaleString() || 'N/A'}</span>}
                    </Cell>
                  </Column>
                  <Column flexGrow={1} minWidth={200}>
                    <HeaderCell>Delivery Terms</HeaderCell>
                    <Cell dataKey="delivery_terms" />
                  </Column>
                  <Column flexGrow={1} minWidth={200}>
                    <HeaderCell>Payment Terms</HeaderCell>
                    <Cell dataKey="payment_terms" />
                  </Column>
                  <Column width={120} align="center">
                    <HeaderCell>AI Score</HeaderCell>
                    <Cell>
                      {rowData => {
                        const score = rowData.total_score || 0;
                        let color = 'red';
                        if (score >= 8) color = 'green';
                        else if (score >= 6) color = 'orange';
                        return (
                          <Tag color={color}>
                            {score.toFixed(1)} / 10
                          </Tag>
                        );
                      }}
                    </Cell>
                  </Column>
                </Table>
              </div>
              {}
              <div className="bg-indigo-50 border border-t-0 border-indigo-100 rounded-b-lg p-6 flex gap-4">
                <div className="mt-1 flex-shrink-0">
                   {}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-indigo-900 mb-2">AI Recommendation</h3>
                  <p className="text-indigo-800 text-sm leading-relaxed">
                    {comparisonResults.recommendation}
                  </p>
                  {}
                  {comparisonResults.results.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-indigo-200/50">
                       <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                         <InfoRound style={{ fontSize: '1em' }} /> Key Strengths
                       </h4>
                       <ul className="space-y-1">
                         {comparisonResults.results.map((res, idx) => (
                           <li key={idx} className="text-xs text-indigo-800">
                             <span className="font-semibold text-indigo-900">{res.vendor_name}:</span> {res.details?.strengths || 'Balanced offer.'}
                           </li>
                         ))}
                       </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : !loading && (
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 text-gray-400">
              {}
              <PageEnd style={{ fontSize: '3em', opacity: 0.2, marginBottom: '10px' }} />
              <p>Select an RFP above to see the comparison.</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};
export default ProposalComparison;