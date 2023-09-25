import { useState } from 'react';
import UserModal from './UserModal';
import { API } from '../services/services';
import { useAuth } from '../contexts/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { useColorMode } from '@chakra-ui/react'
import logo from '../logo.png'
import moon from '../moon-25.svg'
import sun from '../sun.png'

const Navbar = () => {
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode()
  const { setAuth, user, notis } = useAuth()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState(null)
  const [notisBox, setNotisBox] = useState(false)

  const handleClick = (mode) => {
    setOpen(true);
    setMode(mode);
  }

  const logout = async () => {
    try {await API.post('user/logout');
      setAuth(false);
    } catch (error) {
      console.log(error)
    }
    navigate('/');
  }

  return (
    <div className='nav-container'>
      <div className='nav-items'>
        <img className="nav-title" src={logo} onClick={() => navigate('/')} alt="todoskins" />
        <img onClick={toggleColorMode} src={`${colorMode === 'light' ? moon : sun}`} className='toggle' alt='toggle' />
        {(user && !user.admin) && <NavLink to={'/profile'}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className='user-icon'>
            <path strokeWidth="1.75" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </NavLink>}
        {user && 
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className='notis-icon' onClick={() => setNotisBox(prev => !prev)}>
              <path strokeWidth="1.75" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            {notis.length < 1 ? '' : <div className='noti'>{notis.length}</div>}
            {notis.length > 0 && notisBox && 
              <div className='notis' style={ colorMode === 'dark' ? { textColor: 'white' } : {} }>
                {notis.map(noti => <NavLink to={`/chat/${noti}`} key={noti} onClick={() => setNotisBox(false)}>Nuevo mensaje del ticket {noti.substring(0, 8)}</NavLink>)}
              </div>
            }
          </>
        }
      </div>
      <nav id='nav' style={{ aActive: 'red' }}>
        {!user ? 
        <>
          <button style={{ padding: '4px 10px' }} onClick={() => handleClick('login')}>Login</button>
          <button style={{ padding: '4px 10px' }} onClick={() => handleClick('register')}>Registro</button>
        </> :
        <>
          {user.admin && <NavLink to={'/'}>Admin</NavLink>}
          {!user.admin && <NavLink to={'/tickets'}>Tickets</NavLink>}
          <NavLink to={'/chat'}>Chat</NavLink>
          {!user.admin && <NavLink to={'/faq'}>FAQ</NavLink>}
          {!user.admin && <NavLink to={'/links'}>Enlaces</NavLink>}
          {user.admin && <button style={{ padding: '4px 10px' }} onClick={logout}>Salir</button>}
        </>
        }
      </nav>
      <UserModal open={open} setOpen={setOpen} mode={mode} />
    </div>
  )
}

export default Navbar