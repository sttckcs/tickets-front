import { useTransition, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useColorModeValue } from '@chakra-ui/react'
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import { useAuth } from "./contexts/AuthContext";
import { Waveform } from "@uiball/loaders";
import Tickets from "./pages/Tickets";
import Faq from "./pages/Faq";
import MyProfile from "./pages/MyProfile";
import UserProfile from "./pages/UserProfile";
import Chat from "./pages/Chat";
import ChatRoom from "./pages/ChatRoom";
import VerifyUser from "./pages/VerifyUser";
import ChangePassword from "./pages/ChangePassword";
import HelpChat from './components/HelpChat';

function App() {
  const [, startTransition] = useTransition();
  const [load, setLoad] = useState(false);
  const { user, loading } = useAuth();
  const bg = useColorModeValue('#C2E8F0', '#1A202C')
  
  return (
    <main style={{ backgroundColor: bg }}>
      {loading ? 
        <div className="loader">
          <Waveform />
        </div> : 
          <Router>
            <Navbar />
            <div className="container">
              <Routes>
                <Route path='/' element={<Home></Home>}></Route>
                <Route path='/faq' element={<Faq></Faq>}></Route>
                <Route path='/admin' element={user?.admin ? <Admin></Admin> : <NotFound></NotFound>}></Route>
                <Route path='/admin/:id/profile' element={user?.admin? <UserProfile></UserProfile> : <NotFound></NotFound>}></Route>
                <Route path='/profile' element={user && !user.admin ? <MyProfile></MyProfile> : <NotFound></NotFound>}></Route>
                <Route path='/tickets' element={user && !user.admin ? <Tickets></Tickets> : <NotFound></NotFound>}></Route>
                <Route path='/chat' element={user ? <Chat></Chat> : <NotFound></NotFound>}></Route>
                <Route path='/chat/:id' element={user ? <ChatRoom></ChatRoom> : <NotFound></NotFound>}></Route>
                <Route path='/verify/:nick/:token' element={!user ? <VerifyUser></VerifyUser> : <NotFound></NotFound>}></Route>
                <Route path='/recover/:nick/:token' element={!user ? <ChangePassword></ChangePassword> : <NotFound></NotFound>}></Route>
                <Route path='*' element={<NotFound></NotFound>}></Route>
              </Routes>
            </div>
            {user && 
              <div className='help'>
              {load && <HelpChat />}
                  <button onClick={() => {
                    startTransition(() => {
                      setLoad(prev => !prev);
                    })
                  }}><p><b>Necesitas ayuda?</b></p></button>
              </div>
            }
            <footer className="footer">
              <b>2023 Staxx Tickets CS-GO</b>
            </footer>
          </Router>
      }
    </main>
  )
}

export default App
