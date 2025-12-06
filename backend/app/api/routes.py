from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.schemas import RFPCreate, RFPResponse, VendorCreate, VendorResponse, ProposalCreate, ProposalResponse, ComparisonResult, AIRequest
from app.core.agents import RFPGeneratorAgent, ResponseParserAgent, ComparisonAgent
from app.database import get_db
from sqlalchemy.orm import Session
from app.crud import rfp as rfp_crud, vendor as vendor_crud, proposal as proposal_crud
from app.utils.email_utils import EmailSender
from pydantic import BaseModel

router = APIRouter()

# Placeholder for RFP endpoints
@router.post("/rfps/", response_model=dict)
async def create_rfp(rfp: RFPCreate, db: Session = Depends(get_db)):
    db_rfp = rfp_crud.create_rfp(db, rfp)
    return {"id": db_rfp.id, "message": "RFP created successfully"}

@router.get("/rfps/", response_model=List[dict])
async def get_rfps(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    rfps = rfp_crud.get_rfps(db, skip=skip, limit=limit)
    result = []
    for rfp in rfps:
        result.append({
            "id": rfp.id,
            "title": rfp.title,
            "description": rfp.description,
            "budget": rfp.budget,
            "deadline": rfp.deadline.isoformat() if rfp.deadline else None,
            "created_at": rfp.created_at.isoformat() if rfp.created_at else None,
            "items": [{
                "id": item.id,
                "name": item.name,
                "quantity": item.quantity,
                "description": item.description,
                "specifications": item.specifications
            } for item in rfp.items]
        })
    return result

@router.post("/rfps/generate", response_model=dict)
async def generate_rfp(request: AIRequest):
    """Generate RFP from natural language prompt using AI"""
    agent = RFPGeneratorAgent()
    rfp_data = agent.generate_rfp(request.prompt)
    # Return the generated RFP data without saving to database yet
    return rfp_data.dict()

@router.get("/rfps/{rfp_id}", response_model=dict)
async def get_rfp(rfp_id: int, db: Session = Depends(get_db)):
    db_rfp = rfp_crud.get_rfp(db, rfp_id)
    if db_rfp is None:
        raise HTTPException(status_code=404, detail="RFP not found")
    return {
        "id": db_rfp.id,
        "title": db_rfp.title,
        "description": db_rfp.description,
        "budget": db_rfp.budget,
        "deadline": db_rfp.deadline.isoformat() if db_rfp.deadline else None,
        "delivery_terms": db_rfp.delivery_terms,
        "payment_terms": db_rfp.payment_terms,
        "warranty_requirements": db_rfp.warranty_requirements,
        "created_at": db_rfp.created_at.isoformat() if db_rfp.created_at else None,
        "items": [{
            "id": item.id,
            "name": item.name,
            "quantity": item.quantity,
            "description": item.description,
            "specifications": item.specifications
        } for item in db_rfp.items]
    }

@router.delete("/rfps/{rfp_id}")
async def delete_rfp(rfp_id: int, db: Session = Depends(get_db)):
    success = rfp_crud.delete_rfp(db, rfp_id)
    if not success:
        raise HTTPException(status_code=404, detail="RFP not found")
    return {"message": "RFP deleted successfully"}

# Placeholder for Vendor endpoints
@router.post("/vendors/", response_model=dict)
async def create_vendor(vendor: VendorCreate, db: Session = Depends(get_db)):
    # Check if vendor already exists
    existing_vendor = vendor_crud.get_vendor_by_email(db, vendor.email)
    if existing_vendor:
        raise HTTPException(status_code=400, detail="Vendor with this email already exists")
    
    db_vendor = vendor_crud.create_vendor(db, vendor)
    return {"id": db_vendor.id, "message": "Vendor created successfully"}

@router.get("/vendors/", response_model=List[dict])
async def get_vendors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    vendors = vendor_crud.get_vendors(db, skip=skip, limit=limit)
    return [{
        "id": vendor.id,
        "name": vendor.name,
        "email": vendor.email,
        "contact_person": vendor.contact_person,
        "phone": vendor.phone,
        "address": vendor.address,
        "created_at": vendor.created_at.isoformat() if vendor.created_at else None
    } for vendor in vendors]

@router.get("/vendors/{vendor_id}", response_model=dict)
async def get_vendor(vendor_id: int, db: Session = Depends(get_db)):
    db_vendor = vendor_crud.get_vendor(db, vendor_id)
    if db_vendor is None:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return {
        "id": db_vendor.id,
        "name": db_vendor.name,
        "email": db_vendor.email,
        "contact_person": db_vendor.contact_person,
        "phone": db_vendor.phone,
        "address": db_vendor.address,
        "created_at": db_vendor.created_at.isoformat() if db_vendor.created_at else None
    }

@router.put("/vendors/{vendor_id}", response_model=dict)
async def update_vendor(vendor_id: int, vendor: VendorCreate, db: Session = Depends(get_db)):
    db_vendor = vendor_crud.update_vendor(db, vendor_id, vendor)
    if db_vendor is None:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return {"id": db_vendor.id, "message": "Vendor updated successfully"}

@router.delete("/vendors/{vendor_id}")
async def delete_vendor(vendor_id: int, db: Session = Depends(get_db)):
    success = vendor_crud.delete_vendor(db, vendor_id)
    if not success:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return {"message": "Vendor deleted successfully"}

# Placeholder for Proposal endpoints
@router.post("/proposals/", response_model=dict)
async def create_proposal(proposal: ProposalCreate, db: Session = Depends(get_db)):
    db_proposal = proposal_crud.create_proposal(db, proposal)
    return {"id": db_proposal.id, "message": "Proposal created successfully"}

@router.get("/proposals/", response_model=List[dict])
async def get_proposals(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    proposals = proposal_crud.get_proposals(db, skip=skip, limit=limit)
    result = []
    for proposal in proposals:
        result.append({
            "id": proposal.id,
            "rfp_id": proposal.rfp_id,
            "vendor_id": proposal.vendor_id,
            "vendor_name": proposal.vendor.name if proposal.vendor else None,
            "total_price": proposal.total_price,
            "delivery_terms": proposal.delivery_terms,
            "payment_terms": proposal.payment_terms,
            "created_at": proposal.created_at.isoformat() if proposal.created_at else None,
            "items": [{
                "id": item.id,
                "rfp_item_id": item.rfp_item_id,
                "price_per_unit": item.price_per_unit,
                "total_price": item.total_price,
                "delivery_time": item.delivery_time,
                "warranty_period": item.warranty_period
            } for item in proposal.items]
        })
    return result

@router.get("/proposals/{proposal_id}", response_model=dict)
async def get_proposal(proposal_id: int, db: Session = Depends(get_db)):
    """Get a single proposal by ID"""
    db_proposal = proposal_crud.get_proposal(db, proposal_id)
    if db_proposal is None:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return {
        "id": db_proposal.id,
        "rfp_id": db_proposal.rfp_id,
        "vendor_id": db_proposal.vendor_id,
        "vendor_name": db_proposal.vendor.name if db_proposal.vendor else None,
        "total_price": db_proposal.total_price,
        "delivery_terms": db_proposal.delivery_terms,
        "payment_terms": db_proposal.payment_terms,
        "validity_period": db_proposal.validity_period,
        "notes": db_proposal.notes,
        "created_at": db_proposal.created_at.isoformat() if db_proposal.created_at else None,
        "items": [{
            "id": item.id,
            "rfp_item_id": item.rfp_item_id,
            "price_per_unit": item.price_per_unit,
            "total_price": item.total_price,
            "delivery_time": item.delivery_time,
            "warranty_period": item.warranty_period,
            "specifications_match": item.specifications_match
        } for item in db_proposal.items]
    }

@router.get("/proposals/rfp/{rfp_id}", response_model=List[dict])
async def get_proposals_by_rfp(rfp_id: int, db: Session = Depends(get_db)):
    proposals = proposal_crud.get_proposals_by_rfp(db, rfp_id)
    result = []
    for proposal in proposals:
        result.append({
            "id": proposal.id,
            "rfp_id": proposal.rfp_id,
            "vendor_id": proposal.vendor_id,
            "vendor_name": proposal.vendor.name if proposal.vendor else None,
            "total_price": proposal.total_price,
            "delivery_terms": proposal.delivery_terms,
            "payment_terms": proposal.payment_terms,
            "created_at": proposal.created_at.isoformat() if proposal.created_at else None,
            "items": [{
                "id": item.id,
                "rfp_item_id": item.rfp_item_id,
                "price_per_unit": item.price_per_unit,
                "total_price": item.total_price,
                "delivery_time": item.delivery_time,
                "warranty_period": item.warranty_period
            } for item in proposal.items]
        })
    return result

@router.delete("/proposals/{proposal_id}")
async def delete_proposal(proposal_id: int, db: Session = Depends(get_db)):
    success = proposal_crud.delete_proposal(db, proposal_id)
    if not success:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return {"message": "Proposal deleted successfully"}

@router.get("/proposals/compare/{rfp_id}", response_model=dict)
async def compare_proposals_endpoint(rfp_id: int, db: Session = Depends(get_db)):
    """Compare proposals for a specific RFP using AI"""
    return await compare_proposals(rfp_id, db)

# Placeholder for comparison endpoint
@router.get("/compare/{rfp_id}", response_model=dict)
async def compare_proposals(rfp_id: int, db: Session = Depends(get_db)):
    # Get RFP and proposals
    db_rfp = rfp_crud.get_rfp(db, rfp_id)
    if db_rfp is None:
        raise HTTPException(status_code=404, detail="RFP not found")
    
    proposals = proposal_crud.get_proposals_by_rfp(db, rfp_id)
    if not proposals:
        raise HTTPException(status_code=404, detail="No proposals found for this RFP")
    
    # Use AI agent to compare proposals
    agent = ComparisonAgent()
    
    # Prepare RFP data
    rfp_data = {
        "id": db_rfp.id,
        "title": db_rfp.title,
        "budget": db_rfp.budget,
        "items": [{
            "name": item.name,
            "quantity": item.quantity
        } for item in db_rfp.items]
    }
    
    # Prepare proposals data
    proposals_data = []
    for proposal in proposals:
        proposals_data.append({
            "vendor_id": proposal.vendor_id,
            "vendor_name": proposal.vendor.name if proposal.vendor else "Unknown",
            "total_price": proposal.total_price,
            "delivery_terms": proposal.delivery_terms,
            "payment_terms": proposal.payment_terms,
            "items": [{
                "price_per_unit": item.price_per_unit,
                "total_price": item.total_price,
                "delivery_time": item.delivery_time,
                "warranty_period": item.warranty_period
            } for item in proposal.items]
        })
    
    comparison_data = agent.compare_proposals(rfp_data, proposals_data)
    return comparison_data

# AI Agent endpoints
@router.post("/ai/create-rfp")
async def ai_create_rfp(request: AIRequest, db: Session = Depends(get_db)):
    agent = RFPGeneratorAgent()
    rfp_data = agent.generate_rfp(request.prompt)
    # Save the RFP to the database
    db_rfp = rfp_crud.create_rfp(db, rfp_data)
    return {
        "message": "RFP created from AI prompt",
        "rfp_id": db_rfp.id,
        "rfp": {
            "id": db_rfp.id,
            "title": db_rfp.title,
            "description": db_rfp.description,
            "budget": db_rfp.budget,
            "deadline": db_rfp.deadline.isoformat() if db_rfp.deadline else None,
            "items": [{
                "name": item.name,
                "quantity": item.quantity,
                "description": item.description,
                "specifications": item.specifications
            } for item in db_rfp.items]
        }
    }

@router.post("/ai/parse-response")
async def ai_parse_response(email_content: str, db: Session = Depends(get_db)):
    agent = ResponseParserAgent()
    # In a real implementation, we would fetch the actual RFP data from the database
    rfp_data = {}
    proposal_data = agent.parse_vendor_response(email_content, rfp_data)
    # Here we would save the proposal to the database
    # For now, we'll just return the generated data
    return {"message": "Vendor response parsed", "proposal": proposal_data.dict()}

@router.post("/ai/compare-proposals")
async def ai_compare_proposals(rfp_id: int, db: Session = Depends(get_db)):
    agent = ComparisonAgent()
    # In a real implementation, we would fetch the actual RFP and proposals from the database
    rfp_data = {}
    proposals_data = []
    comparison_data = agent.compare_proposals(rfp_data, proposals_data)
    # Here we would save the comparison results
    # For now, we'll just return the generated data
    return {"message": "Proposals compared", "results": comparison_data}

# Email endpoints
class SendRFPRequest(BaseModel):
    rfp_id: int
    vendor_ids: List[int]

@router.post("/send-rfp")
async def send_rfp_to_vendors(request: SendRFPRequest, db: Session = Depends(get_db)):
    # Get RFP
    db_rfp = rfp_crud.get_rfp(db, request.rfp_id)
    if db_rfp is None:
        raise HTTPException(status_code=404, detail="RFP not found")
    
    # Get vendors
    vendors = []
    for vendor_id in request.vendor_ids:
        vendor = vendor_crud.get_vendor(db, vendor_id)
        if vendor:
            vendors.append(vendor)
    
    if not vendors:
        raise HTTPException(status_code=404, detail="No valid vendors found")
    
    # Prepare email content
    subject = f"RFP: {db_rfp.title}"
    body = f"""
Dear Vendor,

You are invited to submit a proposal for the following RFP:

Title: {db_rfp.title}
Description: {db_rfp.description}
Budget: ${db_rfp.budget:,.2f}
Deadline: {db_rfp.deadline.strftime('%Y-%m-%d %H:%M:%S') if db_rfp.deadline else 'N/A'}

Items Required:
"""
    
    for item in db_rfp.items:
        body += f"\n- {item.name} (Quantity: {item.quantity})"
        if item.description:
            body += f"\n  Description: {item.description}"
        if item.specifications:
            body += f"\n  Specifications: {item.specifications}"
        body += "\n"
    
    body += f"""

Terms:
Delivery Terms: {db_rfp.delivery_terms or 'Standard'}
Payment Terms: {db_rfp.payment_terms or 'Net 30'}
Warranty Requirements: {db_rfp.warranty_requirements or 'Standard warranty'}

Please respond to this email with your proposal including:
1. Pricing for each item
2. Total price
3. Delivery timeline
4. Warranty period
5. Any special terms or conditions

Best regards,
RFP Management System
"""
    
    # Send email to each vendor
    email_sender = EmailSender()
    vendor_emails = [vendor.email for vendor in vendors]
    
    try:
        success = email_sender.send_rfp(vendor_emails, subject, body)
        if success:
            return {
                "message": "RFP sent successfully",
                "rfp_id": request.rfp_id,
                "vendors_count": len(vendors),
                "vendors": [vendor.name for vendor in vendors]
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to send RFP emails")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sending emails: {str(e)}")