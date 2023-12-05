import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "../services/services";
import { Waveform } from "@uiball/loaders";
import Profile from "../components/Profile";
import TicketDetailModal from "../components/TicketDetailModal";
import { useAuth } from "../contexts/AuthContext";

const UserProfile = () => {
  const { id } = useParams();
  const { setTicket } = useAuth();
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [detailOpen, setDetailOpen] = useState(false)
  const [currentTicket, setCurrentTicket] = useState(null);
  const [tickets, setTickets] = useState([])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.post(
          'user/id',
          { id }
        );
        setUser(res.data);
      } catch (error) {
        setUser(null);
      }
      setLoading(false)
    };

    const getTickets = async () => {
      try {
        const res = await API.get(
          'ticket/all'
        );
        if(res.data !== tickets) setTickets(res.data);
      } catch (error) {
        setTickets([]);
      }
      setLoading(false)
    };

    fetchUser();
    getTickets();
    
    setTicket(true)
  }, [id]);

  const handleDetails = (ticket) => {
    const _id = ticket.user;
    const updatedTicket = {
      _id: _id,
      nick: user.nick
    }
    ticket.user = updatedTicket;
    console.log('updatedTicket', updatedTicket);
    setCurrentTicket(ticket)
    setDetailOpen(true)
  }

  const handleClose = async (_id, open) => {
    try {
      await API.post(
        'ticket/close',
        {_id,
        open}
      );
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (_id) => {
    try {
      await API.post(
        'ticket/delete',
        {_id}
      );
      setDetailOpen(false);
    } catch (error) {
      console.log(error)
    }
  }

  const handleChat = async (_id) => {
    const updatedTickets = tickets.map(ticket => {
      if(ticket._id === _id) {
        return { ...ticket, adminLast: user.admin }
      }
      return ticket;
    })
    setCurrentTicket(updatedTickets.filter(ticket => ticket._id === _id)[0])
    setTickets(updatedTickets)
  }

  return (
    <>
      {loading ?
        <div className="loader">
          <Waveform color="white" />
        </div> :
        user ?
          <>
            <Profile user={user} />
            <h2 style={{ fontSize: '2.25rem' }}><b>Tickets</b></h2>
            <div className="tickets">
            {[...user.tickets].reverse().map((ticket) => 
              <div 
                key={ticket._id} 
                className="ticket" 
                style={{ backgroundColor: !ticket.open ? 'red' : ticket.adminLast ? 'gray' : 'green' }} 
                onClick={() => handleDetails(ticket)}
              >
                <strong>{ticket._id.substring(0,8)}</strong>
              </div>
            )}
          </div>
          <TicketDetailModal open={detailOpen} setOpen={setDetailOpen} ticket={currentTicket} handleChat={handleChat} handleCloseT={handleClose} handleDelete={handleDelete} />
          </>
           : 
          <strong>Error 404: Usuario no encontrado</strong>
      }
    </>
  )
}

export default UserProfile