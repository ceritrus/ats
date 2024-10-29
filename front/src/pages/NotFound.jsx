import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="home">
      <div>
        <img src="/notfound.svg"></img>
        <p>Vous vous retrouvez sur une page non existante</p>
        <Link to="/">
          <button>Retournez à la page d'acceuil</button>
        </Link>
      </div>
    </div>
  );
}
