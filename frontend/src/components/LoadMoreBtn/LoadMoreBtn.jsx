import Container from "../container/container";
import styles from "./LoadMoreBtn.module.css";

export default function LoadMoreBtn({ onClick }) {
  return (
    <Container>
      <button className={styles.loadMoreBtn} onClick={onClick}>
        Load more
      </button>
    </Container>
  );
}
