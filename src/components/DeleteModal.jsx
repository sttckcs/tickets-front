import { Button, useDisclosure, Modal, ModalCloseButton, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react'

const DeleteModal = ({ open, setOpen, handleDelete }) => {
  const { onClose } = useDisclosure({ defaultIsOpen: true })

  const handleClose = () => {
    onClose();
    setOpen(false);
  }

  return (
    <Modal blockScrollOnMount={false} closeOnOverlayClick={false} isOpen={open} onClose={handleClose} size='sm'>
      <ModalOverlay backdropFilter='auto' backdropBlur='2px' />
      <ModalContent>
        <ModalHeader>Eliminar cuenta</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div>
            <h1>Seguro que quieres eliminar tu cuenta?</h1>
          </div>
        </ModalBody>
        <ModalFooter>
          <div>
            <Button style={{ margin: '10px' }} onClick={handleDelete}>Confirmar</Button>
            <Button style={{ margin: '10px' }} onClick={handleClose}>Salir</Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DeleteModal;
