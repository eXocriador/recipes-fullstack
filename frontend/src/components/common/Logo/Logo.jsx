import Svg from '../Svg/Svg.jsx';
import css from './Logo.module.css';
export default function Logo() {
  return (
    <a className={css.container} href='/'>
      <Svg styles={css.svg} name={'logo'}></Svg>
      <p className={css.logoName}>Tasteorama </p>
    </a>
  );
}
