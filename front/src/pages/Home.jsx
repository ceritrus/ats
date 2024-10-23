import Icons from "../utils/Icons";

import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="home">
        <div classname="left-column">
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
          </p>
        </div>
        <div className="right-column">
          <img src="/logo.png" alt="logo" />
        </div>
      </div>
    </div>
  );
}
