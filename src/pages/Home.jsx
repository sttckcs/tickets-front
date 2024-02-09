import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import skins from "/images/skins.png";

const Home = () => {
  const { user } = useAuth();
  const [currentText, setCurrentText] = useState(0)
  const texts = [
    '¿Te gustaría comprar skins de Counter Strike? ¡Consulta el precio de tu skin favorita abriendo un ticket aquí! Conseguiremos la skin de tus sueños al mejor precio.'
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length)
    }, 5000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div style={{ padding: '10px 20px' }}>
      {!user
        ? <strong className='home-font'>
          Bienvenido a Todoskins, tu mercado de confianza donde podrás vender,
          comprar, intercambiar skins de CS y comprar balance de buff.163 al mejor precio
        </strong>
        :
        <div className="home">
          {/* {texts.map((text, index) => (
            <strong 
              key={index} 
              className={`home-text ${index === currentText ? 'active' : ''}`}
            >
              {text}
            </strong>
          ))
          } */}
          <h1>¿Te gustaría comprar o vender skins de <b>Counter Strike?</b></h1>
          <p>¡Consulta el precio de tu <strong className="strong-pink">skin favorita</strong> abriendo un ticket aquí!</p>
          <p>Conseguiremos la skin de tus sueños al <strong className="strong-orange">mejor precio</strong></p>
        </div>
      }
      <img src={skins} alt="skins" className='skins' loading='lazy' />
    </div>
  )
}

export default Home;
