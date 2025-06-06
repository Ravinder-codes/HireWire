import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import signupimg from './Components/login.jpg'

const Login = () => {
    const navigate  = useNavigate();

    const [username,setname] = useState("");
    const [pass,setpass] = useState("");
    const [notvalid,setvalid] = useState(false);


    // Handle password and username
    const handlePass = (e) =>{
        setvalid(false);
        setpass(e.target.value);       
    }
    const handleusername = (e)=>{
        setvalid(false);
        setname(e.target.value)
    }

    const Submit =(e)=>{
        if (username == "" || pass == "") return 
        const data = {username,pass};


        fetch('http://127.0.0.1:5000/login',{
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
      }).then((response)=>{
        if (response.ok){
            return response.json()
        }
        else{
            console.log("error")
        }
      }).then((data)=>{

        if (data['result']==true){
            // If valid, move to home page with login = true
            navigate('/',{state:{login:true}})
        }
        else{
            // If not valid, show error
            setvalid(true);
            setname("");
            setpass("");
        }
      }).catch((error)=>{
        console.log(error);
      })
    }


    const handleSignUp = () =>{
        navigate('/signup',{state:{}})
    }
    

    return (
        <>
            <div className="text-center mt-10 mb-5 text-3xl text-blue-400
            font-medium ">LOG IN for <a href ="/" className='font-bold text-blue-600 underline'>HireWire</a></div>

            <div className='flex w-[100%] h-[100%] '>
                <div className='h-[80vh] w-[25%] bg-white m-auto items-center rounded-3xl shadow-2xl p-4'  >
                    <img src = {signupimg} className='w-[80%]  m-auto' />
                    <div className ="mt-10">

                    </div>
                    Username 
                    {notvalid && <span className='text-red-400 italic'> Username or Password invalid</span>}
                    <input
                        className='h-12 w-[100%] bg-blue-200 rounded-2xl p-3 mb-5' 
                        placeholder='Username'
                        value = {username}
                        onChange = {handleusername}
                        type="text"
                    />
                  
                    Password
                    <input
                        className='h-12 w-[100%] bg-blue-200 rounded-2xl p-3'
                        placeholder='Password'
                        value = {pass}
                        onChange={handlePass}
                        type="password"
                    />

                    <button className = "w-[100%] h-15 bg-[#15A194] mt-20 rounded-full text-white border-black border-0 hover:border-2" onClick={Submit}>  
                        Login      
                    </button>  
                    <div className=' mt-2 flex font-medium'>
                        <button className='hover:underline cursor-pointer m-auto' onClick={handleSignUp}>Do not have account? SignUp</button>
                    </div> 
                </div>

                

            </div>
        </>
    )
}

export default Login;