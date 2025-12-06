import { useState } from 'react';

const VendorManagement = () => {
  const [vendors, setVendors] = useState([
    {
      id: 1,
      name: "Tech Solutions Inc.",
      email: "contact@techsolutions.com",
      contact_person: "John Smith",
      phone: "+1 (555) 123-4567",
      address: "123 Tech Street, San Francisco, CA 94103"
    },
    {
      id: 2,
      name: "Global Electronics Ltd.",
      email: "info@globalelectronics.com",
      contact_person: "Sarah Johnson",
      phone: "+1 (555) 987-6543",
      address: "456 Electronic Ave, New York, NY 10001"
    }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact_person: '',
    phone: '',
    address: ''
  });

  const handleAddVendor = () => {
    setFormData({
      name: '',
      email: '',
      contact_person: '',
      phone: '',
      address: ''
    });
    setEditingVendor(null);
    setShowAddForm(true);
  };

  const handleEditVendor = (vendor) => {
    setFormData(vendor);
    setEditingVendor(vendor);
    setShowAddForm(true);
  };

  const handleDeleteVendor = (vendorId) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      setVendors(vendors.filter(vendor => vendor.id !== vendorId));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingVendor) {
      // Update existing vendor
      setVendors(vendors.map(vendor => 
        vendor.id === editingVendor.id ? {...formData, id: editingVendor.id} : vendor
      ));
    } else {
      // Add new vendor
      const newVendor = {
        ...formData,
        id: Math.max(...vendors.map(v => v.id), 0) + 1
      };
      setVendors([...vendors, newVendor]);
    }
    
    setShowAddForm(false);
    setFormData({
      name: '',
      email: '',
      contact_person: '',
      phone: '',
      address: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-2xl font-semibold text-gray-800">Manage Vendors</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Add, edit, or remove vendors</p>
        </div>
        <div className="border-t border-gray-200">
          <div className="p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Vendor List</h3>
              <button
                onClick={handleAddVendor}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Vendor
              </button>
            </div>
            
            {showAddForm && (
              <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
                </h4>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Company Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                      <input
                        type="text"
                        name="contact_person"
                        value={formData.contact_person}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="2"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {editingVendor ? 'Update Vendor' : 'Add Vendor'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vendors.map((vendor) => (
                    <tr key={vendor.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vendor.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.contact_person}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleEditVendor(vendor)}
                          className="text-indigo-600 hover:text-indigo-900 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteVendor(vendor.id)}
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
    </div>
  );
};

export default VendorManagement;