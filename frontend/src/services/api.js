const API_BASE_URL = 'http://localhost:8000/api/v1';
export const vendorAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/vendors/`);
    if (!response.ok) throw new Error('Failed to fetch vendors');
    return response.json();
  },
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/vendors/${id}`);
    if (!response.ok) throw new Error('Failed to fetch vendor');
    return response.json();
  },
  create: async (vendorData) => {
    const response = await fetch(`${API_BASE_URL}/vendors/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendorData),
    });
    if (!response.ok) throw new Error('Failed to create vendor');
    return response.json();
  },
  update: async (id, vendorData) => {
    const response = await fetch(`${API_BASE_URL}/vendors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendorData),
    });
    if (!response.ok) throw new Error('Failed to update vendor');
    return response.json();
  },
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/vendors/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete vendor');
    return response.json();
  },
};
export const rfpAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/rfps/`);
    if (!response.ok) throw new Error('Failed to fetch RFPs');
    return response.json();
  },
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/rfps/${id}`);
    if (!response.ok) throw new Error('Failed to fetch RFP');
    return response.json();
  },
  create: async (rfpData) => {
    const response = await fetch(`${API_BASE_URL}/rfps/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rfpData),
    });
    if (!response.ok) throw new Error('Failed to create RFP');
    return response.json();
  },
  generate: async (prompt) => {
    const response = await fetch(`${API_BASE_URL}/rfps/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok) throw new Error('Failed to generate RFP');
    return response.json();
  },
  sendToVendors: async (rfpId, vendorIds) => {
    const response = await fetch(`${API_BASE_URL}/send-rfp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rfp_id: rfpId, vendor_ids: vendorIds }),
    });
    if (!response.ok) throw new Error('Failed to send RFP');
    return response.json();
  },
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/rfps/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete RFP');
    return response.json();
  },
};
export const proposalAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/proposals/`);
    if (!response.ok) throw new Error('Failed to fetch proposals');
    return response.json();
  },
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/proposals/${id}`);
    if (!response.ok) throw new Error('Failed to fetch proposal');
    return response.json();
  },
  compare: async (rfpId, forceRefresh = false) => {
    const url = `${API_BASE_URL}/proposals/compare/${rfpId}${forceRefresh ? '?force_refresh=true' : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to compare proposals');
    return response.json();
  },
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/proposals/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete proposal');
    return response.json();
  },
  accept: async (id) => {
    const response = await fetch(`${API_BASE_URL}/proposals/${id}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to accept proposal');
    return response.json();
  },
  reject: async (id) => {
    const response = await fetch(`${API_BASE_URL}/proposals/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to reject proposal');
    return response.json();
  },
};