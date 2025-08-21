import { Outlet } from "react-router-dom";
import Container from "../../components/container/container.jsx";
import ProfileNavigation from "../../components/ProfileNavigation/ProfileNavigation.jsx";
import style from "./ProfilePage.module.css";

export default function ProfilePage() {
  return (
    <div className={style.wrapper}>
      <Container>
        <h1 className={style.title}>Profile page</h1>
        <ProfileNavigation />
        <Outlet />
      </Container>
    </div>
  );
}
