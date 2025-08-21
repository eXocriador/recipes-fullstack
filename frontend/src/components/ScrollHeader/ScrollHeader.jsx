import { useEffect, useState } from "react";

const ScrollHeader = ({ children }) => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShow(false);
      } else {
        setShow(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        transition: "transform 0.3s ease",
        transform: show ? "translateY(0)" : "translateY(-100%)",
        zIndex: 999,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollHeader;
