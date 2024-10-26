import Icons from "../utils/Icons";
import Navbar from "../components/Navbar";
import { Fetch, Post } from "../utils/Api";
import { useState, useEffect } from "react";

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const request = async () => {
      try {
        setData(await Fetch("/"));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    request();
  }, []);

  return (
    <div>
      <div className="home">
        <div className="left-column">
          <h1>
            Bienvenue sur Job Hunter{" "}
            <a href="https://github.com/ceritrus/ats">
              <Icons.github fontSize="large" />
            </a>
          </h1>
          <h2>Un job board alimenté par l'intelligence artificielle!</h2>
          <p>
            Que vous soyez recruteur ou candidat, profitez d'outils intelligents
            pour accélerer le processus de recherche.
            <br />
            Ce projet a été réalisé par des apprenants de la POE IA de Dawan en
            Octobre 2024:
          </p>
          <ul>
            <li>
              <a href="https://www.linkedin.com/in/brannigan-chateau/">
                <Icons.linkedin />
                Brannigan Chateau
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/enzo-onesti/">
                <Icons.linkedin />
                Enzo Onesti
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/camille-pericat/">
                <Icons.linkedin />
                Camille Péricat
              </a>
            </li>
          </ul>
          <br />
          {"Api status: " + data.message}
        </div>
        <div className="right-column">
          <img src="/logo.png" alt="logo" />
        </div>
      </div>
    </div>
  );
}
