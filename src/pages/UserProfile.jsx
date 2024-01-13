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
  const [profileUser, setProfileUser] = useState(null)
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
        setProfileUser(res.data);
      } catch (error) {
        setProfileUser(null);
      }
      setLoading(false)
    };

    const getTickets = async () => {
      try {
        const res = await API.post(
          'ticket/all'
        );
        if (res.data !== tickets) setTickets(res.data);
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
      nick: profileUser.nick
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
        {
          _id,
          open
        }
      );
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (_id) => {
    try {
      await API.post(
        'ticket/delete',
        { _id }
      );
      setDetailOpen(false);
    } catch (error) {
      console.log(error)
    }
  }

  const handleChat = async (_id) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket._id === _id) {
        return { ...ticket, adminLast: profileUser.admin }
      }
      return ticket;
    })
    setCurrentTicket(updatedTickets.filter(ticket => ticket._id === _id)[0])
    setTickets(updatedTickets)
  }

  return (
    <>
      {loading ?
        <div className="loader-sm">
          <Waveform color="white" />
        </div> :
        profileUser ?
          <>
            <div className='perfil-admin'>
              <Profile user={profileUser} />
              {profileUser.idNeverlate !== 0 &&
                <div>
                  <strong style={{ fontSize: '3rem', color: 'rgb(200, 200, 255)' }}>Otros datos</strong>
                  <div className="profile">
                    <h1>Apellidos: <span>{profileUser.apellidos}</span></h1>
                    <h1>Dirección: <span>{profileUser.direccionFacturacion}</span></h1>
                    <h1>Código Postal: <span>{profileUser.codigoPostalFacturacion}</span></h1>
                    <h1>País: <span>{profileUser.paisFacturacion}</span></h1>
                    <h1>Empresa: <span>{profileUser.empresa ? 'si' : 'no'}</span></h1>
                  </div>
                </div>
              }
            </div>
            <h2 style={{ fontSize: '2.25rem', color: 'rgb(200, 200, 255)' }}><b>Tickets</b></h2>
            <div className="tickets">
              {[...profileUser.tickets].reverse().map((ticket) =>
                <div
                  key={ticket._id}
                  className="ticket"
                  style={{ backgroundColor: !ticket.open ? 'red' : ticket.adminLast ? 'gray' : 'green' }}
                  onClick={() => handleDetails(ticket)}
                >
                  <strong>{ticket._id.substring(0, 8)}</strong>
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