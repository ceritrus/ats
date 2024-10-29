import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchIcon from "@mui/icons-material/Search";

export default function Searchbar({ searchCallback }) {
  const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchValue !== "") {
      navigate("/offers");
      setTimeout(() => {
        navigate("/search/" + searchValue);
      }, 50);
    }
  };

  return (
    <form className="Searchbar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchValue}
        onChange={handleChange}
        onSubmit={handleSubmit}
        placeholder="Rechercher une offre..."
      />
      <button type="submit">
        <SearchIcon />
      </button>
    </form>
  );
}
