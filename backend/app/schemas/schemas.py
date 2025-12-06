from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# RFP Models
class RFPItem(BaseModel):
    name: str
    quantity: int
    description: Optional[str] = None
    specifications: Optional[str] = None

class RFPBase(BaseModel):
    title: str
    description: str
    budget: float
    deadline: datetime
    items: List[RFPItem]
    delivery_terms: Optional[str] = None
    payment_terms: Optional[str] = None
    warranty_requirements: Optional[str] = None

class RFPCreate(RFPBase):
    pass

class RFPResponse(RFPBase):
    id: int
    created_at: datetime = None

# Vendor Models
class VendorBase(BaseModel):
    name: str
    email: str
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class VendorCreate(VendorBase):
    pass

class VendorResponse(VendorBase):
    id: int
    created_at: datetime = None

# Proposal Models
class ProposalItem(BaseModel):
    rfp_item_id: int  # Reference to the RFP item
    price_per_unit: float
    total_price: float
    delivery_time: Optional[int] = None  # in days
    warranty_period: Optional[int] = None  # in months
    specifications_match: Optional[bool] = None

class ProposalBase(BaseModel):
    rfp_id: int
    vendor_id: int
    items: List[ProposalItem]
    total_price: float
    delivery_terms: Optional[str] = None
    payment_terms: Optional[str] = None
    validity_period: Optional[int] = None  # in days
    notes: Optional[str] = None

class ProposalCreate(ProposalBase):
    pass

class ProposalResponse(ProposalBase):
    id: int
    created_at: datetime = None

# Comparison Models
class VendorScore(BaseModel):
    vendor_id: int
    vendor_name: str
    total_score: float
    price_score: float
    terms_score: float
    completeness_score: float
    details: dict

class ComparisonResult(BaseModel):
    rfp_id: int
    results: List[VendorScore]
    recommendation: Optional[str] = None

# AI Processing Models
class AIRequest(BaseModel):
    prompt: str

class AIResponse(BaseModel):
    content: str