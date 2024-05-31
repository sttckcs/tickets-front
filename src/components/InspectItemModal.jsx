import { useState } from 'react';
import { useDisclosure, Modal, ModalCloseButton, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@chakra-ui/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InspectItemModal = ({ isOpen, setOpen, currentItem }) => {
  const { onClose } = useDisclosure({ defaultIsOpen: true })

  const handleClose = () => {
    onClose();
    setOpen(false);
  }

  return (
    <Modal blockScrollOnMount={false} closeOnOverlayClick={false} isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay backdropFilter='auto' backdropBlur='2px' />
      <ModalContent maxW='500px'>
        <ModalHeader>{currentItem ? currentItem.marketName : ""}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            {currentItem && (
                <div className='item-details'>
                    <div className='inventory-image-container inventory-detailed-image'>
                        <img src={currentItem.previewUrl} alt={currentItem.marketName} className="inventory-item-image" />
                    </div>
                    <div className='inventory-detailed-description'>
                        <h3>{currentItem.marketName}</h3>
                        <hr />
                        <div className='inventory-detailed-info-splitter'>
                        <div className='inventory-detailed-info-splitter-1'>
                            <p>Wear: {currentItem.wearName}</p>
                            <p>Price: {currentItem.price != 0 ? currentItem.price * (1 + currentItem.pricePlusPercentege) : "A consultar"}</p>
                        </div>
                        <div className='inventory-detailed-info-splitter-1'>
                            <p>Float: {currentItem.float}</p>
                            <p>Paint Seed: {currentItem.paintSeed}</p>
                            <p>Paint Index: {currentItem.paintIndex}</p>
                            {currentItem.fade ? <p>Fade: {currentItem.fade}%</p> : <></>}
                        </div>
                        </div>
                        <hr />
                    </div>
                    <a className='item-inspect-button' href={currentItem.actionLink} target="_blank" rel="noopener noreferrer">Inspeccionar in-game</a>
                </div>
            )}
        </ModalBody>
        <ToastContainer theme="colored" position="top-center" limit={3} />
      </ModalContent>
    </Modal>
  )
}

export default InspectItemModal;
