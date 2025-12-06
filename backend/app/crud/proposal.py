from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.models import Proposal as ProposalModel, ProposalItem as ProposalItemModel
from app.schemas import ProposalCreate

def create_proposal(db: Session, proposal: ProposalCreate) -> ProposalModel:
    """
    Create a new proposal in the database
    """
    # Create Proposal
    db_proposal = ProposalModel(
        rfp_id=proposal.rfp_id,
        vendor_id=proposal.vendor_id,
        total_price=proposal.total_price,
        delivery_terms=proposal.delivery_terms,
        payment_terms=proposal.payment_terms,
        validity_period=proposal.validity_period,
        notes=proposal.notes
    )
    
    db.add(db_proposal)
    db.flush()  # Get the ID before committing
    
    # Create Proposal items
    for item in proposal.items:
        db_item = ProposalItemModel(
            proposal_id=db_proposal.id,
            rfp_item_id=item.rfp_item_id,
            price_per_unit=item.price_per_unit,
            total_price=item.total_price,
            delivery_time=item.delivery_time,
            warranty_period=item.warranty_period,
            specifications_match=item.specifications_match
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_proposal)
    return db_proposal

def get_proposal(db: Session, proposal_id: int) -> Optional[ProposalModel]:
    """
    Get a single proposal by ID
    """
    return db.query(ProposalModel).filter(ProposalModel.id == proposal_id).first()

def get_proposals(db: Session, skip: int = 0, limit: int = 100) -> List[ProposalModel]:
    """
    Get all proposals with pagination
    """
    return db.query(ProposalModel).offset(skip).limit(limit).all()

def get_proposals_by_rfp(db: Session, rfp_id: int) -> List[ProposalModel]:
    """
    Get all proposals for a specific RFP
    """
    return db.query(ProposalModel).filter(ProposalModel.rfp_id == rfp_id).all()

def get_proposals_by_vendor(db: Session, vendor_id: int) -> List[ProposalModel]:
    """
    Get all proposals from a specific vendor
    """
    return db.query(ProposalModel).filter(ProposalModel.vendor_id == vendor_id).all()

def delete_proposal(db: Session, proposal_id: int) -> bool:
    """
    Delete a proposal
    """
    db_proposal = get_proposal(db, proposal_id)
    if db_proposal is None:
        return False
    
    db.delete(db_proposal)
    db.commit()
    return True