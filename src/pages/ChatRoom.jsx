import { useState, useEffect } from 'react';
import { io } from 'socket.io-client'
import { useAuth } from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';
import { API } from '../services/services';
import { Waveform } from '@uiball/loaders';
import { Button } from '@chakra-ui/react'

const socket = io('http://localhost:3001');

const ChatRoom = ({ tId, handleChat }) => {
  const { id } = useParams();
  const _id = tId ? tId : id
  const { user, loading, ticket, setTicket, notis, setNotis, setInChat } = useAuth()
  const [owner, setOwner] = useState(null)
  const [access, setAccess] = useState(false)  
  const [chatMessage, setChatMessage] = useState({ name: user.nick, msg: '', room: id })
  const [msgList, setMsgList] = useState([])

  useEffect(() => {
    const verifyAccess = async () => {
      if (user.admin || user.tickets.find(ticket => ticket._id === _id)) {
        try {
          const res = await API.post(
            'ticket/open', { id: _id }
          );
          if (res.data.open) {
            setAccess(true)
            if (res.data.user.nick !== user.nick) setOwner(res.data.user.nick)
            else setOwner(user.nick)
          }
        } catch (error) {
          console.log(error)
        }
      }
    }

    const getMessages = async () => {
      try {
        const res = await API.post(
          'ticket/messages', { id: _id }
        );
        setMsgList(res.data.messages)
      } catch (error) {
        console.log(error)
      }
    };
    setInChat(true);
    if (notis.includes(_id)) {
      setNotis(notis.filter(id => id !== _id))
    }
    verifyAccess();
    getMessages();
    socket.emit('userJoin', { username:user.nick, id: _id })
    return () => setInChat(false)
  }, [_id, user.admin, user.nick, user.tickets, loading, ticket])
  
  socket.on('newMessage', () => {
    setTicket(true)
  })

  const handleChange = (e) => {
    setChatMessage({ ...chatMessage, [e.target.name]: e.target.value })
  }

  const newMessageSubmit = async (e) => {
    e.preventDefault();
    const newMessage = {
      name: chatMessage.name,
      email: user.email,
      msg: chatMessage.msg,
      room: _id,
      byAdmin: user.admin
    }

    try {
      await API.post('ticket/newmessage', {
        newMessage
      });

    } catch (error) {
      alert(`Error saving message: ${error.response.data.message}`);
    }

    socket.emit('newMessage', newMessage)

    setChatMessage({
      name: user.nick,
      msg: '',
    })

    handleChat(_id)
    
    setTicket(true)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {loading ?
        <div className={`${tId ? 'modal-loader' : 'loader'}`}>
          <Waveform />
        </div> :
        access ? 
          <div className={`${tId ? 'chat-ticket' : 'chat-window'}`}>
            {tId ? '' : <div>
              <h2><b>Chat de</b> {_id.substring(0,8)} <b>Ticket de</b> {owner}</h2>
            </div>}
            <h1><b>Mensajes</b></h1>
            <div id={`${tId ? 'chatMessagesTicket' : 'chatMessagesWindow'}`}>
              <ul style={{ listStyleType: 'none' }}>
                {msgList.map((msg, index) => {
                  const date = `${new Date(msg.time).toLocaleDateString('es-ES', {day: '2-digit', month:'2-digit', year:'2-digit'})} ${new Date(msg.time).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}`
                  return <li key={index}>
                    {date === 'Invalid Date Invalid Date' ?
                      '' : 
                      <>
                        <b>{msg.name} </b><span style={{ fontSize: '12px' }} >{date}</span><h5>{msg.msg}</h5>
                      </>
                    }
                  </li>
                })}
              </ul>
            </div>
            <form onSubmit={newMessageSubmit}>
              <input type='text' name='msg' value={chatMessage.msg} onChange={handleChange} required />
              <Button variant='green' type='submit'>Enviar</Button>
            </form>
          </div>
        : ''
      }
    </div>
  )
}

export default ChatRoom