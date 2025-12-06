"""
Script to add multiple vendor proposals for testing comparison feature
Run this after sending an RFP
"""

from app.database import SessionLocal
from app.models import Proposal, ProposalItem, RFP, Vendor
from datetime import datetime

def add_multiple_proposals():
    db = SessionLocal()
    try:
        # Get the latest RFP
        rfp = db.query(RFP).order_by(RFP.id.desc()).first()
        if not rfp:
            print("❌ No RFP found. Please create and send an RFP first.")
            return
        
        # Get all vendors
        vendors = db.query(Vendor).limit(3).all()
        if len(vendors) < 2:
            print("❌ Need at least 2 vendors for comparison. Please add more vendors.")
            return
        
        print(f"📋 Creating proposals for RFP: {rfp.title} (ID: {rfp.id})")
        print(f"📊 Number of vendors: {len(vendors)}\n")
        
        # Proposal data for each vendor
        proposals_data = [
            {
                "vendor_index": 0,
                "total_price": 12500.00,
                "price_per_unit": 1250.00,
                "delivery_terms": "12 business days, free shipping",
                "payment_terms": "Net 30",
                "delivery_time": 12,
                "warranty_period": 36,
                "notes": "Premium quality, volume discount applied"
            },
            {
                "vendor_index": 1,
                "total_price": 11800.00,
                "price_per_unit": 1180.00,
                "delivery_terms": "15 business days, standard shipping",
                "payment_terms": "Net 45",
                "delivery_time": 15,
                "warranty_period": 24,
                "notes": "Budget-friendly option, good value"
            },
            {
                "vendor_index": 2,
                "total_price": 13200.00,
                "price_per_unit": 1320.00,
                "delivery_terms": "7 business days, express shipping included",
                "payment_terms": "Net 30",
                "delivery_time": 7,
                "warranty_period": 48,
                "notes": "Fastest delivery, extended warranty, premium service"
            }
        ]
        
        for i, data in enumerate(proposals_data[:len(vendors)]):
            vendor = vendors[data["vendor_index"]]
            
            # Create proposal
            proposal = Proposal(
                rfp_id=rfp.id,
                vendor_id=vendor.id,
                total_price=data["total_price"],
                delivery_terms=data["delivery_terms"],
                payment_terms=data["payment_terms"],
                validity_period=30,
                notes=data["notes"]
            )
            db.add(proposal)
            db.flush()
            
            print(f"✅ Vendor {i+1}: {vendor.name}")
            print(f"   Price: ${data['total_price']:,.2f}")
            print(f"   Delivery: {data['delivery_time']} days")
            print(f"   Warranty: {data['warranty_period']} months")
            
            # Add proposal items
            if rfp.items:
                for rfp_item in rfp.items:
                    proposal_item = ProposalItem(
                        proposal_id=proposal.id,
                        rfp_item_id=rfp_item.id,
                        price_per_unit=data["price_per_unit"],
                        total_price=data["total_price"],
                        delivery_time=data["delivery_time"],
                        warranty_period=data["warranty_period"],
                        specifications_match=True
                    )
                    db.add(proposal_item)
            print()
        
        db.commit()
        print("=" * 60)
        print("🎉 Multiple proposals added successfully!")
        print("=" * 60)
        print(f"\n📊 Next Steps:")
        print(f"   1. Go to: http://localhost:5173")
        print(f"   2. Click 'Proposal Management' tab to view all proposals")
        print(f"   3. Click 'Proposal Comparison' tab")
        print(f"   4. Select RFP ID: {rfp.id}")
        print(f"   5. Click 'Compare Proposals' to see AI analysis")
        print(f"\n💡 The AI will score each proposal on:")
        print(f"   - Price (40% weight)")
        print(f"   - Terms (30% weight)")
        print(f"   - Completeness (30% weight)")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    print("=" * 60)
    print("📝 Adding Multiple Test Proposals")
    print("=" * 60)
    add_multiple_proposals()
