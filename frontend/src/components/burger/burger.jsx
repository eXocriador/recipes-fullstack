import Svg from "../Svg/svg.jsx";
import css from "./burger.module.css";
export default function Burger({ openMobile, isOpened }) {
  return (
    <>
      {isOpened ? (
        <Svg
          onClick={openMobile}
          styles={css.svgCross}
          name="mobileCross"
        ></Svg>
      ) : (
        <Svg onClick={openMobile} styles={css.svgCross} name="burger"></Svg>
      )}
    </>
  );
}
