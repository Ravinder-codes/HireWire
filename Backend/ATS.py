"""
Main file that handles all the data flow and operations
"""

from langchain_community.chat_models import ChatOllama
from langchain.agents import initialize_agent, AgentType
from langchain.tools import Tool
from langchain_community.document_loaders import PyPDFLoader
import Similarity
import JDAgent


# Using mistal model, OnPremise LLM
llm = ChatOllama(model = "gemma3:4b",temperature= 0)

progress = {} #Get request will be sent to get progress track based on the user id


# Loading the resume using PyPDFLoader
def Get_resume(filename:str)->str:

    "Useful to get a resume , Give only the file path as input"
    loader = PyPDFLoader(filename)
    docs = loader.load()
    resume = "\n\n".join([doc.page_content for doc in docs])
    return resume


# Tools
get_resume = Tool(
    name = "Get Resume",
    func = Get_resume,
    description= "Gives you the resume text, pass only file path as parameter"
)


# Agent
resume_agent = initialize_agent(
    tools = [get_resume],
    llm = llm,
    agent = AgentType.STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION,
    verbose = True,
)



def Run(user_id ,filenames , jdfilename):
    response = []
    extract_jd, jd_dic, genEmail = JDAgent.Run(user_id,jdfilename)
    print(jd_dic)
    
    for i,name in enumerate(filenames):
    
        prompt = f"""
        Open the resume stored in the path - `{user_id}Resume/{name}`

        
        
        Carefully analyze the whole resume and extract the following information from the resume, these are must and you cannot skip any of those:

        Name:   
        <Candidate's full name>

        Email: 
        <Candidate's email address>

        Phone:<Candidate's phone number>

        Skills:
        <Comma-separated list of skills, tools, frameworks from Projects, Technical Skills, and Soft Skills>

        Education:
        <Comma-separated list of educational qualifications>

        Experience:
        <Comma-separated list of work experiences , what are the roles and position that the candidate took earlier>


        INSTRUCTIONS
        -If you are unable to find any information - write 'N/A' in front of it.
        -File path should be in the given format only.

        """

        progress[user_id] = f"Processing and matching resume: {name}  [{i+1}/{len(filenames)}]"
     

        extract_rsm  = resume_agent.run(prompt)
        rsm_dic = {}


        # Extracting key points
        for line in extract_rsm.split("\n"):
            part = line.partition(":")
            rsm_dic[part[0]] = part[2].strip()

        


        # Weightage of each criteria
        power = {
            'Skills':6,
            'Experience':1,
            'Education':3
        }

        total_score = 0
        # Match based on this criteria
        for criteria in ['Skills','Experience','Education']:
            rsm_criteria = rsm_dic[criteria].split(",")
            jd_criteria = jd_dic[criteria].split(",")

            score = Similarity.Run(jd_criteria,rsm_criteria)
            score*=power[criteria]
            total_score+= score
        
        total_score = round(total_score/10,2)

        response.append([total_score,rsm_dic["Name"], rsm_dic["Email"]])

    # Shortlisting based on scores
    response.sort(reverse = True)
    return [response,genEmail,extract_jd]
