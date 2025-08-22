import css from './Loader.module.css';

export default function Loader() {
  return (
    <div className={css.loaderWrapper}>
      <span className={css.loader}></span>
    </div>
  );
}

// New component for favourite buttons
export function Spinner({ size = 'small' }) {
  return (
    <div className={`${css.spinner} ${css[size]}`}>
      <div className={css.spinnerInner}></div>
    </div>
  );
}
