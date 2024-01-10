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
        element.scrollHeight - element.scrollTop < element.clientHeight + 20;

      setIsScrolledToBottom(isAtBottom);
    }
  };

  return (
    <Modal blockScrollOnMount={false} closeOnOverlayClick={false} isOpen={openTerms} onClose={handleClose} right='100px'>
      <ModalOverlay backdropFilter='auto' backdropBlur='2px' />
      <ModalContent>
        <ModalHeader>Términos y condiciones</ModalHeader>
        <ModalCloseButton />
        <ModalBody
          ref={modalContentRef}
          onScroll={handleScroll}
          style={{
            maxHeight: '300px',
            overflowY: 'auto',
          }}>
          <div>
            <p>
              CONDICIONES DE USO

              PRIMERO. CONDICIONES GENERALES

              •	Los términos aquí descritos junto a cualquier otra indicación publicada en la web TODOSKINS.COM es un contrato (“acuerdo”) entre usted (en adelante usted como “usuario”) y SKINDREAM nombre de la empresa respecto a las condiciones asociadas con su uso del sitio web TODOSKINS.COM y de los servicios ofrecidos dentro de dicho sitio web para la venta de bienes virtuales para su uso en juegos de ordenador Counter strike 2 (cs2) Le pedimos encarecidamente que lea atentamente todos los términos y condiciones que se detallan a continuación antes de utilizar el sitio web. Al utilizarlo o acceder al sitio web, usted acepta todos los términos y condiciones establecidos en este Acuerdo. Si, en algún momento, no acepta o entiende que no puede aceptar los términos de este Acuerdo, debe dejar de acceder o utilizar el sitio web. Por lo que su utilización en todo momento será bajo su propia responsabilidad siendo enteramente vinculantes para el usuario.

              •	TODOSKINS.COM es un portal de internet dedicado al intercambio de contenido virtual en el que su función es la de facilitar el contacto entre usuarios para el intercambio de contenido digital.

              •	El uso de TODOSKINS.COM y del Servicio tiene restricción de edad. Por lo que usted acuerda, declara y garantiza que dispone de la mayoría de edad en la jurisdicción donde reside (al menos 18 años de edad) asimismo se declara plenamente capaz y legalmente competente para utilizar TODOSKINS.COM y, por tanto que no violarán ningún otro acuerdo del que usted sea parte o residente.  Si no tiene al menos dieciocho (18) años y/o la mayoría de edad en su país de residencia le pedimos encarecidamente que abandone nuestra web y que no utilice ninguno de nuestros servicios.

              •	Al utilizar el sitio web, usted también acepta, declara y garantiza que (según la ley aplicable y la ley de su país de residencia):
              a. Tiene toda la experiencia y el conocimiento necesarios y relevantes para tratar con elementos digitales y/o sistemas basados en el intercambio de productos virtuales, tiene una comprensión completa de su marco, es consciente de todos los pros, contras, riesgos y restricciones de todo tipo, incluido el marco normativo de su país de procedencia asociados con los activos digitales (incluidos su compra y uso) así como la experiencia y el conocimiento necesarios y relevantes para comprarlos, usarlos y administrarlos, y son los únicos responsables de su uso.
              b. En caso de ser usted una empresa, organización gubernamental u otra entidad legal, tiene el derecho, poder y autoridad para actuar en nombre de dicha empresa, organización gubernamental u otra entidad legal y vincularlas a estos Términos.
              c. Usted es la única persona que controla sus credenciales (dirección de correo electrónico, contraseña, nik, …) y no actúa en nombre de ningún tercero.
              d. No utilizará el sitio web para realizar actividades ilegales ni participar en ninguna actividad ilegal o fraudulenta. Usted será la única persona responable del uso indebido para actividades ilícitas y/o fraudulentas.
              e. Usted es la única persona que controla sus credenciales (dirección de correo electrónico, contraseña, nik,…) y no actúa en nombre de ningún tercero y que cualquier pérdida de sus credenciales, suplantación de identidad o cualquier otra situación que le hubiera supuesto la pérdida de la confidencialidad y de acceso, será bajo su única responsabilidad
              5. La existencia en nuestra web de servicios de otros socios, juegos, proveedores, así como enlaces hacia o desde otros sitios web y servicios de terceros no se considerará que los propietarios recomienden dichos servicios a no ser que se indique expresamente, sino que se realizan para facilitar al usuario algunos servicios que pudieran resultarle de interés. La web no se responsabiliza ni garantiza ni implica de ningún modo la seguridad de ningún otro sitio web a excepción de este propio ni así como de la conformidad de dicho sitio web de terceros con sus expectativas. Además, el propietario del sitio web no es responsable de mantener ningún material al que se haga referencia desde o hacia otro sitio, y no ofrece garantías, recomendaciones o soporte para ese sitio o servicio respectivo. El propietario del sitio web no asume ninguna obligación en caso de daño o pérdida, o cualquier otro impacto, que resulte directa o indirectamente del uso de cualquier contenido, bienes o servicios disponibles en o a través de dichos sitios web y recursos de terceros. Se le indica que estos servicios pueden tener sus propias políticas (incluidas las respectivas políticas de privacidad) rechazando toda responsabilidad u obligación por políticas de otras webs ajenas a la nuestra. Es por esto por lo que le recomendamos que consulte las políticas de dichos servicios antes de utilizarlos, animándole a  leer y seguir sus respectivas políticas. Si hay discrepancias entre dichas políticas de terceros y cualquiera de las políticas del propietario del sitio web, prevalecerán las políticas del propietario del sitio web.

              SEGUNDO. REGISTRO Y CUENTA DEL USUARIO

              •	Los usuarios pueden registrarse mediante una cuenta de correo electrónico de usuario y contraseña
              •	Para un correcto uso se deberá registrar en el sitio web y crear una cuenta individual (la “Cuenta”) con su nombre de usuario y contraseña respectivos. Se le otorga acceso a una Cuenta en el momento que proporcione toda la información requerida por TODOSKINS.COM, la autorización del propietario del sitio web y luego de la creación exitosa de una Cuenta. Usted garantiza que toda la información proporcionada con el fin de crear su cuenta y/o cualquier otro uso del sitio web es válida, actual, completa y precisa. La información fraudulenta y/o errónea será bajo su única responsabilidad. Los datos de registro y otra información sobre usted están sujetos a la Política de privacidad adjunta disponible en el sitio web.
              •	No se permite la creación de cuentas por bots ni métodos automatizados.
              •	No se permite la creación de más de una cuenta por cada usuario salvo que se diga lo contrario.
              •	En caso de compartir cuenta con otros usuarios será bajo su propia responsabilidad exonerando a TODOSKINS.COM y a su propietario derivado de cualquier uso indebido.
              •	Se recomienda la autenticación en doble factor para garantizar la seguridad de su cuenta. El Propietario no será responsable de por el acceso no autorizado a su cuenta por parte de terceros, incluido, entre otros, el secuestro de sesión y otros incidentes relacionados.
              •	La web se reserva el derecho de prohibir el uso a cualquier usuario de cualquier país o territorio que sea objeto de sanciones económicas o comerciales de Andorra.
              •	Usted acepta expresamente que es el único responsable del uso de su nombre de usuario y contraseña para la cuenta, de cualquier dato de registro proporcionado para la creación de la cuenta y de cualquier acción realizada durante cualquier uso de su cuenta de usuario. Usted acepta mantener la privacidad de su información de inicio de sesión y contraseña y notificar inmediatamente al propietario del sitio web sobre cualquier actividad no autorizada de la cuenta. Usted puede conocer y modificar su información de inicio de sesión respectivamente siendo usted el único responsable de cualquier pérdida o daño que usted o el propietario del sitio web puedan sufrir como resultado de no hacerlo.
              •	Puede desactivar su registro en el sitio web en cualquier momento enviando la solicitud respectiva en el formulario de contacto del sitio web. Podemos cancelar su uso y registro en el sitio web o congelar cualquier transacción en el sitio web en cualquier momento si viola estos términos o cualquier otra política de TODOSKINS.COM , a nuestro exclusivo criterio y sin previo aviso y sin ninguna responsabilidad u obligación adicional de ningún tipo a usted o a cualquier otra parte, cuando consideremos que dichas medidas son razonables y/o necesarias en una situación particular, sin ningún reembolso ni responsabilidad.
              •	Al crear una cuenta, también acepta recibir comunicaciones electrónicas del Propietario del sitio web (por ejemplo, por correo electrónico) siendo parte de la relación entre el usuario y la web. Usted acepta que cualquier aviso, acuerdo, divulgación u otra comunicación que le enviemos electrónicamente cumplirá con todos los requisitos legales de comunicación, incluido, entre otros, que dichas comunicaciones se realicen por escrito. También podemos enviarle comunicaciones con ánimos promocionales por correo electrónico,
              •	Tras 12 meses de inactividad, el propietario del sitio web puede suspender su cuenta sin ninguna responsabilidad u obligación adicional de ningún tipo para con usted o cualquier otra parte. Aún así, dentro de los 6 meses a partir de la fecha en que se suspendió su cuenta, podrá solicitar la reactivación de su cuenta enviando la solicitud respectiva en el formulario de contacto del sitio web, pasado este periodo el propietario del sitio web puede cancelar su cuenta en el sitio web sin opción de restaurar ello, sin ninguna responsabilidad u obligación adicional de ningún tipo para con usted o cualquier otra parte y sin ningún reembolso.
              •	Para garantizar el acceso fluido y la disponibilidad de sus servicios para todos los usuarios del sitio web, el Propietario del sitio web se reserva el derecho de cancelación a los usuarios que considere razonablemente que realicen un uso de los Servicios injusto, como por ejemplo exceder el uso promedio, causar una congestión significativa de la red, interrupción o es fraudulento, sospechoso, o un uso no ordinario, o cualquier otro modo adverso afectar a los Servicios o el trabajo del Sitio web. Si lo considera, a su entera discreción, sin notificarle por adelantado y sin ninguna responsabilidad hacia usted, se reserva el derecho de suspender o limitar su uso del Servicio o cualquier volumen o característica del mismo. Asimismo se reserva el derecho a modificar estas políticas cuando lo considere oportuno. Por la presente usted reconoce y acepta expresamente su política.
              •	No se permiten actos que supongan insulto u ofensas a la comunidad, la moral pública o la decencia, o realizar cualquier otro acto que pueda dañar la imagen del titular del sitio web, o realizar cualquier otra cosa que pueda razonablemente encontrarse por el propietario del sitio web para constituir discurso de odio o infringir de otro modo los derechos de otros usuarios.
              •	Cualquier y todo el contenido que sea parte, aliente, elogie, promueva cualquier tipo de violencia (incluida la violencia gráfica), incitación al odio, odio contra individuos o grupos, ayude a organizaciones criminales violentas o tenga la intención de amenazar, escandalizar o disgustar a los Usuarios, o contenido que En TODOSKINS.COM no se permite animar a otros a cometer actos violentos, actividades peligrosas o ilegales que supongan un riesgo de daño físico grave o la muerte. El propietario del sitio web puede eliminar todo el contenido del sitio web sin informar al usuario y sin ninguna responsabilidad.

              TERCERO. OBLIGACIONES PARA USUARIOS COMERCIALES

              •	Si usted utiliza la web con ánimos comerciales será el único responsable del tratamiento fiscal y contable que realice a través del portal web.

              CUARTO. CONTENIDO DIGITAL PERMITIDO.

              •	La web está diseñada a los efectos de portal informativo para que los distintos usuarios intercambien su información y contenidos digitales que oferten.
              •	La web no se hace responsable del cumplimiento de los acuerdos que tomen independientemente los propios usuarios.
              •	No se podrá realizar intercambio de material ilícito, y queda totalmente prohibido el uso e intercambio de cualquier material pornográfico, pedófilo, drogas, o cualquier información relativa a servicios o contenidos prohibidos por la legalidad vigente. Por lo que si los titulares de la web son conocedores que algún usuario realiza cualquier acto de esta naturaleza será inmediatamente expulsado y llevado ante las autoridades pertinentes toda la información que se disponga para su tratamiento legal.

              QUINTO. IMPUESTOS Y COSTOS.

              1. Los usuarios son responsables de cualquier tarifa, impuesto u otros costos asociados con los pagos, ventas, compras y entrega de artículos que resulten de las regulaciones legales (locales) aplicables, así como de los cargos impuestos por su relación con los proveedores de servicios de pago.
              2. El usuario es responsable de la identificación y el pago de todos los impuestos y otros cargos que se le imponen sobre o con respecto a los pagos, ventas, compras y entregas y de cualquier arancel o impuesto formal impuesto por sus funcionarios de aduanas locales u otro organismo regulador y resultante. de la ley aplicable.

              SEXTO. SERVICIOS REALIZADOS POR LA WEB

              Compra/venta de los artículos, skins y complementos del juego Counter - Strike 2 ( cs2)

              SEPTIMO. POLITICA DE DEVOLUCIÓN Y REEMBOLSO

              OCTAVO. ENTREGA DEL CONTENIDO DIGITAL

              1. Salvo indicación en contra, el contenido digital comprado en LA WEB se entrega mediante descarga en los dispositivos elegidos por los Usuarios.
              2. Los usuarios reconocen y aceptan que para descargar y/o utilizar el Producto, los dispositivos previstos y su respectivo software (incluidos los sistemas operativos) deben ser legales, de uso común, actualizados y consistentes con las normas actuales del mercado. estándares.
              3. Los usuarios reconocen y aceptan que la capacidad de descargar el Producto adquirido puede estar limitada en tiempo y espacio.

              NOVENO. DERECHO DE LOS USUARIOS

              •	Solicitud de Baja. Los usuarios podrán realizar en cualquier momento la baja como usuarios de la web, y solicitar la baja de sus datos de la base de datos según la normativa vigente en materia de protección de datos.
              •	Los usuarios no podrán reclamar a la web o a sus titulares ningún tipo de responsabilidad ni penalización en el caso de que otros usuarios hubieran incumplido cualquier pacto realizado entre ellos.
              •	Usuarios de la UE.  Los Usuarios reconocen y aceptan que el Propietario simplemente proporciona a los Usuarios la infraestructura técnica y las características incorporadas en la web.

              DÉCIMO. CANCELACIÓN DE LA CUENTA

              Los usuarios pueden cancelar su cuenta en cualquier momento enviando una solicitud para cerrar la cuenta mediante el botón correspondiente en la configuración de la cuenta. La solicitud del usuario de cerrarla provocará la cancelación inmediata, lo que resulta en el cierre de sesión del usuario y en la imposibilidad de iniciar sesión en la cuenta y continuar usándola a partir de ese momento.

              UNDÉCIMO. DEREHOS DEL PROPIETARIO. TODOS LOS DERECHOS

              •	El Propietario posee y se reserva todos los derechos de propiedad intelectual del portal web.
              •	El Propietario se reserva el derecho de tomar cualquier medida adecuada para proteger sus intereses legítimos, incluso negar a los Usuarios el acceso a este Sitio web o al Servicio, rescindir contratos, informar cualquier mala conducta realizada a través de este Sitio web o el Servicio a las autoridades competentes, como autoridades judiciales o administrativas que no respeten las condiciones anteriormente descritas

              DUODECIMO. RESPONSABILIDAD E INDEMNIZACIÓN

              •	El propietario web no se hace responsable por el uso de sus contenidos por parte del usuario. Este lo realiza bajo su cuenta y riesgo. La paralización de los servicios de forma temporal por cuestiones de mantenimiento, errores, causas de fuerza mayor o cualquier motivo que pudiera dejar inoperativa la web no derivarán ninguna penalización ni indemnización a favor del usuario.
              •	El propietario velará por el correcto funcionamiento del portal así como por los intereses de todos los usuarios pero cualquier pérdida que pudiera resultar por la utilización de la web, el usuario exonera completamente tanto al portal como a sus propietarios. El usuario entiende completamente lo contenido en este punto.
              •	A pesar de que esta web desea ayudar a sus usuarios a sacar mayor provecho de en las transacciones de contenido digital, el usuario es plenamente consciente de que la utilización de la web puede ocasionarle pérdidas económicas importantes por lo que exonera completamente a la web y a sus propietarios de cualquier responsabilidad.
              •	Los propietarios de la web le advierte de que el uso continuo de ella pudiera derivar en casos de ludopatía por lo que le insta a que haga un uso responsable y en caso de necesitar ayuda acuda a un profesional para ser tratado de forma activa. La web y sus propietarios quedan exonerados de todos los procesos que pudieran desarrollar los usuarios por la utilización de los servicios.
              •	En la medida que permita la ley aplicable, la web no ofrece garantía alguna ni declaración respecto al servicio ofertado, incluyendo que pueda satisfacer al usuario o no, ni que funcionará con cualquier hardware o software proporcionado por terceros, ni que el servicio será ininterrumpido, sin problemas, errores, segura o que deba corregir todos los errores que pudieran existir. La web ofrece el servicio según esté y según disponibilidad, utilizando el usuario por su cuenta y riesgo. La web no fomenta, ni aprueba ni promueve el uso comercial del servicio. Tampoco garantiza que cualquier descarga esté libre de virus o malware informático que pudiera afectar al rendimiento de sus dispositivos y/o dañarlos. El usuario siempre lo utilizará bajo su cuenta y riesgo.En cualquier caso, y si por ley se le derivara responsabilidad alguna, el límite máximo será de 100€ en total. Las limitaciones de responsabilidad anteriores no se verán afectadas si algún recurso proporcionado aquí no cumple con su propósito esencial, previsible o no, e incluso si la web hubiera advertido de tales daños.
              •	Al aceptar los Términos, el usuario exonera total e incondicionalmente e intemporalmente al propietario, sus funcionarios, directores, empleados y agentes de todos y cada uno de los reclamos, demandas y daños (reales o consecuentes, directos o indirectos), ya sean conocidos o desconocidos, de todo tipo y naturaleza relacionados que surjan de cualquier manera relacionados con la disputas entre usuarios, o cualquier otra persona o entidad. También lo exonera por el uso de los Servicios o Productos, incluidos, entre otros, todos y cada uno de los reclamos de que dicho uso viola cualquiera de los derechos de propiedad intelectual, derechos de autor, derechos de publicidad o privacidad, derechos morales o derechos de atribución e integridad del Vendedor, o de la actividad de otros Usuarios en la web, incluida, entre otras, la capacidad jurídica de los Usuarios, su capacidad para completar una transacción o pagar los costos asociados. El Usuario reconoce y acepta que el Propietario no tiene control ni será responsable de ningún daño resultante del uso o mal uso por parte de cualquier otra persona o entidad de cualquier Producto.
              • Si el Propietario tiene conocimiento de algún producto que supuestamente no cumple con los términos, el Propietario o cualquier persona dependiente del mismo puede investigar el problema y tratar de encontrar la solución al mismo en los términos de su propia política, sin tener responsabilidad alguna ante los usuarios por la realización o no realización de dichas actividades. El Propietario tiene el derecho absoluto de eliminar sin previo aviso cualquier producto que estuviera bajo su control que considere pertinente. Los usuarios dan su consentimiento para dicha eliminación  y renuncian a tomar cualquier acción  contra el Propietario por ello. El Propietario se reserva el derecho de no ser responsable por no almacenar el contenido publicado u otros materiales que los Usuarios puedan transmitir a través de la web. Los usuarios serán los únicos responsable de preservar copias de cualquier dato, material, contenido o información que dicho usuario publique en la web
              • Sin perjuicio de su papel como mero intermediario técnico descrito anteriormente, el Propietario podrá proporcionar servicios adicionales a cualquiera de las partes de dicha interacción para las disputas que existieran entre los usuarios, sin tener la obligación de resolver los conflictos que entre ellos existieran y exonerado completamente de sus acciones y/o conflictos.
              • El Titular realiza sus máximos esfuerzos para que los contenidos facilitados en la web no infrinjan disposiciones legales aplicables ni derechos de terceros. Sin embargo, puede haber situaciones en las que no siempre sea posible lograrlo. En tales casos, sin perjuicio de los derechos de los Usuarios, se ruega que informen preferentemente de las causas relacionadas utilizando los datos de contacto proporcionados en este documento.
              •	Cualquier indicación dada por el propietario o la web, así como por parte de sus trabajadores, filiales, o cualquier otra parte que pudiera pertenecer al propietario de forma directa y/o indirecta creará garantía alguna, salvo que esté expresamente establecida en las presentes condiciones.
              • Esta sección de limitación de responsabilidad se aplicará en la máxima medida permitida por la ley en la jurisdicción aplicable, ya sea que la supuesta responsabilidad se base en contrato, agravio, negligencia, responsabilidad objetiva o cualquier otra base, incluso si la empresa ha sido informada de la posibilidad de tal daño. Algunas jurisdicciones no permiten la exclusión o limitación de daños incidentales o consecuentes, por lo tanto, es posible que las limitaciones o exclusiones anteriores no se apliquen al Usuario.
              • Los términos otorgan al Usuario derechos legales específicos, y el Usuario también puede tener otros derechos que varían de una jurisdicción a otra. Las exenciones de responsabilidad, exclusiones y limitaciones de responsabilidad según los términos no se aplicarán en la medida en que lo prohíba la ley aplicable.
              • El Usuario se compromete a defender, indemnizar y eximir de responsabilidad al Propietario y sus subsidiarias, afiliadas, funcionarios, directores, agentes, marcas compartidas, socios, proveedores y empleados de y contra todos y cada uno de los reclamos o demandas, daños, obligaciones, pérdidas, responsabilidades, costos o deudas y gastos, incluidos, entre otros, honorarios y gastos legales, que surjan del uso y acceso del usuario al Servicio, incluidos cualquier dato o contenido transmitido o recibido por el Usuario. También por la violación por parte del Usuario de estos términos, incluido, entre otros, el incumplimiento por parte del Usuario de cualquiera de las representaciones y garantías establecidas en estos términos, así como de cualquier derecho de terceros, incluidos, entre otros, cualquier derecho de privacidad o derechos de propiedad intelectual, ley, norma o reglamento estatutario. Además de cualquier contenido que se envíe desde la cuenta del Usuario, incluido el acceso de terceros con el nombre de usuario, contraseña u otra medida de seguridad únicos del Usuario, si corresponde, incluida, entre otras, información engañosa, falsa o inexacta; por la mala conducta intencionada del usuario; así como por disposición legal por parte del Usuario o sus
              • El Propietario no intermedia, modera, promueve ni interviene en interacciones, acuerdos o transacciones entre Usuarios y, por lo tanto, no asume ninguna responsabilidad por dichas interacciones entre Usuarios, incluido el cumplimiento de las obligaciones de los Usuarios.

              DECIMOCUARTA. NORMATIVA LEGAL APLICABLE

              •	Para todas aquellas cuestiones que pudieran surgir, se atenderá a la normativa vigente establecida en el país de residencia de la web (Andorra)
              •	Los usuarios aceptan que en caso de litigio, se someten a las leyes de residencia del propietario de la web.
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
