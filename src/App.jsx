import { useTransition, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { useColorModeValue } from '@chakra-ui/react';
import { useAuth } from "./contexts/AuthContext";
import { Waveform } from '@uiball/loaders';
import Twitter from '/images/x1.png';
import HelpChat from "./components/HelpChat";
import { circIn } from 'framer-motion';


const Home = lazy(() => import("./pages/Home"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Navbar = lazy(() => import("./components/Navbar"));
const Tickets = lazy(() => import("./pages/Tickets"));
const Faq = lazy(() => import("./pages/Faq"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Chat = lazy(() => import("./pages/Chat"));
const ChatRoom = lazy(() => import("./pages/ChatRoom"));
const VerifyUser = lazy(() => import("./pages/VerifyUser"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const Links = lazy(() => import("./pages/Links"));
const Users = lazy(() => import("./pages/Users"));
const Ticket = lazy(() => import("./pages/Ticket"));
const Inventory = lazy(() => import("./pages/Inventory"))
const HelpChat = lazy(() => import("./components/HelpChat"));
const Sell = lazy(() => import("./pages/Sell"));

function App() {
  const [, startTransition] = useTransition();
  const [load, setLoad] = useState(false);
  const { user, loading } = useAuth();
  const bg = useColorModeValue('#C2E8F0', '#1A202C')

  const changeLoad = () => {
    setLoad(true)
  }

  return (
    <>
      <main style={{ backgroundColor: bg }}>
        {loading ?
          <div className="loader">
            <Waveform color="white" />
          </div> : 
            <Router>
              {/* <Navbar /> */}
              <div className="container">
                <Routes>
                  <Route path='/' element={<Layout />}>
                    <Route path='/' element={<Home />} />
                    <Route path='/faq' element={user ? <Faq /> : <NotFound />} />
                    <Route path='/sell' element={user ? <Sell /> : <NotFound />} />
                    <Route path='/links' element={user ? <Links /> : <NotFound />} />
                    <Route path='/tickets/:id/profile' element={user?.admin? <UserProfile /> : <NotFound />} />
                    <Route path='/tickets/:id' element={user?.admin? <Ticket /> : <NotFound />} />
                    <Route path='/users' element={user?.admin? <Users /> : <NotFound />} />
                    <Route path='/profile' element={user && !user.admin ? <MyProfile /> : <NotFound />} />
                    <Route path='/tickets' element={user && !user.admin ? <Tickets /> : user && user.admin ? <Admin /> : <NotFound />} />
                    <Route path='/chat' element={user ? <Chat /> : <NotFound />} />
                    <Route path='/chat/:id' element={user ? <ChatRoom /> : <NotFound />} />
                    <Route path='/verify/:nick/:token' element={!user ? <VerifyUser /> : <NotFound />} />
                    <Route path='/recover/:token' element={!user ? <ChangePassword /> : <NotFound />} />
                    <Route path='*' element={<NotFound />} />
                  </Route>
                </Routes>
              </div>
              {user && 
                <div className='help'>
                  {<HelpChat load={load} setLoad={changeLoad} />}
                    <button onClick={() => {
                      startTransition(() => {
                        setLoad(prev => !prev);
                      })
                    }}>
                      <svg className='support' strokeWidth="1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 11a8 8 0 10-16 0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        <path d="M2 15.438v-1.876a2 2 0 011.515-1.94l1.74-.436a.6.6 0 01.745.582v5.463a.6.6 0 01-.746.583l-1.74-.435A2 2 0 012 15.439zM22 15.438v-1.876a2 2 0 00-1.515-1.94l-1.74-.436a.6.6 0 00-.745.582v5.463a.6.6 0 00.745.583l1.74-.435A2 2 0 0022 15.439zM20 18v.5a2 2 0 01-2 2h-3.5" strokeWidth="1.5"></path>
                        <path d="M13.5 22h-3a1.5 1.5 0 010-3h3a1.5 1.5 0 010 3z"strokeWidth="1.5"></path>
                      </svg>
                      <h1>SOPORTE</h1>
                    </button>
                </div>
              }
              <a 
                href="http://www.twitter.com/todoskins" 
                target="_blank" 
                rel="noreferrer"
              >
                <img className='rrss' src={Twitter} alt='Logo Twitter' />
              </a>
              <footer className="footer">
                <b>© 2023 SKINDREAM, SL. Todos los derechos reservados.</b>
              </footer>
            </Router>
        }
      </main>
      {/* <img className='skins' src={skins} alt='skins' /> */}
    </>
  )
}

function Layout () {
  return (
    <>
      <Navbar />
      <Suspense 
        fallback={
          <div className="loader-small">
            <Waveform color="white" />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </>
  )
}

export default App
