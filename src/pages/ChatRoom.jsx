import { useState, useEffect } from 'react';
import { io } from 'socket.io-client'
import { useAuth } from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';
import { API, socketURL } from '../services/services';
import { Waveform } from '@uiball/loaders';
import { Button, useColorModeValue, Input } from '@chakra-ui/react'

const socket = io(socketURL);

const ChatRoom = ({ tId, handleChat }) => {
  const { id } = useParams();
  const _id = tId ? tId : id
  const { user, loading, ticket, setTicket, notis, setNotis, setInChat } = useAuth()
  // const textColor = useColorModeValue('#E2E8F0', '#2D3748')
  // const bgColor = useColorModeValue('#2D3748', '#E2E8F0')
  const textColor = useColorModeValue('#2D3748', '#E2E8F0')
  const bgColor = useColorModeValue('#E2E8F0', '#2D3748')
  const [owner, setOwner] = useState(null)
  const [access, setAccess] = useState(false)  
  const [chatMessage, setChatMessage] = useState({ name: user.nick, msg: '', room: id })
  const [msgList, setMsgList] = useState([])
  const [previewImage, setPreviewImage] = useState(null);
  const [blob, setBlob] = useState(null);

  const handlePaste = (e) => {
    const items = e.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        const imageUrl = URL.createObjectURL(blob);
        setBlob(blob);
        setPreviewImage(imageUrl);
        console.log('imageURL', imageUrl);
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
        email: user.email,
        msg: res.data.imageUrl,
        room: _id,
        byAdmin: user.admin
      }

      handleNewMessage(newMessage);
    } catch (error) {
      console.error('Error subiendo la imagen:', error.response.data.message);
    }
  };


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
    
    const getMessagesPeriodically = () => {
      getMessages();
      const intervalId = setInterval(getMessages, 1000); 
  
      return () => clearInterval(intervalId);
    };
    
    getMessagesPeriodically();
    socket.emit('userJoin', { username:user.nick, id: _id })
    return () => setInChat(false)
  }, [_id, user.admin, user.nick, user.tickets, loading, ticket])
  
  socket.on('newMessage', () => {
    setTicket(true)
  })

  const handleChange = (e) => {
    setChatMessage({ ...chatMessage, [e.target.name]: e.target.value })
  }
  
  const handleNewMessage = async (newMessage) => {
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
    setPreviewImage(null)
    setBlob(null)
  }

  const newMessageSubmit = (e) => {
    e.preventDefault();
    if (previewImage) handleImageUpload()
    else if (chatMessage.msg) {
      const newMessage = {
        name: chatMessage.name,
        email: user.email,
        msg: chatMessage.msg,
        room: _id,
        byAdmin: user.admin
      }

      handleNewMessage(newMessage);
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {loading ?
        <div className={`${tId ? 'modal-loader' : 'loader'}`}>
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
                  return <li key={index} style={{ padding: '5px 0px' }}>
                    {date === 'Invalid Date Invalid Date' ?
                      '' : 
                      <>
                        <div style={{ margin: '6px 0px 1px 0px', color: `${(msg.name == 'Aregodas' || msg.name == 'admin') ? 'red' : 'green'}` }}><b>{msg.name} </b><span style={{ fontSize: '1rem', paddingLeft: '4px' }} >{date}</span></div>
                        {msg.msg.startsWith('https://res.cloudinary.com/') ? <img className='imagen-chat' src={msg.msg} alt='imagen' /> : <h5 style={{ textAlign: 'justify', color: 'white' }}>{msg.msg}</h5>}
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
            {/* <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '20px' }}>
              <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>Selecciona una imagen</label>
              {image && <p>{image.name}</p>}
              <input type="file" id="image-upload" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
              <Button onClick={handleImageUpload}>Subir imagen</Button>
            </div> */}
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
    </div>
  )
}

export default ChatRoom