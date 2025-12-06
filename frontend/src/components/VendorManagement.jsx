import { useState, useEffect } from 'react';
import { Table, Button, Modal, ButtonToolbar, Message, toaster, Pagination, Input } from 'rsuite';
import { Plus, Edit, Trash } from '@rsuite/icons';
import { vendorAPI } from '../services/api';
const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingVendorId, setDeletingVendorId] = useState(null);
  const [editingVendor, setEditingVendor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact_person: '',
    phone: '',
    address: ''
  });
  useEffect(() => {
    fetchVendors();
  }, []);
  const fetchVendors = async () => {
    try {
      setLoading(true);
      const data = await vendorAPI.getAll();
      setVendors(data);
      setError(null);
    } catch (err) {
      setError('Failed to load vendors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
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
    setDeletingVendorId(vendorId);
    setShowDeleteConfirm(true);
  };
  const confirmDelete = async () => {
    try {
      await vendorAPI.delete(deletingVendorId);
      await fetchVendors();
      toaster.push(
        <Message showIcon type="success" closable>
          Vendor deleted successfully
        </Message>,
        { placement: 'topEnd' }
      );
    } catch (err) {
      toaster.push(
        <Message showIcon type="error" closable>
          Failed to delete vendor
        </Message>,
        { placement: 'topEnd' }
      );
      console.error(err);
    } finally {
      setShowDeleteConfirm(false);
      setDeletingVendorId(null);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVendor) {
        await vendorAPI.update(editingVendor.id, formData);
        toaster.push(
          <Message showIcon type="success" closable>
            Vendor updated successfully
          </Message>,
          { placement: 'topEnd' }
        );
      } else {
        await vendorAPI.create(formData);
        toaster.push(
          <Message showIcon type="success" closable>
            Vendor created successfully
          </Message>,
          { placement: 'topEnd' }
        );
      }
      await fetchVendors();
      setShowAddForm(false);
      setFormData({
        name: '',
        email: '',
        contact_person: '',
        phone: '',
        address: ''
      });
    } catch (err) {
      toaster.push(
        <Message showIcon type="error" closable>
          {`Failed to ${editingVendor ? 'update' : 'create'} vendor`}
        </Message>,
        { placement: 'topEnd' }
      );
      console.error(err);
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleChangePage = (dataKey) => {
    setPage(dataKey);
  };
  const handleChangeLength = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
  };
  const getPaginatedData = () => {
    return vendors.filter((v, i) => {
      const start = limit * (page - 1);
      const end = start + limit;
      return i >= start && i < end;
    });
  };
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div className="bg-white" style={{ width: '100%', minHeight: '100vh' }}>
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Manage Vendors</h2>
                <p className="text-sm text-gray-600">Add, edit, or remove vendor profiles</p>
              </div>
            </div>
            <Button
              onClick={handleAddVendor}
              appearance="primary"
              size="lg"
              startIcon={<Plus />}
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              Add Vendor
            </Button>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <div className="p-6" style={{ width: '100%' }}>
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">{error}</p>
              </div>
            )}
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading vendors...</p>
              </div>
            ) : (
              <>
            <div style={{ width: '100%' }}>
              <Table
                autoHeight
                data={getPaginatedData()}
                loading={loading}
                bordered
                cellBordered
              >
                <Table.Column flexGrow={2} minWidth={200}>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.Cell dataKey="name" />
                </Table.Column>
                <Table.Column flexGrow={2} minWidth={250}>
                  <Table.HeaderCell>Email</Table.HeaderCell>
                  <Table.Cell dataKey="email" />
                </Table.Column>
                <Table.Column flexGrow={1} minWidth={150}>
                  <Table.HeaderCell>Contact Person</Table.HeaderCell>
                  <Table.Cell dataKey="contact_person" />
                </Table.Column>
                <Table.Column flexGrow={1} minWidth={150}>
                  <Table.HeaderCell>Phone</Table.HeaderCell>
                  <Table.Cell dataKey="phone" />
                </Table.Column>
                <Table.Column width={180} fixed="right">
                  <Table.HeaderCell>Actions</Table.HeaderCell>
                  <Table.Cell>
                    {rowData => (
                      <ButtonToolbar>
                        <Button
                          size="sm"
                          appearance="ghost"
                          startIcon={<Edit />}
                          onClick={() => handleEditVendor(rowData)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          appearance="ghost"
                          color="red"
                          startIcon={<Trash />}
                          onClick={() => handleDeleteVendor(rowData.id)}
                        >
                          Delete
                        </Button>
                      </ButtonToolbar>
                    )}
                  </Table.Cell>
                </Table.Column>
              </Table>
              <div style={{ padding: 20 }}>
                <Pagination
                  prev
                  next
                  first
                  last
                  ellipsis
                  boundaryLinks
                  maxButtons={5}
                  size="md"
                  layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                  total={vendors.length}
                  limitOptions={[10, 20, 50]}
                  limit={limit}
                  activePage={page}
                  onChangePage={handleChangePage}
                  onChangeLimit={handleChangeLength}
                />
              </div>
            </div>
              </>
            )}
          </div>
        </div>
      </div>
      {}
      <Modal open={showAddForm} onClose={() => setShowAddForm(false)} size="md">
        <Modal.Header>
          <Modal.Title>{editingVendor ? 'Edit Vendor' : 'Add New Vendor'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="vendor-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
              <Input
                name="name"
                value={formData.name}
                onChange={(value) => setFormData({...formData, name: value})}
                placeholder="Enter company name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={(value) => setFormData({...formData, email: value})}
                placeholder="vendor@company.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
              <Input
                name="contact_person"
                value={formData.contact_person}
                onChange={(value) => setFormData({...formData, contact_person: value})}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={(value) => setFormData({...formData, phone: value})}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <Input
                as="textarea"
                rows={3}
                name="address"
                value={formData.address}
                onChange={(value) => setFormData({...formData, address: value})}
                placeholder="123 Main St, City, State, ZIP"
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" form="vendor-form" appearance="primary">
            {editingVendor ? 'Update Vendor' : 'Add Vendor'}
          </Button>
          <Button onClick={() => setShowAddForm(false)} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      {}
      <Modal open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} size="xs">
        <Modal.Header>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this vendor? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={confirmDelete} appearance="primary" color="red">
            Delete
          </Button>
          <Button onClick={() => setShowDeleteConfirm(false)} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default VendorManagement;