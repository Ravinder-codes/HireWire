from langchain_community.document_loaders import PyPDFLoader
from langchain_ollama import OllamaLLM as Ollama

llm =  Ollama(base_url = "http://localhost:11434",model = "gemma3:1b")
loader = PyPDFLoader('C1080.pdf')
docs = loader.load()

from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains.llm import LLMChain
from langchain_core.prompts import PromptTemplate

# Define prompt
from langchain.prompts import PromptTemplate

resume_summary_prompt = PromptTemplate.from_template(
    """Extract the following information from this resume in a structured format:
    
    Name: [Full Name]
    Phone: [Phone number]
    Email: [Email]
    Current Role: [Most Recent Job Title]
    Experience: [Total Years of Experience]
    Key Skills: [5-7 most relevant technical/professional skills]
    Education: [Highest Degree Earned]
    
    Notable Achievements:
    - [Bullet point 1]
    - [Bullet point 2]
    - [Bullet point 3]
    

    Do not print this-
    Resume Text:{context} 
    
    Instructions:
    1. Keep responses concise
    2. Only include information explicitly found in the resume
    3. Use "Not specified" for missing information
    """
)

# Instantiate chain
chain = create_stuff_documents_chain(llm, resume_summary_prompt)

# Invoke chain
result = chain.invoke({"context": docs})
print(result)