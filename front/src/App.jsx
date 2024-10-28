import "./styles/App.css";
import Home from "./pages/Home";
import Offers from "./pages/Offers";
import Offer from "./pages/Offer";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Application_offer from "./pages/Application_offer";
import Recruiter_offer from "./pages/Recruiter_offer";
import About_candidate from "./pages/About_candidate";

function App() {
  return (
    <div className="App">
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
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
