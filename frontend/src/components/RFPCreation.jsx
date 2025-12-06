import React, { useState, useEffect } from 'react';
import { Button, Input, Checkbox, Message, toaster, Loader } from 'rsuite';
import { Send, Save, Gear } from '@rsuite/icons';
import { rfpAPI, vendorAPI } from '../services/api';
const SendIcon = () => (
  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
);
const SaveIcon = () => (
  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
);
const SparklesIcon = () => (
   <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
);
const RFPCreation = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedRFP, setGeneratedRFP] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchVendors();
  }, []);
  const fetchVendors = async () => {
    try {
      const data = await vendorAPI.getAll();
      setVendors(data);
    } catch (err) {
      console.error('Failed to fetch vendors:', err);
    }
  };
  const handleGenerateRFP = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await rfpAPI.generate(prompt);
      setGeneratedRFP(data);
    } catch (error) {
      console.error('Error generating RFP:', error);
      setError('Failed to generate RFP. Check backend .env configuration.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleSaveRFP = async () => {
    try {
      await rfpAPI.create(generatedRFP);
      toaster.push(
        <Message showIcon type="success" closable>
          RFP saved successfully!
        </Message>,
        { placement: 'topEnd' }
      );
      setGeneratedRFP(null);
      setPrompt('');
    } catch (error) {
      toaster.push(
        <Message showIcon type="error" closable>
          Failed to save RFP
        </Message>,
        { placement: 'topEnd' }
      );
      console.error(error);
    }
  };
  const handleSendRFP = async () => {
    if (selectedVendors.length === 0) {
      toaster.push(
        <Message showIcon type="warning" closable>
          Please select at least one vendor
        </Message>,
        { placement: 'topEnd' }
      );
      return;
    }
    try {
      const savedRFP = await rfpAPI.create(generatedRFP);
      await rfpAPI.sendToVendors(savedRFP.id, selectedVendors);
      toaster.push(
        <Message showIcon type="success" closable>
          RFP sent to vendors successfully!
        </Message>,
        { placement: 'topEnd' }
      );
      setGeneratedRFP(null);
      setPrompt('');
      setSelectedVendors([]);
    } catch (error) {
      toaster.push(
        <Message showIcon type="error" closable>
          Failed to send RFP
        </Message>,
        { placement: 'topEnd' }
      );
      console.error(error);
    }
  };
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans text-gray-800">
      {}
      <div className="w-1/2 flex flex-col border-r border-gray-200">
        {}
        <div className="h-14 min-h-[3.5rem] flex items-center px-6 border-b border-gray-200 bg-gray-50">
          <span className="bg-indigo-100 text-indigo-700 p-1.5 rounded-md mr-3">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </span>
          <h2 className="font-semibold text-gray-700">RFP Composer</h2>
        </div>
        {}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-white">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}
          <p className="text-sm text-gray-500 mb-2">
            Describe requirements in natural language.
          </p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="max-h-[40%] flex-1 w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm bg-gray-50"
            placeholder="// Example:&#10;I need to procure laptops and monitors for our new office.&#10;Budget is $50,000 total.&#10;Need 20 laptops (16GB RAM) and 15 monitors."
          ></textarea>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleGenerateRFP}
              disabled={isLoading || !prompt.trim()}
              loading={isLoading}
              appearance="primary"
              size="lg"
              startIcon={isLoading ? null : <Gear />}
            >
              {isLoading ? 'Generating...' : 'Generate with AI'}
            </Button>
          </div>
        </div>
      </div>
      {}
      <div className="w-1/2 flex flex-col bg-gray-50/50">
        {}
        <div className="h-14 min-h-[3.5rem] flex items-center justify-between px-6 border-b border-gray-200 bg-white">
          <div className="flex items-center">
             <SparklesIcon />
             <h2 className="ml-2 font-semibold text-gray-700">Live Preview</h2>
          </div>
          {generatedRFP && (
             <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
                AI Generated
             </span>
          )}
        </div>
        {}
        <div className="flex-1 overflow-y-auto p-8 relative">
          {}
          {!generatedRFP && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
               <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
               <p className="text-lg font-medium text-gray-500">Ready to Generate</p>
               <p className="text-sm">Type your requirements on the left to see the result here.</p>
            </div>
          )}
          {}
          {isLoading && (
             <div className="h-full flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-500">Analyzing requirements...</p>
             </div>
          )}
          {}
          {generatedRFP && !isLoading && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-4">General Details</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Title</label>
                      <input 
                        type="text" 
                        value={generatedRFP.title}
                        onChange={(e) => setGeneratedRFP({...generatedRFP, title: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded focus:border-indigo-500 outline-none transition-colors" 
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Budget ($)</label>
                      <input 
                        type="number" 
                        value={generatedRFP.budget}
                        onChange={(e) => setGeneratedRFP({...generatedRFP, budget: parseFloat(e.target.value)})}
                        className="w-full p-2 border border-gray-300 rounded focus:border-indigo-500 outline-none transition-colors" 
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Deadline</label>
                      <input 
                        type="datetime-local" 
                        value={generatedRFP.deadline ? generatedRFP.deadline.substring(0, 16) : ''}
                        onChange={(e) => setGeneratedRFP({...generatedRFP, deadline: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded focus:border-indigo-500 outline-none transition-colors" 
                      />
                   </div>
                </div>
              </div>
              {}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-4">Items Required</h3>
                <div className="space-y-3">
                  {generatedRFP.items && generatedRFP.items.map((item, index) => (
                    <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded border border-gray-100">
                        <div className="flex-1">
                          <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Item Name</label>
                          <input
                              type="text"
                              value={item.name}
                              onChange={(e) => {
                                const newItems = [...generatedRFP.items];
                                newItems[index].name = e.target.value;
                                setGeneratedRFP({...generatedRFP, items: newItems});
                              }}
                              className="w-full text-sm p-1 border border-gray-300 rounded"
                          />
                        </div>
                        <div className="w-24">
                          <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Qty</label>
                          <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const newItems = [...generatedRFP.items];
                                newItems[index].quantity = parseInt(e.target.value);
                                setGeneratedRFP({...generatedRFP, items: newItems});
                              }}
                              className="w-full text-sm p-1 border border-gray-300 rounded"
                          />
                        </div>
                    </div>
                  ))}
                </div>
              </div>
               {}
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                 <h3 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-4">Select Vendors</h3>
                 <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                   {vendors.map((vendor) => (
                     <label key={vendor.id} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer border border-transparent hover:border-gray-200 transition-colors">
                       <input
                         type="checkbox"
                         checked={selectedVendors.includes(vendor.id)}
                         onChange={(e) => {
                           if (e.target.checked) {
                             setSelectedVendors([...selectedVendors, vendor.id]);
                           } else {
                             setSelectedVendors(selectedVendors.filter(id => id !== vendor.id));
                           }
                         }}
                         className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                       />
                       <div className="ml-3 flex flex-col">
                          <span className="text-sm font-medium text-gray-700">{vendor.name}</span>
                          <span className="text-xs text-gray-500">{vendor.email}</span>
                       </div>
                     </label>
                   ))}
                 </div>
               </div>
               {}
               <div className="pt-2 flex gap-3">
                  <Button
                    onClick={handleSaveRFP}
                    appearance="default"
                    size="lg"
                    block
                    startIcon={<Save />}
                  >
                    Save Draft
                  </Button>
                  <Button
                    onClick={handleSendRFP}
                    appearance="primary"
                    color="green"
                    size="lg"
                    block
                    startIcon={<Send />}
                  >
                    Send to Vendors
                  </Button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default RFPCreation;