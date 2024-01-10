import { NavLink } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const MainChat = ({ ticket }) => {
  const { user } = useAuth();
  return (
    <div key={ticket._id} style={{ width: '180px', height: '158px', overflowY: 'hidden', padding: '10px', backgroundColor: !user.admin ? 'green' : ticket.adminLast ? 'gray' : 'green' }}>
      <NavLink to={`/chat/${ticket._id}`}><strong style={{ color: 'white' }}>{ticket._id.substring(0, 8)} - {ticket.category === 'buff' ? 'Balance' : ticket.category === 'sell' ? 'Venta' : 'Compra'}</strong></NavLink>
      <div>
        {ticket.messages.slice(-1).map((msg, index) => {
          const date = `${new Date(msg.time).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })} ${new Date(msg.time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`
          return <li style={{ listStyleType: 'none' }} key={index}>
            {date === 'Invalid Date' ?
              '' :
              <div style={{ color: 'white' }}>
                <b>{msg.name} </b><span style={{ fontSize: '12px' }} >{date}</span><h5>{msg.msg}</h5>
              </div>
            }
          </li>
        })}
      </div>
    </div>
  )
}

export default MainChat