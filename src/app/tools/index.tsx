import { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

const Tools = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== "/tools") {
      return;
    }

    navigate("/");
  }, [location, navigate]);

  return <Outlet />;
};

export default Tools;
