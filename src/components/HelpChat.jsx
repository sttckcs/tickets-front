import { Button } from '@chakra-ui/react'
import { io } from 'socket.io-client'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react';
import { useEffect } from 'react';
import Draggable from 'react-draggable';

const socket = io('http://localhost:3001');

const HelpChat = () => {
  const { user } = useAuth();
  const [chatMessage, setChatMessage] = useState({ name: user.nick, msg: '', byAdmin: user.admin, room: 'HelpChat' })
  const [convos, setConvos] = useState([])
  const [target, setTarget] = useState()
  const [msgList, setMsgList] = useState([])

  useEffect(() => {
    socket.emit('userJoin', { username: user.nick, id: 'HelpChat' })
    return () => socket.emit('roomLeave', {username: user.nick, id: 'HelpChat'})
  }, [])
  

  const handleChange = (e) => {
    setChatMessage({ ...chatMessage, [e.target.name]: e.target.value })
  }


  socket.on("newMessage", newMessage => {
    if (user.admin || newMessage.byAdmin || newMessage.name === user.nick) setMsgList([...msgList, { name: newMessage.name, msg: newMessage.msg, byAdmin: newMessage.byAdmin, room: 'HelpChat', target: newMessage.target}])
  })


  const newMessageSubmit = async (e) => {
    e.preventDefault();
    const newMessage = {
      name: chatMessage.name,
      msg: chatMessage.msg,
      byAdmin: user.admin,
      room: 'HelpChat',
      target: target
    }

    socket.emit('newMessage', newMessage)

    setChatMessage({
      name: user.nick,
      msg: '',
      room: 'HelpChat',
      target: ''
    })
    
  }

  const filteredList = user.admin ? [...msgList.filter(msg => !msg.byAdmin)] : [...msgList.filter(msg => msg.target === user.nick || msg.name === user.nick)]

  const handleNewChat = async (target) => {
    if (user.admin && target !== user.nick && !convos.includes(target)) {
      setConvos(prev => [...prev, target])
      setTarget(target)
    }
  }

  const renderNewChat = (tgt) => {
    const handlePopoutClose = () => {
      setConvos((prev) =>
        prev.filter((convo) => convo !== tgt)
      );
      setMsgList(prev => prev.filter(msg => msg.name !== tgt))
    };

    return (        
      <Draggable>
        <div className='chat-popout'>
          <h1><b>{tgt}</b></h1>
          <button onClick={() => setTarget('')} style={{ fontSize: '15pt', position: 'absolute', top: '-8px', right: '32px' }}>_</button>
          <button onClick={handlePopoutClose} style={{ position: 'absolute', top: '4px', right: '12px' }}>X</button>
          <div className="help-chat">
            <div className='help-chat--chat'>
              <ul style={{ listStyleType: 'none' }}>
                {[...msgList].filter(msg => msg.byAdmin && msg.target === tgt || msg.name === tgt).map((msg, index) => {
                  const date = `${new Date().toLocaleDateString('es-ES', {day: '2-digit', month:'2-digit', year:'2-digit'})} ${new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}`
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
            {target === tgt && <form onSubmit={newMessageSubmit} style={{ display: 'flex', alignItems: 'center' }}>
              <input type='text' name='msg' value={chatMessage.msg} onChange={handleChange} required />
              <Button variant='green' size='xs' type='submit'>Enviar</Button>
            </form>}
          </div>
        </div>
      </Draggable>
    )
  }

  return (
    <div>
      <div className="help-chat">
        <div className='help-chat--chat'>
          <ul style={{ listStyleType: 'none' }}>
            {[...filteredList].filter(msg => !convos.includes(msg.name)).map((msg, index) => {
              const date = `${new Date().toLocaleDateString('es-ES', {day: '2-digit', month:'2-digit', year:'2-digit'})} ${new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}`
              return <li key={index}>
                {date === 'Invalid Date Invalid Date' ?
                  '' : 
                  <>
                    <b style={{ cursor: 'pointer' }} onClick={() => handleNewChat(msg.name)}>{msg.name} </b><span style={{ fontSize: '12px' }} >{date}</span><h5>{msg.msg}</h5>
                  </>
                }
              </li>
            })}
          </ul>
        </div>
        {!user.admin && <form onSubmit={newMessageSubmit} style={{ display: 'flex', alignItems: 'center' }}>
          <input type='text' name='msg' value={chatMessage.msg} onChange={handleChange} required />
          <Button variant='green' size='xs' type='submit'>Enviar</Button>
        </form>}
      </div>
      {user.admin && <div className='conversations'>
        {convos.map((tgt, key) => {
          const convo = [...msgList].filter(msg => msg.byAdmin && msg.target === tgt || msg.name === tgt).slice(-1)[0].name;
          if (tgt === target) return <div key={key} className='conversation-popout'>{renderNewChat(tgt)}</div>
          else return <div key={key} style={{ cursor: 'pointer', backgroundColor: convo === tgt ? 'red' : 'black' }} className='chat-min' onClick={() => setTarget(tgt)}>{tgt}</div>
        })}
      </div>}
    </div>
  )
}

export default HelpChat