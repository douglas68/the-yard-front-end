import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import EditProfile from "./pages/EditProfile.jsx";

function Guard({ children }) {
  const userId = localStorage.getItem("userId");
  const loc = useLocation();
  if (!userId) return <Navigate to="/auth" state={{ from: loc }} replace />;
  return children;
}

export default function App(){
  const loc = useLocation();
  const showNav = loc.pathname !== "/auth";
  return (
    <>
      {showNav && <Navbar/>}
      <Routes>
        <Route path="/auth" element={<Auth/>} />
        <Route path="/dashboard" element={<Guard><Dashboard/></Guard>} />
        <Route path="/profile" element={<Guard><Profile/></Guard>} />
        <Route path="/profile/edit" element={<Guard><EditProfile/></Guard>} />
        <Route path="*" element={<Navigate to="/dashboard" replace/>} />
      </Routes>
    </>
  );
}
