import json
from database import engine, Base
from models import User, Quiz, QuizHistory
from sqlalchemy.orm import Session

# --- 1. Ensure Tables Exist ---
# This is safe to run every time. It will NOT
# recreate tables that already exist.
Base.metadata.create_all(bind=engine)

# --- 2. Create a Session ---
# We use a 'with' block, which is the standard way.
# It automatically opens and closes the session.
try:
    with Session(engine) as session:
        
        # --- 3. Create Independent Objects (Users & Quizzes) ---
        
        print("Creating new users...")
        # Create Python instances of your models
        user1 = User(username="alice")
        user2 = User(username="bob")
        
        print("Creating new quiz...")
        # This is the complex JSON data for your quiz
        sample_quiz_data = {
            "title": "Basic Python Quiz",
            "questions": [
                {
                    "q": "What is 2+2?",
                    "options": ["3", "4", "5"],
                    "answer": "4"
                },
                {
                    "q": "What is the capital of France?",
                    "options": ["London", "Berlin", "Paris"],
                    "answer": "Paris"
                }
            ]
        }
        
        # Create the Quiz object, using json.dumps()
        quiz1 = Quiz(
            url="http://example.com/python-quiz",
            title="Python Basics",
            # We serialize the dict into a JSON string
            full_quiz_data=json.dumps(sample_quiz_data) 
        )

        # --- 4. Add to Session (Staging Area) ---
        # Add all your new objects to the "cart"
        session.add(user1)
        session.add(user2)
        session.add(quiz1)

        # --- 5. Commit (Save to Database) ---
        # This is the "checkout". The database transaction happens here.
        # Until you call commit(), nothing is saved!
        session.commit()

        print("Successfully added users and quiz.")
        
        # --- 6. Create Dependent Objects (QuizHistory) ---
        # Now that we have committed, our objects have IDs!
        # The 'user1' object was automatically updated with its new ID.
        print(f"New user 'alice' has ID: {user1.id}")
        
        # Now we can create a QuizHistory that *links* to user1
        history1 = QuizHistory(
            score=85,
            user_id=user1.id  # <-- This is the Foreign Key link
        )
        
        # Add the new history object to the session
        session.add(history1)
        
        # Commit this second change
        session.commit()
        
        print(f"Successfully added quiz history for user {user1.username}.")
        
except Exception as e:
    print(f"An error occurred: {e}")
    session.rollback() # Roll back changes if something went wrong
