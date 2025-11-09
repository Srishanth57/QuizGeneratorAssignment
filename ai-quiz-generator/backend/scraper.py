
import requests
from bs4 import BeautifulSoup
import re

def scrape_wikipedia(url: str) -> tuple[str, str]:
    """
    Scrapes Wikipedia article and returns cleaned text and title.
    
    Args:
        url: Wikipedia article URL
        
    Returns:
        tuple: (cleaned_text, article_title)
    """
    try:
        # Fetch the page
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Parse HTML
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract title
        title = soup.find('h1', class_='firstHeading')
        article_title = title.get_text() if title else "Wikipedia Article"
        
        # Find main content
        content_div = soup.find('div', {'id': 'mw-content-text'})
        
        if not content_div:
            raise ValueError("Could not find article content")
        
        # Remove unwanted elements
        for tag in content_div.find_all(['sup', 'table', 'script', 'style']):
            tag.decompose()
        
        # Remove references and citation sections
        for tag in content_div.find_all(['span', 'div'], class_=re.compile('reference|citation')):
            tag.decompose()
        
        # Extract paragraphs
        paragraphs = content_div.find_all('p')
        text_content = ' '.join([p.get_text() for p in paragraphs])
        
        # Clean text
        cleaned_text = re.sub(r'\s+', ' ', text_content)  # Remove extra whitespace
        cleaned_text = re.sub(r'\[.*?\]', '', cleaned_text)  # Remove [1], [2] references
        cleaned_text = cleaned_text.strip()
        
        # Limit to first 3000 words for LLM processing
        words = cleaned_text.split()[:3000]
        cleaned_text = ' '.join(words)
        
        return cleaned_text, article_title
        
    except Exception as e:
        raise Exception(f"Error scraping Wikipedia: {str(e)}")

