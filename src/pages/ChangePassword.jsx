import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { API } from "../services/services"
import { Waveform } from "@uiball/loaders"
import { Button } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom"

const ChangePassword = () => {
  const { token } = useParams()
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pwd1, setPwd1] = useState('')
  const [pwd2, setPwd2] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await API.post(
          'user/recover', 
          { token }
        );
        if (res.data.message === 'confirmed') setSuccess(true);
        else setSuccess(false)
      } catch (error) {
        setSuccess(false);
      }
      setLoading(false)
    };

    verify();

  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pwd1 !== pwd2) {
      alert('Las contraseñas deben coincidir')
      setPwd1('')
      setPwd2('')
      return
    }
    try {
      const res = await API.post(
        'user/password', 
        { token, password: pwd1 }
      );
      if (res.data === 'password changed') alert('Contraseña cambiada! Ya puedes iniciar sesión')
      setPwd1('')
      setPwd2('')
      navigate('/');
    } catch (error) {
      alert(`Error cambiando la contraseña: ${error.response.data.message}`);
    }
  }

  return (
    <div>
      {loading ?
        <div className="loader">
          <Waveform color="white" />
        </div> :
        <div style={{ margin: '20px auto', width: '400px', fontSize: '1.5rem' }}>
          {success ?
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                placeholder="Entra tu nueva contraseña"
                value={pwd1}
                onChange={(e) => setPwd1(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirma tu nueva contraseña"
                value={pwd2}
                onChange={(e) => setPwd2(e.target.value)}
                required
              />
              <Button colorScheme='blue' type='submit' mt={3}>
                Cambiar
              </Button>
            </form>
            : 
            <h1>Ha habido un error al intentar cambiar tu contraseña</h1>
            }
        </div>
        }
    </div>
  )
}

export default ChangePassword