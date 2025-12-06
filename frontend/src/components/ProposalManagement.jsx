import { useState, useEffect } from 'react';
import { Table, Button, Modal, Panel, ButtonToolbar, Tag, Message, toaster, Pagination } from 'rsuite';
import { Visible, Trash, Check, Close } from '@rsuite/icons';
import { proposalAPI } from '../services/api';
const ProposalManagement = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingProposalId, setDeletingProposalId] = useState(null);
  const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);
  const [acceptingProposal, setAcceptingProposal] = useState(null);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [rejectingProposal, setRejectingProposal] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  useEffect(() => {
    fetchProposals();
  }, []);
  const fetchProposals = async () => {
    try {
      setLoading(true);
      const data = await proposalAPI.getAll();
      setProposals(data);
      setError(null);
    } catch (err) {
      setError('Failed to load proposals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleViewProposal = (proposal) => {
    setSelectedProposal(proposal);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setSelectedProposal(null);
    setShowModal(false);
  };
  const handleChangePage = (dataKey) => {
    setPage(dataKey);
  };
  const handleChangeLength = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
  };
  const getPaginatedData = () => {
    return proposals.filter((v, i) => {
      const start = limit * (page - 1);
      const end = start + limit;
      return i >= start && i < end;
    });
  };
  const handleDeleteProposal = (proposalId) => {
    setDeletingProposalId(proposalId);
    setShowDeleteConfirm(true);
  };
  const confirmDelete = async () => {
    try {
      await proposalAPI.delete(deletingProposalId);
      await fetchProposals();
      toaster.push(
        <Message showIcon type="success" closable>
          Proposal deleted successfully
        </Message>,
        { placement: 'topEnd' }
      );
    } catch (err) {
      toaster.push(
        <Message showIcon type="error" closable>
          Failed to delete proposal
        </Message>,
        { placement: 'topEnd' }
      );
      console.error(err);
    } finally {
      setShowDeleteConfirm(false);
      setDeletingProposalId(null);
    }
  };
  const handleAcceptProposal = (proposal) => {
    setAcceptingProposal(proposal);
    setShowAcceptConfirm(true);
  };
  const confirmAccept = async () => {
    try {
      await proposalAPI.accept(acceptingProposal.id);
      await fetchProposals();
      toaster.push(
        <Message showIcon type="success" closable>
          Proposal accepted successfully!
        </Message>,
        { placement: 'topEnd' }
      );
    } catch (err) {
      toaster.push(
        <Message showIcon type="error" closable>
          Failed to accept proposal
        </Message>,
        { placement: 'topEnd' }
      );
      console.error(err);
    } finally {
      setShowAcceptConfirm(false);
      setAcceptingProposal(null);
    }
  };
  const handleRejectProposal = (proposal) => {
    setRejectingProposal(proposal);
    setShowRejectConfirm(true);
  };
  const confirmReject = async () => {
    try {
      await proposalAPI.reject(rejectingProposal.id);
      await fetchProposals();
      toaster.push(
        <Message showIcon type="warning" closable>
          Proposal rejected
        </Message>,
        { placement: 'topEnd' }
      );
    } catch (err) {
      toaster.push(
        <Message showIcon type="error" closable>
          Failed to reject proposal
        </Message>,
        { placement: 'topEnd' }
      );
      console.error(err);
    } finally {
      setShowRejectConfirm(false);
      setRejectingProposal(null);
    }
  };
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div className="bg-white" style={{ width: '100%', minHeight: '100vh' }}>
        <div className="px-6 py-5 bg-gradient-to-r from-green-50 to-teal-50 border-b border-green-100">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Vendor Proposals</h2>
              <p className="text-sm text-gray-600">View and manage vendor submissions</p>
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
                <p className="text-gray-500">Loading proposals...</p>
              </div>
            ) : proposals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No proposals found. Proposals will appear here when vendors respond to RFPs.</p>
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
                <Table.Column flexGrow={1} minWidth={150}>
                  <Table.HeaderCell>Vendor</Table.HeaderCell>
                  <Table.Cell dataKey="vendor_name" />
                </Table.Column>
                <Table.Column width={120}>
                  <Table.HeaderCell>RFP ID</Table.HeaderCell>
                  <Table.Cell>
                    {rowData => `RFP #${rowData.rfp_id}`}
                  </Table.Cell>
                </Table.Column>
                <Table.Column flexGrow={1} minWidth={150}>
                  <Table.HeaderCell>Total Price</Table.HeaderCell>
                  <Table.Cell>
                    {rowData => `$${rowData.total_price.toLocaleString()}`}
                  </Table.Cell>
                </Table.Column>
                <Table.Column flexGrow={1} minWidth={150}>
                  <Table.HeaderCell>Received Date</Table.HeaderCell>
                  <Table.Cell>
                    {rowData => new Date(rowData.created_at).toLocaleDateString()}
                  </Table.Cell>
                </Table.Column>
                <Table.Column width={120}>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.Cell>
                    {rowData => {
                      const status = rowData.status || 'received';
                      let color = 'blue';
                      let text = 'Received';
                      if (status === 'accepted') {
                        color = 'green';
                        text = 'Accepted';
                      } else if (status === 'rejected') {
                        color = 'red';
                        text = 'Rejected';
                      }
                      return <Tag color={color}>{text}</Tag>;
                    }}
                  </Table.Cell>
                </Table.Column>
                <Table.Column width={280} fixed="right">
                  <Table.HeaderCell>Actions</Table.HeaderCell>
                  <Table.Cell>
                    {rowData => {
                      const status = rowData.status || 'received';
                      const isAccepted = status === 'accepted';
                      const isRejected = status === 'rejected';
                      const isPending = status === 'received';
                      return (
                        <ButtonToolbar>
                          <Button
                            size="sm"
                            appearance="ghost"
                            startIcon={<Visible />}
                            onClick={() => handleViewProposal(rowData)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            appearance="ghost"
                            color="green"
                            startIcon={<Check />}
                            onClick={() => handleAcceptProposal(rowData)}
                            disabled={isAccepted || isRejected}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            appearance="ghost"
                            color="orange"
                            startIcon={<Close />}
                            onClick={() => handleRejectProposal(rowData)}
                            disabled={isAccepted || isRejected}
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            appearance="ghost"
                            color="red"
                            startIcon={<Trash />}
                            onClick={() => handleDeleteProposal(rowData.id)}
                          >
                            Delete
                          </Button>
                        </ButtonToolbar>
                      );
                    }}
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
                  total={proposals.length}
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
      {}
      <Modal open={showModal} onClose={handleCloseModal} size="lg">
        <Modal.Header>
          <Modal.Title>
            Proposal from {selectedProposal?.vendor_name || 'Unknown Vendor'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProposal && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">RFP ID</label>
                  <p className="mt-1 text-sm text-gray-900">RFP #{selectedProposal.rfp_id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Price</label>
                  <p className="mt-1 text-sm text-gray-900">${selectedProposal.total_price.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Received Date</label>
                  <p className="mt-1 text-sm text-gray-900">{new Date(selectedProposal.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delivery Terms</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProposal.delivery_terms || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Terms</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProposal.payment_terms || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {(() => {
                      const status = selectedProposal.status || 'received';
                      let color = 'blue';
                      let text = 'Received';
                      if (status === 'accepted') {
                        color = 'green';
                        text = 'Accepted';
                      } else if (status === 'rejected') {
                        color = 'red';
                        text = 'Rejected';
                      }
                      return <Tag color={color}>{text}</Tag>;
                    })()}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Proposal Items</h4>
                <Table
                  height={300}
                  data={selectedProposal.items}
                  bordered
                  cellBordered
                >
                  <Table.Column width={100}>
                    <Table.HeaderCell>Item #</Table.HeaderCell>
                    <Table.Cell>
                      {(rowData, rowIndex) => `Item ${rowIndex + 1}`}
                    </Table.Cell>
                  </Table.Column>
                  <Table.Column width={120}>
                    <Table.HeaderCell>Price/Unit</Table.HeaderCell>
                    <Table.Cell>
                      {rowData => `$${rowData.price_per_unit.toFixed(2)}`}
                    </Table.Cell>
                  </Table.Column>
                  <Table.Column width={120}>
                    <Table.HeaderCell>Total</Table.HeaderCell>
                    <Table.Cell>
                      {rowData => `$${rowData.total_price.toFixed(2)}`}
                    </Table.Cell>
                  </Table.Column>
                  <Table.Column width={120}>
                    <Table.HeaderCell>Delivery (days)</Table.HeaderCell>
                    <Table.Cell dataKey="delivery_time" />
                  </Table.Column>
                  <Table.Column width={140}>
                    <Table.HeaderCell>Warranty (months)</Table.HeaderCell>
                    <Table.Cell dataKey="warranty_period" />
                  </Table.Column>
                </Table>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            onClick={() => handleAcceptProposal(selectedProposal)} 
            appearance="primary" 
            color="green" 
            startIcon={<Check />}
            disabled={selectedProposal?.status === 'accepted' || selectedProposal?.status === 'rejected'}
          >
            Accept Proposal
          </Button>
          <Button 
            onClick={() => handleRejectProposal(selectedProposal)} 
            appearance="primary" 
            color="orange" 
            startIcon={<Close />}
            disabled={selectedProposal?.status === 'accepted' || selectedProposal?.status === 'rejected'}
          >
            Reject Proposal
          </Button>
          <Button onClick={handleCloseModal} appearance="subtle">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {}
      <Modal open={showAcceptConfirm} onClose={() => setShowAcceptConfirm(false)} size="xs">
        <Modal.Header>
          <Modal.Title>Confirm Accept</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to accept this proposal from {acceptingProposal?.vendor_name}?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={confirmAccept} appearance="primary" color="green">
            Accept
          </Button>
          <Button onClick={() => setShowAcceptConfirm(false)} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      {}
      <Modal open={showRejectConfirm} onClose={() => setShowRejectConfirm(false)} size="xs">
        <Modal.Header>
          <Modal.Title>Confirm Reject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to reject this proposal from {rejectingProposal?.vendor_name}?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={confirmReject} appearance="primary" color="orange">
            Reject
          </Button>
          <Button onClick={() => setShowRejectConfirm(false)} appearance="subtle">
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
          Are you sure you want to delete this proposal? This action cannot be undone.
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
export default ProposalManagement;