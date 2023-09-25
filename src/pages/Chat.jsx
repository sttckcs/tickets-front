import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext"
import { Waveform } from "@uiball/loaders";
import MainChat from "../components/MainChat";

const Chat = () => {
  const { user, setTicket, loading } = useAuth();

  useEffect(() => {
    setTicket(true)
  }, [setTicket])

  return (
    <>
    {loading ?
      <div className="loader">
        <Waveform color="white" />
      </div> :
      <>
        {!user.admin ? 
          <div className="chat-box">
            {user.tickets.map(ticket => {
              if (ticket.open && ticket.messages.length > 0) return (
                <MainChat ticket={ticket} key={ticket._id} />
              )
            })}
          </div> : 
          <div className="chat-box">
            {user.chats.map(ticket => {
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