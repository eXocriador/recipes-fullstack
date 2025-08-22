import { NavLink } from "react-router-dom";
import css from "./AuthNavMobile.module.css";
import clsx from "clsx";
export default function AuthNavMobile({ openMobile }) {
  const getLinkStyles = ({ isActive }) => {
    return clsx(css.link, isActive && css.active);
  };
  return (
    <>
      <div className={css.list}>
        <NavLink
          onClick={openMobile}
          className={getLinkStyles}
          to="/auth/login"
        >
          Log In
        </NavLink>
        <NavLink
          onClick={openMobile}
          className={css.button}
          to="/auth/register"
        >
          Register
        </NavLink>
      </div>
    </>
  );
}
