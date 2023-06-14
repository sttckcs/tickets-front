import { Button, useDisclosure, Modal, ModalCloseButton, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react';
const TermsModal = ({ openTerms, setOpenTerms, acceptedTerms, setAcceptedTerms }) => {
  const { onClose } = useDisclosure({ defaultIsOpen: true })
  const modalContentRef = useRef(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  useEffect(() => {
    const modalContent = modalContentRef.current;

    if (modalContent) modalContent.addEventListener('scroll', handleScroll);
    return () => {
      if (modalContent) modalContent.removeEventListener('scroll', handleScroll)
    };
  }, []);

  const handleClose = () => {
    onClose();
    setOpenTerms(false);
  }

  const handleAccept = () => {
    setAcceptedTerms(true);
    handleClose();
  };

  const handleScroll = () => {
    const element = modalContentRef.current;

    if (element) {
      const isAtBottom =
        element.scrollHeight - element.scrollTop === element.clientHeight;

      setIsScrolledToBottom(isAtBottom);
    }
  };
  
  return (
    <Modal blockScrollOnMount={false} closeOnOverlayClick={false} isOpen={openTerms} onClose={handleClose} right='100px'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Términos y condiciones</ModalHeader>
        <ModalCloseButton color='black' />
        <ModalBody  
          ref={modalContentRef} 
          onScroll={handleScroll} 
          style={{
              maxHeight: '300px',
              overflowY: 'auto',
            }}>
          <div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus, cupiditate fugiat expedita dolor autem natus dolorem! Hic eos perspiciatis impedit, quod dignissimos sint sunt perferendis veniam explicabo architecto itaque at.
              Magni eum voluptatum quae autem, repellendus atque quisquam delectus ducimus praesentium! Ab ullam enim sequi quasi, exercitationem expedita corrupti repellat doloremque quia minus, odio laudantium ipsum quidem. Sed, consequatur maiores.
              Molestiae, consequuntur. Quis eius, reiciendis deserunt illo dolores optio deleniti nulla dolorem similique, praesentium cum, nihil ducimus nostrum? Voluptatum praesentium est perferendis saepe qui doloremque porro ipsum reprehenderit rerum expedita.
              Culpa corrupti beatae molestias quaerat aspernatur praesentium eveniet at, dicta obcaecati, atque animi? Placeat illum, quia aut maxime fugit et quam, voluptatem vitae deleniti, aperiam accusantium accusamus repellat inventore minus.
              Dolorem optio quae nesciunt quis placeat, officiis minus maxime corporis exercitationem quo, voluptatem nobis hic soluta nemo incidunt laudantium doloribus rerum, labore reiciendis natus! Ratione quibusdam voluptatum autem fugiat corrupti.
              Consequatur, molestias dolor quis minus earum excepturi et autem harum eum commodi pariatur magni doloremque soluta consectetur eaque possimus voluptates veniam asperiores modi quam expedita a necessitatibus ea recusandae. Officiis!
              Hic ipsa illum quam perferendis praesentium reiciendis inventore, asperiores veniam voluptates et corrupti nisi, molestiae commodi corporis, ad fugit sapiente nam! Temporibus mollitia vero accusantium! Ea laborum eius nihil ducimus?
              Perferendis reiciendis, ad laudantium hic dolorum cupiditate distinctio ipsum porro aperiam, aliquid, sunt fugit veritatis quaerat pariatur illum doloremque repellendus tenetur fuga! Neque quam facere doloremque delectus aut debitis esse.
              Voluptatum, repellat nisi culpa dolores incidunt expedita ipsum ullam numquam doloribus at, perspiciatis eligendi minima minus nobis omnis consequatur delectus laborum voluptates eveniet ut velit earum obcaecati veritatis! Deleniti, et!
              Eum, magnam excepturi quod quo quae atque cum corporis dolorum ea, id sapiente nihil hic est eveniet reprehenderit libero neque. Laboriosam voluptatibus iure debitis inventore modi incidunt in, enim laudantium.
              Consectetur vitae provident blanditiis sapiente, neque quas impedit asperiores? Obcaecati itaque facilis eos consectetur explicabo a placeat? Repellendus odit cupiditate aliquam reprehenderit, pariatur esse nisi officia blanditiis, possimus, dolores dolorum?
              Vel asperiores dolores repudiandae tempora reiciendis molestias ad fuga illum deserunt autem voluptatem nostrum blanditiis eos repellat laborum veniam hic ullam, ratione minus labore qui et maiores. A, at alias.
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={handleAccept}
            isDisabled={!isScrolledToBottom || acceptedTerms}
            variant='blue'
            mt={3}
          >
            {acceptedTerms ? 'Aceptados' : 'Aceptar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default TermsModal;
