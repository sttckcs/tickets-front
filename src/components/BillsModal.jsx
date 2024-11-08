import { useAuth } from '../contexts/AuthContext'
import { useDisclosure, Modal, ModalCloseButton, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react';
import descargaIcon from '/images/descarga.png'
import { socketURL } from '../services/services';
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
              {user.facturas.reverse().map(factura => {
                const { _id, numero, fecha, totalImporte } = factura;
                return (
                  <div key={_id} className='factura'>
                    <span>{numero}</span> <span>{fecha}</span><span>{totalImporte} €</span><a href={`${socketURL}/user/bills/${_id}`} target='_blank' rel="noreferrer"><img className='descarga-icon' src={descargaIcon} alt='descargar' /></a>
                  </div>
                )
              })}
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
