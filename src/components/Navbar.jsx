import { useState } from 'react';
import UserModal from './UserModal';
import { API } from '../services/services';
import { useAuth } from '../contexts/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const { setAuth, user, notis } = useAuth()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState(null)

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
      <h1 style={{ fontSize: '28px' }}><b>Staxx Tickets CS:GO</b></h1>
      <nav id='nav'>
        {!user ? 
        <>
          <button style={{ padding: '4px 10px' }} onClick={() => handleClick('login')}>Login</button>
          <button style={{ padding: '4px 10px' }} onClick={() => handleClick('register')}>Registo</button>
        </> :
        <>
          {!user.admin && <NavLink to={'/faq'}>FAQ</NavLink>}
          {user.admin ? <NavLink to={'/admin'}>Admin</NavLink> : <NavLink to={'/profile'}>Perfil</NavLink>}
          {!user.admin && <NavLink to={'/tickets'}>Tickets</NavLink>}
          <NavLink to={'/chat'}>Chat{notis.length < 1 ? '' : <div className='noti'>{notis.length}</div>}</NavLink>
          {user.admin && <button style={{ padding: '4px 10px' }} onClick={logout}>Salir</button>}
        </>
        }
      </nav>
      <UserModal open={open} setOpen={setOpen} mode={mode} />
    </div>
  )
}

export default Navbar