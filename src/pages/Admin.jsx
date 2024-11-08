import { useEffect, useState } from "react"
import { API } from "../services/services";
import { Button, Input, Select, Box, useColorModeValue } from "@chakra-ui/react"
import { Waveform } from "@uiball/loaders";
import CalendarModal from "../components/CalendarModal";
import { useDebounce } from "@uidotdev/usehooks";
import { useAuth } from "../contexts/AuthContext";
import TicketDetailModal from "../components/TicketDetailModal";
import MailModal from "../components/MailModal";
import Star from '/images/star.png';

const Admin = () => {
  const { user, setTicket, getTickets, setTickets, tickets } = useAuth();
  // const textColor = useColorModeValue('#E2E8F0', '#2D3748')
  // const bgColor = useColorModeValue('#2D3748', '#E2E8F0')
  const textColor = useColorModeValue('#2D3748', '#E2E8F0')
  const bgColor = useColorModeValue('#E2E8F0', '#2D3748')
  const [calOpen, setCalOpen] = useState(false)
  const [loading, setLoading] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false)
  const [mailOpen, setMailOpen] = useState(false)
  const [currentTicket, setCurrentTicket] = useState(null);
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const [startDate, setStartDate] = useState(new Date('Mon Jun 05 2023 00:00:00 GMT+0200 (Central European Summer Time)'));
  const [endDate, setEndDate] = useState(new Date());
  const [order, setOrder] = useState('newest');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    let intervalId;
    const fetchTicketsPeriodically = () => {
      intervalId = setInterval(getTickets, 10000); 
      return () => clearInterval(intervalId);
    };
  
    fetchTicketsPeriodically();
    setTicket(true);
    setLoading(false);

    if (!detailOpen) getTickets();

    return () => {
      clearInterval(intervalId);
    }
  }, [detailOpen]);

  const handleDetails = (ticket) => {
    setCurrentTicket(ticket)
    setDetailOpen(true)
  }

  const ticketNewTab = (ticket, e) => {
    if (e.button == 2) {
      e.preventDefault();
      window.open(`/tickets/${ticket._id}`, '_blank')
    }
  }

  const handleClose = async (_id, open) => {
    try {
      await API.post(
        'ticket/close',
        { _id,
        open }
      );
      const updatedTickets = tickets.map(ticket => {
        if (ticket._id === _id) {
          return { ...ticket, open: !open }
        }
        return ticket;
      })
      setCurrentTicket(updatedTickets.filter(ticket => ticket._id === _id)[0])
      setTickets(updatedTickets)
    } catch (error) {
      console.log(error)
    }
  }

  const ticketNewTab = (ticket, e) => {
    if (e.button == 2) {
      e.preventDefault();
      window.open(`/tickets/${ticket._id}`, '_blank')
    }
  }

  const handleDelete = async (_id) => {
    try {
      await API.post(
        'ticket/delete',
        { _id }
      );
      const updatedTickets = tickets.filter(ticket => ticket._id !== _id)
      setTickets(updatedTickets)
      setDetailOpen(false);
    } catch (error) {
      console.log(error)
    }
  }

  const nullTicket = () => {
    setCurrentTicket(null);
  }

  const handleChat = async (_id) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket._id === _id) {
        return { ...ticket, adminLast: user.admin }
      }
      return ticket;
    })
    setCurrentTicket(updatedTickets.filter(ticket => ticket._id === _id)[0])
    setTickets(updatedTickets)
  }

  const handleSelect = (date) => {
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
  };

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: 'selection'
  }

  let filteredTickets = tickets.filter(ticket => {
    const ticketDate = new Date(ticket.createdAt)
    if (!status && !ticket.open) return false;
    if (category && ticket.category !== category) return false;
    if (status && ((!ticket.open && status !== 'closed') || (ticket.open && status === 'closed') || ((!ticket.open || ticket.adminLast) && status === 'open') || ((!ticket.open || !ticket.adminLast) && status === 'read')) || (ticket.marked && status === 'unmarked') || (!ticket.marked && status === 'marked')) return false;
    if (debouncedSearch && ticket.user.nick !== debouncedSearch && ticket.user.email !== debouncedSearch && ticket._id.substring(0,8) !== debouncedSearch) return false;

    return (ticketDate >= startDate && ticketDate <= endDate)
  })

  if (order === 'oldest') filteredTickets = [...filteredTickets].reverse();

  return (
    <>
      <nav id='nav-filters' style={{ paddingTop: 0 }}>
        <Box w='210px'>
          <Select isRequired={true} fontSize='1.25rem' variant='filled' onChange={(e) => setStatus(e.target.value)}>
            <option value=''>Todos los estados</option>
            <option value='open'>Ver pendientes</option>
            <option value='read'>Ver leídos</option>
            <option value='closed'>Ver cerrados</option>
            <option value='marked'>Ver marcados</option>
            <option value='unmarked'>Ver sin marcar</option>
          </Select>
        </Box>
        <Box w='210px'>
          <Select isRequired={true} fontSize='1.25rem' variant='filled' onChange={(e) => setCategory(e.target.value)}>
            <option value=''>Todas las categorías</option>
            <option value='sell'>Venta</option>
            <option value='buy'>Compra</option>
            <option value='buff'>Balance</option>
          </Select>
        </Box>
        <Box w='210px'>
          <Select isRequired={true} fontSize='1.25rem' colorScheme="twitter" variant='filled' onChange={(e) => setOrder(e.target.value)}>
            <option value='newest'>Más recientes</option>
            <option value='oldest'>Más antiguos</option>
          </Select>
        </Box>
        <Box w='230px'>
          <Input style={{ fontSize: '1.25rem', borderColor: textColor, height: '38px', paddingLeft: '8px', width: '220px', backgroundColor: bgColor, color: textColor }} _placeholder={{ color: textColor }} type='text' placeholder='Busca por nombre' onChange={(e) => setSearch(e.target.value)} />
        </Box>
        <Box w='110px'>
          <Button onClick={() => setCalOpen(true)}>Fechas</Button>
        </Box>
        <Box w='150px'>
          <Button onClick={() => setMailOpen(true)}>Envía correo</Button>
        </Box>
        <CalendarModal open={calOpen} setOpen={setCalOpen} selectionRange={selectionRange} handleSelect={handleSelect} />
      </nav>
      {loading ?
        <div className="loader-sm">
          <Waveform color="white" />
        </div> :
        <>
          <div className="tickets">
            {filteredTickets.map((ticket) => {
              return (
                <div key={ticket._id} style={{ position: 'relative', margin: '0px 10px' }}>
                  <div 
                    className="ticket" 
                    style={{ backgroundColor: !ticket.open ? 'red' : ticket.adminLast ? 'gray' : 'green' }} 
                    onClick={() => handleDetails(ticket)}
                    onMouseDown={(e) => ticketNewTab(ticket, e)}
                    onContextMenu={(e) => ticketNewTab(ticket, e)}
                  >
                    {ticket.marked && <img src={Star} alt='star' className="ticket-star"/>}
                    <strong>{ticket._id.substring(0,8)}</strong>
                  </div>
                </div>
              )
            })}
          </div>
          <TicketDetailModal open={detailOpen} setOpen={setDetailOpen} ticket={currentTicket} setTicket={setCurrentTicket} handleChat={handleChat} handleCloseT={handleClose} handleDelete={handleDelete} />
          <MailModal open={mailOpen} setOpen={setMailOpen} />
        </>
      }
    </>
  )
}

export default Admin