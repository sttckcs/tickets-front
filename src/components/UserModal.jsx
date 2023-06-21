import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Text, Button, useDisclosure, Modal, ModalCloseButton, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react'
import { API } from '../services/services'
import TermsModal from './TermsModal'
import { useNavigate } from 'react-router-dom'
const UserModal = ({ open, setOpen, mode }) => {

  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const { onClose } = useDisclosure({ defaultIsOpen: true })
  const [nick, setNick] = useState('');
  const [name, setName] = useState('');
  const [steam, setSteam] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [forgotten, setForgotten] = useState(false);
  const [password, setPassword] = useState('');
  const [openTerms, setOpenTerms] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    setNick('')
    setName('')
    setSteam('')
    setPhone('')
    setEmail('')
    setPassword('')
    setAcceptedTerms(false)
    setForgotten(false)
  }, [open])

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('user/login', {
        email,
        password
      });
      if (res.status === 200) {
        setAuth(true);
      }
      handleClose();
      navigate('/');
    } catch (error) {
      console.log(error);
      alert(`Error con el login: ${error.response.data.message}`);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('user/register', {
        nick,
        name,
        steam,
        phone,
        email,
        password
      });
      alert('Usuario creado! Verifica tu correo para iniciar sesión')
      handleClose();
    } catch (error) {
      alert(`Error en el registro: ${error.response.data.message}`);
    }
  };

  const handleClose = () => {
    onClose();
    setOpen(false);
  }
  
  const handleForgotten = async (e) => {
    e.preventDefault();
    try {
      await API.post('user/recovery', {
        email,
      });
      alert('Correo de recuperación enviado! Comprueba tu bandeja')
      handleClose();
    } catch (error) {
      alert(`Error enviando el correo: ${error.response.data.message}`);
    }
  }
  
  return (
    <Modal blockScrollOnMount={false} closeOnOverlayClick={false} isOpen={open} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{mode === 'login' ? 'Inciar sesión' : 'Registro'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {mode === 'login' &&
            <div>
              <form onSubmit={handleLogin}>
                <input type="email" style={{ width: '300px' }} placeholder={forgotten ? "Introduce tu correo" : "Correo"} value={email} onChange={(e) => setEmail(e.target.value)} required />
                {!forgotten && <input
                  style={{ width: '300px' }}
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />}
                <ModalFooter mt={2}>
                  {!forgotten ?
                    <>
                      <Button colorScheme='green' onClick={() => setForgotten(true)} mr={3}>
                        Contraseña olvidada?
                      </Button>
                      <Button colorScheme='blue' type='submit'>
                        Iniciar
                      </Button>
                    </> :
                    <Button colorScheme='blue' onClick={handleForgotten}>
                      Enviar
                    </Button>
                  }
                </ModalFooter>
              </form>
            </div>
          }
          {mode === 'register' &&
            <div>
              <form onSubmit={handleRegister}>
                <input 
                  type="text" 
                  placeholder="Nick" 
                  value={nick} 
                  onChange={(e) => setNick(e.target.value.toLowerCase())} 
                  required 
                />
                <input
                  type="text" 
                  placeholder="Nombre" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
                <input 
                  type="text" 
                  placeholder="Cuenta de Steam" 
                  value={steam} 
                  onChange={(e) => setSteam(e.target.value)} 
                  required
                />
                <input
                  type="number" 
                  placeholder="Número de teléfono" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required   
                />
                <input 
                  type="email" 
                  placeholder="Correo" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', margin: '10px'}}>
                  <Button colorScheme='green' onClick={() => setOpenTerms(true)}>Términos y condiciones</Button><Text fontSize='md' style={{ fontWeight: '600' }}>{acceptedTerms ? 'Aceptados' : 'Sin aceptar'}</Text>
                </div>
                <TermsModal openTerms={openTerms} setOpenTerms={setOpenTerms} acceptedTerms={acceptedTerms} setAcceptedTerms={setAcceptedTerms} />
                <ModalFooter mt={2}>
                  <Button colorScheme='blue' type='submit' mr={3} isDisabled={!acceptedTerms}>
                    Registrar
                  </Button>
                </ModalFooter>
              </form>
            </div>
          }
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default UserModal;
