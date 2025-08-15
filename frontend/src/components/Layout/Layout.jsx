import Header from "../Header/Header.jsx";
import css from "./Layout.module.css";
import { Outlet } from "react-router-dom";
import Footer from "../footer/footer.jsx";
import ModalMenuLogout from "../modalMenuLogout/modalMenuLogout.jsx";
import { useState } from "react";
export default function Layout() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handlerModalMenu = () => {
    setIsMobileMenuOpened(false);
    setIsModalOpen(true);
  };
  const [isMobileMenuOpened, setIsMobileMenuOpened] = useState(false);
  const mobileMenuHandler = () => {
    setIsMobileMenuOpened(!isMobileMenuOpened);
    setIsModalOpen(false);
  };
  return (
    <div className={css.container}>
      {isModalOpen && (
        <ModalMenuLogout
          isModalOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <Header
        isMobileMenuOpened={isMobileMenuOpened}
        mobileMenuHandler={mobileMenuHandler}
        toggleModal={handlerModalMenu}
        setIsMobileMenuOpened={setIsMobileMenuOpened}
      />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
