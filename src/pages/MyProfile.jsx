import { Waveform } from "@uiball/loaders";
import { useAuth } from "../contexts/AuthContext";
import { Button } from '@chakra-ui/react'
import { API } from "../services/services";
import { useNavigate } from "react-router-dom";
import Profile from "../components/Profile";

const MyProfile = () => {
  const { user, loading, setAuth } = useAuth(); 
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
          <Waveform />
        </div> :
        <>
          <Profile user={user} />
          <Button onClick={logout}>Salir</Button>
        </>
      }
    </>
  )
}

export default MyProfile