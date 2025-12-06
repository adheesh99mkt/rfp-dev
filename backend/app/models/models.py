from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, Table, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from datetime import datetime
from typing import List
rfp_vendor_association = Table(
    'rfp_vendor_association',
    Base.metadata,
    Column('rfp_id', Integer, ForeignKey('rfps.id')),
    Column('vendor_id', Integer, ForeignKey('vendors.id'))
)
class RFPItem(Base):
    __tablename__ = "rfp_items"
    id = Column(Integer, primary_key=True, index=True)
    rfp_id = Column(Integer, ForeignKey("rfps.id"))
    name = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    description = Column(Text)
    specifications = Column(Text)
    rfp = relationship("RFP", back_populates="items")
class RFP(Base):
    __tablename__ = "rfps"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    budget = Column(Float, nullable=False)
    deadline = Column(DateTime, nullable=False)
    delivery_terms = Column(Text)
    payment_terms = Column(Text)
    warranty_requirements = Column(Text)
    status = Column(String, default="open")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    items = relationship("RFPItem", back_populates="rfp", cascade="all, delete-orphan")
    vendors = relationship("Vendor", secondary=rfp_vendor_association, back_populates="rfps")
    proposals = relationship("Proposal", back_populates="rfp")
class Vendor(Base):
    __tablename__ = "vendors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    contact_person = Column(String)
    phone = Column(String)
    address = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    rfps = relationship("RFP", secondary=rfp_vendor_association, back_populates="vendors")
    proposals = relationship("Proposal", back_populates="vendor")
class ProposalItem(Base):
    __tablename__ = "proposal_items"
    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(Integer, ForeignKey("proposals.id"))
    rfp_item_id = Column(Integer, ForeignKey("rfp_items.id"))
    price_per_unit = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    delivery_time = Column(Integer)  
    warranty_period = Column(Integer)
    specifications_match = Column(Boolean)
    proposal = relationship("Proposal", back_populates="items")
    rfp_item = relationship("RFPItem")
class Proposal(Base):
    __tablename__ = "proposals"
    id = Column(Integer, primary_key=True, index=True)
    rfp_id = Column(Integer, ForeignKey("rfps.id"))
    vendor_id = Column(Integer, ForeignKey("vendors.id"))
    total_price = Column(Float, nullable=False)
    delivery_terms = Column(Text)
    payment_terms = Column(Text)
    validity_period = Column(Integer) 
    notes = Column(Text)
    status = Column(String, default="received") 
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    rfp = relationship("RFP", back_populates="proposals")
    vendor = relationship("Vendor", back_populates="proposals")
    items = relationship("ProposalItem", back_populates="proposal", cascade="all, delete-orphan")
class AIComparisonCache(Base):
    __tablename__ = "ai_comparison_cache"
    id = Column(Integer, primary_key=True, index=True)
    rfp_id = Column(Integer, ForeignKey("rfps.id"), unique=True, index=True)
    comparison_result = Column(JSON, nullable=False)  
    analyzed_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    rfp = relationship("RFP")