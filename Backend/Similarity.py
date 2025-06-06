from sentence_transformers import SentenceTransformer,util


# Bi-encoder model 
model = SentenceTransformer('all-MiniLM-L6-v2')


def SimilarityScore(resume_emb,jd_emb):
    # Finding Cosine Similarity
    score = util.cos_sim(resume_emb,jd_emb)

    # Get the percentage
    return round(float(score)*100,2)



def HowSimilar(resume_skills,jd_skills):

    """
    Match each keyword of jd with resume and get its maximum match value
    """

    count = 0
    total = 0
    for i in range(len(resume_skills)):
        res= 0
        for j in range(len(jd_skills)):
            val = SimilarityScore(resume_skills[i],jd_skills[j])
            res = max(res,val)
        count+=1
        total+=res

    # Return the average result
    return total/count


def Run(lis1,lis2):
    # Create embeddings
    lis1encode = [model.encode(i,convert_to_tensor=True) for i in lis1]
    lis2encode = [model.encode(i,convert_to_tensor=True) for i in lis2]
    
    return HowSimilar(lis2encode,lis1encode)