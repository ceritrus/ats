import React from "react";
import { Link } from "react-router-dom";
import Icons from "../utils/Icons";

import Searchbar from "./Searchbar";

export default function Navbar() {
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
      <Link to="/profile" className="nav-link nav-profile">
        <Icons.user className="icon" fontSize="large" />
      </Link>
    </div>
  );
}
