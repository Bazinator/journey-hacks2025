from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from typing import List

from ..database.session import get_db
from ..models.restaurant import FoodItem, Pickup, Restaurant
from ..schemas.restaurant import (
    FoodItemCreate,
    FoodItemUpdate,
    FoodItemResponse,
    PickupResponse,
    StatsResponse
)
from ..core.security import oauth2_scheme

router = APIRouter()

# Add new food item
@router.post("/food-items", response_model=FoodItemResponse)
def add_food_item(food_item: FoodItemCreate, db: Session = Depends(get_db)):
    new_item = FoodItem(**food_item.dict())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

# List all food items for a restaurant
@router.get("/food-items", response_model=List[FoodItemResponse])
def list_food_items(db: Session = Depends(get_db)):
    return db.query(FoodItem).all()

# Update a food item
@router.put("/food-items/{id}", response_model=FoodItemResponse)
def update_food_item(id: int, food_item: FoodItemUpdate, db: Session = Depends(get_db)):
    item = db.query(FoodItem).filter(FoodItem.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Food item not found")
    for key, value in food_item.dict(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item

# Delete a food item
@router.delete("/food-items/{id}")
def delete_food_item(id: int, db: Session = Depends(get_db)):
    item = db.query(FoodItem).filter(FoodItem.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Food item not found")
    db.delete(item)
    db.commit()
    return {"message": "Food item deleted successfully"}

# Get scheduled pickups
@router.get("/pickups/scheduled", response_model=List[PickupResponse])
def get_scheduled_pickups(db: Session = Depends(get_db)):
    return db.query(Pickup).filter(Pickup.status == "confirmed").all()

# Get completed pickups
@router.get("/pickups/completed", response_model=List[PickupResponse])
def get_completed_pickups(db: Session = Depends(get_db)):
    return db.query(Pickup).filter(Pickup.status == "completed").all()

# Get donation statistics
@router.get("/stats", response_model=StatsResponse)
def get_donation_statistics(db: Session = Depends(get_db)):
    total_pickups = db.query(Pickup).count()
    people_helped = sum(p.impact['peopleHelped'] for p in db.query(Pickup).filter(Pickup.status == "completed"))
    food_saved = sum(p.impact['foodSaved'] for p in db.query(Pickup).filter(Pickup.status == "completed"))
    avg_rating = db.query(Pickup).filter(Pickup.status == "completed").with_entities(func.avg(Pickup.rating)).scalar()
    return {"totalPickups": total_pickups, "peopleHelped": people_helped, "foodSaved": food_saved, "averageRating": avg_rating}
