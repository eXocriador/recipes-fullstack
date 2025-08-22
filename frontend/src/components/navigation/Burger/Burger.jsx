import Svg from '../../common/Svg/Svg.jsx';
import css from './Burger.module.css';
export default function Burger({ openMobile, isOpened }) {
  return (
    <>
      {isOpened ? (
        <Svg
          onClick={openMobile}
          styles={css.svgCross}
          name='mobileCross'
        ></Svg>
      ) : (
        <Svg onClick={openMobile} styles={css.svgCross} name='burger'></Svg>
      )}
    </>
  );
}
