import os
from openai import OpenAI
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from app.schemas import RFPCreate, ProposalCreate
from typing import Dict, Any
import json

class RFPGeneratorAgent:
    def __init__(self):
        self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.llm = ChatOpenAI(temperature=0, model_name="gpt-3.5-turbo")
        
    def generate_rfp(self, user_prompt: str) -> RFPCreate:
        """
        Convert natural language prompt to structured RFP
        """
        prompt_template = """
        Convert the following procurement request into a structured RFP format.
        Extract key information such as items needed, quantities, budget, deadlines, and terms.
        
        Request: {user_prompt}
        
        Please provide the response in the following JSON format:
        {{
            "title": "Brief title for the RFP",
            "description": "Detailed description of what is being procured",
            "budget": 0.0,
            "deadline": "2025-12-31T23:59:59",
            "items": [
                {{
                    "name": "Item name",
                    "quantity": 0,
                    "description": "Description of the item",
                    "specifications": "Technical specifications if any"
                }}
            ],
            "delivery_terms": "Delivery terms if mentioned",
            "payment_terms": "Payment terms if mentioned",
            "warranty_requirements": "Warranty requirements if mentioned"
        }}
        
        IMPORTANT:
        - Use actual datetime values in ISO format (e.g., "2025-12-31T23:59:59")
        - If no deadline is mentioned, use a date 30 days from today
        - Use numeric values for budget and quantity, not strings
        - Provide realistic estimates based on the request
        
        Respond ONLY with the JSON object, no additional text.
        """
        
        prompt = PromptTemplate(
            input_variables=["user_prompt"],
            template=prompt_template
        )
        
        # Use invoke instead of LLMChain
        formatted_prompt = prompt.format(user_prompt=user_prompt)
        response = self.llm.invoke(formatted_prompt)
        
        # Parse the JSON response
        try:
            rfp_data = json.loads(response.content)
            # Validate and fix deadline if needed
            if rfp_data.get('deadline') == 'YYYY-MM-DDTHH:MM:SS' or not rfp_data.get('deadline'):
                from datetime import datetime, timedelta
                rfp_data['deadline'] = (datetime.now() + timedelta(days=30)).isoformat()
            return RFPCreate(**rfp_data)
        except (json.JSONDecodeError, Exception) as e:
            # Fallback in case of parsing error
            from datetime import datetime, timedelta
            return RFPCreate(
                title="Procurement Request",
                description=user_prompt,
                budget=0.0,
                deadline=(datetime.now() + timedelta(days=30)).isoformat(),
                items=[],
                delivery_terms="Standard delivery terms",
                payment_terms="Net 30",
                warranty_requirements="Standard warranty"
            )

class ResponseParserAgent:
    def __init__(self):
        self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.llm = ChatOpenAI(temperature=0, model_name="gpt-3.5-turbo")
        
    def parse_vendor_response(self, email_content: str, rfp_data: Dict[Any, Any]) -> ProposalCreate:
        """
        Parse vendor email response and extract structured proposal data
        """
        prompt_template = """
        Parse the following vendor response email and extract structured proposal information.
        Match the items in the response with the RFP items provided.
        
        RFP Details:
        {rfp_details}
        
        Vendor Response:
        {email_content}
        
        Please provide the response in the following JSON format:
        {{
            "rfp_id": 0,
            "vendor_id": 0,
            "items": [
                {{
                    "rfp_item_id": 0,
                    "price_per_unit": 0.0,
                    "total_price": 0.0,
                    "delivery_time": 0,
                    "warranty_period": 0,
                    "specifications_match": true
                }}
            ],
            "total_price": 0.0,
            "delivery_terms": "Delivery terms mentioned in response",
            "payment_terms": "Payment terms mentioned in response",
            "validity_period": 0,
            "notes": "Any additional notes from the vendor"
        }}
        
        Respond ONLY with the JSON object, no additional text.
        """
        
        rfp_details = json.dumps(rfp_data, indent=2)
        
        prompt = PromptTemplate(
            input_variables=["rfp_details", "email_content"],
            template=prompt_template
        )
        
        formatted_prompt = prompt.format(rfp_details=rfp_details, email_content=email_content)
        response = self.llm.invoke(formatted_prompt)
        
        # Parse the JSON response
        try:
            proposal_data = json.loads(response.content)
            return ProposalCreate(**proposal_data)
        except json.JSONDecodeError:
            # Fallback in case of parsing error
            return ProposalCreate(
                rfp_id=1,
                vendor_id=1,
                items=[],
                total_price=0.0,
                delivery_terms="Standard terms",
                payment_terms="Standard terms",
                validity_period=30,
                notes="Could not parse vendor response"
            )

class ComparisonAgent:
    def __init__(self):
        self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.llm = ChatOpenAI(temperature=0, model_name="gpt-3.5-turbo")
        
    def compare_proposals(self, rfp_data: Dict[Any, Any], proposals_data: list) -> dict:
        """
        Compare multiple vendor proposals and provide recommendations
        """
        prompt_template = """
        Compare the following vendor proposals for the RFP and provide a recommendation.
        
        RFP Details:
        {rfp_details}
        
        Vendor Proposals:
        {proposals_data}
        
        Please provide the response in the following JSON format:
        {{
            "rfp_id": 0,
            "results": [
                {{
                    "vendor_id": 0,
                    "vendor_name": "Vendor Name",
                    "total_price": 0.0,
                    "delivery_terms": "Delivery terms from proposal",
                    "payment_terms": "Payment terms from proposal",
                    "total_score": 8.5,
                    "price_score": 9.0,
                    "terms_score": 8.0,
                    "completeness_score": 8.5,
                    "details": {{
                        "strengths": "Strengths of this proposal",
                        "weaknesses": "Weaknesses of this proposal",
                        "key_differences": "Key differences from other proposals"
                    }}
                }}
            ],
            "recommendation": "Overall recommendation with reasoning"
        }}
        
        CRITICAL - YOU MUST CALCULATE ACTUAL NUMERIC SCORES (1-10 scale):
        - Price Score (40% weight): Compare total prices. Best price = 10, worst = relative score
        - Terms Score (30% weight): Evaluate delivery time, payment terms, warranty. Best = 10
        - Completeness Score (30% weight): Check if all RFP items are addressed. Complete = 10
        - Total Score: Weighted average = (price_score * 0.4) + (terms_score * 0.3) + (completeness_score * 0.3)
        
        DO NOT return 0 for scores. You MUST calculate real numeric values between 1-10 based on the actual proposal data.
        
        Respond ONLY with the JSON object, no additional text.
        """
        
        rfp_details = json.dumps(rfp_data, indent=2)
        proposals_details = json.dumps(proposals_data, indent=2)
        
        prompt = PromptTemplate(
            input_variables=["rfp_details", "proposals_data"],
            template=prompt_template
        )
        
        formatted_prompt = prompt.format(rfp_details=rfp_details, proposals_data=proposals_details)
        response = self.llm.invoke(formatted_prompt)
        
        # Parse the JSON response
        try:
            comparison_data = json.loads(response.content)
            return comparison_data
        except json.JSONDecodeError:
            # Fallback in case of parsing error
            return {
                "rfp_id": 1,
                "results": [],
                "recommendation": "Could not generate comparison due to parsing error"
            }