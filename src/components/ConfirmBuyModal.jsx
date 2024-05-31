import { useDisclosure, Modal, ModalCloseButton, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@chakra-ui/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConfirmBuyModal = ({ isOpen, setOpen, onConfirm }) => {

  const { onClose } = useDisclosure({ defaultIsOpen: true })

  const handleClose = () => {
    onClose();
    setOpen(false);
  }

  return (
    <Modal blockScrollOnMount={false} closeOnOverlayClick={false} isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay backdropFilter='auto' backdropBlur='2px' />
      <ModalContent maxW='500px'>
        <ModalHeader>¿Quieres solicitar comprar este arma?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <p>Por favor, confirma si deseas proceder con la solicitud de compra.</p>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onConfirm}>Confirmar</Button>
          <Button variant="ghost" onClick={handleClose}>Cancelar</Button>
        </ModalFooter>
        <ToastContainer theme="colored" position="top-center" limit={3} />
      </ModalContent>
    </Modal>
  )
}

export default ConfirmBuyModal;
