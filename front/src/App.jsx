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
import Apply from "./pages/Apply";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import CandidateOffers from "./pages/Candidate_offers";
import Search from "./pages/Search";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setID,
  setName,
  setEmail,
  setRole,
  setRoleID,
} from "./utils/UserSlice";

function App() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user.id) {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        const payload = JSON.parse(atob(token.split(".")[1]));
        dispatch(setID(payload.id));
        dispatch(setRole(payload.role));
        dispatch(setName(payload.sub));
        dispatch(setRoleID(payload.role_id));
      }
    }
  }, [user]);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/recruiter_offer" element={<Recruiter_offer />} />
        <Route path="/application_offer/:id" element={<Application_offer />} />
        <Route path="/apply/:id" element={<Apply />} />
        <Route path="/search/:needle" element={<Search />} />
        <Route
          path="/about_candidate/:application_id/:candidate_id"
          element={<About_candidate />}
        />
        <Route path="/offers/:id" element={<Offer />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/applications" element={<CandidateOffers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
