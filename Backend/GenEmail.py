"""
File to generate draft email based on the given jd
"""
from langchain_community.chat_models import ChatOllama
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate


llm = ChatOllama(model ="gemma3:1b",temperature=1)

def GenerateDraftEmail(info):
    prompt_template = """
    You are an assistant tasked with writing a draft email that is to be sent to shortlisted candidates.
    You are provided with the following information, now write an email in about 50-100 words.
    Write it in a professionally funny way, Just give the email do not add any extra text in it
    Suject should be professional

    Just provie the email,do not add anything extra into it
    {info}
    """
    llm_chain = LLMChain(prompt=PromptTemplate(template=prompt_template, input_variables=["info"]),llm=llm)
    response = llm_chain.run({"info":info})
    return response
