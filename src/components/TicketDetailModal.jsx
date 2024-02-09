import { Button, Checkbox, useDisclosure, Modal, ModalCloseButton, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react'
import { useAuth } from '../contexts/AuthContext'
import { NavLink } from 'react-router-dom';
import ChatRoom from '../pages/ChatRoom';
import { useState } from 'react';
import { API } from '../services/services';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TicketDetailModal = ({ open, setOpen, ticket, handleChat, handleCloseT, handleDelete }) => {
  const { onClose } = useDisclosure({ defaultIsOpen: true })
  const { user } = useAuth();
  const [notify, setNotify] = useState(false);
  const [marked, setMarked] = useState(false);

  useEffect(() => {
    if (ticket) {
      setNotify(user.admin ? ticket.notifyAdmin : ticket.notifyUser)
      setMarked(ticket.marked)
    }
  }, [ticket, user.admin])

  const handleClose = () => {
    setOpen(false);
    onClose();
  }

  const handleMark = async () => {
    try {
      const res = await API.post(
        'ticket/mark', {
        _id: ticket._id
      }
      );
      if (res.data.marked) toast.success('Ticket desmarcado');
      else toast.success('Ticket marcado');
      setMarked(!res.data.marked);
    } catch (error) {
      toast.error('Ha habido un error')
    }
  }

  const handleNotify = async () => {
    setNotify(!notify)
    try {
      await API.post(
        'ticket/notify', {
        id: ticket._id,
        admin: user.admin,
        notify: !notify
      }
      );
      toast.success('Notificaciones actualizadas')
    } catch (error) {
      toast.error('Ha habido un error')
    }
  }

  return (
    <>
      <Modal blockScrollOnMount={false} closeOnOverlayClick={false} isOpen={open} onClose={handleClose} size='full'>
        <ModalOverlay backdropFilter='auto' backdropBlur='2px' />
        <ModalContent>
          <ModalHeader>Detalles del ticket</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {ticket &&
              <div style={{ fontSize: '1.5rem' }}>
                <h1>Id: {ticket._id.substring(0, 8)}</h1>
                {user.admin && <h1>Creado por: <NavLink to={`${ticket.user._id}/profile`}><strong>{ticket.user.nick}</strong></NavLink></h1>}
                <h2>Categoría: {ticket.category === 'sell' ? 'venta' : ticket.category === 'buy' ? 'compra' : 'balance'}</h2>
                <h2>Fecha: {new Date(ticket.createdAt).toLocaleDateString('es-ES')} {new Date(ticket.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</h2>
                <h2>Estado: {user.admin ? ticket.open && !ticket.adminLast ? 'Pendiente' : ticket.open && ticket.adminLast ? 'Leído' : 'Cerrado' : ticket.open ? 'Abierto' : 'Cerrado'}</h2>
                <Checkbox isChecked={notify} onChange={handleNotify}><p style={{ fontSize: '1.25rem', marginRight: '20px' }} >Recibe notificaciones por correo</p></Checkbox>
                {user.admin && <Checkbox isChecked={marked} onChange={handleMark}><p style={{ fontSize: '1.25rem' }} >Ticket marcado</p></Checkbox>}
                <ChatRoom handleChat={handleChat} tId={ticket._id} open={ticket.open} />
                <ModalFooter style={{ padding: '0px' }}>
                  {user.admin &&
                    <>
                      <Button variant='blue' onClick={() => handleCloseT(ticket._id, ticket.open)} style={{ margin: '0px 10px 0px 4px' }}>{ticket.open ? 'Cerrar' : 'Abrir'}</Button>
                      <Button variant='red' onClick={() => handleDelete(ticket._id)} style={{ margin: '4px 0px' }}>Eliminar</Button>
                    </>
                  }
                </ModalFooter>
              </div>
            }
          </ModalBody>
          <ToastContainer theme="colored" position="top-center" limit={3} />
        </ModalContent>
      </Modal>
    </>
  )
}

export default TicketDetailModal;
