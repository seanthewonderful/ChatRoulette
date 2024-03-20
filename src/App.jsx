import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom"
import Home from "./pages/Home"
import LoginRegister from "./pages/LoginRegister"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Home />} >
      <Route path="login" element={<LoginRegister />} />
    </Route>
  )
)

export default function App() {
  return <RouterProvider router={router} />
}
