import AppBar from "../AppBar/AppBar.jsx";
import css from "./Header.module.css";
import Container from "../container/container.jsx";
import Logo from "../logo/logo.jsx";
import { useEffect, useState } from "react";
import Burger from "../burger/burger.jsx";
import MobileMenu from "../mobileMenu/MobileMenu.jsx";
import ScrollHeader from "../ScrollHeader/ScrollHeader.jsx";

// import RefreshToken from '../RefreshToken/RefrehsToken.jsx'

export default function Header({
  toggleModal,
  mobileMenuHandler,
  isMobileMenuOpened,
  setIsMobileMenuOpened,
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleResize = () => {
      const isNowMobile = mediaQuery.matches;
      setIsMobile(isNowMobile);
      if (!isNowMobile && isMobileMenuOpened) {
        setIsMobileMenuOpened(false);
      }
    };
    handleResize();
    mediaQuery.addEventListener("change", handleResize);
    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, [isMobileMenuOpened]);
  return (
    <>
      <ScrollHeader>
        <header className={css.background}>
          <Container>
            <div className={css.container}>
              <Logo />
              {isMobile ? (
                <Burger
                  isOpened={isMobileMenuOpened}
                  openMobile={mobileMenuHandler}
                />
              ) : (
                <AppBar toggleModal={toggleModal} />
              )}
            </div>
          </Container>
        </header>
        {isMobileMenuOpened ? (
          <>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.3)",
                zIndex: 998,
              }}
              onClick={() => setIsMobileMenuOpened(false)}
            />
            <MobileMenu
              toggleModal={toggleModal}
              openMobile={mobileMenuHandler}
            />
          </>
        ) : null}
      </ScrollHeader>
    </>
  );
}
