import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import Svg from "../Svg/svg";
import style from "./ModalErrorWhileSaving.module.css";

export default function ModalErrorWhileSaving({ isModalOpen, onClose }) {
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  return (
    <>
      <div className={style.backdrop}>
        <div className={style.modal} onClick={(e) => e.stopPropagation()}>
          <Svg styles={style.svg} onClick={onClose} name="cross" />
          <h2 className={style.title}>Error while saving</h2>
          <p className={style.text}>
            To save this recipe, you need to authorize first
          </p>
          <ul className={style.list}>
            <li>
              <NavLink
                className={style.link}
                to="/auth/login"
                onClick={onClose}
              >
                Log in
              </NavLink>
            </li>
            <li>
              <NavLink
                className={style.link}
                to="/auth/register"
                onClick={onClose}
              >
                Register
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
