import { useState } from 'react';
import UserModal from './UserModal';
import { API } from '../services/services';
import { useAuth } from '../contexts/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { useColorMode } from '@chakra-ui/react'
import logo from '/images/Logo-Con-Glow.png'
import userIcon from '/images/Icono-User.png'
import notisIcon from '/images/Icono-Correo.png'
import settingsIcon from '/images/Icono-Settings.png'
// import moon from '../moon-25.svg'
// import sun from '../sun.png'

const Navbar = () => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode()
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
        <img src={settingsIcon} className='settings' alt='settings' />
        {(user && !user.admin) && <NavLink to={'/profile'}>
          <img src={userIcon} alt='user logo' className='user-icon' />
        </NavLink>}
        {user && 
          <>
            <img src={notisIcon} alt='mail logo' className='notis-icon' onClick={() => setNotisBox(prev => !prev)} />
            {notis.length < 1 ? '' : <div className='noti'>{notis.length}</div>}
            {notis.length > 0 && notisBox && 
              <div className='notis' style={ colorMode === 'dark' ? { textColor: 'white' } : {} }>
                {notis.map(noti => {
                  if (noti === 'xx21') return <NavLink to={`/profile`} key={noti} onClick={() => setNotisBox(false)}>Necesitas añadir los datos de facturación</NavLink>
                  else return <NavLink to={`/chat/${noti}`} key={noti} onClick={() => setNotisBox(false)}>Nuevo mensaje del ticket {noti.substring(0, 8)}</NavLink>
                })}
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
          {user.admin && <NavLink to={'/chat'}>Chat</NavLink>}
          {user.admin && <NavLink to={'/permissions'}>Permisos</NavLink>}
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