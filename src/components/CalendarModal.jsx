import { LightMode, useDisclosure, Modal, ModalCloseButton, ModalOverlay, ModalContent, ModalHeader, ModalBody } from '@chakra-ui/react'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { es } from 'date-fns/locale';
const CalendarModal = ({ open, setOpen, selectionRange, handleSelect }) => {
  const { onClose } = useDisclosure({ defaultIsOpen: true })

  const handleClose = () => {
    onClose();
    setOpen(false);
  }
  
  return (
    <LightMode>
    <Modal blockScrollOnMount={false} closeOnOverlayClick={false} isOpen={open} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent maxW='610px' top='100px'>
        <ModalHeader color='black'>Escoge intervalo de fechas</ModalHeader>
        <ModalCloseButton color='black' />
        <ModalBody>
        <DateRangePicker
          className='calendar'
          locale={es}
          ranges={[selectionRange]}
          onChange={handleSelect}
        />
        </ModalBody>
      </ModalContent>
    </Modal>
    </LightMode>
  )
}

export default CalendarModal;
