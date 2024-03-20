import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"

function Home() {
  return (
    <>
    <Navbar />
    <div>Home</div>
    <Outlet />
    </>
  )
}

export default Home