import { useAuth } from '../contexts/AuthContext'
import { useDisclosure, Modal, ModalCloseButton, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react';
import descargaIcon from '/images/descarga.png'
const BillsModal = ({ open, setOpen }) => {

  const { user } = useAuth();
  const { onClose } = useDisclosure({ defaultIsOpen: true })

  const handleClose = () => {
    onClose();
    setOpen(false);
  }

  return (
    <Modal blockScrollOnMount={false} closeOnOverlayClick={false} isOpen={open} onClose={handleClose} >
      <ModalOverlay backdropFilter='auto' backdropBlur='2px' />
      <ModalContent maxW='500px'>
        <ModalHeader>Transacciones</ModalHeader>
        <ModalCloseButton />
        <ModalBody> 
          {user.facturas.length > 0 ?
            <>
              <div className='lista-facturas'>
                <p>Número de factura</p>
                <p>Fecha</p>
                <p>Importe</p>
                <p>Descargar</p>
              </div>
              {user.facturas.reverse().map(factura =>
              <div key={factura._id} className='factura'>
                <span>{factura.numero}</span> <span>{factura.fecha}</span><span>{factura.totalImporte} €</span><a href={factura.ruta} target="_blank" rel="noreferrer"><img className='descarga-icon' src={descargaIcon} alt='descargar' loading="lazy" /></a>
              </div>)}
            </>
           : 'No hay facturas disponibles'}
        </ModalBody>
        <ModalFooter>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default BillsModal;
