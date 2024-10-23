import "./styles/App.css";
import Home from "./pages/Home";
import Icons from "./utils/Icons";
import Recruiter_offer from "./pages/recruiter_offer";
import Application_offer from "./pages/application_offer";
import About_candidate from "./pages/about_candidate";

import Offers from "./pages/Offers";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route index element={<Home />} />
        <Route path="/recruiter_offer" Component={Recruiter_offer} />
        <Route path="/application_offer/id" Component={Application_offer} />
        <Route path="/about_candidate/id" Component={About_candidate} />
        <Route path="/offers" element={<Offers />} />
      </Routes>
    </div>
  );
}

export default App;
