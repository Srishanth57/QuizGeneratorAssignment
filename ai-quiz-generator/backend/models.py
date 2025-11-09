from pydantic import BaseModel, Field
from typing import List

class Question(BaseModel):
    question: str = Field(description="The quiz question text")
    options: List[str] = Field(description="List of 4 answer options")
    correct_answer: str = Field(description="The correct answer from the options")
    explanation: str = Field(description="Brief explanation of why the answer is correct")

class Quiz(BaseModel):
    title: str = Field(description="Quiz title based on the article topic")
    questions: List[Question] = Field(description="List of 5-10 quiz questions")

class QuizOutput(BaseModel):
    quiz: Quiz
    key_entities: List[str] = Field(description="5-10 key topics/entities from the article")
    related_topics: List[str] = Field(description="3-5 related topics for further reading")

