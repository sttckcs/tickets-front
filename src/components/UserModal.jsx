import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Text, Button, Select, Box, useDisclosure, Modal, ModalCloseButton, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react'
import { API } from '../services/services'
import TermsModal from './TermsModal'
import { useNavigate } from 'react-router-dom'
const UserModal = ({ open, setOpen, mode }) => {

  const navigate = useNavigate();
  const { user, setUser, setAuth } = useAuth();
  const { onClose } = useDisclosure({ defaultIsOpen: true })
  const [newUser, setNewUser] = useState(user);
  const [nick, setNick] = useState('');
  const [steam, setSteam] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [forgotten, setForgotten] = useState(false);
  const [password, setPassword] = useState('');
  const [pwd1, setPwd1] = useState('')
  const [pwd2, setPwd2] = useState('')
  const [openTerms, setOpenTerms] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [editF, setEditF] = useState('nick');

  useEffect(() => {
    setNick('')
    setSteam('')
    setPhone('')
    setEmail('')
    setPassword('')
    setAcceptedTerms(false)
    setForgotten(false)
    setEditF('nick')
    setNewUser(user);
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
    if (mode === 'edit' || mode === 'billing') setNewUser(user);
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

  const handleUserEdit = (e) => {
    const { id, value, checked } = e.target;

    setNewUser(prev => {
      if (id === 'nick') {
        return {
          ...prev,
          [id]: value.toLowerCase()
        }
      }

      else if (id === 'empresaF') {
        return {
          ...prev,
          ['empresa']: !checked
        }
      }

      else if (id === 'empresaT') {
        return {
          ...prev,
          ['empresa']: checked
        }
      }

      else {
        return {
          ...prev,
          [id]: value
        }
      }
    })
  }

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (pwd1 !== '' || pwd2 !== '') {
      if (pwd1 !== pwd2) {
        alert('Las contraseñas deben coincidir')
        setPwd1('')
        setPwd2('')
        return
      }

      try {
        await API.post('user/password', { 
          nick: user.nick, 
          password: pwd1 
        });
        setPwd1('')
        setPwd2('')
      } catch (error) {
        alert(`Error cambiando la contraseña: ${error.response.data.message}`);
        return
      }
    } 
    try {
      await API.put('user/edit', {
        _id: user._id,
        newUser
      });
      setUser({...newUser, _id: user._id})
      alert('Usuario editado correctamente!')
      handleClose();
    } catch (error) {
      console.log(Object.keys(error.response.data.keyValue)[0])
      if (Object.keys(error.response.data.keyValue)[0] === 'email') alert(`Error editando el usuario: El email ya existe`);
      else if (Object.keys(error.response.data.keyValue)[0] === 'nick') alert(`Error editando el usuario: El nick ya existe`);
      setNewUser(user)
    }
  };

  const handleBillingSubmit = async (e) => {
    e.preventDefault();
    if (newUser.nif.length < 9) {
      alert('Error en el NIF');
      return;
    }
  
    try {
      await API.put('user/billing', {
        _id: user._id,
        newUser
      });
      setUser({...newUser, _id: user._id})
      alert('Datos de facturación añadidos correctamente!')
      handleClose();
    } catch (error) {
      console.log(error)
      alert('Error añadiendo los datos de facturación', error);
      setNewUser(user)
    }
  };

  
  return (
    <Modal blockScrollOnMount={false} closeOnOverlayClick={false} isOpen={open} onClose={handleClose}>
      <ModalOverlay backdropFilter='auto' backdropBlur='2px' />
      <ModalContent>
        <ModalHeader>{mode === 'login' ? 'Iniciar sesión' : mode === 'register' ? 'Registro' : mode === 'billing' ? 'Datos de facturación' : 'Editar perfil'}</ModalHeader>
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
                <ModalFooter mt={2} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  {!forgotten ?
                    <div>
                      <Button colorScheme='blue' type='submit' mr={1}>
                        Iniciar
                      </Button>
                      <Button colorScheme='green' onClick={() => setForgotten(true)}>
                        Contraseña olvidada?
                      </Button>
                    </div> :
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
                  placeholder="Cuenta de Steam" 
                  value={steam} 
                  onChange={(e) => setSteam(e.target.value)} 
                  required
                />
                <input
                  type="tel" 
                  placeholder="Número de teléfono" 
                  value={phone} 
                  onChange={(e) => {
                    const num = e.target.value.replace(/\D/g, '')
                    e.target.value = num
                    if (num.length <= 9) setPhone(e.target.value)
                    }} 
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
                  <Button style={{ backgroundColor: 'rgb(20, 100, 45)', color: 'white' }} onClick={() => setOpenTerms(true)}>Términos y condiciones</Button><Text fontSize='xl' style={{ fontWeight: '600' }}>{acceptedTerms ? 'Aceptados' : 'Sin aceptar'}</Text>
                </div>
                <TermsModal openTerms={openTerms} setOpenTerms={setOpenTerms} acceptedTerms={acceptedTerms} setAcceptedTerms={setAcceptedTerms} />
                <ModalFooter mt={2}>
                  <Button colorScheme='blue' type='submit' mr={1} isDisabled={!acceptedTerms || phone.length <9}>
                    Registrar
                  </Button>
                </ModalFooter>
              </form>
            </div>
          }
          {mode === 'billing' &&
            <div>
              <form onSubmit={handleBillingSubmit}>
                <input 
                  type="text" 
                  placeholder="Nombre"
                  id="name"
                  value={newUser.name} 
                  onChange={(e) => handleUserEdit(e)} 
                  required 
                />
                <input 
                  type="text" 
                  placeholder="Apellidos"
                  id="apellidos"
                  value={newUser.apellidos} 
                  onChange={(e) => handleUserEdit(e)} 
                  required
                />
                <input
                  type="text" 
                  placeholder="NIF/CIF"
                  id="nif"
                  value={newUser.nif} 
                  onChange={(e) => {
                    if (e.target.value.length <= 9) handleUserEdit(e);
                  }} 
                  required
                />
                <input 
                  type="text" 
                  placeholder="Dirección" 
                  id="direccionFacturacion"
                  value={newUser.direccionFacturacion} 
                  onChange={(e) => handleUserEdit(e)} 
                  required 
                />
                <input
                  type="text"
                  placeholder="Código Postal"
                  id="codigoPostalFacturacion"
                  value={newUser.codigoPostalFacturacion}
                  onChange={(e) => handleUserEdit(e)}
                  required
                />
                <input
                  type="text"
                  placeholder="País"
                  id="paisFacturacion"
                  value={newUser.paisFacturacion}
                  onChange={(e) => handleUserEdit(e)}
                  required
                />
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px', marginTop: '6px' }}>
                  <p>Persona Física</p>
                  <input 
                    type="checkbox"
                    style={{ width: '30px', height: '30px' }}
                    checked={!newUser.empresa} 
                    id="empresaF"
                    onChange={(e) => handleUserEdit(e)} 
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                  <p>Persona Jurídica (Empresa)</p>
                  <input 
                    type="checkbox"
                    style={{ width: '30px', height: '30px' }}
                    checked={newUser.empresa} 
                    id="empresaT"
                    onChange={(e) => handleUserEdit(e)} 
                  />
                </div>
                <ModalFooter mt={2}>
                  <Button colorScheme='blue' type='submit' mr={1} isDisabled={newUser.nif.length < 9}>
                    Aceptar
                  </Button>
                </ModalFooter>
              </form>
            </div>
          }
          {mode === 'edit' &&
            <div>
            <Box w='150px' mb='20px' ml='10px'>
              <Select fontSize='1.25rem' isRequired={true} variant='filled' onChange={(e) => setEditF(e.target.value)}>
                <option value='nick'>Nick</option>
                <option value='name'>Nombre</option>
                <option value='steam'>Steam</option>
                <option value='phone'>Teléfono</option>
                <option value='email'>Email</option>
                <option value='password'>Contraseña</option>
              </Select>
            </Box>
              <form onSubmit={handleUserSubmit}>
                {editF === 'nick' && <input 
                  type="text" 
                  value={newUser.nick} 
                  id="nick"
                  onChange={(e) => handleUserEdit(e)} 
                  required 
                />}
                {editF === 'name' && <input
                  type="text" 
                  value={newUser.name} 
                  id="name"
                  onChange={(e) => handleUserEdit(e)} 
                  required 
                />}
                {editF === 'steam' && <input 
                  type="text" 
                  value={newUser.steam} 
                  id="steam"
                  onChange={(e) => handleUserEdit(e)} 
                  required 
                />}
                {editF === 'phone' && <input
                  type="tel" 
                  value={newUser.phone} 
                  id="phone"
                  onChange={(e) => {
                    const num = e.target.value.replace(/\D/g, '')
                    e.target.value = num;
                    if (num.length <= 9) handleUserEdit(e)}} 
                  required 
                />}
                {editF === 'email' && <input 
                  type="text" 
                  value={newUser.email} 
                  id="email"
                  onChange={(e) => handleUserEdit(e)} 
                  required 
                />}
                {editF === 'password' && 
                  <>
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
                  </>
                }
                <ModalFooter mt={2}>
                  <Button colorScheme='blue' type='submit' mr={1}>
                    Guardar
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
