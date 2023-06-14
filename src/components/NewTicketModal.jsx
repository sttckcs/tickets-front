import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Select, Checkbox, Button, useDisclosure, Modal, ModalCloseButton, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react'
import { API } from '../services/services'
import { useEffect } from 'react'

const NewTicketModal = ({ open, setOpen }) => {
  const { onClose } = useDisclosure({ defaultIsOpen: true })
  const { user, setTicket } = useAuth();
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [notify, setNotify] = useState(true)

  useEffect(() => {
    setDescription('')
    setCategory('')
  }, [open])

  const handleTicket = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('ticket/add', {
        user: user._id,
        description,
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
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Nuevo Ticket</ModalHeader>
        <ModalCloseButton color='black' />
        <ModalBody>
          <div>
            <form onSubmit={handleTicket}>
              <Select isRequired={true} variant='filled' placeholder='Elige categoría' onChange={(e) => setCategory(e.target.value)}>
                <option value='buy'>Compra</option>
                <option value='sell'>Venta</option>
                <option value='buff'>Buff</option>
              </Select>
              <textarea maxLength='80' style={{ resize: 'none', height: '150px' }} placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} required />
              <Checkbox isChecked={notify} onChange={() => setNotify(!notify)}>Recibe notificaciones por correo</Checkbox>
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
