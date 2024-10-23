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
      searchCallback(searchValue);
      navigate("/");
    }
  };

  return (
    <form className="Searchbar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchValue}
        onChange={handleChange}
        onSubmit={handleSubmit}
        placeholder="Rechercher une offre, une entreprise..."
      />
      <button type="submit">
        <SearchIcon />
      </button>
    </form>
  );
}
