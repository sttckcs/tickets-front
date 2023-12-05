import { useState } from "react"
import { API } from "../services/services"
import { Button } from '@chakra-ui/react'
import { useAuth } from "../contexts/AuthContext"
import AdminsModal from "../components/AdminsModal"

const Users = () => {
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [action, setAction] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.email === email) {
      alert('No puedes cambiar tus permisos')
      setEmail('')
      return
    }
    if (action === 'permissions') {
      try {
        const res = await API.put(
          'user/permissions', 
          { email, id: user._id }
        );
        res.data.admin ? alert(`Se han dado permisos a ${res.data.nick}`) : alert(`Se han quitado permisos a ${res.data.nick}`)
      } catch (error) {
        alert(`Usuario no encontrado`);
      }
    } else if (action === 'verify') {
      try {
        const res = await API.put(
          'user/verifyAdmin', 
          { email, id: user._id }
        );
        alert(`Se ha verificado a ${res.data.nick}`)
      } catch (error) {
        if (error.response.status === 304) alert('El usuario ya estaba verificado');
        else if (error.response.status === 404) alert('Usuario no encontrado');
        else alert('Error del servidor');
      }
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
            <Button colorScheme='blue' type='submit' mt={3} mr={2} onClick={() => setAction('permissions')}>
              Cambiar permisos
            </Button>
            <Button colorScheme='blue' type='submit' mt={3} ml={2} onClick={() => setAction('verify')}>
              Verificar
            </Button>
          </form>
          <div>
            <Button colorScheme='blue' type='submit' mt={5} ml={2} onClick={() => setOpen(true)}>
              Ver admins
            </Button>
          </div>
          <AdminsModal open={open} setOpen={setOpen} />
      </div>
    </div>
  )
}

export default Users