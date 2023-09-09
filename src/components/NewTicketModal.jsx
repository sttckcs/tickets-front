import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Select, Checkbox, Button, useDisclosure, Modal, ModalCloseButton, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react'
import { API } from '../services/services'
import { useEffect } from 'react'

const NewTicketModal = ({ open, setOpen }) => {
  const { onClose } = useDisclosure({ defaultIsOpen: true })
  const { user, setTicket } = useAuth();
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [notify, setNotify] = useState(true)

  const ticketMessages = {
    'buff' : `Buenas ${user.nick}, soy Aregodas. En este apartado tendrás acceso a poder comprar o vender saldo en buff.163
    Para COMPRAR saldo se puede hacer de dos formas.
    1- tendrás que listar un arma a la cantidad que te gustaria recibir, una vez lo hagas vas dentro de buff.163 a “sell” y arriba a la derecha te sale el icono de una tienda y te pone “my store”, entras ahí dentro y eso es lo que tu tienes a la venta, necesito que me pases ese link. Así yo veo que es lo que quieres vender, y te digo cuanto te cobro por venderte esa cantidad de balance, una vez realizada la transacción , a los 8 dias contactame y enviame tradeback de la skin que usamos para proceder a la transacción del saldo, ya que esa skin solo es un intermediario y te la voy a regresar.
    2- Los cupones.
    Puedo enviarte las cantidades de 1000 o 2000 yuanes ( vienen predefinidas no son customizables) que te llegan integras con las comisiones ya incluidas.
    Para este proceso, lo único que necesito es que me pases tu nombre de usuario, y con tu nombre te emitiré un cupón que puedes introducirlo dentro del apartado de ''benefit'' y se te agregaria el saldo al instante.
    los cupones són limitados, así que solo se emitirán en cantidades concretas
    En caso de que el cliente no tenga ningún artículo para listar y proceder a la transacción, puedo solicitar por soporte el abono manual de la cuantía, este proceso suele tardar 2 días desde la emisión de la solicitud, y buff.163 se reserva el derecho a rechazar la solicitud ( no ha ocurrido todavia, pero lo dejan abierto a que pueda suceder)
    -En caso de que quieras VENDER saldo, tienes que indicarme la cantidad que quieres vender, y te informaré de cuanto te podría pagar por ese balance, el proceso és el mismo que en las compras, por lo que tengo que listar a vender una skin para que me la compres, y a los 8 días me la tienes que regresar.`,
    'sell' : `Buenas ${user.nick}, soy Aregodas, la persona que se encarga de hacer los trades, este ticket es un espacio seguro donde solo tenemos acceso nosotros dos, y los admins que entran a ayudar en cualquier tipo de duda que pueda haber hasta que atienda el ticket, así que a la hora de compartir cualquier dato para proceder a los pagos, puedes estar tranquilo que tu información no se verá comprometida. Atenderé tu petición lo antes posible.
    Este es mi steam: https://steamcommunity.com/id/Aregodas (no tengo segundas cuentas , ni hay gente que me ayude con los trades, si alguien te contacta va a querer scamearte, si esto ocurre porfavor haznos llegar la información de esa persona a mi o a los moderadores para banearla y asi evitar scams)
    En este ticket podrás vender tus skins, para ello voy a necesitar que hagas lo siguiente:
    1- En este mismo ticket dime que vas a querer vender, el nombre de la skin junto a su estado y en caso de que sea StaTrack debes indicarmelo. O si quieres vender todo el inventario también puedes pedirmelo y te doy precio por todo.
    2- Enviame una solicitud a steam, arriba te he facilitado el link a mi perfil. Y comentame en el perfil el motivo de la solicitud ( ej: hola buenas tardes, te he enviado una solicitud de amistad porque quiero venderte mi cuchillo)
    3- En caso de que tu alias o nombre en la plataforma sea distinto a tu nombre de steam, tendrás que indicarme en el ticket tu nombre en steam para poder relacionarte y  acceder a tu inventario
    4- Es muy importante que a la hora de cerrar un comercio, te asegures en la confirmación del móvil que me estas enviando a mi las skins y no a otra persona, los datos que deben coincidir en la confirmación son: mi nivel de steam (264) y la fecha en la que mi cuenta se registró en steam ( 8/08/2016 )
    Recuerda haber leído el FAQ de tradeo o tu ticket puede ser eliminado`,
    'buy' : `Buenas ${user.nick}, soy Aregodas, la persona que se encarga de hacer los trades, este ticket es un espacio seguro donde solo tenemos acceso nosotros dos y los Admins que entran a ayudar en cualquier tipo de duda que pueda haber hasta que atienda el ticket.
    Así que a la hora de compartir cualquier dato para proceder a los pagos, puedes estar tranquilo que tu información no se verá comprometida. Atenderé tu petición lo antes posible.
    Este es mi steam: https://steamcommunity.com/id/Aregodas
    (No tengo segundas cuentas ni hay gente que me ayude con los trades, si alguien te contacta va a querer scamearte, si esto ocurre porfavor haznos llegar la información de esa persona a mi o a los moderadores para banearla y asi evitar scams)
    
    • En este ticket tendrás acceso a comprar skins.
    Para comprar skins tienes que hacer lo siguiente:
    
    ➣ Indicar el nombre de la skin que quieres; Su estado y con o sin StatTrack. (en caso de querer una fase especifica como en los doppler, o un % de fade. Deberás indicarlo)
    ➣ Agregarme a steam y comentarme en el perfil (ej: hola buenas , te he enviado solicitud porque quiero comprarte una skin). En caso de no tener el mismo nombre en Steam y en la plataforma, tendrás que indicarmelo en el ticket para que no haya fallos en el envio de la skin.
    
    Puedes pagarme la skin por transferencia bancaria. Acepto skins como forma de pago. Una vez me hayas hecho el pago de tu pedido (o enviado la skin que has usado como método de pago)
    En caso de no tenerla en mi inventario, procederia a comprarla de buff.163, por lo que desde el momento en que la compro y me la envian, no podré enviartela hasta dentro de los siguientes 8 dias ya que tiene una restricción de steam (tradeban),
    por lo que en este caso, el ticket se quedaria abierto en espera de que se cumplan esos 8 dias de restricción hasta que pueda enviarte la skin. Una vez el item esté libre y se pueda tradear, taggeame @Aregodas en el ticket y enviame la oferta de intercambio.`
  }

  useEffect(() => {
    setDescription('')
    setCategory('')
  }, [open])


  const handleTicket = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('ticket/add', {
        user: user._id,
        description,
        category,
        notify
      });
      if (res.status === 200) {
        setTicket(true)
      }
      handleClose();
    } catch (error) {
      alert(`Failed to create ticket: ${error.response.data.message}`);
    }
  };

  const handleClose = () => {
    onClose();
    setOpen(false);
  }
  
  const handleCategory = (e) => {
    setCategory(e.target.value)
    setDescription(e.target.value === 'buff' ? ticketMessages.buff : e.target.value === 'buy' ? ticketMessages.buy : ticketMessages.sell)
  }

  return (
    <Modal blockScrollOnMount={false} closeOnOverlayClick={false} isOpen={open} onClose={handleClose} size='xl'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Nuevo Ticket</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div>
            <form onSubmit={handleTicket}>
              <Select isRequired={true} variant='filled' placeholder='Elige categoría' onChange={handleCategory}>
                <option value='buy'>Compra</option>
                <option value='sell'>Venta</option>
                <option value='buff'>Balance</option>
              </Select>
              <Checkbox mt={3} isChecked={notify} onChange={() => setNotify(!notify)}>Recibe notificaciones por correo</Checkbox>
              <ModalFooter style={{ padding: '12px 0px' }}>
                <Button variant='blue' type='submit'>
                  Añadir ticket
                </Button>
              </ModalFooter>
            </form>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default NewTicketModal;
