import React, { useState } from "react";
import { Link } from "react-router-dom";
import Icons from "../utils/Icons";
import Searchbar from "./Searchbar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Navbar() {
  // État pour gérer l'affichage du sous-menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const userRole = user?.role

  // Fonction pour basculer l'affichage du sous-menu
  const toggleMenu = () => {
    if (!user.id) {
      navigate(`/login`);
    } else {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  return (
    <div className="navbar">
      <Link to="/" className="nav-link nav-main">
        <img src="logo.png" alt="logo" className="logo" />
        <span className="link-text">JOB HUNTER</span>
      </Link>
      <Link to="/offers" className="nav-link nav-section">
        <span className="link-text">OFFRES</span>
      </Link>
      <div>
        <Searchbar />
      </div>
      <div className="nav-profile-container" onClick={toggleMenu}>
        <Icons.user className="icon" fontSize="large" />
        {isMenuOpen && (
          <div className="submenu">
          {userRole === "Recruiter" ? (
            <>
              <Link to="/profile" className="submenu-link">Mon Profil</Link>
              <Link to="/recruiter_offer" className="submenu-link">Mes offres</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="submenu-link">Mon Profil</Link>
              <Link to="/settings" className="submenu-link">Mes candidatures</Link>
            </>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
