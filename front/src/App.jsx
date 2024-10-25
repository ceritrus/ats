import "./styles/App.css";
import Home from "./pages/Home";
import Offers from "./pages/Offers";
import Offer from "./pages/Offer";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route index element={<Home />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/offers/:id" element={<Offer />} />
      </Routes>
    </div>
  );
}

export default App;
