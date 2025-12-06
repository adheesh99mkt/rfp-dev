from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.models import Vendor as VendorModel
from app.schemas import VendorCreate

def create_vendor(db: Session, vendor: VendorCreate) -> VendorModel:
    """
    Create a new vendor in the database
    """
    db_vendor = VendorModel(
        name=vendor.name,
        email=vendor.email,
        contact_person=vendor.contact_person,
        phone=vendor.phone,
        address=vendor.address
    )
    
    db.add(db_vendor)
    db.commit()
    db.refresh(db_vendor)
    return db_vendor

def get_vendor(db: Session, vendor_id: int) -> Optional[VendorModel]:
    """
    Get a single vendor by ID
    """
    return db.query(VendorModel).filter(VendorModel.id == vendor_id).first()

def get_vendor_by_email(db: Session, email: str) -> Optional[VendorModel]:
    """
    Get a vendor by email address
    """
    return db.query(VendorModel).filter(VendorModel.email == email).first()

def get_vendors(db: Session, skip: int = 0, limit: int = 100) -> List[VendorModel]:
    """
    Get all vendors with pagination
    """
    return db.query(VendorModel).offset(skip).limit(limit).all()

def update_vendor(db: Session, vendor_id: int, vendor: VendorCreate) -> Optional[VendorModel]:
    """
    Update an existing vendor
    """
    db_vendor = get_vendor(db, vendor_id)
    if db_vendor is None:
        return None
    
    db_vendor.name = vendor.name
    db_vendor.email = vendor.email
    db_vendor.contact_person = vendor.contact_person
    db_vendor.phone = vendor.phone
    db_vendor.address = vendor.address
    
    db.commit()
    db.refresh(db_vendor)
    return db_vendor

def delete_vendor(db: Session, vendor_id: int) -> bool:
    """
    Delete a vendor
    """
    db_vendor = get_vendor(db, vendor_id)
    if db_vendor is None:
        return False
    
    db.delete(db_vendor)
    db.commit()
    return True