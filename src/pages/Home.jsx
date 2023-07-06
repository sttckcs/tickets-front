import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

const Home = () => {
  const { user } = useAuth();
  const [currentText, setCurrentText] = useState(0)
  const texts = [
    'Te gustaria saber cuánto podrias ganar vendiendo tu inventario de CS:GO? Abre un ticket y el trader te responderá muy pronto dándote el mejor precio que puedes obtener por tus skins.','Te gustaría comprar skins de CS:GO? no dudes en consultar el precio de la skin que más te gusta abriendo un ticket aquí, y te conseguiremos la skin de tus sueños al mejor precio de mercado'
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
    <div style={{ padding: '10px 20px'}}> 
      {!user 
      ? <strong>
        Bienvenido a Todoskins, tu mercado de confianza donde podrás vender,
        comprar, intercambiar skins de CS:GO y comprar balance de buff.163 al mejor precio
        </strong>
      :
        <div className="home">
          {texts.map((text, index) => (
            <strong 
              key={index} 
              className={`home-text ${index === currentText ? 'active' : ''}`}
            >
              {text}
            </strong>
          ))
          }
        </div>
       }
    </div>
  )
}

export default Home;
