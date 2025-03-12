//rrd
import { Outlet } from "react-router-dom";
//components
import Navbar from "./components/Navbar";

const Layout = () => {
  return (
    <div className="bg-col-1 min-h-screen">
      <Navbar />
      <Outlet />
      {/* <div>Footer</div> */}
    </div>
  );
};

export default Layout;
