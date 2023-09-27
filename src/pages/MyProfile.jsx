import { Waveform } from "@uiball/loaders";
import { useAuth } from "../contexts/AuthContext";
import { Button } from '@chakra-ui/react'
import { API } from "../services/services";
import { useNavigate } from "react-router-dom";
import Profile from "../components/Profile";
import { useState } from "react";
import UserModal from "../components/UserModal";

const MyProfile = () => {
  const { user, loading, setAuth } = useAuth(); 
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const logout = async () => {
    try {await API.post('user/logout');
      setAuth(false);
    } catch (error) {
      console.log(error)
    }
    navigate('/');
  }

  
  return (
      <>
      {loading ? 
        <div className="loader">
          <Waveform color="white" />
        </div> :
        <>
          <Profile user={user} />
          <Button style={{ margin: '10px' }} onClick={() => setOpen(true)}>Editar</Button>
          <Button style={{ margin: '10px' }} onClick={logout}>Salir</Button>
          <UserModal open={open} setOpen={setOpen} mode={'edit'} />
        </>
      }
    </>
  )
}

export default MyProfile