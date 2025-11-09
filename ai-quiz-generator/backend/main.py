
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from sqlalchemy.orm import Session
from datetime import datetime
import json

from database import get_db, Quiz as DBQuiz
from scraper import scrape_wikipedia
from llm_quiz_generator import generate_quiz

# Initialize FastAPI
app = FastAPI(title="AI Wiki Quiz Generator")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class GenerateQuizRequest(BaseModel):
    url: HttpUrl

class QuizHistoryResponse(BaseModel):
    id: int
    url: str
    title: str
    date_generated: datetime

# API Endpoints

@app.get("/")
def root():
    return {"message": "AI Wiki Quiz Generator API", "status": "active"}

@app.post("/generate_quiz")
async def create_quiz(request: GenerateQuizRequest, db: Session = Depends(get_db)):
    """
    Generate a new quiz from a Wikipedia URL.
    
    1. Scrapes the Wikipedia article
    2. Generates quiz using LLM
    3. Saves to database
    4. Returns quiz data
    """
    try:
        url_str = str(request.url)
        
        # Validate Wikipedia URL
        if "wikipedia.org" not in url_str:
            raise HTTPException(status_code=400, detail="Please provide a valid Wikipedia URL")
        
        # Step 1: Scrape Wikipedia
        print(f"Scraping Wikipedia article: {url_str}")
        article_text, article_title = scrape_wikipedia(url_str)
        
        if not article_text or len(article_text) < 100:
            raise HTTPException(status_code=400, detail="Could not extract sufficient content from article")
        
        # Step 2: Generate quiz using LLM
        print(f"Generating quiz for: {article_title}")
        quiz_data = generate_quiz(article_text, article_title)
        
        # Step 3: Save to database
        quiz_json = json.dumps(quiz_data)
        
        db_quiz = DBQuiz(
            url=url_str,
            title=article_title,
            scraped_content=article_text[:5000],  # Store first 5000 chars
            full_quiz_data=quiz_json
        )
        
        db.add(db_quiz)
        db.commit()
        db.refresh(db_quiz)
        
        print(f"Quiz saved with ID: {db_quiz.id}")
        
        # Step 4: Return quiz data
        return {
            "id": db_quiz.id,
            "url": url_str,
            "title": article_title,
            "date_generated": db_quiz.date_generated,
            **quiz_data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error generating quiz: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {str(e)}")

@app.get("/history")
async def get_history(db: Session = Depends(get_db)):
    """
    Get list of all generated quizzes.
    """
    try:
        quizzes = db.query(DBQuiz).order_by(DBQuiz.date_generated.desc()).all()
        
        return [
            {
                "id": quiz.id,
                "url": quiz.url,
                "title": quiz.title,
                "date_generated": quiz.date_generated
            }
            for quiz in quizzes
        ]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {str(e)}")

@app.get("/quiz/{quiz_id}")
async def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    """
    Get specific quiz by ID.
    """
    try:
        quiz = db.query(DBQuiz).filter(DBQuiz.id == quiz_id).first()
        
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        
        # Deserialize quiz data
        quiz_data = json.loads(quiz.full_quiz_data)
        
        return {
            "id": quiz.id,
            "url": quiz.url,
            "title": quiz.title,
            "date_generated": quiz.date_generated,
            **quiz_data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch quiz: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

