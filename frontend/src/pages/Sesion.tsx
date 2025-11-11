import React from 'react'

function Sesion() {
    const Logout = async () => {
        try{
           await fetch("http://localhost:5000/auth/logout", {
  method: "POST",
  credentials: "include" // <--- muy importante
});

localStorage.removeItem("token"); // si usas JWT

        }catch(error){
            console.log(error);
        }
    }
  return (
    <div>Sesion

         <button onClick={Logout}>cerrarSesion</button>
    </div>
   
  )
}

export default Sesion