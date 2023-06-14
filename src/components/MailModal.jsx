import { Button, useDisclosure, Modal, ModalCloseButton, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react'
import { API } from '../services/services';
import { useEffect, useState } from 'react';
import { Waveform } from '@uiball/loaders';

const MailModal = ({ open, setOpen }) => {
  const { onClose } = useDisclosure({ defaultIsOpen: true })
  const [emails, setEmails] = useState();
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleClose = () => {
    onClose();
    setOpen(false);
  }

  useEffect(() => {
    const getEmails = async () => {
      try {
        const res = await API.get(
          'user/emails'
        );
        setEmails(res.data);
      } catch (error) {
        setEmails(null);
      }
      setLoading(false)
    };

    if (open) {
      getEmails();
      setSubject('');
      setMessage('');
    }
}, [open]);

const handleEmail = async (e) => {
  e.preventDefault();
  console.log(emails);
  try {
    const res = await API.post('user/email', {
      emails,
      subject,
      message
    });
    if (res.status === 200) alert('Email sent successfully!');
    handleClose();
  } catch (error) {
    alert(`Failed to send the email: ${error.response.data.message}`);
  }
};


return (
  <Modal blockScrollOnMount={false} closeOnOverlayClick={false} isOpen={open} onClose={handleClose} size='xl'>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Envia un correo</ModalHeader>
      <ModalCloseButton color='black' />
      <ModalBody>
        {loading ?
          <div className='loader'>
            <Waveform />
          </div> : 
          <form onSubmit={handleEmail}>
            <input style={{ width: '500px' }} type="text" placeholder="Título" value={subject} onChange={(e) => setSubject(e.target.value)} required />
            <textarea maxLength='800' value={message} style={{ resize: 'none', height: '150px' }} placeholder="Asunto" onChange={(e) => setMessage(e.target.value)} required />
            <ModalFooter>
              <Button colorScheme='blue' type='submit'>Enviar</Button>
            </ModalFooter>
          </form>
        }
      </ModalBody>
    </ModalContent>
  </Modal>
  )
}

export default MailModal;
