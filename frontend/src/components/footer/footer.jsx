import { NavLink } from "react-router-dom";
import Logo from "../logo/logo.jsx";
import css from "./footer.module.css";
import Container from "../container/container.jsx";
export default function Footer() {
  return (
    <footer className={css.footer}>
      <Container>
        <div className={css.container}>
          <Logo></Logo>
          <p className={css.text}>
            © 2025 CookingCompanion. All rights reserved.
          </p>
          <nav>
            <ul className={css.list}>
              <li>
                <NavLink to="/" className={css.link}>
                  Recipe
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile/own" className={css.link}>
                  Account
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
