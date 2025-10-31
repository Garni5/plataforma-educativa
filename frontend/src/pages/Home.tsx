import { useEffect, useState } from "react"
import { getHola, type HolaResponse } from "../services/prueba"
import "./Home.css" // importa los estilos

function Home() {
  const [mensaje, setMensaje] = useState<string>("Cargando...")

  useEffect(() => {
    getHola()
      .then((data: HolaResponse) => setMensaje(data.mensaje))
      .catch(() => setMensaje("Error al conectar con el backend"))
  }, [])

  return (
    <div className="container">
      {/* Lado izquierdo - formulario */}
      <div className="left">
        <div className="form-box">
          <h2>Inicie sesión</h2>
          <form>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="submit">Login</button>
          </form>
          <p className="register">
            <a href="#">Register</a>
          </p>
          <p className="mensaje">{mensaje}</p>
        </div>
      </div>

      {/* Lado derecho - imagen + texto */}
      <div className="right">
        <div className="overlay"></div>
        <h1>
          Plataforma Educativa <br /> Programación Python
        </h1>
      </div>
    </div>
  )
}

export default Home

