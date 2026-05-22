import { BrowserRouter, Routes, Route } from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import AddContent from "./pages/AddContent"
import Details from "./pages/Details"
import Analytics from "./pages/Analytics"

function App() {
  return (
    <BrowserRouter>
      <div className="bg-black min-h-screen text-white">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddContent />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App