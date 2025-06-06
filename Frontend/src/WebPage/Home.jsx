import { useState } from 'react';
import { useEffect, useRef } from 'react'
import './tailwind.css'
import Navbar from './Navbar'
import design from './Components/design4.png'
import loading from './Components/preloader.gif'
import { useNavigate, useLocation } from 'react-router-dom';
import { v4 as uid } from 'uuid';


function Home() {


    const location = useLocation();
    const navigate = useNavigate();
    const [login, setlogin] = useState(false);
    const data = location.state; // data contains true or false , whether the user is coming to page after log in or not

    const [loadingb, setLoading] = useState(false);
    const [errormsg, setErrormsg] = useState(false);
    const [response, setResponse] = useState(false);

    const [resultdata, setData] = useState(0); //Data which will be sent to result page after computations


    const [loading_msg, Setloading_msg] = useState("Just a moment, we're working our magic!") //Text to display loading messages 



    // JD varibles
    const jd_Inputref = useRef(null);
    const [jdfile, setJdfile] = useState(null);

    // CV varibles
    const cvInputref = useRef(null);
    const [cvfile, setCvfiles] = useState(null);


    useEffect(() => {

        document.title = "HireWIRE";
        localStorage.clear();

        if (data != null && 'login' in data) {
            setlogin(data['login']);
        }
    }, [])



    //Uploading Files
    const handleJDChange = (e) => {
        if (e.target.files.length > 0) {
            const selectedJd = e.target.files[0];
            setJdfile(selectedJd);
        }
        else {
            setJdfile(null);
        }
    }

    const HandleJdUpload = (e) => {
        jd_Inputref.current.click();
    }

    const handleCVChange = (e) => {
        if (e.target.files.length > 0) {
            const selectedCVs = e.target.files;
            setCvfiles(selectedCVs);
        }
        else {
            setCvfiles(null);
        }
    }
    const handleCVUpload = (e) => {
        cvInputref.current.click();
    }



    const handleRetry = () => {
        // In case, server connection error occured
        setErrormsg(false);
    }

    const handleResult = () => {
        // Move to result page with the pocessed data
        navigate('/result', { state: { resultdata } });
    }

    const handleStart = () => {
        // Login first
        navigate('/Login', {});
    }

    const handleLogout = () => {
        setlogin(false);
        navigate('/', { state: { login: false } });
    }



    const handleGO = () => {
        // Main function to send api request and process data

        localStorage.setItem("id", uid()); // Unique id for each transaction

        let interval = null; // To make get request of progress track

        setLoading(true);


        const formData = new FormData();
        formData.append('userId', localStorage.getItem('id'));
        formData.append('Jd', jdfile);
        for (let i = 0; i < cvfile.length; i++) {
            formData.append(cvfile[i].name, cvfile[i]);
        }



        fetch('http://127.0.0.1:5000', {
            method: 'POST',
            body: formData,

        })
            .then((response) => {

                if (interval != null) {
                    clearInterval(interval);
                    interval = null;
                }

                setLoading(false);
                if (response.ok) {
                    return response.json();
                }
                else {
                    throw new Error('Failed to upload file');
                }
            })
            .then((data) => {
                setData(data);
                setResponse(true);
            })
            .catch((error) => {
                if (interval != null) {
                    clearInterval(interval);
                    interval = null;
                }
                console.log(error);
                setLoading(false);
                setErrormsg(true);

            });



        // Progress track after each 5 sec
        interval = setInterval(() => {
            fetch(`http://127.0.0.1:5000/progress?user_id=${encodeURIComponent(localStorage.getItem('id'))}`)
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                    }
                    else {
                        throw new Error('Cannot load progress');
                    }
                })
                .then((data) => {
                    Setloading_msg(data['result']);
                })
                .catch((error) => {
                    console.log(error);
                })
        }, 5000);

    }




    const handleLogin = () => {
        navigate('/login', { state: {} })
    }
    const handleSignup = () => {
        navigate('/signup', { state: {} })
    }




    return (
        <>
            <div className="flex h-screen">
                {/* Left half */}

                <div className="flex-1 h-screen w-[50%]">
                    <Navbar />

                    {/* Left containter */}
                    <div className="w-[80%] m-auto my-20">

                        <div className='w-[80%] m-auto'>
                            {/* Headline */}
                            <div className='text-5xl font-bold'>
                                <div><span className='text-[#15A194] '>Your </span> Friendly</div>
                                <div>Neighbourhoood <span className='text-[#15A194]'>ATS</span></div>
                            </div>

                            {/* Description */}
                            <div className='text-md my-10 w-[70%] mb-30'>
                                <p className='mt-1 font-medium'>Quickly find your ideal candidates with our smart resume parsing and job matching — focusing on key skills, qualifications, and experience to streamline your hiring process.</p>
                            </div>
                        </div>


                        {/* Buttons */}
                        {
                            login &&
                            (<div className='flex gap-4'>
                                <button onClick={HandleJdUpload}
                                    className=' py-5 px-5  rounded-full cursor-pointer text-white w-80 shadow-2xl font-medium truncate border-2 border-black ml-auto hover:bg-blue-200 hover:text-black bg-black'>
                                    {jdfile ? jdfile.name : 'Upload Job Description'}
                                </button>
                                <button onClick={handleCVUpload}
                                    className='py-5 px-5 bg-[#15A194] rounded-full cursor-pointer font-medium text-white w-80 shadow-2xl truncate hover:border-2 border-black mr-auto hover:bg-blue-200 hover:text-black'>
                                    {cvfile ? cvfile.length + ' CV(s) selected' : 'Upload CVs'}
                                </button>
                            </div>
                            )
                        }
                        {
                            !login && (
                                <div className="flex">
                                    <button onClick={handleStart}
                                        className='mx-auto cursor-pointer text-4xl  text-black hover:underline decoration-blue-400 '>
                                        <span className='text-blue-400 font-bold'>KICK </span>THINGS OFF!!
                                    </button>
                                </div>
                            )
                        }




                        {/* Conditionally render the button if the JD and CV are selected */}
                        <div className="mt-10 w-[85%] m-auto">
                            {
                                cvfile != null &&
                                jdfile != null &&
                                login &&
                                !loadingb &&
                                !errormsg &&
                                !response &&
                                (
                                    <button className="bg-blue-400 w-[100%] text-white h-20 rounded-full text-3xl font-bold hover:border-2 border-black cursor-pointer   "
                                        onClick={handleGO}>
                                        GO
                                    </button>
                                )

                            }
                            {
                                loadingb &&
                                login &&
                                (
                                    <div className="justify-center text-center grid text-sm ">
                                        <img src={loading} className='h-20 m-auto mb-3' />
                                        {loading_msg}
                                    </div>
                                )
                            }
                            {
                                errormsg &&
                                login &&
                                (
                                    <div className='text-center grid justify-center text-sm'>
                                        <button className="bg-blue-400 rounded-full text-3xl font-bold text-white cursor-pointer h-20 mb-3 hover:border-2 border-black" onClick={handleRetry}>
                                            Retry?
                                        </button>
                                        Oops! Something went wrong. Let’s try that again?
                                    </div>
                                )
                            }
                            {
                                response &&
                                login &&
                                (
                                    <div className='text-center grid justify-center text-sm'>
                                        <button className="bg-blue-400 rounded-full text-3xl font-bold text-white cursor-pointer h-20 mb-3 hover:border-2 border-black " onClick={handleResult}>
                                            RESULTS
                                        </button>
                                        And... it's done! Your response is locked, loaded, and ready for action
                                    </div>
                                )

                            }
                        </div>



                        {/* These inputs are hidden */}
                        {/* JD upload input */}
                        <input
                            type="file"
                            ref={jd_Inputref}
                            accept="application/pdf"
                            style={{ display: 'none' }}
                            onChange={handleJDChange}
                        />

                        {/* CV upload input */}
                        <input
                            type="file"
                            ref={cvInputref}
                            accept="application/pdf"
                            multiple
                            style={{ display: 'none' }}
                            onChange={handleCVChange}
                        />



                    </div>
                </div>



                {/* Right half */}

                <div className="w - [50%] flex-1 bg-[#15A194]">
                    <div className='flex justify-end  '>
                        {
                            !login && (
                                <>
                                    <button className='bg-white my-2 mr-2 w-25 h-10 rounded-full font-bold  text-md cursor-pointer hover:bg-black hover:text-white' onClick={handleLogin}>
                                        LogIn
                                    </button>
                                    <button className='bg-white my-2 mr-2 w-25 h-10 rounded-full font-bold  text-md cursor-pointer hover:bg-black hover:text-white' onClick={handleSignup}>
                                        SignUp</button>
                                </>
                            )
                        }
                        {
                            login && (
                                <button className='bg-white my-2 mr-2 w-25 h-10 rounded-full font-bold  text-md cursor-pointer hover:bg-black hover:text-white'
                                    onClick={handleLogout}>
                                    LogOut
                                </button>
                            )
                        }
                    </div>

                    
                    <img src={design} className='w-[70%] my-40 mx-auto' />
                </div>
            </div>
        </>
    )
}

export default Home;