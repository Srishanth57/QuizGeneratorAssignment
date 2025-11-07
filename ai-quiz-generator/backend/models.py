from sqlalchemy import  Column, Integer, String, ForeignKey , Text , DateTime 
from database import Base # <-e- Import your Base
import datetime

# Define a model. 
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)

class QuizHistory(Base):
    __tablename__ = "quiz_history"

    id = Column(Integer, primary_key=True, index=True)
    score = Column(Integer)
    user_id = Column(Integer, ForeignKey("users.id"))

class Quiz(Base): 
    __tablename__ = "quiz" 
    id = Column(Integer, primary_key=True  )
    url = Column(String)
    title = Column(String)
    date_generated = Column(DateTime, default =datetime.datetime.now)
    scraped_content = Column(Text, nullable=True) 
    full_quiz_data = Column(Text, nullable=False)