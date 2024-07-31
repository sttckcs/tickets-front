import { Button, useDisclosure, Modal, ModalCloseButton, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react'
import { API } from '../services/services';
import { useEffect, useState } from 'react';
import { Waveform } from '@uiball/loaders';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MailModal = ({ open, setOpen }) => {
  const { onClose } = useDisclosure({ defaultIsOpen: true })
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleClose = () => {
    onClose();
    setOpen(false);
  }

  useEffect(() => {
    if (open) {
      setSubject('');
      setMessage('');
    }
}, [open]);

const handleEmail = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post('user/email', {
      subject,
      message
    });
    if (res.status === 200) toast.success('Email sent successfully!');
    handleClose();
  } catch (error) {
    toast.error(`Failed to send the email: ${error.response.data.message}`);
  }
};


return (
  <Modal blockScrollOnMount={false} closeOnOverlayClick={false} isOpen={open} onClose={handleClose} size='xl'>
    <ModalOverlay backdropFilter='auto' backdropBlur='2px' />
    <ModalContent>
      <ModalHeader>Envia un correo</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <div className='loader'>
          <Waveform color="white" />
        </div> : 
        <form onSubmit={handleEmail}>
          <input style={{ width: '500px', paddingLeft: '8px' }} type="text" placeholder="Título" value={subject} onChange={(e) => setSubject(e.target.value)} required />
          <textarea maxLength='800' value={message} style={{ resize: 'none', height: '150px' }} placeholder="Asunto" onChange={(e) => setMessage(e.target.value)} required />
          <ModalFooter>
            <Button colorScheme='blue' type='submit' mr={-1}>Enviar</Button>
          </ModalFooter>
        </form>
      </ModalBody>
      <ToastContainer theme="colored" position="top-center" limit={3} />
    </ModalContent>
  </Modal>
  )
}

export default MailModal;
