//rrd
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <div>Navbar</div>
      <Outlet />
      <div>Footer</div>
    </div>
  );
};

export default Layout;
