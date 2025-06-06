import { useEffect, useState } from 'react';
import Navbar from './Navbar'
import {useLocation } from 'react-router-dom';
import preloader from './Components/preloader.gif'
import copy from './Components/copy.png'

function Result() {
    const location = useLocation();
    const data = location.state;


    const [threshold, changeTresh] = useState(50); //Match above this set line

    const [candidates, setCandidates] = useState([]); //This contains shortlisted candidates


    const [emailValue, setEmailValue] = useState('');
    const [arr, changearr] = useState([]) //This contains total candidates

    const [jd_description, setJd] = useState("");

    const [is_writingMail, SetWriteEmail] = useState(false)

    // For copying candidate email and draft emails
    const [is_copied,setcopy] = useState(false) 
    const [shortlist_email,setShortlistedEmail] = useState("") 

    const [is_emailCopied,setEmailCopied] = useState(false)

    useEffect(() => {
        changearr(data['resultdata']['result']);
        setEmailValue(data['resultdata']['email'])
        setJd(data['resultdata']['jd_des'])
    }, []);

    
    const ChangeGenEmail = (e) => {
        // Button to generate new email based on the jd

        SetWriteEmail(true);

        fetch('http://127.0.0.1:5000/GenerateEmail', {
            method: 'POST',
            body: jd_description,
        })
            .then((response) => {
                SetWriteEmail(false);
                if (response.ok) {
                    return response.json()
                }
                else {
                    throw new Error('failed to change')
                }
            })
            .then((data) => {
                // Update email
                setEmailValue(data['result'])
                
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }


    // Change candidates on change in total candidate, this will only run once after arr is updated
    useEffect(() => {
        if (arr.length == 0) { return }

        let candi = [];
        let candi_emails = "";


        for (let i = 0; i < arr.length; i++) {
            if (arr[i][0] < threshold) { break }
            candi.push(
                {
                    'Score': arr[i][0],
                    'Name': arr[i][1],
                    'Email': arr[i][2]
                }
            )
            candi_emails+=arr[i][2]+","
        }
        candi_emails = candi_emails.slice(0,-1)
        setCandidates(candi);
        setShortlistedEmail(candi_emails);

    }, [arr])



    const handleEmailChange = (e) => {
        setEmailValue(e.target.value);
    }



    // Update the shortlisted candidates based on threshold
    const OnChangeThreshold = (e) => {
        let t = e.target.value;


        // Threashold cannot be less than 0 or above 100
        if (t=="") {
            t = 0
        }
        else if(t>100){
            t=100
        }
        else {
            t = parseInt(t);
        }
        e.target.value = t 



        changeTresh(t);


        // Update candidates accordingly
        let candi = [];
        let candi_emails = ""
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][0] < t) break;
            candi.push(
                {
                    'Score': arr[i][0],
                    'Name': arr[i][1],
                    'Email': arr[i][2]
                }
            )
            candi_emails+=arr[i][2]+","
        }

        candi_emails = candi_emails.slice(0,-1)
        setCandidates(candi);
        setShortlistedEmail(candi_emails);
    }


    // Copy buttons
    const HandleCopy = async(e) =>{
        try{
            await navigator.clipboard.writeText(emailValue);
            setcopy(true)   
            setTimeout(()=> setcopy(false),2000);
        }catch(err){
            console.error("failed to copy ",err);
        }
    }

    const HandleEmailCopy = async(e) =>{
        try{
            await navigator.clipboard.writeText(shortlist_email);
            setEmailCopied(true)
            setTimeout(()=>setEmailCopied(false),2000);
        }
        catch(err){
            console.log("failed to copy",err)
        }
    }





    return (

        <>
                <div className = "relative h-30">
                <Navbar />
                <div className='absolute top-1/2 w-[100%]'>
                    <div className='text-center font-bold text-5xl text-shadow-lg'>RESULTS</div>
                    
                </div>
                </div>
                
       
                
            
            <div className="flex w-[100%] mx-auto gap-2 mt-2">
                <div className='w-[12%] text-center'>

                    {/* Total and shorlisted candidates */}
                    <div className='text-xl font-bold mt-10'>TOTAL CANDIDATES</div>
                    <div className='text-7xl font-bold text-[#15A194]'>{arr.length}</div>
                    <div className='text-xl font-bold mt-10'>SHORTLISTED</div>
                    <div className='text-7xl font-bold text-[#15A194]'>{candidates.length}</div>

                </div>


                {/* Leader board */}
                <div className="h-[75vh] overflow-auto w-[50%] bg-blue-200 px-2 py-2 rounded-2xl text-white shadow-2xl" >
                    <div className="bg-white w-[100%]  h-10 rounded-2xl items-center flex p-5 mb-2  justify-between ">
                        <div className='font-bold w-[8%] text-[#15A194] '>
                            SCORE
                        </div>
                        <div className='font-bold w-[40%] text-[#15A194] '>
                            NAME
                        </div>
                        <div className="w-[27%] font-bold text-[#15A194] flex gap-1 items-center truncate">
                            EMAIL
                            <button className="w-6 h-6 cursor-pointer"
                            onClick={HandleEmailCopy}
                            >
                                {!is_emailCopied?
                                    <div className='flex font-medium text-black'><img  src = {copy} /> Copy</div>
                                    :
                                    <div className='font-medium text-black'>Copied!</div>
                                }
                            </button>
                            
                        </div>
                        <div className="w-[25%] font-bold flex items-center text-[#15A194]">
                            MATCH ABOVE %:
                            <input
                                type="number"
                                value={threshold}
                                onChange={OnChangeThreshold}
                                className='w-[28%] h-[70%] ml-2 bg-gray-300 rounded border-2 border-black text-black font-medium p-0.5'
                            />
                        </div>
                    </div>


                    {/* Render shortlisted candidates */}
                    {
                        candidates.map(item => {

                            return (<div className="bg-blue-400 w-[100%]  h-10 rounded-2xl items-center flex p-5 mb-2  justify-between">
                                <div className=' font-bold w-[8%]'>
                                    {item.Score}
                                </div>
                                <div className=' w-[40%]'>
                                    {item.Name}
                                </div>
                                <div className="w-[52%]">
                                    {item.Email}
                                </div>
                            </div>)
                        })

                    }

                </div>
                

                {/* Draft email here */}
                <div className='w-[30%]'>
                    <div className='font-bold'>Invitation Mail</div>

                    <div className='w-[100%] h-[50vh] rounded-2xl p-5 bg-gray-300 shadow-2xl'>
                        <textarea className='w-[100%] h-[100%]'
                            type="text"
                            value={emailValue}
                            
                            onChange={handleEmailChange}

                        />
                    </div>


                    {/* Edit Email button */}
                    <div className='w-[100%] flex mt-10 text-center'>
                        {
                            is_writingMail ? 
                            <div className='mx-auto'>
                                    <img className='mx-auto' src={preloader} />
                                    Emails so good, they open themselves
                                </div>
                            :
                            <button
                                className='m-auto w-[80%] h-20 bg-[#15A194] rounded-full text-md text-white cursor-pointer hover:border-2 shadow-2xl border-black hover:bg-blue-200 hover:text-black '
                                onClick={ChangeGenEmail}>
                                    Need better? Generate a brand-new email
                            </button>
                                
                        }

                    </div>


                </div>
                {
                    !is_copied?<button className='w-6 h-6 cursor-pointer flex font-medium'  
                    onClick = {HandleCopy}
                    >
                    <img src={copy}/> Copy
                    </button> 
                    :
                     <div className='font-medium'>Copied!</div>
                    
                }
                
            </div>
            

        </>
    )
}

export default Result;