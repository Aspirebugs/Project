import Auth from "./Auth.jsx"
import {Routes,Route} from "react-router-dom"
import Layout from "./Layout.jsx"
import Home from "./Home.jsx"
import Missing from "./Missing.jsx"
import Problem from "./Problem.jsx"
import RequireAuth from "./RequireAuth.jsx";

function App() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 flex items-center justify-center">
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route path="auth" element={<Auth />} />
          

          {/* we want to protect these routes */}
            <Route  path = "/" element={<Home/>} />

           
            <Route path = "/problems/:problemId" element = {<Problem/>}/> 
         

          {/* catch all */}
          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
    </div>

  )
}

export default App
