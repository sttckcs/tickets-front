import { useState } from "react"
import { API } from "../services/services"
import { Button } from '@chakra-ui/react'
import { useAuth } from "../contexts/AuthContext"

const Permissions = () => {
  const { user } = useAuth()
  const [email, setEmail] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.email === email) {
      alert('No puedes cambiar tus permisos')
      setEmail('')
      return
    }
    try {
      const res = await API.put(
        'user/permissions', 
        { email }
      );
      res.data.admin ? alert(`Se han dado permisos a ${res.data.nick}`) : alert(`Se han quitado permisos a ${res.data.nick}`)
    } catch (error) {
      console.log('error', error);
      alert(`Usuario no encontrado`);
    }
  }

  return (
    <div>
      <div style={{ margin: '20px auto', width: '400px', fontSize: '1.5rem' }}>
          <form onSubmit={handleSubmit}>
            <input 
              type="email" 
              style={{ width: '320px' }} 
              placeholder={"Introduce el correo del usuario"} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
            <Button colorScheme='blue' type='submit' mt={3}>
              Cambiar permisos
            </Button>
          </form>
      </div>
    </div>
  )
}

export default Permissions