
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from models import QuizOutput
from dotenv import load_dotenv
import os

load_dotenv()
# Initialize Gemini model
def get_llm():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables")
    
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=api_key,
        temperature=0.7
    )

# Define prompt template
QUIZ_PROMPT = """You are an expert educational content creator. Given the following Wikipedia article text, create an engaging and educational quiz.

Article Title: {title}
Article Content: {content}

Generate a comprehensive quiz with the following requirements:
1. Create 5-10 multiple choice questions that test understanding of key concepts
2. Each question must have exactly 4 options
3. Provide clear explanations for correct answers
4. Extract 5-10 key entities/topics from the article
5. Suggest 3-5 related topics for further learning

Make questions diverse - include factual recall, conceptual understanding, and application questions.

{format_instructions}

Return ONLY valid JSON matching the schema. Do not include any additional text or markdown formatting.
"""

def generate_quiz(article_text: str, article_title: str) -> dict:

    try:
        # Setup parser
        parser = JsonOutputParser(pydantic_object=QuizOutput)
        
        # Create prompt
        prompt = ChatPromptTemplate.from_template(QUIZ_PROMPT)
        
        # Initialize LLM
        llm = get_llm()
        
        # Create chain
        chain = prompt | llm | parser
        
        # Generate quiz
        result = chain.invoke({
            "title": article_title,
            "content": article_text,
            "format_instructions": parser.get_format_instructions()
        })
        
        return result
        
    except Exception as e:
        raise Exception(f"Error generating quiz: {str(e)}")
