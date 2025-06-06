"""
File focused on Job Description extraction and email generation
"""
from langchain_community.chat_models import ChatOllama
from langchain.agents import initialize_agent, AgentType
from langchain.tools import Tool
from langchain_community.document_loaders import PyPDFLoader
import GenEmail
import ATS


# Using mistal model, OnPremise LLM
llm = ChatOllama(model = "gemma3:4b",temperature= 0)


def Job_Description_Loader(query:str)->str:
    """Used to load the Job description, pass file path as parameter"""
    loader = PyPDFLoader(query)
    docs = loader.load()
    jd = "\n\n".join(doc.page_content for doc in docs)
    return jd


# Tools
Get_jd = Tool(
    name = "Get Job Description",
    func = Job_Description_Loader,
    description= "Load and get the job description. Only pass the file path as parameter, nothing else"
)


# Agent
jd_agent = initialize_agent(
    tools = [Get_jd],
    llm = llm,
    agent = AgentType.STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION,
    verbose = True
)



def Run(userid,filename):
    ATS.progress[userid] = "Processing Job Description..."

    prompt = f"""
        Open the Job Description stored in the path - `{userid}JD/{filename}`
        

        Carefully analyze the whole Job description and extract the following information from it:
        Title:
        <Job title which the company is offering>

        Company Name:
        <Company's full name>

        Location:
        <Company's location>

        Skills:
        <Comma-separated list of skills required for the role>

        Education:
        <Comma-separated list of required educational qualifications>

        Experience:
        <Comma-separated list of required work experience>


        Instructions
        1. If any field is not present then write N/A there
        """
    extract_jd = jd_agent.run(prompt)

    jd_dic = {}

    # Extract key info
    for line in extract_jd.split("\n"):
        key,colon,value = line.partition(":")
        jd_dic[key.strip()] = value.strip()


    ATS.progress[userid] = "Drafting Invitation Email..."

    
    # Draft email generation
    info=  f"""
    Title : {jd_dic['Title']},
    Company Name : {jd_dic['Company Name']}
    Location : {jd_dic['Location']}
    This will be an onsite interview
    Also add fields for timing and date
    """
    draft_email = GenEmail.GenerateDraftEmail(info)

    return [extract_jd,jd_dic,draft_email]
