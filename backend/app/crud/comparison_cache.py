from sqlalchemy.orm import Session
from typing import Optional
from app.models.models import AIComparisonCache
def get_cached_comparison(db: Session, rfp_id: int) -> Optional[AIComparisonCache]:
    return db.query(AIComparisonCache).filter(AIComparisonCache.rfp_id == rfp_id).first()
def create_or_update_cache(db: Session, rfp_id: int, comparison_result: dict) -> AIComparisonCache:
    existing_cache = get_cached_comparison(db, rfp_id)
    if existing_cache:
        existing_cache.comparison_result = comparison_result
        db.commit()
        db.refresh(existing_cache)
        return existing_cache
    else:
        new_cache = AIComparisonCache(
            rfp_id=rfp_id,
            comparison_result=comparison_result
        )
        db.add(new_cache)
        db.commit()
        db.refresh(new_cache)
        return new_cache
def delete_cache(db: Session, rfp_id: int) -> bool:
    cache = get_cached_comparison(db, rfp_id)
    if cache:
        db.delete(cache)
        db.commit()
        return True
    return False