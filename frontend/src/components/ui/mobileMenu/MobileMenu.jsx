import { NavLink } from 'react-router-dom';
import css from './MobileMenu.module.css';
import AuthNavMobile from '../../auth/AuthNavMobile/AuthNavMobile.jsx';
import UserMenuMobile from '../../auth/UserMenuMobile/UserMenuMobile.jsx';
import clsx from 'clsx';
import Container from '../../common/container/container.jsx';
import { selectIsLoggedIn } from '../../../redux/auth/selectors.js';
import { useSelector } from 'react-redux';

export default function MobileMenu({ openMobile, toggleModal }) {
  const getLinkStyles = ({ isActive }) => {
    return clsx(css.link, isActive && css.active);
  };
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return (
    <div className={css.container}>
      <Container>
        <div className={css.wrapper}>
          <NavLink onClick={openMobile} to="/" className={getLinkStyles}>
            Recipes
          </NavLink>
          {isLoggedIn ? (
            <UserMenuMobile toggleModal={toggleModal} openMobile={openMobile} />
          ) : (
            <AuthNavMobile openMobile={openMobile} />
          )}
        </div>
      </Container>
    </div>
  );
}
