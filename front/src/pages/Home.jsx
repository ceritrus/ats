import Icons from "../utils/Icons";

import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <h1>
        <Icons.home className="icon" fontSize="large" /> Home
      </h1>
    </div>
  );
}
