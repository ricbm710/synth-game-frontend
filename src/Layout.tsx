//rrd
import { Outlet } from "react-router-dom";
//components
import Navbar from "./components/Navbar";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      {/* <div>Footer</div> */}
    </div>
  );
};

export default Layout;
