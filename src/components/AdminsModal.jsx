import { useDisclosure, Modal, ModalCloseButton, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react';
import { API } from '../services/services';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminsModal = ({ open, setOpen }) => {
  const [admins, setAdmins] = useState([]);
  const { onClose } = useDisclosure({ defaultIsOpen: true })

  useEffect(() => {
    const getAdmins = async () => {
      try {
        const res = await API.post(
          'user/admins'
        );
        setAdmins(res.data);
      } catch (error) {
        toast.error('Error obteniendo los admins')
        setAdmins([]);
      }
    }

    getAdmins();
  }, [])

  const handleClose = () => {
    onClose();
    setOpen(false);
  }

  return (
    <Modal blockScrollOnMount={false} closeOnOverlayClick={false} isOpen={open} onClose={handleClose} >
      <ModalOverlay backdropFilter='auto' backdropBlur='2px' />
      <ModalContent maxW='500px'>
        <ModalHeader>Lista de admins</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {admins &&
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
                <h1>Nombre</h1>
                <h1>Correo</h1>
              </div>
              {admins.map(admin => (
                <div key={admin.email} style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 20px' }}>
                  <span>{admin.nick}</span><span>{admin.email}</span>
                </div>
                )
              )}
            </div>
          }
        </ModalBody>
        <ModalFooter>
        </ModalFooter>
        <ToastContainer theme="colored" position="top-center" limit={3} />
      </ModalContent>
    </Modal>
  )
}

export default AdminsModal;
