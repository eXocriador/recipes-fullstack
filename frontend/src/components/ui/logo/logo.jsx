import Svg from "../../common/Svg/svg.jsx";
import css from "./logo.module.css";
export default function Logo() {
  return (
    <a className={css.container} href="/">
      <Svg styles={css.svg} name={"logo"}></Svg>
      <p className={css.logoName}>Tasteorama </p>
    </a>
  );
}
