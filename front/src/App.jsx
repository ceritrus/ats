import "./styles/App.css";
import Home from "./pages/Home";
import Offers from "./pages/Offers";
import Offer from "./pages/Offer";
import { Route, Routes } from "react-router-dom";
import Application_offer from "./pages/Application_offer";
import Recruiter_offer from "./pages/Recruiter_offer";
import About_candidate from "./pages/About_candidate";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/recruiter_offer" element={<Recruiter_offer />} />
        <Route path="/application_offer/:id" element={<Application_offer />} />
        <Route
          path="/about_candidate/:application_id/:candidate_id"
          element={<About_candidate />}
        />
        <Route path="/offers/:id" element={<Offer />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
