import React, { useState } from "react";
import { NavLink } from "react-router-dom";
// import { MenuList } from "./MenuList";
import "../Navbar/NavBar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">IN<font>Fire</font></div>

      <ul className="nav-links">
        <input type="checkbox" id="checkbox_toggle" />
        <label for="checkbox_toggle" className="hamburger">
          &#9776;
        </label>

        <div className="menu">
          <li >
            <NavLink  exact to="/dash/home">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink exact to="/dash/MyProfile">
              Profile
            </NavLink>
          </li>

          <li>
            <NavLink exact to="/dash/message">
              Messaging
            </NavLink>
          </li>

          <li>
            <NavLink exact to="/dash/findfriend">
              Search friends
            </NavLink>
          </li>
          <li>
            <NavLink exact to="/dash/feedback">
              Feedback
            </NavLink>
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
