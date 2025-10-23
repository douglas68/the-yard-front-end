import { Link, useNavigate } from "react-router-dom";

export default function Navbar(){
  const nav = useNavigate();
  const logout = () => { localStorage.removeItem("userId"); nav("/auth"); };
  return (
    <div className="nav">
      <div className="nav-inner">
        <div className="nav-title">The Yard</div>
        <div className="nav-links">
          <Link to="/dashboard">Home</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/profile/edit">Edit Profile</Link>
          <button className="btn" onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
}
