import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom"
import Home from "./pages/Home"
import LoginRegister from "./pages/LoginRegister"
import Chat from "./pages/Chat"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Home />} >
      <Route path="login" element={<LoginRegister />} />
      <Route path="chat" element={<Chat />} />
    </Route>
  )
)

export default function App() {
  return <RouterProvider router={router} />
}
