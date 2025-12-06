"""
Script to manually add a test proposal to the database
Run this after sending the RFP email
"""

from app.database import SessionLocal
from app.models import Proposal, ProposalItem, RFP, Vendor
from datetime import datetime

def add_test_proposal():
    db = SessionLocal()
    try:
        # Get the latest RFP
        rfp = db.query(RFP).order_by(RFP.id.desc()).first()
        if not rfp:
            print("❌ No RFP found in database. Please create and send an RFP first.")
            return
        
        # Get the first vendor (TechSupply Inc.)
        vendor = db.query(Vendor).filter(Vendor.name.like('%TechSupply%')).first()
        if not vendor:
            vendor = db.query(Vendor).first()
        
        if not vendor:
            print("❌ No vendor found in database. Please add vendors first.")
            return
        
        print(f"📋 Creating proposal for RFP: {rfp.title} (ID: {rfp.id})")
        print(f"👤 Vendor: {vendor.name}")
        
        # Create the proposal
        proposal = Proposal(
            rfp_id=rfp.id,
            vendor_id=vendor.id,
            total_price=12500.00,
            delivery_terms="12 business days, free shipping, fully insured",
            payment_terms="Net 30 days from delivery",
            validity_period=30,
            notes="Volume discount applied (10% off). Includes free setup and configuration."
        )
        db.add(proposal)
        db.flush()  # Get the proposal ID
        
        print(f"✅ Proposal created with ID: {proposal.id}")
        
        # Add proposal items
        if rfp.items:
            for rfp_item in rfp.items:
                proposal_item = ProposalItem(
                    proposal_id=proposal.id,
                    rfp_item_id=rfp_item.id,
                    price_per_unit=1250.00,
                    total_price=12500.00,
                    delivery_time=12,
                    warranty_period=36,  # 3 years
                    specifications_match=True
                )
                db.add(proposal_item)
                print(f"  ✅ Added item: {rfp_item.name} - $1,250/unit")
        
        db.commit()
        print("\n🎉 Test proposal added successfully!")
        print(f"\n📊 You can now:")
        print(f"   1. View the proposal in 'Proposal Management' tab")
        print(f"   2. Compare proposals using 'Proposal Comparison' tab")
        print(f"   3. RFP ID for comparison: {rfp.id}")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("=" * 60)
    print("📝 Adding Test Proposal to Database")
    print("=" * 60)
    add_test_proposal()
