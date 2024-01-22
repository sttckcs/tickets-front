import { useEffect, useState } from "react"
import { API } from "../services/services"
import { Box, Button, Input, Select } from '@chakra-ui/react'
import { useAuth } from "../contexts/AuthContext"
import AdminsModal from "../components/AdminsModal"
import { Waveform } from "@uiball/loaders"
import { useDebounce } from "@uidotdev/usehooks"
import { ToastContainer, toast } from "react-toastify"
import CalendarModal from "../components/CalendarModal"

const Users = () => {
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [action, setAction] = useState('');
  const [interval, setInterval] = useState('day');
  const [calOpen, setCalOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);
  const [billCount, setBillCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    getStats();
  }, [interval, debouncedSearch])

  const getStats = async () => {
    try {
      setLoading(true);
      const res = await API.post(
        'user/stats',
        {
          interval,
          startDate,
          endDate,
          pais: debouncedSearch
        });
      const { user, ticket, bill } = res.data;
      setUserCount(user);
      setTicketCount(ticket);
      setBillCount(bill);
      setLoading(false);
    } catch (error) {
      toast.error('Error recogiendo las estadísticas')
    }
  }

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: 'selection'
  }

  const handleSelect = (date) => {
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
    setInterval('custom');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.email === email) {
      toast.error('No puedes cambiar tus permisos')
      setEmail('')
      return
    }
    if (action === 'permissions') {
      try {
        const res = await API.put(
          'user/permissions',
          { email }
        );
        res.data.admin ? toast.success(`Se han dado permisos a ${res.data.nick}`) : toast.success(`Se han quitado permisos a ${res.data.nick}`)
      } catch (error) {
        toast.error(`Usuario no encontrado`);
      }
    } else if (action === 'verify') {
      try {
        const res = await API.put(
          'user/verifyAdmin',
          { email }
        );
        toast.success(`Se ha verificado a ${res.data.nick}`)
      } catch (error) {
        if (error.response.status === 304) toast.error('El usuario ya estaba verificado');
        else if (error.response.status === 404) toast.error('Usuario no encontrado');
        else toast.error('Error del servidor');
      }
    } else if (action === 'ban') {
      try {
        const res = await API.put(
          'user/ban',
          { email }
        );
        toast.success(`Se ha baneado a ${res.data.nick}`)
      } catch (error) {
        if (error.response.status === 304) toast.error('El usuario ya estaba baneado');
        else if (error.response.status === 404) toast.error('Usuario no encontrado');
        else toast.error('Error del servidor');
      }
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '30px' }}>
      <div style={{ margin: '20px', width: '400px', fontSize: '1.5rem' }}>
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
          <Button colorScheme='blue' type='submit' mt={3} ml={2} onClick={() => setAction('ban')}>
            Banear
          </Button>
        </form>
        <div>
          <Button colorScheme='blue' type='submit' mt={5} ml={2} onClick={() => setOpen(true)}>
            Ver admins
          </Button>
        </div>
        <AdminsModal open={open} setOpen={setOpen} />
      </div>
      <div style={{ margin: '10px', width: '500px', fontSize: '1.5rem', display: 'flex', gap: '10px', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontSize: '3.25rem' }}>Estadísticas</h1>
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '10px' }}>
          <Box w='210px'>
            <Select value={interval} isRequired={true} fontSize='1.25rem' variant='filled' onChange={(e) => setInterval(e.target.value)}>
              <option value='day'>Hoy</option>
              <option value='week'>Última semana</option>
              <option value='month'>Último mes</option>
              <option value='year'>Último año</option>
              <option value='custom'>Otro</option>
            </Select>
          </Box>
          <Box w='120px'>
            <Button onClick={() => setCalOpen(true)}>Fechas</Button>
          </Box>
          <Box w='240px'>
            <Input style={{ fontSize: '1.25rem', borderColor: '#2D3748', height: '38px', paddingLeft: '8px', width: '220px', backgroundColor: '#E2E8F0', color: '#2D3748' }} _placeholder={{ color: '#2D3748' }} type='text' placeholder='Usuarios por país' onChange={(e) => setSearch(e.target.value)} />
          </Box>
        </div>
        {loading ?
          <div className="loader-small">
            <Waveform color="white" />
          </div> :
          <div>
            <h1>Usuarios: {userCount}</h1>
            <h1>Tickets: {ticketCount}</h1>
            <h1>Facturas: {billCount}</h1>
          </div>
        }
      </div>
      <CalendarModal getStats={getStats} open={calOpen} setOpen={setCalOpen} selectionRange={selectionRange} handleSelect={handleSelect} />
      <ToastContainer theme="colored" position="top-center" limit={3} />
    </div>
  )
}

export default Users