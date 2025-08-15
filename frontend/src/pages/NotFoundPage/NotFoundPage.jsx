import css from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  return (
    <section className={css.sectionNotFound}>
      <div className={css.container}>
        <div className={css.caption}>
          <div className={css.hatCont}>
            <div className={css.hat}></div>
            <div className={css.lines}></div>
            <div className={css.left}></div>
            <div className={css.leftOpp}></div>
            <div className={css.top}></div>
          </div>
          <div className={css.headText}>Page not found!</div>
        </div>
        <div className={css.head}>
          <div className={css.panWrapper}>
            <div className={css.center}>
              <div className={css.subCenter}>
                <div className={css.egg}>
                  <div className={css.yolk}></div>
                </div>
              </div>
            </div>
            <div className={css.handle}></div>
            <div className={css.handleSub}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
