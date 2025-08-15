import css from "./logout.module.css";
import Svg from "../Svg/svg.jsx";
import { selectUser } from "../../redux/auth/selectors.js";
import { useSelector } from "react-redux";
export default function Logout({ toggleModal }) {
  const userName = useSelector(selectUser);
  const cutUserName = () => {
    if (!userName || userName.length === 0) return "";
    return userName[0];
  };

  return (
    <div className={css.container}>
      <div className={css.nameWrapper}>
        <div className={css.icon}>
          <p className={css.name}>{cutUserName()}</p>
        </div>
        <p className={css.name}>{userName}</p>
      </div>
      <div className={css.stick}></div>
      <Svg styles={css.svg} onClick={toggleModal} name="exit"></Svg>
    </div>
  );
}
