import "./tailwind.css"
import logo from './Components/logo2.png'
<img src={logo} alt="Logo" className="mr-2" />
import { useNavigate } from "react-router-dom"

const Navbar = () => {
    const navigate = useNavigate();

    const HandleClick = ()=>{
        // Move to home page
        navigate('/',{state:{}});
    }

    return (

        <nav className="flex p-5 ">
            <button className="items-center cursor-pointer" onClick={HandleClick}>
                <img src={logo} alt="Logo" className="w-15 h-15" />
                <div className="text-2xl DarkgreenFont font-bold flex text-shadow-lg ">
                    HireWIRE
                </div>
            </button>
        </nav>

    )
}
export default Navbar;