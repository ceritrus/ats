import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./styles/App.css";
import Home from "./pages/Home";
import Icons from "./utils/Icons";

import { Route, Routes } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Routes>
        <Route index element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
