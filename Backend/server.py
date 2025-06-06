"""
Server to handle all the api requests
"""
from flask import Flask,request,jsonify
from flask_cors import CORS
import os
import ATS
from send2trash import send2trash
import GenEmail
import mongo



app= Flask(__name__)
CORS(app)



@app.route('/',methods = ['GET'])
def Start():
    return jsonify({'message':'running'}),200


# Uploading files
@app.route('/',methods = ['POST'])
def GetFiles():


    # Create separate folder for each user
    userid = request.form['userId']

    ATS.progress[userid] = "Just a moment, we're working our magic!"
    os.makedirs(f"{userid}JD")
    os.makedirs(f"{userid}Resume")

    filenames = []
    jdfilename = ""


    for file_key in request.files:
    
        file = request.files[file_key]

        if file_key == 'Jd':
            jdfilename = file.name

            file.save(f"{userid}JD/{jdfilename}")
        else:
            filenames.append(file.name)
            file.save(f"{userid}Resume/{file.name}")
    

    response,email,jd_Des = ATS.Run(userid,filenames,jdfilename)

    del ATS.progress[userid]

    # Delete the created folder
    send2trash(f"{userid}JD")
    send2trash(f"{userid}Resume")

    return jsonify({'result': response,'email':email,"jd_des":jd_Des}),200


# Generate draft email
@app.route('/GenerateEmail',methods=['POST'])
def GenerateEmail():
    
    response = GenEmail.GenerateDraftEmail(request.get_data(as_text=True))
    return jsonify({"result":response}),200



# Keeps track of all the progress
@app.route('/progress',methods = ["GET"])
def GetProgress():
    user_id = request.args.get('user_id');
    if user_id not in ATS.progress:
        return jsonify({"result":""}),200
    
    return jsonify({"result":ATS.progress[user_id]}),200



# Login request
@app.route('/login',methods = ["POST"])
def Login():
    data = request.get_json()

    name = data.get('username')
    password = data.get('pass')
    res= mongo.Validate(name,password)
    return jsonify({"result":res}),200


# Signup request
@app.route('/signup',methods = ["POST"])
def Signup():
    data = request.get_json()  
    
    name = data.get('username')
    password = data.get('pass')
    res = mongo.Insert(name,password)
    return jsonify({"result":res}),200





if __name__=='__main__':
    app.run(debug=True)