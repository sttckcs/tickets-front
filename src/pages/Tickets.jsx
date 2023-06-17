import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext"
import { Button } from '@chakra-ui/react'
import NewTicketModal from "../components/NewTicketModal";
import TicketDetailModal from "../components/TicketDetailModal";
import { Waveform } from "@uiball/loaders";

const Tickets = () => {
  const [newOpen, setNewOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const { user, setTicket, loading } = useAuth();
  const [currentTicket, setCurrentTicket] = useState(null);

  useEffect(() => {
    setTicket(true)
  }, [setTicket])

  const handleDetails = (ticket) => {
    setCurrentTicket(ticket)
    setDetailOpen(true)
  }

  return (
    <>
      {loading ?
        <div className="loader">
          <Waveform />
        </div> :
        <>
          <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Button style={{ margin: '10px', color: 'black' }} onClick={() => setNewOpen(true)}>Nuevo Ticket</Button>
          </nav>
          <div className="tickets">
            {[...user.tickets].reverse().map((ticket) => 
              <div 
                key={ticket._id} 
                className="ticket" 
                style={{ backgroundColor: ticket.open ? 'green' : 'red' }}
                onClick={() => handleDetails(ticket)}
              >
                <strong>{ticket._id.substring(0,8)}</strong>
              </div>
            )}
          </div>
        </>
        }

      <TicketDetailModal open={detailOpen} setOpen={setDetailOpen} ticket={currentTicket} />
      <NewTicketModal open={newOpen} setOpen={setNewOpen} />
    </>
  )
}

export default Tickets