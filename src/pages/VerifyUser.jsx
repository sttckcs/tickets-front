import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { API } from "../services/services"
import { Waveform } from "@uiball/loaders"

const VerifyUser = () => {
  const { token, nick } = useParams()
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await API.post(
          'user/verify', 
          { token, nick }
        );
        if (res.data === 'verified') setSuccess(true);
        else setSuccess(false)
      } catch (error) {
        setSuccess(false);
      }
      setLoading(false)
    };

    verify();

  }, [nick, token]);

  return (
    <div>
      {loading ?
        <div className="loader">
          <Waveform />
        </div> :
        <div>
          <h1>{success ? 'Cuenta verificada! Ya puedes iniciar sesión' : 'Ha habido un error al verificar tu cuenta'}</h1>
        </div>
        }
    </div>
  )
}

export default VerifyUser