import { useState, useEffect } from 'react';
import { Table, Button, Modal, ButtonToolbar, Tag, Message, toaster, Pagination, Panel } from 'rsuite';
import { Visible, Trash } from '@rsuite/icons';
import { rfpAPI } from '../services/api';

const RFPManagement = () => {
  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRFP, setSelectedRFP] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingRFPId, setDeletingRFPId] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchRFPs();
  }, []);

  const fetchRFPs = async () => {
    try {
      setLoading(true);
      const data = await rfpAPI.getAll();
      setRfps(data);
      setError(null);
    } catch (err) {
      setError('Failed to load RFPs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRFP = (rfp) => {
    setSelectedRFP(rfp);
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setSelectedRFP(null);
    setShowViewModal(false);
  };

  const handleDeleteRFP = (rfpId) => {
    setDeletingRFPId(rfpId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await rfpAPI.delete(deletingRFPId);
      await fetchRFPs();
      toaster.push(
        <Message showIcon type="success" closable>
          RFP deleted successfully
        </Message>,
        { placement: 'topEnd' }
      );
    } catch (err) {
      toaster.push(
        <Message showIcon type="error" closable>
          Failed to delete RFP
        </Message>,
        { placement: 'topEnd' }
      );
      console.error(err);
    } finally {
      setShowDeleteConfirm(false);
      setDeletingRFPId(null);
    }
  };

  const handleChangePage = (dataKey) => {
    setPage(dataKey);
  };

  const handleChangeLength = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
  };

  const getPaginatedData = () => {
    return rfps.filter((v, i) => {
      const start = limit * (page - 1);
      const end = start + limit;
      return i >= start && i < end;
    });
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div className="bg-white" style={{ width: '100%', minHeight: '100vh' }}>
        <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">View RFPs</h2>
              <p className="text-sm text-gray-600">Manage and view all your RFPs</p>
            </div>
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
                <p className="text-gray-500">Loading RFPs...</p>
              </div>
            ) : rfps.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No RFPs found. Create your first RFP to get started.</p>
              </div>
            ) : (
              <div style={{ width: '100%' }}>
                <Table
                  autoHeight
                  data={getPaginatedData()}
                  loading={loading}
                  bordered
                  cellBordered
                >
                  <Table.Column flexGrow={2} minWidth={200}>
                    <Table.HeaderCell>Title</Table.HeaderCell>
                    <Table.Cell dataKey="title" />
                  </Table.Column>

                  <Table.Column flexGrow={1} minWidth={120}>
                    <Table.HeaderCell>Budget</Table.HeaderCell>
                    <Table.Cell>
                      {rowData => `$${rowData.budget?.toLocaleString() || 'N/A'}`}
                    </Table.Cell>
                  </Table.Column>

                  <Table.Column flexGrow={1} minWidth={150}>
                    <Table.HeaderCell>Deadline</Table.HeaderCell>
                    <Table.Cell>
                      {rowData => rowData.deadline ? new Date(rowData.deadline).toLocaleDateString() : 'N/A'}
                    </Table.Cell>
                  </Table.Column>

                  <Table.Column flexGrow={1} minWidth={120}>
                    <Table.HeaderCell>Items</Table.HeaderCell>
                    <Table.Cell>
                      {rowData => (
                        <Tag color="blue">{rowData.items?.length || 0} items</Tag>
                      )}
                    </Table.Cell>
                  </Table.Column>

                  <Table.Column flexGrow={1} minWidth={150}>
                    <Table.HeaderCell>Created</Table.HeaderCell>
                    <Table.Cell>
                      {rowData => new Date(rowData.created_at).toLocaleDateString()}
                    </Table.Cell>
                  </Table.Column>

                  <Table.Column width={180} fixed="right">
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                    <Table.Cell>
                      {rowData => (
                        <ButtonToolbar>
                          <Button
                            size="sm"
                            appearance="ghost"
                            startIcon={<Visible />}
                            onClick={() => handleViewRFP(rowData)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            appearance="ghost"
                            color="red"
                            startIcon={<Trash />}
                            onClick={() => handleDeleteRFP(rowData.id)}
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
                    total={rfps.length}
                    limitOptions={[10, 20, 50]}
                    limit={limit}
                    activePage={page}
                    onChangePage={handleChangePage}
                    onChangeLimit={handleChangeLength}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View RFP Modal */}
      <Modal open={showViewModal} onClose={handleCloseModal} size="lg">
        <Modal.Header>
          <Modal.Title>{selectedRFP?.title || 'RFP Details'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRFP && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Budget</label>
                  <p className="mt-1 text-sm text-gray-900">${selectedRFP.budget?.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Deadline</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedRFP.deadline ? new Date(selectedRFP.deadline).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="mt-1 text-sm text-gray-900">{selectedRFP.description || 'No description'}</p>
              </div>

              {selectedRFP.items && selectedRFP.items.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
                  <Table
                    height={300}
                    data={selectedRFP.items}
                    bordered
                    cellBordered
                  >
                    <Table.Column width={200}>
                      <Table.HeaderCell>Name</Table.HeaderCell>
                      <Table.Cell dataKey="name" />
                    </Table.Column>
                    <Table.Column width={100}>
                      <Table.HeaderCell>Quantity</Table.HeaderCell>
                      <Table.Cell dataKey="quantity" />
                    </Table.Column>
                    <Table.Column flexGrow={1}>
                      <Table.HeaderCell>Description</Table.HeaderCell>
                      <Table.Cell dataKey="description" />
                    </Table.Column>
                  </Table>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseModal} appearance="primary">
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} size="xs">
        <Modal.Header>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this RFP? This action cannot be undone.
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

export default RFPManagement;
