import { useDisclosure, Modal, ModalCloseButton, ModalOverlay, ModalContent, ModalHeader, ModalBody } from '@chakra-ui/react'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { es } from 'date-fns/locale';
const CalendarModal = ({ open, setOpen, selectionRange, handleSelect, getStats }) => {
  const { onClose } = useDisclosure({ defaultIsOpen: true })

  const handleClose = () => {
    if (getStats) getStats();
    onClose();
    setOpen(false);
  }
  
  return (
    <Modal lockScrollOnMount={false} closeOnOverlayClick={false} isOpen={open} onClose={handleClose}>
      <ModalOverlay backdropFilter='auto' backdropBlur='2px' />
      <ModalContent maxW='610px' top='100px'>
        <ModalHeader>Escoge intervalo de fechas</ModalHeader>
        <ModalCloseButton />
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
  )
}

export default CalendarModal;
