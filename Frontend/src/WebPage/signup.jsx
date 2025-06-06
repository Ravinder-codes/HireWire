import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import signupimg from './Components/signup.jpg'


const signup = () => {
    const navigate  = useNavigate();
    

    // Varibles
    const [username,setname] = useState("");
    const [pass,setpass] = useState("");
    const [alreadyExist,setexist] = useState(false); //Triggers if account already exists



    const handlePass = (e) =>{
        setpass(e.target.value);       
    }
    const handleusername = (e)=>{
        if (alreadyExist){
            setexist(false);
        }
        setname(e.target.value)
    }

    const Submit =(e)=>{
        if (username == "" || pass == "") return 
        const data = {username,pass};


        fetch('http://127.0.0.1:5000/signup',{
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), // Convert JS object to JSON string
      }).then((response)=>{

        console.log(response)
        if (response.ok){
            return response.json()
        }
        else{
            console.log("error")
        }
      }).then((data)=>{

      
        if (data['result']==true){
            // If account created go to login page
            navigate('/login',{state:{}})
        }
        else{
            // If already exists, show error
            setexist(true);
            setname("");
            setpass("");
        }
      }).catch((error)=>{
        console.log(error);
      })
    }


    const handleLogin=()=>{
        navigate('/login',{state:{}})
    }
    

    return (
        <>
            <div className="text-center mt-10 mb-5 text-3xl text-purple-400
            font-medium ">SIGN UP for <a href ="/" className='font-bold text-purple-600 underline' >HireWire</a></div>

            {/* Middle panel */}
            <div className='flex w-[100%] h-[100%]  '>
                <div className='h-[80vh] w-[25%] bg-white m-auto items-center rounded-3xl shadow-2xl p-4'  >
                    <img src = {signupimg} className='w-[80%]  m-auto' />
                    <div className ="mt-10">
                    
                    </div>
                    Set Username 
                    { alreadyExist && <span className='text-red-400 italic'> Username already exists</span>}
                    <input
                        className='h-12 w-[100%] bg-purple-200 rounded-2xl p-3 mb-5' 
                        placeholder='Username'
                        value = {username}
                        required
                        onChange = {handleusername}
                        type="text"
                    />
                  
                    Set Password
                    <input
                        className='h-12 w-[100%] bg-purple-200 rounded-2xl p-3'
                        required
                        placeholder='Password'
                        value = {pass}
                        onChange={handlePass}
                        type="password"
                    />

                    <button className = "w-[100%] h-15 bg-[#15A194] mt-20 rounded-full text-white border-black border-0 hover:border-2" onClick={Submit}>  
                        Create Account      
                    </button>  
                    <div className=' mt-2 flex font-medium'>
                        <button className='hover:underline cursor-pointer m-auto' onClick={handleLogin}>Already have account? Login</button>
                    </div> 
                </div>

                

            </div>
        </>
    )
}

export default signup;