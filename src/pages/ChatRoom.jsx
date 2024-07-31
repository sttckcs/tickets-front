import { useState, useEffect } from 'react';
import { io } from 'socket.io-client'
import { useAuth } from '../contexts/AuthContext';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { API, socketURL } from '../services/services';
import { Waveform } from '@uiball/loaders';
import { Button, useColorModeValue, Input } from '@chakra-ui/react'
import EditIcon from '/images/edit.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io(socketURL, { path: '/api/socket.io/', transports: ['websocket'], secure: true });

const ChatRoom = ({ tId, handleChat, open }) => {
  const { id } = useParams();
  let _id = tId ? tId : id
  const { user, ticket, setTicket, notis, setNotis, setInChat } = useAuth()
  // const textColor = useColorModeValue('#E2E8F0', '#2D3748')
  // const bgColor = useColorModeValue('#2D3748', '#E2E8F0')
  const textColor = useColorModeValue('#2D3748', '#E2E8F0')
  const bgColor = useColorModeValue('#E2E8F0', '#2D3748')
  const [owner, setOwner] = useState(null)
  const [loading, setLoading] = useState(true)
  const [access, setAccess] = useState(false)  
  const [chatMessage, setChatMessage] = useState({ name: user.nick, msg: '', room: id })
  const [msgList, setMsgList] = useState([])
  const [previewImage, setPreviewImage] = useState(null);
  const [blob, setBlob] = useState(null);
  const [editId, setEditId] = useState('');
  const [editMsg, setEditMsg] = useState('');

  const handlePaste = (e) => {
    const items = e.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        const imageUrl = URL.createObjectURL(blob);
        setBlob(blob);
        setPreviewImage(imageUrl);
        break;
      }
    }
  };


  const clearImagePreview = () => {
    setPreviewImage(null);
    setBlob(null);
  };


  const handleImageUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('image', blob);

      const res = await API.post(
        'ticket/image',
         formData,
        { headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const newMessage = {
        name: chatMessage.name,
        msg: res.data.imageUrl,
        room: _id,
      }

      handleNewMessage(newMessage);
    } catch (error) {
      console.error('Error subiendo la imagen:', error.response.data.message);
    }
  };


  useEffect(() => {
    let intervalId;
    const verifyAccess = async () => {
      if (user.admin || user.tickets.find(ticket => ticket._id === _id)) {
        try {
          const res = await API.post(
            'ticket/open', { id: _id }
          );
          if (res.data.open) {
            setAccess(true)
            setCurrentTicket(res.data)
            if (res.data.user.nick !== user.nick) {
              setOwner(res.data.user.nick)
              setOid(res.data.user._id)
            }
          } else setAccess(false)
        } catch (error) {
          toast.error(error)
        }
      }
    }

    const getMessages = async () => {
      try {
        const res = await API.post(
          'ticket/messages', { id: _id }
        );
        if (msgList !== res.data.messages) setMsgList(res.data.messages)
      } catch (error) {
        toast.error(error)
      }
      setLoading(false)
    };

    setInChat(true);
    if (notis.includes(_id)) {
      setNotis(notis.filter(id => id !== _id))
    }
    verifyAccess();
    if (access) getMessages();
    
    if (open || id) {
      intervalId = setInterval(getMessages, 1000); 
    } else {
      return () => clearInterval(intervalId);
    }
    
    socket.emit('userJoin', { username:user.nick, id: _id })
    return () => {
      clearInterval(intervalId);
      setInChat(false);
    }
  }, [_id, user.admin, user.nick, user.tickets, ticket, open])
  
  socket.on('newMessage', () => {
    setTicket(true)
  })

  const handleChange = (e) => {
    setChatMessage({ ...chatMessage, [e.target.name]: e.target.value })
  }
  
  const handleNewMessage = async (newMessage) => {
    try {
      await API.post('ticket/newmessage', {
        newMessage, id: user._id
      });

    } catch (error) {
      toast.error(`Error guardando el mensaje: ${error.response.data.message}`);
    }

    socket.emit('newMessage', newMessage)

    if (!id) handleChat(_id);
    setTicket(true)
    setPreviewImage(null)
    setBlob(null)
  }

  const newMessageSubmit = (e) => {
    e.preventDefault();
    if (previewImage) handleImageUpload()
    else if (chatMessage.msg) {
      const newMessage = {
        name: chatMessage.name,
        msg: chatMessage.msg,
        room: _id,
      }

      setChatMessage({
        name: user.nick,
        msg: '',
      })
      
      handleNewMessage(newMessage);
    }
  }

  const messageDelete = async (message) => {
    try {
      await API.post('ticket/deletemessage', {
        message, _id
      });
    } catch (error) {
      toast.error(`Error borrando el mensaje`);
    }
  }

  const handleEdit = (msg) => {
    if (editId === msg.time) {
      setEditId(null);
      setEditMsg('');
    } else {
      setEditId(msg.time);
      setEditMsg(msg.msg)
    }
  } 

  const handleEditSubmit = async (time) => {
    const message = msgList.filter(msg => msg.time === time);
    try {
      await API.post('ticket/editmessage', {
        message, edit: editMsg, _id
      });
    } catch (error) {
      toast.error(`Error editando el mensaje`);
    }
    setEditId(null);
    setEditMsg('');
  }
  
  const handleDelete = (time) => {
    const message = msgList.filter(msg => msg.time === time);
    console.log('message', message);
    // setMsgList(prev => {
    //   return prev.filter(msg => msg !== message);
    // })
    messageDelete(message);
  }

  const renderMessage = (message) => {
    const urlRegex = /(\b(?:https?:\/\/|www\.)\S+\b)/g;
    const cloudinaryUrlRegex = /https:\/\/res\.cloudinary\.com/g;

    const parts = message.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        if (part.match(cloudinaryUrlRegex)) return <img key={index} className='imagen-chat' src={part} alt='imagen chat' />
        else return (
          <a key={index} href={part.startsWith('www.') ? `http://${part}` : part} style={{ color: 'rgb(75, 87, 218)' }} target='_blank' rel='noopener noreferrer'>{part}</a>
        )
      } else {
        return <span key={index}>{part}</span>
      }
    })
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {loading ?
        <div className={`${tId ? 'loader-ticket' : 'loader-sm'}`}>
          <Waveform color="white" />
        </div> :
        access ? 
          <div className={`${tId ? 'chat-ticket' : 'chat-window'}`}>
            {tId || !user.admin ? '' : <div style={{ fontSize: '2rem' }}>
              <h2><b>Chat de</b><span style={{ fontWeight: '600' }}> {_id.substring(0,8)}</span> <b>-</b> <b> Ticket de</b> <span style={{ fontWeight: '600' }}>{owner}</span></h2>
            </div>}
            <h1 style={{ fontSize: '1.75rem', margin: '10px' }}><b>Mensajes</b></h1>
            <div id={`${tId ? 'chatMessagesTicket' : 'chatMessagesWindow'}`}>
              <ul style={{ listStyleType: 'none' }}>
                {msgList.map((msg, index) => {
                  const date = `${new Date(msg.time).toLocaleDateString('es-ES', {day: '2-digit', month:'2-digit', year:'2-digit'})} ${new Date(msg.time).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}`
                  return <li key={index} style={{ padding: '5px 0px', width: '100%' }}>
                    {date === 'Invalid Date Invalid Date' ?
                      '' :
                      <>
                        <div style={{ margin: '6px 0px 1px 0px', color: `${(msg.name == 'Aregodas' || msg.name == 'admin') ? 'red' : 'green'}`, position: 'relative' }}>
                          <b>{msg.name} </b><span style={{ fontSize: '1rem', paddingLeft: '4px' }} >{date}</span>
                          {user.admin && (msg.name == 'Aregodas' || msg.name == 'admin') && 
                            <>
                              <img src={EditIcon} className='edit-icon' style={{ width: '20px' }} onClick={() => handleEdit(msg)} alt='edit-icon' />
                              <div className='gg-trash' onClick={() => handleDelete(msg.time)}></div>
                            </>
                          }
                        </div>
                        {editId === msg.time
                          ? <><input className='edit-text' type='text' value={editMsg} onChange={(e) => setEditMsg(e.target.value)} /><Button onClick={() => handleEditSubmit(msg.time)}>Enviar</Button></>
                          : <h5 style={{ textAlign: 'justify', color: 'white' }}>{renderMessage(msg.msg)}</h5>
                        }
                      </>
                    }
                  </li>
                })}
              </ul>
            </div>
            <form onSubmit={newMessageSubmit} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
              <Input type='text' onPaste={handlePaste} style={{ backgroundColor: bgColor, color: textColor, marginRight: '20px', fontSize: '1.25rem' }} _placeholder={{ color: textColor }} placeholder='Introduce tu mensaje' name='msg' value={chatMessage.msg} onChange={handleChange} />
              <Button type='submit'>Enviar</Button>
            </form>
            <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '20px' }}>
              {previewImage && (
                <div>
                  <img
                    src={previewImage}
                    alt="Pasted Preview"
                    className="preview-image"
                  />
                  <button onClick={clearImagePreview} className="remove-preview-button">
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        : ''
      }
      <ToastContainer theme="colored" position="top-center" limit={3} />
    </div>
  )
}

export default ChatRoom