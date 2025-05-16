from typing import Optional
from sqlalchemy.orm import Session
from uuid import UUID

from .base import BaseRepository
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash

class UserRepository(BaseRepository[User, UserCreate, UserUpdate]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()
        
    def get_by_username(self, db: Session, *, username: str) -> Optional[User]:
        return db.query(User).filter(User.username == username).first()
        
    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        db_obj = User(
            email=obj_in.email,
            username=obj_in.username,
            hashed_password=get_password_hash(obj_in.password),
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
        
    def update(
        self, db: Session, *, db_obj: User, obj_in: UserUpdate
    ) -> User:
        if obj_in.password is not None:
            hashed_password = get_password_hash(obj_in.password)
            db_obj.hashed_password = hashed_password
        
        update_data = obj_in.dict(exclude_unset=True, exclude={"password"})
        for field, value in update_data.items():
            setattr(db_obj, field, value)
            
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

user_repository = UserRepository(User)
