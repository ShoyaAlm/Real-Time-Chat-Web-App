import ChatPage from "./chats"
import { Signup, Login } from "./signup-login"
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import './css/main.css'

const Main = () => {

    const token = localStorage.getItem('token')

return (<>

    <Router>
        <Routes>

            { !token ? <> 
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<Login />} />
             </> 
             : <>
                <Route path="/*" element={<ChatPage />} />
              </> }

        </Routes>
    </Router>

</>)

}

export default Main