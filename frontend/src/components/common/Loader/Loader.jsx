import css from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={css.loaderWrapper}>
      <span className={css.loader}></span>
    </div>
  );
}