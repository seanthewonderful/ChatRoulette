import { useState } from "react"
import Login from "../components/Login"
import Register from "../components/Register"

export default function LoginRegister() {
  const [register, setRegister] = useState(false)

  return (
    <div id="login-register-container">
      {register ? <Register setRegister={setRegister} /> : <Login setRegister={setRegister} />}
    </div>
  )
}
