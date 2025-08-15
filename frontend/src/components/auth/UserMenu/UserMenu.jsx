import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import css from "./UserMenu.module.css";
import clsx from "clsx";
import Logout from "../logout/logout.jsx";

const getLinkStyles = ({ isActive }) => {
  return clsx(css.link, isActive && css.active);
};

export default function UserMenu({ toggleModal }) {
  return (
    <>
      <nav>
        <ul className={css.list}>
          <li>
            <NavLink to="/profile/own" className={getLinkStyles}>
              My profile
            </NavLink>
          </li>
          <li>
            <NavLink to="/add-recipe" className={getLinkStyles}>
              Add Recepy
            </NavLink>
          </li>
        </ul>
      </nav>

      <Logout toggleModal={toggleModal} />
    </>
  );
}
