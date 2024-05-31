import { useState } from 'react';
import { useDisclosure, Modal, ModalCloseButton, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@chakra-ui/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditPriceModal = ({ isOpen, setOpen, item, onConfirm }) => {
  const { onClose } = useDisclosure({ defaultIsOpen: true })
  const [price, setPrice] = useState('');

  const handleClose = () => {
    onClose();
    setOpen(false);
  }

  const handleConfirm = () => {
    onConfirm(Number(price));
    setPrice('');
    handleClose();
  }

  const calculateNewPrice = () => {
    const pricePercentage = Number(price) / 100;
    return item ? (item.price * (1 + pricePercentage)).toFixed(2) : 0;
  }

  return (
    <Modal blockScrollOnMount={false} closeOnOverlayClick={false} isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay backdropFilter='auto' backdropBlur='2px' />
      <ModalContent maxW='500px'>
        <ModalHeader>¿Quieres cambiar el precio de {item ? item.marketName : ""}?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <p>El precio actual es: {item ? `${item.pricePlusPercentege}% (${item.price * (1 + item.pricePlusPercentege)}€)` : ""}</p>
            <input 
              type="number"
              placeholder='New Price (%)'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <p>El nuevo precio será: {calculateNewPrice()}€</p>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleConfirm}>Confirmar</Button>
          <Button variant="ghost" onClick={handleClose}>Cancelar</Button>
        </ModalFooter>
        <ToastContainer theme="colored" position="top-center" limit={3} />
      </ModalContent>
    </Modal>
  )
}

export default EditPriceModal;
