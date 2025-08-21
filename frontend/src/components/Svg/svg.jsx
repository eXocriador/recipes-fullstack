import sprite from "../../assets/svg/sprite.svg?url";
export default function Svg({ onClick = null, styles, name }) {
  return (
    <svg onClick={onClick} className={styles}>
      <use href={`${sprite}#icon-${name}`}></use>
    </svg>
  );
}
