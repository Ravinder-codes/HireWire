import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import Home from './WebPage/Home'
import Result from  './WebPage/Result'
import Login from './WebPage/Login'
import Signup from './WebPage/signup'


function App() {
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element:<Home/>
      },
      {
        path: "/Result",
        element: <Result/>
      },
      {
        path: "/Login",
        element: <Login/>
      },
      {
        path: "/signup",
        element: <Signup/>
      },
    ]
  )

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
 
}

export default App
