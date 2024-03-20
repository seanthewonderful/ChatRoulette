import axios from "axios"

export default function Login({ setRegister }) {

  const registerClick = () => {
    setRegister(true)
  }

  return (
    <>
      <form className="login-register-form" id="login-form">
        <h1>Login</h1>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" placeholder="Username" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" placeholder="Password" />
        <input type="submit" value="Login" />
      </form>

      <span>Don't have an account? </span>
      <button id="login-register-btn" onClick={registerClick}>Register</button>
    </>
  )
}
