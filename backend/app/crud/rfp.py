from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.models import RFP as RFPModel, RFPItem as RFPItemModel
from app.schemas import RFPCreate, RFPResponse
from datetime import datetime
def create_rfp(db: Session, rfp: RFPCreate) -> RFPModel:
    db_rfp = RFPModel(
        title=rfp.title,
        description=rfp.description,
        budget=rfp.budget,
        deadline=rfp.deadline,
        delivery_terms=rfp.delivery_terms,
        payment_terms=rfp.payment_terms,
        warranty_requirements=rfp.warranty_requirements
    )
    db.add(db_rfp)
    db.flush() 
    for item in rfp.items:
        db_item = RFPItemModel(
            rfp_id=db_rfp.id,
            name=item.name,
            quantity=item.quantity,
            description=item.description,
            specifications=item.specifications
        )
        db.add(db_item)
    db.commit()
    db.refresh(db_rfp)
    return db_rfp
def get_rfp(db: Session, rfp_id: int) -> Optional[RFPModel]:
    return db.query(RFPModel).filter(RFPModel.id == rfp_id).first()
def get_rfps(db: Session, skip: int = 0, limit: int = 100) -> List[RFPModel]:
    return db.query(RFPModel).offset(skip).limit(limit).all()
def update_rfp(db: Session, rfp_id: int, rfp: RFPCreate) -> Optional[RFPModel]:
    db_rfp = get_rfp(db, rfp_id)
    if db_rfp is None:
        return None
    db_rfp.title = rfp.title
    db_rfp.description = rfp.description
    db_rfp.budget = rfp.budget
    db_rfp.deadline = rfp.deadline
    db_rfp.delivery_terms = rfp.delivery_terms
    db_rfp.payment_terms = rfp.payment_terms
    db_rfp.warranty_requirements = rfp.warranty_requirements
    db.query(RFPItemModel).filter(RFPItemModel.rfp_id == rfp_id).delete()
    for item in rfp.items:
        db_item = RFPItemModel(
            rfp_id=db_rfp.id,
            name=item.name,
            quantity=item.quantity,
            description=item.description,
            specifications=item.specifications
        )
        db.add(db_item)
    db.commit()
    db.refresh(db_rfp)
    return db_rfp
def delete_rfp(db: Session, rfp_id: int) -> bool:
    db_rfp = get_rfp(db, rfp_id)
    if db_rfp is None:
        return False
    db.delete(db_rfp)
    db.commit()
    return True