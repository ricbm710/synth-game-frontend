//rrd
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="bg-col-3 p-2 md:p-5">
      <Link to="/">
        <h1 className="text-white text-2xl md:text-4xl text-center font-bold">
          Synth Game
        </h1>
      </Link>
    </div>
  );
};

export default Navbar;
