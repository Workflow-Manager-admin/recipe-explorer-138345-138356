import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Navbar() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span role="img" aria-label="Recipe">🍲</span> Recipe Explorer
      </Link>
      <NavLink to="/" className="navbar-link">
        Browse
      </NavLink>
      {user && (
        <>
          <NavLink to="/my-recipes" className="navbar-link">
            My Recipes
          </NavLink>
          <NavLink to="/bookmarks" className="navbar-link">
            Bookmarks
          </NavLink>
          <NavLink to="/recipe/new" className="navbar-link">
            + Add Recipe
          </NavLink>
        </>
      )}
      {!user && (
        <>
          <NavLink to="/login" className="navbar-link">
            Sign In
          </NavLink>
          <NavLink to="/register" className="navbar-link">
            Register
          </NavLink>
        </>
      )}
      <div className="navbar-user">
        {user && (
          <>
            <span className="navbar-avatar">
              {(user.full_name || user.email)[0].toUpperCase()}
            </span>
            <span style={{ marginRight: 6 }}>
              {user.full_name || user.email}
            </span>
            <button onClick={handleLogout} className="btn btn-accent" style={{ fontSize: "0.88em"}}>Log Out</button>
          </>
        )}
      </div>
    </nav>
  );
}
