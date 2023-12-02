import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext"
import { Waveform } from "@uiball/loaders";
import MainChat from "../components/MainChat";

const Chat = () => {
  const { user, setTicket, loading } = useAuth();

  useEffect(() => {
    console.log('chats', user.chats[0].messages[user.chats[0].messages.length - 1].time);
    setTicket(true)
  }, [setTicket])

  const formatTickets = (tickets) => {
    return tickets.sort((a, b) => {
      const dateA = new Date(a.messages[a.messages.length - 1].time);
      const dateB = new Date(b.messages[b.messages.length - 1].time);
      return dateB - dateA
      }).sort((a, b) => a.adminLast - b.adminLast)
  }

  return (
    <>
    {loading ?
      <div className="loader">
        <Waveform color="white" />
      </div> :
      <>
        {!user.admin ? 
          <div className="chat-box">
            {formatTickets(user.tickets).map(ticket => {
              if (ticket.open && ticket.messages.length > 0) return (
                <MainChat ticket={ticket} key={ticket._id} />
              )
            })}
          </div> : 
          <div className="chat-box">
            {formatTickets(user.chats).map(ticket => {
              if (ticket.open) return (
                <MainChat ticket={ticket} key={ticket._id} />
              )
            })}
          </div>
        }
      </>
    }
    </>
  )
}

export default Chat