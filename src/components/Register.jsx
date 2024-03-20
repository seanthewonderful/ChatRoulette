import React from 'react'

export default function Register({ setRegister }) {

  const registerClick = () => {
    setRegister(false)
  }

  return (
    <>
    <form className="login-register-form" id="register-form">
      <h1>Register</h1>
      <label htmlFor="username">Username</label>
      <input type="text" name="username" placeholder="Username" />
      <label htmlFor="password">Password</label>
      <input type="password" name="password" placeholder="Password" />
      <label htmlFor="confirm-password">Confirm Password</label>
      <input type="password" name="confirm-password" placeholder="Confirm password" />
      <input type="submit" value="Register" />
    </form>
      <button id='login-register-btn' onClick={registerClick}>Login</button>
    </>
  )
}
