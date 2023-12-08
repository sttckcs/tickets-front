import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Select, Checkbox, Button, useDisclosure, Modal, ModalCloseButton, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react'
import { API } from '../services/services'
import { useEffect } from 'react'

const NewTicketModal = ({ open, setOpen }) => {
  const { onClose } = useDisclosure({ defaultIsOpen: true })
  const { user, setTicket } = useAuth();
  const [category, setCategory] = useState('');
  const [notify, setNotify] = useState(true);

  useEffect(() => {
    setCategory('')
  }, [open])


  const handleTicket = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('ticket/add', {
        user: user._id,
        category,
        notify
      });
      if (res.status === 200) {
        setTicket(true)
      }
      handleClose();
    } catch (error) {
      alert(`Failed to create ticket: ${error.response.data.message}`);
    }
  };

  const handleClose = () => {
    onClose();
    setOpen(false);
  }

  return (
    <Modal blockScrollOnMount={false} closeOnOverlayClick={false} isOpen={open} onClose={handleClose} size='xl'>
      <ModalOverlay backdropFilter='auto' backdropBlur='2px' />
      <ModalContent>
        <ModalHeader>Nuevo Ticket</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div>
            <form onSubmit={handleTicket}>
              <Select isRequired={true} fontSize='1.25rem' variant='filled' placeholder='Elige categoría' onChange={(e) => setCategory(e.target.value)}>
                <option value='buy'>Compra</option>
                <option value='sell'>Venta</option>
                <option value='buff'>Balance</option>
              </Select>
              <Checkbox mt={5} isChecked={notify} onChange={() => setNotify(!notify)}><p style={{ fontSize: '1.1rem' }}>Recibe notificaciones por correo</p></Checkbox>
              <ModalFooter style={{ padding: '12px 0px' }}>
                <Button variant='blue' type='submit'>
                  Añadir ticket
                </Button>
              </ModalFooter>
            </form>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default NewTicketModal;
