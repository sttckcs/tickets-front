import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Text, Button, Select, Box, useDisclosure, Modal, ModalCloseButton, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react';
import descargaIcon from '/images/descarga.png'
const BillsModal = ({ open, setOpen }) => {

  const { user } = useAuth();
  const { onClose } = useDisclosure({ defaultIsOpen: true })

  useEffect(() => {
  }, [])

  const handleClose = () => {
    onClose();
    setOpen(false);
  }

  return (
    <Modal blockScrollOnMount={false} closeOnOverlayClick={false} isOpen={open} onClose={handleClose} >
      <ModalOverlay backdropFilter='auto' backdropBlur='2px' />
      <ModalContent maxW='520px'>
        <ModalHeader>Facturas</ModalHeader>
        <ModalCloseButton />
        <ModalBody> 
          {user.facturas.length > 0 ?
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'space-between' }}>
                <p>Número de factura</p>
                <p>Fecha</p>
                <p>Importe</p>
                <p>Descargar</p>
              </div>
              {user.facturas.map(factura =>
              <div key={factura._id} style={{ display: 'flex', alignItems: 'center', padding: '0px 17px', justifyContent: 'flex-start', gap: '48px' }}>
                <span style={{ marginRight: '9px' }}>{factura.numero}</span> <span>{factura.fecha}</span><span style={{ marginRight: '40px' }}>{factura.totalImporte} €</span><a href={factura.ruta} target="_blank" rel="noreferrer"><img className='descarga-icon' src={descargaIcon} alt='descargar' /></a>
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
